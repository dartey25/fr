import "@/core";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { Providers } from "./utils/providers";
import { useModalStore } from "@/ui/modal/store/query";
import { Modal, StatusModal } from "@/ui";
import { useStatusModal } from "@/ui/modal/store/status";
import { Dialog } from "./components/ui/dialog";
// import ServerHealthCheck from "./components/server-health-check";

function App() {
  const modalState = useModalStore();
  const statusModalState = useStatusModal();
  return (
    <Providers>
      <RouterProvider router={router} />
      <Dialog open={modalState.open} onOpenChange={modalState.dismiss}>
        <Modal {...modalState} />
      </Dialog>
      <Dialog
        open={statusModalState.open}
        onOpenChange={statusModalState.dismiss}
      >
        <StatusModal {...statusModalState} />
      </Dialog>
      {/* <ServerHealthCheck /> */}
    </Providers>
  );
}

export default App;
