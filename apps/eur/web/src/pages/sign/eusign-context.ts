import { createContext } from "react";
import { EUSignCPFrontend } from "md-sign";

type ContextInterface = {
  euSign: EUSignCPFrontend | undefined;
  setEUSign: (library: EUSignCPFrontend) => void;
};

export default createContext<ContextInterface>({
  euSign: undefined,
  setEUSign: (_library: EUSignCPFrontend) => {},
});
