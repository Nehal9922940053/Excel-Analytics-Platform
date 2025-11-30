import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

// const API_URL = "/api/auth";

// const API_URL = "http://localhost:5000/api/auth";
const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

// Get user from localStorage
const userInfo = JSON.parse(localStorage.getItem("userInfo"));

const initialState = {
    userInfo: userInfo ? userInfo : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

// Login user
export const login = createAsyncThunk("auth/login", async ({email, password}, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password,
        });

        if (response.data) {
            localStorage.setItem("userInfo", JSON.stringify(response.data));
        }

        return response.data;
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const logoutt = createAsyncThunk('auth/logoutt', async (_, thunkAPI) => {
  try {
    // Clear localStorage or any stored tokens
    localStorage.removeItem('userInfo');
    return null;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
})


// Register user
export const register = createAsyncThunk("auth/register", async ({email, password}, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            email,
            password,
        });

        if (response.data) {
            localStorage.setItem("userInfo", JSON.stringify(response.data));
        }

        return response.data;
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Logout user
export const logout = createAsyncThunk("auth/logout", async () => {
    localStorage.removeItem("userInfo");
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.userInfo = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            state.userInfo = null;
        })
        .addCase(register.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.userInfo = action.payload;
        })
        .addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            state.userInfo = null;
        })
        .addCase(logout.fulfilled, (state) => {
            state.userInfo = null;
        })
        .addCase(logoutt.fulfilled, (state) => {
            state.userInfo = null;
            state.isLoading = false;
            state.isSuccess = true;
        });
    },
});

export const {reset} = authSlice.actions;
export default authSlice.reducer;
