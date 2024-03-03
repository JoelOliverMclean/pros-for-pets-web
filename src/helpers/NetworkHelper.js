import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: (process.env.REACT_APP_URL_PREFIX ?? "") + "/api/",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

const apiGet = (action, params = {}) => {
  return api.get(action, {
    validateStatus: (status) => {
      return true;
    },
    params: params ?? {},
  });
};

const apiDelete = (action, id) => {
  return api.delete(action, {
    params: {
      id: id,
    },
    validateStatus: (status) => {
      return true;
    },
  });
};

const apiPost = (action, body) => {
  return api.post(action, body, {
    validateStatus: (status) => {
      return true;
    },
    headers: {
      "Content-type": "application/json",
      "x-csrf-token": Cookies.get("csrf-token"),
    },
  });
};

const apiPostFormData = (action, body) => {
  return api.post(action, body, {
    validateStatus: (status) => {
      return true;
    },
    headers: {
      "Content-Type": "multipart/form-data",
      "x-csrf-token": Cookies.get("csrf-token"),
    },
  });
};

const getCsrfToken = async () => {
  apiGet("csrf-token").then(() => {});
};

export { apiGet, apiPost, getCsrfToken, apiDelete, apiPostFormData };
