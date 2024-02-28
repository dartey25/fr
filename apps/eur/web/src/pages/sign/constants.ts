const PROCESS_STATUS_READ_PRIVATE_KEY = "Зчитування особистого ключа";
const PROCESS_STATUS_SIGN_FILE = "Накладання підпису на файл";
const PROCESS_STATUS_INSTALL_LIBRARY =
  "Ініціалізація криптографічної бібліотеки";
const ERROR_KM_UPDATE_LIST =
  "Виникла помилка при оновленні списку носіїв ключової інформації";
const ERROR_GET_JKS_PRIVATE_KEY_INFO =
  "Виникла помилка при отриманні інформації про особистий ключ";
const ERROR_NO_KEYMEDIA = "Не обрано носій";
const ERROR_UNKNOWN = "Помилка";
const ERROR_URL_INIT = "Помилка запиту при ініціалізації";
const ERROR_URL_SAVE = "Помилка запиту при відправці";
const ERROR_NO_SIGN = "Помилка при читанні ключа";
const ERROR_SIGN = "Помилка при спробі підпису";
const PROCESS_STATUS_INIT_FORM = "Ініціалізація пакету відправки";
const PROCESS_STATUS_SEND = "Відправка пакету";
// const ERROR_URL_INIT = 'Сталась помилка при ініціалізації форми';
const ERROR_URL_SEND = "Сталась помилка при відправці пакету";

export {
  ERROR_GET_JKS_PRIVATE_KEY_INFO,
  ERROR_KM_UPDATE_LIST,
  ERROR_NO_KEYMEDIA,
  ERROR_NO_SIGN,
  ERROR_SIGN,
  ERROR_UNKNOWN,
  ERROR_URL_INIT,
  ERROR_URL_SAVE,
  ERROR_URL_SEND,
  PROCESS_STATUS_INIT_FORM,
  PROCESS_STATUS_INSTALL_LIBRARY,
  PROCESS_STATUS_READ_PRIVATE_KEY,
  PROCESS_STATUS_SEND,
  PROCESS_STATUS_SIGN_FILE,
};
