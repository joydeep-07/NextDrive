import api from "./axios";

export const createFolder = (data) => {
  return api.post("/folders", data);
};
