import { create } from "zustand";

// Dialog store for showing dialogs

export const useDialogStore = create((set) => ({
  isOpen: false,
  title: "",
  description: "",
  details: null,
  onConfirm: () => {},
  openDialog: (title, description, details, onConfirm) =>
    set({ isOpen: true, title, description, details, onConfirm }),
  closeDialog: () =>
    set({
      isOpen: false,
      title: "",
      description: "",
      details: null,
      onConfirm: () => {},
    }),
}));
