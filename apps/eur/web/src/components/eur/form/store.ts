import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type TFormItem = {
  ref: React.RefObject<HTMLLegendElement> | null;
  fieldId: string | null;
  name: string;
} & (
  | {
      type: "table";
      struct?: TFormStructure;
    }
  | { type?: "field" }
);

type TFormStructure = Record<string, TFormItem>;

const formStructure: TFormStructure = {
  general: {
    name: "Загальні відомості",
    ref: null,
    fieldId: null,
  },
  exporter: {
    name: "Експортер",
    ref: null,
    fieldId: null,
  },
  agreement_countries: {
    name: "Країни угоди",
    ref: null,
    fieldId: null,
  },
  receiver: {
    name: "Вантажоодержувач",
    ref: null,
    fieldId: null,
  },
  originCountry: {
    name: "Країна походження",
    ref: null,
    fieldId: null,
  },
  destinationCountry: {
    name: "Країна призначення",
    ref: null,
    fieldId: null,
  },
  transport: {
    name: "Транспортні реквізити",
    ref: null,
    fieldId: null,
  },
  remark: {
    name: "Зауваження",
    ref: null,
    fieldId: null,
  },
  goods: {
    type: "table",
    name: "Товари",
    ref: null,
    fieldId: null,
    struct: undefined,
  },
  customsPermission: {
    name: "Митний дозвіл",
    ref: null,
    fieldId: null,
  },
  exportDeclaration: {
    name: "Декларація від експортера",
    ref: null,
    fieldId: null,
  },
  receiveForm: {
    name: "Заява на отримання",
    ref: null,
    fieldId: null,
  },
  addedDocs: {
    type: "table",
    name: "Прикладені документи",
    ref: null,
    fieldId: null,
  },
};

interface FormState {
  structure: TFormStructure;
  // setStruct: (payload: {
  //   key: string;
  //   ref: TFormItem["ref"];
  //   fieldId: TFormItem["fieldId"];
  // }) => void;
}

const useFormStore = create<FormState>()(
  immer(() => ({
    structure: formStructure,
    //   setStruct: (payload) => {
    //     set((state) => {
    //       let field;
    //       if (payload.key === "exporter") {
    //         field = state.structure.exporter;
    //       } else if (payload.key === "countries") {
    //         field = state.structure.countries;
    //       } else if (payload.key === "receiver") {
    //         field = state.structure.receiver;
    //       } else if (payload.key === "originCountry") {
    //         field = state.structure.originCountry;
    //       } else if (payload.key === "destinationCountry") {
    //         field = state.structure.destinationCountry;
    //       } else if (payload.key === "transport") {
    //         field = state.structure.transport;
    //       } else if (payload.key === "remark") {
    //         field = state.structure.remark;
    //       } else if (payload.key === "customsPermission") {
    //         field = state.structure.customsPermission;
    //       } else if (payload.key === "exportDeclaration") {
    //         field = state.structure.exportDeclaration;
    //       }

    //       state.structure[payload.key].name = ;
    //     });
    //   },
  })),
);

interface GoodsState {
  structure: string[];
  setStruct: (struct: string[]) => void;
}

const useGoodsStore = create<GoodsState>()(
  immer((set) => ({
    structure: [],
    setStruct: (struct) => {
      set((state) => {
        state.structure = struct;
      });
    },
  })),
);

interface DocsState {
  structure: string[];
  setStruct: (struct: string[]) => void;
}

const useDocsStore = create<DocsState>()(
  immer((set) => ({
    structure: [],
    setStruct: (struct) => {
      set((state) => {
        state.structure = struct;
      });
    },
  })),
);

export { useFormStore, useGoodsStore, useDocsStore };
export type { TFormItem, TFormStructure };
