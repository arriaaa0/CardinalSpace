"use client";

import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "confirm" | "alert" | "success" | "error";
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = "alert",
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel"
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "confirm":
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 mb-4">
            <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case "success":
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getColors = () => {
    switch (type) {
      case "confirm":
        return {
          bg: "bg-white",
          border: "border-amber-200",
          title: "text-amber-900",
          message: "text-amber-700",
          confirm: "bg-amber-600 hover:bg-amber-700 text-white",
          cancel: "border-amber-300 text-amber-700 hover:bg-amber-50"
        };
      case "success":
        return {
          bg: "bg-white",
          border: "border-emerald-200",
          title: "text-emerald-900",
          message: "text-emerald-700",
          confirm: "bg-emerald-600 hover:bg-emerald-700 text-white",
          cancel: "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
        };
      case "error":
        return {
          bg: "bg-white",
          border: "border-red-200",
          title: "text-red-900",
          message: "text-red-700",
          confirm: "bg-red-600 hover:bg-red-700 text-white",
          cancel: "border-red-300 text-red-700 hover:bg-red-50"
        };
      default:
        return {
          bg: "bg-white",
          border: "border-blue-200",
          title: "text-blue-900",
          message: "text-blue-700",
          confirm: "bg-blue-600 hover:bg-blue-700 text-white",
          cancel: "border-blue-300 text-blue-700 hover:bg-blue-50"
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose} />
        
        <div className={`relative transform overflow-hidden rounded-2xl ${colors.bg} ${colors.border} border-2 p-6 text-left shadow-xl transition-all max-w-md w-full`}>
          {getIcon()}
          
          <div className="text-center">
            <h3 className={`text-lg font-semibold leading-6 ${colors.title}`}>
              {title}
            </h3>
            <div className="mt-2">
              <p className={`text-sm ${colors.message}`}>
                {message}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {type === "confirm" && onConfirm && (
              <>
                <button
                  type="button"
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold ${colors.confirm} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                >
                  {confirmText}
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-lg border ${colors.cancel} px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  onClick={onClose}
                >
                  {cancelText}
                </button>
              </>
            )}
            
            {(type === "alert" || type === "success" || type === "error") && (
              <button
                type="button"
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold ${colors.confirm} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`}
                onClick={onClose}
              >
                {confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
