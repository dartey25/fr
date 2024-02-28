import "@/core";
import DatabaseSetup from "./setup/database";
import { Toaster } from "sonner";

export function App() {
  return (
    <div className="tw-container tw-mx-auto">
      <DatabaseSetup />
      <Toaster richColors position="bottom-right" expand={false} />
    </div>
  );
}

export default App;
