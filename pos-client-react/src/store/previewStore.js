import { create } from "zustand";

export const usePreviewStore = create((set) => ({
  open: false,
  imgUrl: "",
  // Function for opening the preview (called from various pages)
  handleOpenPreview: (url) => {
    set({
      open: true,
      imgUrl: url,
    });
  },
  // Function for closing the preview (called from the preview component)
  handleClosePreview: () => {
    set({
      open: false,
      imgUrl: "",
    });
  },
}));
