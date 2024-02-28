import { TDatabaseSchema } from "@/schema/eur/database";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type ConfigState = {
  database?: TDatabaseSchema;
};

type ConfigActions = {
  setDatabaseConfig: (config: TDatabaseSchema) => void;
};

type ConfigStore = ConfigState & ConfigActions;

const useConfig = create<ConfigStore>()(
  immer((set) => ({
    setDatabaseConfig: (config) => {
      set((state) => {
        state.database = { ...state.database, ...config };
      });
    },
  })),
);

export { useConfig };
export type { ConfigStore };
