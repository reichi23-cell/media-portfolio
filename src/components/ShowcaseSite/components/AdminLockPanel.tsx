import React from 'react';
import { Lock, KeyRound } from 'lucide-react';

export function AdminLockPanel({
  hasPassword,
  password,
  confirmPassword,
  error,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: {
  hasPassword: boolean;
  password: string;
  confirmPassword: string;
  error: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl place-items-center px-5 py-8 animate-in fade-in zoom-in-95 duration-500">
      <section className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#111]/80 backdrop-blur-xl p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 text-teal-400 shadow-inner mb-4">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl font-black text-white">{hasPassword ? '管理画面ロック' : '管理パスワード設定'}</h1>
            <p className="mt-2 text-sm text-zinc-400">{hasPassword ? 'パスワードを入力してロックを解除してください' : '初回のみパスワードを設定します'}</p>
          </div>

          <div className="space-y-4">
            <input
              value={password}
              onChange={event => onPasswordChange(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-zinc-600"
              placeholder="パスワード"
              type="password"
              autoComplete={hasPassword ? 'current-password' : 'new-password'}
              onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
            />
            {!hasPassword && (
              <input
                value={confirmPassword}
                onChange={event => onConfirmPasswordChange(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-zinc-600"
                placeholder="確認用パスワード"
                type="password"
                autoComplete="new-password"
                onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
              />
            )}
            {error && <p className="text-sm font-semibold text-rose-500 animate-pulse">{error}</p>}
            
            <button
              onClick={onSubmit}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/50 transition-all hover:bg-teal-500 hover:-translate-y-0.5 active:translate-y-0"
            >
              <KeyRound size={18} />
              {hasPassword ? 'ロック解除' : '設定して開く'}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
