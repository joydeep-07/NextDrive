import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AUTH_ENDPOINTS } from "../../api/endpoint";

/* =========================
   LOGIN
========================= */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Login failed");
      }

      // ✅ persist auth
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error) {
      return rejectWithValue("Network error");
    }
  },
);

/* =========================
   LOAD USER (ON RELOAD)
========================= */
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue(null);

      const res = await fetch(AUTH_ENDPOINTS.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ❗ Only logout if backend CONFIRMS 401
      if (res.status === 401) {
        return rejectWithValue("unauthorized");
      }

      const data = await res.json();
      return data;
    } catch {
      // ❗ Network / reload failure ≠ logout
      return rejectWithValue(null);
    }
  },
);

/* =========================
   INITIAL STATE
========================= */
const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,

  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

/* =========================
   SLICE
========================= */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* LOAD USER */
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;

        // sync user
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;

        // 🔥 ONLY logout if backend CONFIRMS unauthorized
        if (action.payload === "unauthorized") {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
