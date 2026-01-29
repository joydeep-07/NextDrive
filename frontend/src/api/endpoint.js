// Base URL (backend)
const BASE_URL = "http://localhost:3000/api";

// Auth endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: `${BASE_URL}/users/register`,
  LOGIN: `${BASE_URL}/users/login`,
};

// 👤 User endpoints
export const USER_ENDPOINTS = {
  GET_ALL: `${BASE_URL}/users/all`, // 🔐 protected
};

// Folder endpoints
export const FOLDER_ENDPOINTS = {
  CREATE: `${BASE_URL}/folders`,
  GET_FOLDERS: `${BASE_URL}/folders`, // get my folders
  GET_BY_ID: (folderId) => `${BASE_URL}/folders/${folderId}`,

  // Collaboration
  SEND_INVITE: `${BASE_URL}/folders/invite`,
  ACCEPT_INVITE: `${BASE_URL}/folders/accept`,

  // 🗑 Delete folder (OWNER ONLY)
  DELETE_FOLDER: `${BASE_URL}/folders`,
};
