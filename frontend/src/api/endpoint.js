// Base URL (backend)
const BASE_URL = "http://localhost:3000/api";

export const AUTH_ENDPOINTS = {
  REGISTER: `${BASE_URL}/users/register`,
  LOGIN: `${BASE_URL}/users/login`,
};

export const USER_ENDPOINTS = {
  GET_ALL: `${BASE_URL}/users/all`,
};

export const FOLDER_ENDPOINTS = {
  CREATE: `${BASE_URL}/folders`,
  GET_FOLDERS: `${BASE_URL}/folders`,
  GET_BY_ID: (id) => `${BASE_URL}/folders/${id}`,

  SEND_INVITE: `${BASE_URL}/folders/invite`,
  ACCEPT_INVITE: `${BASE_URL}/folders/accept`,
  GET_INVITATIONS: `${BASE_URL}/folders/invitations`,

  // ✅ NEW — Folder participants (owner + collaborators)
  GET_PARTICIPANTS: (folderId) =>
    `${BASE_URL}/folders/${folderId}/participants`,

  DELETE_FOLDER: (id) => `${BASE_URL}/folders/${id}`,
};

export const FILE_ENDPOINTS = {
  UPLOAD: `${BASE_URL}/files/upload`,

  GET_MY_FILES: `${BASE_URL}/files`,

  GET_FILE: (fileId) => `${BASE_URL}/files/${fileId}`,

  RENAME_FILE: (id) => `${BASE_URL}/files/rename/${id}`, // ✅ FIXED

  DELETE_FILE: (fileId) => `${BASE_URL}/files/${fileId}`,
};


export const CHAT_ENDPOINTS = {
  GET_MESSAGES: (folderId) => `${BASE_URL}/chat/${folderId}`,
  SEND_MESSAGE: (folderId) => `${BASE_URL}/chat/${folderId}`,
};

