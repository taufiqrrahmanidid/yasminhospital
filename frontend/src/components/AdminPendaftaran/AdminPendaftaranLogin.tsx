import React, { useState } from 'react';

interface Props {
  onLoginSuccess: (user: { email: string; name?: string }) => void;
}

export default function AdminPendaftaranLogin({ onLoginSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Panggil API Login PostgreSQL Port 5000
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Email atau kata sandi salah.');
      }

      // Simpan data user (cookie httpOnly dikelola otomatis oleh browser)
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Gagal masuk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-ivory px-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-headings font-mono text-xs tracking-widest uppercase mb-3 font-bold">
            <span className="w-2 h-2 rounded-full bg-yasmin-green animate-pulse" />
            RS Yasmin Banyuwangi
          </div>
          <h1 className="text-2xl font-display font-black text-headings">Admin Pendaftaran</h1>
          <p className="text-xs text-body-text mt-1">Sistem Otentikasi Mandiri (PostgreSQL Database)</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-body-text mb-1.5 uppercase tracking-wider font-mono">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-divider px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-headings transition-all"
              placeholder="Masukkan Email Anda"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-body-text mb-1.5 uppercase tracking-wider font-mono">Kata Sandi</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-divider px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-headings transition-all"
              placeholder="Masukkan Kata Sandi Anda"
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#0B4F4A] hover:bg-[#0E625C] text-white text-xs font-bold uppercase tracking-wider py-3 transition-all cursor-pointer shadow-md disabled:opacity-60 active:scale-95"
          >
            {loading ? 'Memeriksa Kredensial...' : 'Masuk ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
