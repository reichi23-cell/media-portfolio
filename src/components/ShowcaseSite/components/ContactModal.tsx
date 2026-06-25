import React, { useState } from 'react';
import { Mail, Send, X, MessageSquareHeart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function ContactModal({
  isOpen,
  onClose,
  onSend,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSend: (content: string, contactInfo: string) => Promise<void>;
}) {
  const [content, setContent] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!content.trim()) return;
    setIsSending(true);
    try {
      await onSend(content, contactInfo);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setContent('');
        setContactInfo('');
        onClose();
      }, 2000);
    } catch (e) {
      alert('メッセージの送信に失敗しました。');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-lg bg-[#0f0f0f] rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center animate-in zoom-in duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/20 text-teal-400 mb-4">
              <MessageSquareHeart size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">送信完了しました！</h3>
            <p className="text-zinc-400">メッセージありがとうございます。</p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
                <Mail size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Contact</h2>
                <p className="text-sm text-zinc-400">感想やご依頼はお気軽にどうぞ</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">メッセージ <span className="text-rose-500">*</span></label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[120px] rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-teal-500/50 transition-all resize-none placeholder:text-zinc-600"
                  placeholder="メッセージを入力してください..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">
                  返信先 <span className="text-xs font-normal text-zinc-500">（※返信が必要な場合のみ）</span>
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-teal-500/50 transition-all placeholder:text-zinc-600"
                  placeholder="X(Twitter)のIDやメールアドレス"
                />
              </div>

              <button
                onClick={handleSend}
                disabled={isSending || !content.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-4 font-bold text-white shadow-lg shadow-teal-900/20 transition-all hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <span className="animate-pulse">送信中...</span>
                ) : (
                  <>
                    <Send size={18} /> 送信する
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
