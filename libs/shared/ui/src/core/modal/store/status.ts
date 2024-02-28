import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { UseMutationResult } from "@tanstack/react-query";

type StatusModalState = {
  open: boolean;
  status?: UseMutationResult<any, Error, any>["status"];
  onSuccessCallback?: () => void;
  onCloseCallback?: () => void;
};

type CreateOptions = Required<Pick<StatusModalState, "status">> &
  Omit<StatusModalState, "open" | "status">;

type StatusModalActions = {
  create: (payload: CreateOptions) => void;
  setStatus: (payload: UseMutationResult<any, Error, any>["status"]) => void;
  dismiss: () => void;
};

type StatusModalStore = StatusModalState & StatusModalActions;

const useStatusModal = create<StatusModalStore>()(
  persist(
    immer((set) => ({
      open: false,
      create: (payload) => {
        set((state) => {
          state.open = true;
          state.status = payload.status;
          state.onSuccessCallback = payload.onSuccessCallback;
          state.onCloseCallback = payload.onCloseCallback;
        });
      },
      setStatus: (status) => {
        set((state) => {
          state.status = status;
        });
      },
      dismiss: () =>
        set((state) => {
          state.open = false;
          state.status = undefined;
          state.onSuccessCallback = undefined;
          state.onCloseCallback = undefined;
        }),
    })),
    {
      name: "status-modal-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export { useStatusModal };
export type { StatusModalStore, CreateOptions };
