import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Download, 
  FileJson, 
  FileCode, 
  ShieldCheck, 
  Database, 
  Check, 
  Server, 
  Table, 
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Doctor, HospitalRoom } from '../types';

interface DatabaseExportManagerProps {
  rsInfo: any;
  polyclinics: any[];
  specialists: any[];
  socialMediaLinks: any[];
  announcements: any[];
  rooms: HospitalRoom[];
  doctors: Doctor[];
}

export default function DatabaseExportManager({
  rsInfo,
  polyclinics,
  specialists,
  socialMediaLinks,
  announcements,
  rooms,
  doctors
}: DatabaseExportManagerProps) {
  const [downloadingSection, setDownloadingSection] = useState<string | null>(null);
  const [expandedTable, setExpandedTable] = useState<string | null>(null);

  const triggerDownload = (filename: string, content: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadFirestoreBlueprint = () => {
    setDownloadingSection('firestore-json');
    const blueprint = {
      _meta: {
        appName: "RS Yasmin Banyuwangi Portal",
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        databaseProvider: "Google Firebase Firestore"
      },
      entities: {
        HospitalInfo: {
          title: "HospitalInfo",
          description: "Hospital configuration and contact information",
          type: "object",
          properties: {
            name: { type: "string" },
            address: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
            whatsapp: { type: "string" },
            accreditation: { type: "string" },
            logo: { type: "string" }
          },
          required: ["name", "address", "phone", "email", "whatsapp", "accreditation"]
        },
        Polyclinic: {
          title: "Polyclinic",
          description: "Polyclinic division at the hospital",
          type: "object",
          properties: {
            code: { type: "string" },
            name: { type: "string" },
            status: { type: "string" },
            activeSinceDate: { type: "string" },
            inactiveSinceDate: { type: "string" }
          },
          required: ["code", "name", "status"]
        },
        Specialist: {
          title: "Specialist",
          description: "Medical specialty classification",
          type: "object",
          properties: {
            code: { type: "string" },
            name: { type: "string" },
            description: { type: "string" }
          },
          required: ["code", "name"]
        },
        SocialMedia: {
          title: "SocialMedia",
          description: "Hospital social media channels",
          type: "object",
          properties: {
            id: { type: "string" },
            platform: { type: "string" },
            url: { type: "string" },
            icon: { type: "string" },
            color: { type: "string" }
          },
          required: ["id", "platform", "url", "icon"]
        },
        Announcement: {
          title: "Announcement",
          description: "announcements and popups",
          type: "object",
          properties: {
            id: { type: "string" },
            image: { type: "string" },
            title: { type: "string" },
            isActive: { type: "boolean" },
            activeDate: { type: "string" },
            closeDate: { type: "string" }
          },
          required: ["id", "title", "isActive"]
        },
        HospitalRoom: {
          title: "HospitalRoom",
          description: "Hospital inpatient/ICU/ER room availability status",
          type: "object",
          properties: {
            id: { type: "string" },
            type: { type: "string" },
            name: { type: "string" },
            class: { type: "string" },
            capacity: { type: "number" },
            occupied: { type: "number" },
            facilities: { type: "string" }
          },
          required: ["id", "type", "name", "class", "capacity", "occupied"]
        },
        Doctor: {
          title: "Doctor",
          description: "Hospital doctors and schedule information",
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            specialty: { type: "string" },
            subSpecialty: { type: "string" },
            experience: { type: "number" },
            rating: { type: "number" },
            image: { type: "string" },
            bpjs: { type: "boolean" },
            bio: { type: "string" },
            education: { type: "string" },
            status: { type: "string" },
            licenseNumber: { type: "string" },
            joinDate: { type: "string" },
            gender: { type: "string" }
          },
          required: ["id", "name", "specialty", "experience", "rating", "bpjs"]
        },
        Booking: {
          title: "Booking",
          description: "Patient clinic registration bookings",
          type: "object",
          properties: {
            id: { type: "string" },
            patientName: { type: "string" },
            phone: { type: "string" },
            patientType: { type: "string" },
            bpjsNumber: { type: "string" },
            selectedDoctorId: { type: "string" },
            selectedDate: { type: "string" },
            selectedTimeSlot: { type: "string" },
            complaint: { type: "string" },
            whatsappConsent: { type: "boolean" },
            isRegisteredPatient: { type: "boolean" },
            kiupNumber: { type: "string" },
            serviceType: { type: "string" },
            nik: { type: "string" },
            birthPlace: { type: "string" },
            birthDate: { type: "string" },
            gender: { type: "string" },
            address: { type: "string" },
            insuranceProvider: { type: "string" },
            insuranceNumber: { type: "string" },
            ktpFile: { type: "string" },
            insuranceFile: { type: "string" },
            photoFile: { type: "string" }
          },
          required: ["patientName", "phone", "patientType", "selectedDoctorId", "selectedDate", "selectedTimeSlot"]
        }
      },
      firestore: {
        "/rs_info/{configId}": {
          schema: "HospitalInfo",
          description: "Hospital configuration settings"
        },
        "/polyclinics/{polyclinicId}": {
          schema: "Polyclinic",
          description: "List of active/inactive polyclinics"
        },
        "/specialists/{specialistId}": {
          schema: "Specialist",
          description: "List of medical specialists"
        },
        "/social_media/{socialMediaId}": {
          schema: "SocialMedia",
          description: "Social media links"
        },
        "/announcements/{announcementId}": {
          schema: "Announcement",
          description: "Popup and banner announcements"
        },
        "/rooms/{roomId}": {
          schema: "HospitalRoom",
          description: "Real-time room availability status"
        },
        "/doctors/{doctorId}": {
          schema: "Doctor",
          description: "Hospital medical doctor staff"
        },
        "/bookings/{bookingId}": {
          schema: "Booking",
          description: "Reservations and scheduled appointments"
        }
      }
    };

    setTimeout(() => {
      triggerDownload(
        'firestore_schema_blueprint.json',
        JSON.stringify(blueprint, null, 2),
        'application/json'
      );
      setDownloadingSection(null);
    }, 600);
  };

  const handleDownloadPostgresSQL = () => {
    setDownloadingSection('postgres-sql');
    const sqlDDL = `-- ==========================================
-- PostgreSQL Database Schema Export DDL
-- Generated dynamically by RS Yasmin Banyuwangi Portal
-- Export Date: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}
-- Target Engine: PostgreSQL 14+ / Cloud SQL Developer Edition
-- ==========================================

-- 1. Table: hospital_info
CREATE TABLE IF NOT EXISTS hospital_info (
    id VARCHAR(128) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    accreditation VARCHAR(100) NOT NULL,
    logo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: polyclinics
CREATE TABLE IF NOT EXISTS polyclinics (
    code VARCHAR(128) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Aktif',
    active_since_date VARCHAR(50),
    inactive_since_date VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: specialists
CREATE TABLE IF NOT EXISTS specialists (
    code VARCHAR(128) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table: social_media
CREATE TABLE IF NOT EXISTS social_media (
    id VARCHAR(128) PRIMARY KEY,
    platform VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    icon VARCHAR(100) NOT NULL,
    color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table: announcements
CREATE TABLE IF NOT EXISTS announcements (
    id VARCHAR(128) PRIMARY KEY,
    image TEXT,
    title VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    active_date VARCHAR(50),
    close_date VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Table: rooms
CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(128) PRIMARY KEY,
    type VARCHAR(100) NOT NULL, -- 'Rawat Inap', 'ICU', 'IGD'
    name VARCHAR(255) NOT NULL,
    class VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 0,
    occupied INTEGER NOT NULL DEFAULT 0,
    facilities TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Table: doctors
CREATE TABLE IF NOT EXISTS doctors (
    id VARCHAR(128) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    sub_specialty VARCHAR(255),
    experience INTEGER NOT NULL DEFAULT 0,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    image TEXT,
    bpjs BOOLEAN NOT NULL DEFAULT TRUE,
    bio TEXT,
    education TEXT,
    status VARCHAR(50) DEFAULT 'Aktif',
    license_number VARCHAR(100),
    join_date VARCHAR(50),
    gender VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Table: bookings
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(128) PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    patient_type VARCHAR(50) NOT NULL, -- 'BPJS', 'Umum', 'Asuransi'
    bpjs_number VARCHAR(100),
    selected_doctor_id VARCHAR(128) REFERENCES doctors(id) ON DELETE SET NULL,
    selected_date VARCHAR(50) NOT NULL,
    selected_time_slot VARCHAR(50) NOT NULL,
    complaint TEXT,
    whatsapp_consent BOOLEAN DEFAULT TRUE,
    is_registered_patient BOOLEAN DEFAULT FALSE,
    kiup_number VARCHAR(100),
    service_type VARCHAR(255),
    nik VARCHAR(50),
    birth_place VARCHAR(100),
    birth_date VARCHAR(50),
    gender VARCHAR(20),
    address TEXT,
    insurance_provider VARCHAR(255),
    insurance_number VARCHAR(100),
    ktp_file TEXT,
    insurance_file TEXT,
    photo_file TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimizations
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_bookings_doctor ON bookings(selected_doctor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(selected_date);
CREATE INDEX IF NOT EXISTS idx_rooms_type ON rooms(type);

-- Comments to describe relations
COMMENT ON TABLE hospital_info IS 'Tabel konfigurasi & profil instansi RS Yasmin';
COMMENT ON TABLE doctors IS 'Tabel data staf medis / dokter aktif';
COMMENT ON TABLE bookings IS 'Tabel pencatatan pendaftaran & reservasi pasien klinis';
`;

    setTimeout(() => {
      triggerDownload(
        'postgres_schema_ddl.sql',
        sqlDDL,
        'text/plain'
      );
      setDownloadingSection(null);
    }, 600);
  };

  const handleDownloadFirestoreRules = () => {
    setDownloadingSection('firestore-rules');
    const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper to validate standard IDs
    function isValidId(id) {
      return id is string && id.size() > 0 && id.size() <= 128;
    }

    // Helper for validating HospitalInfo
    function isValidHospitalInfo(data) {
      return data.name is string && data.address is string && data.phone is string && data.email is string;
    }

    // Helper for validating Polyclinic
    function isValidPolyclinic(data) {
      return data.code is string && data.name is string && data.status is string;
    }

    // Helper for validating Specialist
    function isValidSpecialist(data) {
      return data.code is string && data.name is string;
    }

    // Helper for validating SocialMedia
    function isValidSocialMedia(data) {
      return data.id is string && data.platform is string && data.url is string;
    }

    // Helper for validating Announcement
    function isValidAnnouncement(data) {
      return data.id is string && data.title is string && data.isActive is bool;
    }

    // Helper for validating HospitalRoom
    function isValidHospitalRoom(data) {
      return data.id is string && data.type is string && data.name is string && data.class is string && data.capacity is number && data.occupied is number;
    }

    // Helper for validating Doctor
    function isValidDoctor(data) {
      return data.id is string && data.name is string && data.specialty is string && data.experience is number && data.rating is number && data.bpjs is bool;
    }

    // Helper for validating Booking
    function isValidBooking(data) {
      return data.patientName is string && data.phone is string && data.patientType is string && data.selectedDoctorId is string && data.selectedDate is string;
    }

    match /rs_info/{configId} {
      allow read: if true;
      allow write: if isValidId(configId) && isValidHospitalInfo(request.resource.data);
    }

    match /polyclinics/{polyclinicId} {
      allow read: if true;
      allow write: if isValidId(polyclinicId) && isValidPolyclinic(request.resource.data);
    }

    match /specialists/{specialistId} {
      allow read: if true;
      allow write: if isValidId(specialistId) && isValidSpecialist(request.resource.data);
    }

    match /social_media/{socialMediaId} {
      allow read: if true;
      allow write: if isValidId(socialMediaId) && isValidSocialMedia(request.resource.data);
    }

    match /announcements/{announcementId} {
      allow read: if true;
      allow write: if isValidId(announcementId) && isValidAnnouncement(request.resource.data);
    }

    match /rooms/{roomId} {
      allow read: if true;
      allow write: if isValidId(roomId) && isValidHospitalRoom(request.resource.data);
    }

    match /doctors/{doctorId} {
      allow read: if true;
      allow write: if isValidId(doctorId) && isValidDoctor(request.resource.data);
    }

    match /bookings/{bookingId} {
      allow read: if true;
      allow write: if isValidId(bookingId) && isValidBooking(request.resource.data);
    }
  }
}
`;

    setTimeout(() => {
      triggerDownload(
        'firestore.rules',
        rules,
        'text/plain'
      );
      setDownloadingSection(null);
    }, 600);
  };

  const handleDownloadDataDump = () => {
    setDownloadingSection('data-dump');
    const dump = {
      _meta: {
        exportedBy: "RS Yasmin Banyuwangi Portal Admin",
        timestamp: new Date().toISOString(),
        format: "JSON Data Export"
      },
      hospitalInfo: rsInfo,
      polyclinics: polyclinics,
      specialists: specialists,
      socialMedia: socialMediaLinks,
      announcements: announcements,
      rooms: rooms,
      doctors: doctors
    };

    setTimeout(() => {
      triggerDownload(
        'rs_yasmin_data_dump.json',
        JSON.stringify(dump, null, 2),
        'application/json'
      );
      setDownloadingSection(null);
    }, 800);
  };

  // Preview structure helpers
  const tableStructures = [
    {
      name: 'hospital_info',
      type: 'Config Object',
      desc: 'Profil & Identitas Utama Rumah Sakit',
      fields: [
        { name: 'name', type: 'string', desc: 'Nama resmi rumah sakit' },
        { name: 'address', type: 'string', desc: 'Alamat lengkap lokasi instansi' },
        { name: 'phone', type: 'string', desc: 'Nomor telepon resmi' },
        { name: 'email', type: 'string', desc: 'Email dinas resmi' },
        { name: 'whatsapp', type: 'string', desc: 'Kontak pendaftaran WhatsApp' },
        { name: 'accreditation', type: 'string', desc: 'Status sertifikat akreditasi (KARS Paripurna)' },
        { name: 'logo', type: 'string (URL)', desc: 'Tautan URL logo resmi' }
      ]
    },
    {
      name: 'doctors',
      type: 'Collection',
      desc: 'Manajemen Staf Medis dan Dokter Spesialis',
      fields: [
        { name: 'id', type: 'string (PK)', desc: 'ID Unik Dokter / Kode Staf' },
        { name: 'name', type: 'string', desc: 'Nama lengkap beserta gelar dokter' },
        { name: 'specialty', type: 'string', desc: 'Spesialisasi medis utama' },
        { name: 'experience', type: 'number', desc: 'Jumlah tahun pengalaman kerja' },
        { name: 'rating', type: 'number', desc: 'Nilai kepuasan pasien (skala 5)' },
        { name: 'bpjs', type: 'boolean', desc: 'Apakah menerima pasien asuransi BPJS' },
        { name: 'status', type: 'string', desc: 'Status kehadiran saat ini (Aktif, Libur, dll)' }
      ]
    },
    {
      name: 'rooms',
      type: 'Collection',
      desc: 'Status Ketersediaan Tempat Tidur Rumah Sakit',
      fields: [
        { name: 'id', type: 'string (PK)', desc: 'ID Kode Ruangan' },
        { name: 'name', type: 'string', desc: 'Nama bangsal/kamar rawat inap' },
        { name: 'type', type: 'string', desc: 'Tipe kategori ruangan (Rawat Inap, ICU, IGD)' },
        { name: 'class', type: 'string', desc: 'Kelas perawatan (Suite, VIP, Kelas 1, 2, 3)' },
        { name: 'capacity', type: 'number', desc: 'Total kapasitas tempat tidur' },
        { name: 'occupied', type: 'number', desc: 'Jumlah tempat tidur yang terisi' }
      ]
    },
    {
      name: 'bookings',
      type: 'Collection',
      desc: 'Registrasi Pendaftaran Pasien Rawat Jalan Online',
      fields: [
        { name: 'id', type: 'string (PK)', desc: 'Nomor Tiket Antrean / Kode Booking' },
        { name: 'patientName', type: 'string', desc: 'Nama lengkap pasien pendaftar' },
        { name: 'phone', type: 'string', desc: 'Kontak WhatsApp aktif' },
        { name: 'patientType', type: 'string', desc: 'Metode pembayaran (BPJS, Umum, Asuransi)' },
        { name: 'selectedDoctorId', type: 'string (FK)', desc: 'Relasi ke dokter yang dipilih' },
        { name: 'selectedDate', type: 'string', desc: 'Tanggal rencana berobat (YYYY-MM-DD)' },
        { name: 'selectedTimeSlot', type: 'string', desc: 'Sesi jam praktek dokter pilihan' }
      ]
    }
  ];

  return (
    <div id="database-export-manager" className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-teal-50 text-yasmin-green rounded-xl">
            <Server className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-gray-850">Manajer Ekspor Skema Database</h3>
            <p className="text-xs text-gray-500 mt-0.5">Ekspor, unduh, dan pelajari skema database NoSQL (Firestore) dan Relasional (PostgreSQL)</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 self-start md:self-auto font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Database Aktif: Firestore Cloud</span>
        </div>
      </div>

      {/* Main Grid for Download Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Firestore Blueprint JSON */}
        <div className="border border-gray-200 hover:border-teal-200 hover:shadow-md transition-all rounded-xl p-5 flex flex-col justify-between bg-slate-50/50">
          <div className="space-y-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg w-10 h-10 flex items-center justify-center">
              <FileJson className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-850 font-sans">NoSQL Blueprint</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Spesifikasi komplit skema koleksi, relasi, tipe properti wajib Firestore JSON.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownloadFirestoreBlueprint}
            disabled={downloadingSection !== null}
            className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            {downloadingSection === 'firestore-json' ? (
              <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Unduh Blueprint (.json)</span>
              </>
            )}
          </button>
        </div>

        {/* PostgreSQL SQL DDL */}
        <div className="border border-gray-200 hover:border-teal-200 hover:shadow-md transition-all rounded-xl p-5 flex flex-col justify-between bg-slate-50/50">
          <div className="space-y-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg w-10 h-10 flex items-center justify-center">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-850 font-sans">PostgreSQL DDL</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">File query SQL DDL (CREATE TABLE) lengkap untuk migrasi instan ke database relasional.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownloadPostgresSQL}
            disabled={downloadingSection !== null}
            className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            {downloadingSection === 'postgres-sql' ? (
              <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Unduh SQL DDL (.sql)</span>
              </>
            )}
          </button>
        </div>

        {/* Firestore Security Rules */}
        <div className="border border-gray-200 hover:border-teal-200 hover:shadow-md transition-all rounded-xl p-5 flex flex-col justify-between bg-slate-50/50">
          <div className="space-y-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg w-10 h-10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-850 font-sans">Aturan Keamanan</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Konfigurasi Aturan Akses (Security Rules) Firestore untuk menjamin keamanan dari luar.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownloadFirestoreRules}
            disabled={downloadingSection !== null}
            className="w-full mt-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            {downloadingSection === 'firestore-rules' ? (
              <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Unduh Aturan (.rules)</span>
              </>
            )}
          </button>
        </div>

        {/* Live Active Data Dump */}
        <div className="border border-gray-200 hover:border-teal-200 hover:shadow-md transition-all rounded-xl p-5 flex flex-col justify-between bg-slate-50/50">
          <div className="space-y-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg w-10 h-10 flex items-center justify-center">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-850 font-sans">Salinan Data Aktif</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Ekspor seluruh isi database terkini (Profil, Dokter, Ruangan, Pengumuman) langsung.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownloadDataDump}
            disabled={downloadingSection !== null}
            className="w-full mt-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            {downloadingSection === 'data-dump' ? (
              <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Ekspor Semua Data (.json)</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Visual Table Schema Explorer */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-slate-50/30">
        <div className="bg-slate-50 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Table className="h-4.5 w-4.5 text-gray-500" />
            <h4 className="font-bold text-sm text-gray-800">Visual Explorer: Struktur Data Koleksi Rumah Sakit</h4>
          </div>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold font-mono uppercase">Relasional & NoSQL</span>
        </div>

        <div className="p-5 space-y-3">
          {tableStructures.map((tbl) => (
            <div key={tbl.name} className="border border-gray-150 rounded-lg bg-white overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setExpandedTable(expandedTable === tbl.name ? null : tbl.name)}
                className="w-full px-4 py-3 hover:bg-slate-50 transition-all flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-teal-500" />
                  <div>
                    <span className="font-mono text-sm font-bold text-gray-850">{tbl.name}</span>
                    <span className="text-xs text-gray-400 ml-2">({tbl.type})</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 hidden sm:inline">{tbl.desc}</span>
                  {expandedTable === tbl.name ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </button>

              {expandedTable === tbl.name && (
                <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-slate-50/50 font-sans">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse mt-2 text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-500 font-bold">
                          <th className="pb-2 font-mono">Nama Kolom / Properti</th>
                          <th className="pb-2 font-mono">Tipe Data</th>
                          <th className="pb-2">Keterangan Fungsi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {tbl.fields.map((field) => (
                          <tr key={field.name} className="text-gray-700">
                            <td className="py-2 font-mono font-bold text-teal-700">{field.name}</td>
                            <td className="py-2 font-mono text-indigo-600">{field.type}</td>
                            <td className="py-2 text-gray-500">{field.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
