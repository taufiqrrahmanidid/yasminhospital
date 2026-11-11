require('dotenv').config();

const SIMRS_CONFIG = {
    baseUrl: process.env.SIMRS_BASE_URL,
    apiKey: process.env.SIMRS_API_KEY,
    timeoutMs: 5000
};

// Validasi konfigurasi SIMRS on-demand. Server tetap bisa jalan tanpa SIMRS
// (mode offline); error baru muncul saat fungsi bridge benar-benar dipakai.
function assertSimrsConfigured() {
    const raw = String(SIMRS_CONFIG.baseUrl || '').trim();
    if (!raw || !/^https?:\/\//i.test(raw)) {
        throw new Error('SIMRS belum dikonfigurasi (SIMRS_BASE_URL kosong atau tidak valid).');
    }
    SIMRS_CONFIG.baseUrl = raw.replace(/\/$/, '');
}

// 1. Fungsi Cek Validitas Rekam Medis (No. RM) ke SIMRS
async function cekPasienKeSIMRS(noRM, nik) {
    assertSimrsConfigured();
    try {
        console.log(`[BRIDGING] Menghubungi SIMRS untuk memverifikasi No. RM: ${noRM}...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), SIMRS_CONFIG.timeoutMs);

        const res = await fetch(`${SIMRS_CONFIG.baseUrl}/pasien/cek`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': SIMRS_CONFIG.apiKey
            },
            body: JSON.stringify({ noRM, nik }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await res.json();
        return data;
    } catch (err) {
        console.error('[BRIDGING ERROR] Gagal menghubungi SIMRS:', err.message);
        throw new Error('Gagal terhubung ke server SIMRS RS Yasmin. Pastikan jaringan server aktif.');
    }
}

// 2. Fungsi Minta Kode Booking & Nomor Antrean Resmi ke SIMRS
async function daftarkanBookingKeSIMRS(pendaftaran, nomorAntrianUrut) {
    assertSimrsConfigured();
    try {
        console.log(`[BRIDGING] Mengirim pendaftaran tiket ${pendaftaran.id} (Antrean Ke-${nomorAntrianUrut}) ke SIMRS...`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), SIMRS_CONFIG.timeoutMs);

        const res = await fetch(`${SIMRS_CONFIG.baseUrl}/antrean/booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': SIMRS_CONFIG.apiKey
            },
            body: JSON.stringify({
                idTiketWeb: pendaftaran.id,
                noRM: pendaftaran.noIdentitas,
                namaPasien: pendaftaran.patientName,
                kodePoli: pendaftaran.selectedPoli,
                kodeDokter: pendaftaran.selectedDoctorId,
                namaDokter: pendaftaran.selectedDoctorName,
                tanggalPeriksa: pendaftaran.selectedDate,
                sesiJam: pendaftaran.selectedTimeSlot,
                jenisBayar: pendaftaran.patientType,
                nomorAntrianUrut: nomorAntrianUrut // <-- Kirimkan nomor urut otomatis ke SIMRS
            }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const result = await res.json();
        if (res.ok && result.data) {
            console.log(`[BRIDGING SUCCESS] SIMRS menerbitkan: ${result.data.kodeBooking} | Antrean: ${result.data.noAntrian}`);
            return result.data;
        } else {
            throw new Error(result.message || 'SIMRS menolak registrasi antrean.');
        }
    } catch (err) {
        console.error('[BRIDGING ERROR] Gagal registrasi antrean ke SIMRS:', err.message);
        throw err;
    }
}

// 3. Fungsi Validasi Pasien Baru ke SIMRS (Anti-Duplikat NIK & Jaminan)
async function validasiPasienBaruKeSIMRS(payload) {
    assertSimrsConfigured();
    try {
        console.log(`[BRIDGING] Memvalidasi data Pasien Baru (NIK: ${payload.nik}) ke SIMRS...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), SIMRS_CONFIG.timeoutMs);

        const res = await fetch(`${SIMRS_CONFIG.baseUrl}/pasien/validasi-baru`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': SIMRS_CONFIG.apiKey
            },
            body: JSON.stringify({ 
                nik: payload.nik,
                noBPJS: payload.bpjsNumber,
                noAsuransi: payload.insuranceNumber,
                noPegawai: payload.companyCardNumber
            }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        return await res.json();
    } catch (err) {
        console.warn('[BRIDGING WARNING] SIMRS Offline, mengaktifkan mode Toleransi Pintar (Graceful Degradation)...');
        // [KUNCI PERBAIKAN]: Lempar error agar server.js tahu SIMRS sedang mati!
        throw new Error('SIMRS_OFFLINE'); 
    }
}

module.exports = {
    cekPasienKeSIMRS,
    daftarkanBookingKeSIMRS,
    validasiPasienBaruKeSIMRS
};