'use client';

import { Heart, X } from 'lucide-react';

interface AuthPromptModalProps {
  open: boolean;
  onClose: () => void;
  onLogin?: () => void;
}

export function AuthPromptModal({ open, onClose, onLogin }: AuthPromptModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl transition-all"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
        >
          <X size={16} />
        </button>

        <div className="mx-auto -mt-2 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
          <Heart size={28} className="fill-rose-500 text-rose-500" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Сохраняйте любимые места
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
          Войдите, чтобы добавлять места в избранное и возвращаться к ним в любое время
        </p>

        <button
          type="button"
          onClick={onLogin}
          className="mt-5 w-full rounded-full bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Войти
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full rounded-full py-3 text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          Продолжить без входа
        </button>
      </div>
    </div>
  );
}