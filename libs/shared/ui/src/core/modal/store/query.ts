import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { UseQueryOptions } from "@tanstack/react-query";
import React from "react";
import { ModalContent } from "../modal";

type ModalState = {
  open: boolean;
  content?: React.FC;
  title?: string;
  description?: string;
};

type CreateOptions = Omit<ModalState, "open" | "content"> & {
  queryOptions?: UseQueryOptions;
  contentFn: React.FC<{ data: unknown }>;
};

type ModalActions = {
  create: (payload: CreateOptions) => void;
  dismiss: () => void;
};

type ModalStore = ModalState & ModalActions;

const useModalStore = create<ModalStore>()(
  persist(
    immer((set) => ({
      open: false,
      queryOptions: undefined,
      create: (payload) => {
        set((state) => {
          if (payload.title) state.title = payload.title;
          if (payload.description) state.description = payload.description;
          state.open = true;
          if (payload.queryOptions) {
            state.content = () =>
              React.createElement(ModalContent, {
                queryOptions: payload.queryOptions!,
                contentFn: payload.contentFn!,
              });
          } else if (payload.contentFn && !payload.queryOptions) {
            state.content = () =>
              React.createElement(ModalContent, {
                contentFn: payload.contentFn!,
              });
          }
        });
      },
      dismiss: () =>
        set((state) => {
          state.open = false;
          state.description = undefined;
          state.title = undefined;
        }),
    })),
    {
      name: "modal-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

export { useModalStore };
export type { ModalStore, CreateOptions };
