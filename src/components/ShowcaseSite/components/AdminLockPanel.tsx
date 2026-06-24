import React, { useState } from 'react';
import { Lock, KeyRound, Mail, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export function AdminLockPanel({
  onLoginSuccess,
}: {
  onLoginSuccess: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください。');
      return;
    }
    setLoading(true);
    setError('');

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError('ログインに失敗しました。メールアドレスかパスワードが間違っています。');
    } else if (data.session) {
      onLoginSuccess();
    }
  };

  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl place-items-center px-5 py-8 animate-in fade-in zoom-in-95 duration-500">
      <section className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#111]/80 backdrop-blur-xl p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 text-teal-400 shadow-inner mb-4">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl font-black text-white">管理者ログイン</h1>
            <p className="mt-2 text-sm text-zinc-400">Supabaseに登録したアカウントでログインしてください</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-500">
                <Mail size={18} />
              </div>
              <input
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/50 pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-zinc-600"
                placeholder="メールアドレス"
                type="email"
                autoComplete="email"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-500">
                <KeyRound size={18} />
              </div>
              <input
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/50 pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-zinc-600"
                placeholder="パスワード"
                type="password"
                autoComplete="current-password"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {error && <p className="text-sm font-semibold text-rose-500 animate-pulse">{error}</p>}
            
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/50 transition-all hover:bg-teal-500 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
              ログイン
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
