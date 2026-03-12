import { useState } from "react";

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: "confirm" | "alert" | "success" | "error";
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function useModal() {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert"
  });

  const showAlert = (title: string, message: string, type: "alert" | "success" | "error" = "alert") => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      confirmText: "OK"
    });
  };

  const showConfirm = (
    title: string, 
    message: string, 
    onConfirm: () => void,
    options?: {
      confirmText?: string;
      cancelText?: string;
    }
  ) => {
    setModal({
      isOpen: true,
      title,
      message,
      type: "confirm",
      onConfirm,
      confirmText: options?.confirmText || "Confirm",
      cancelText: options?.cancelText || "Cancel"
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  return {
    modal,
    showAlert,
    showConfirm,
    closeModal
  };
}
