// Base URL (backend)
const BASE_URL = "http://localhost:3000/api";

// Auth endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: `${BASE_URL}/users/register`,
  LOGIN: `${BASE_URL}/users/login`,
};

// Folder endpoints
export const FOLDER_ENDPOINTS = {
  CREATE: `${BASE_URL}/folders`,
  GET_FOLDERS: `${BASE_URL}/folders`, // ✅ correct
  GET_BY_ID: (folderId) => `${BASE_URL}/folders/${folderId}`,
  SEND_INVITE: `${BASE_URL}/folders/invite`,
  ACCEPT_INVITE: `${BASE_URL}/folders/accept`,
};

// File endpoints
export const FILE_ENDPOINTS = {
  UPLOAD: `${BASE_URL}/files/upload`,
  GET_BY_FOLDER: (folderId) => `${BASE_URL}/files/${folderId}`,
};
