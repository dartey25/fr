import Axios from "axios";
const axios = Axios.create({
  baseURL:
    process.env.NODE_ENV === "dev"
      ? `http://localhost:${process.env.LICENSE_SERVER_PORT}/`
      : "http://www.mdoffice.com.ua:7000/",
  proxy: false,
});

export { axios };
