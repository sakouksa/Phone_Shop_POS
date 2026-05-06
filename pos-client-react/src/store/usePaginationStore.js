import {
  create
} from "zustand";

export const usePaginationStore = create((set) => ({
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    txt_search: "",
    status: null,
  },
  setPagination: (newPagination) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        ...newPagination
      },
    })),
  resetPagination: () =>
    set({
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        txt_search: "",
        status: null,
      },
    }),
}));