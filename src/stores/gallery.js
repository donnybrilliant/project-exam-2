import { create } from "zustand";

// Gallery store for storing the index of the open image
export const useGalleryStore = create((set) => ({
  openImageIndex: null,
  setOpenImageIndex: (index) => set({ openImageIndex: index }),
  goToNextImage: (mediaLength) =>
    set((state) => {
      // If the current index is less than the length of the media array, increment it by 1
      const newIndex =
        state.openImageIndex < mediaLength - 1 ? state.openImageIndex + 1 : 0;
      return { openImageIndex: newIndex };
    }),
  goToPreviousImage: (mediaLength) =>
    set((state) => {
      const newIndex =
        // If the current index is greater than 0, decrement it by 1
        state.openImageIndex > 0 ? state.openImageIndex - 1 : mediaLength - 1;
      return { openImageIndex: newIndex };
    }),
}));
