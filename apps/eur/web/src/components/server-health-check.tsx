import { useEffect } from "react";
import { axios } from "../utils/axios";
import { toast } from "sonner";

const ServerHealthCheck = () => {
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await axios.get("api/ping");
      } catch (error) {
        showNotification(
          "Сервер не відповідає, спробуйте перезавантажити сервіс",
        );
      }
    };

    const intervalId = setInterval(checkServerStatus, 5 * 60 * 1000);

    checkServerStatus();

    return () => clearInterval(intervalId);
  }, []);

  const showNotification = (message: string) => {
    toast.error(message, {
      dismissible: true,
      important: true,
      duration: 5 * 60 * 1000,
    });
  };

  return null;
};

export default ServerHealthCheck;
