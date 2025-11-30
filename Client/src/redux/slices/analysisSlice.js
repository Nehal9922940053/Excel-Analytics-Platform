

import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "/api";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

console.log("Analysis API URL:", API_URL); 

const initialState = {
    analyses: [],
    currentAnalysis: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    stats: {
        totalAnalyses: 0,
        chartsGenerated: 0,
        aiInsights: 0,
        activeAnalysis: 0
    }
};

export const getAnalyses = createAsyncThunk("analysis/getAll", async(_, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.userInfo.token;
        const isAdmin = state.auth.userInfo.isAdmin;

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const endpoint = isAdmin
            ? "/data/history"
            : "/data/history";
        // const response = await axios.get(API_URL + endpoint, config);
         const response = await axios.get(`${API_URL}/data/history`, config);
        return response.data;
    } catch (error) {
        const message = (error.response
            ?.data
                ?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get admin stats (users, analyses, charts by users only)
export const getAdminStats = createAsyncThunk("analysis/getAdminStats", async(_, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.userInfo.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        // const response = await axios.get(API_URL + "/admin/stats", config);
         const response = await axios.get(`${API_URL}/admin/stats`, config);
        return response.data;
    } catch (error) {
        const message = (error.response
            ?.data
                ?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Upload Excel file
export const uploadFile = createAsyncThunk("analysis/upload", async(formData, thunkAPI) => {
    try {
        const token = thunkAPI
            .getState()
            .auth
            .userInfo
            .token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        };

        const response = await axios.post(`${API_URL}/upload`, formData, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get analysis by ID
export const getAnalysis = createAsyncThunk("analysis/getOne", async(id, thunkAPI) => {
    try {
        const token = thunkAPI
            .getState()
            .auth
            .userInfo
            .token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // const response = await axios.get(API_URL + `/data/${id}`, config);

                const response = await axios.get(`${API_URL}/data/${id}`, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const saveChartConfig = createAsyncThunk("analysis/saveChart", async({
    id,
    chartConfig
}, thunkAPI) => {
    try {
        const token = thunkAPI
            .getState()
            .auth
            .userInfo
            .token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const response = await axios.put(`${API_URL}/data/${id}/chart`, chartConfig, config);

        return {
            ...response.data,
            id,
            chartConfig
        };
    } catch (error) {
        const message = error.response
            ?.data
                ?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get user stats (only user's own data)
export const getUserStats = createAsyncThunk("analysis/getStats", async(_, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.userInfo.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const response = await axios.get(`${API_URL}/data/stats`, config);
        return response.data;
    } catch (error) {
        const message = (error.response
            ?.data
                ?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get insights (now uses comprehensive statistical analysis)
export const getInsights = createAsyncThunk("analysis/getInsights", async(id, thunkAPI) => {
    try {
        const token = thunkAPI
            .getState()
            .auth
            .userInfo
            .token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const response = await axios.post(`${API_URL}/data/${id}/insights`, {}, config);

        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.insights) {
            return error.response.data;
        }

        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const analysisSlice = createSlice({
    name: "analysis",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        },
        setCurrentAnalysis: (state, action) => {
            state.currentAnalysis = action.payload;
        },
        clearCurrentAnalysis: (state) => {
            state.currentAnalysis = null;
        },
        clearMessage: (state) => {
            state.message = "";
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAnalyses.pending, (state) => {
            state.isLoading = true;
        }).addCase(getAnalyses.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.analyses = action.payload;
        }).addCase(getAnalyses.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        }).addCase(uploadFile.pending, (state) => {
            state.isLoading = true;
        }).addCase(uploadFile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.currentAnalysis = {
                _id: action.payload.analysisId,
                columns: action.payload.columns,
                rowCount: action.payload.rowCount
            };
            state
                .analyses
                .unshift({
                    _id: action.payload.analysisId,
                    originalName: action.payload.filename,
                    createdAt: new Date().toISOString()
                });
            state.message = "File uploaded successfully";
        }).addCase(uploadFile.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        }).addCase(getAnalysis.pending, (state) => {
            state.isLoading = true;
        }).addCase(getAnalysis.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.currentAnalysis = action.payload;
        }).addCase(getAnalysis.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
     .addCase(saveChartConfig.fulfilled, (state, action) => {
    state.isSuccess = true;
    state.message = "Chart configuration saved";
    
    const { id, chartConfig } = action.meta.arg;
    
    if (state.currentAnalysis && state.currentAnalysis._id === id) {
        const hadChartBefore = state.currentAnalysis.chartConfig && 
                              state.currentAnalysis.chartConfig.xAxis && 
                              state.currentAnalysis.chartConfig.yAxis;
        
        state.currentAnalysis.chartConfig = chartConfig;
        
        if (!hadChartBefore && chartConfig.xAxis && chartConfig.yAxis) {
            state.stats.chartsGenerated = (state.stats.chartsGenerated || 0) + 1;
        }
    }
    
    const analysisIndex = state.analyses.findIndex(a => a._id === id);
    if (analysisIndex !== -1) {
        const hadChartBefore = state.analyses[analysisIndex].chartConfig && 
                              state.analyses[analysisIndex].chartConfig.xAxis && 
                              state.analyses[analysisIndex].chartConfig.yAxis;
        
        state.analyses[analysisIndex] = {
            ...state.analyses[analysisIndex],
            chartConfig: chartConfig,
            updatedAt: new Date().toISOString()
        };
        
        if (!hadChartBefore && chartConfig.xAxis && chartConfig.yAxis) {
            state.stats.chartsGenerated = (state.stats.chartsGenerated || 0) + 1;
        }
    }
})
            .addCase(getInsights.pending, (state) => {
            state.isLoading = true;
            state.message = "Generating comprehensive data analysis...";
        })
.addCase(getUserStats.fulfilled, (state, action) => {
    state.stats = action.payload;
})

.addCase(getUserStats.rejected, (state) => {
    state.stats = {
        totalAnalyses: state.analyses.length,
        chartsGenerated: state.analyses.filter(a => 
            a.chartConfig && a.chartConfig.xAxis && a.chartConfig.yAxis
        ).length,
        aiInsights: state.analyses.filter(a => 
            a.summary && a.summary.trim().length > 0
        ).length,
        activeAnalysis: state.currentAnalysis ? 1 : 0
    };
})
.addCase(getAdminStats.fulfilled, (state, action) => {
    state.stats = action.payload;
})
.addCase(getAdminStats.rejected, (state) => {
    state.stats = {
        totalAnalyses: 0,
        chartsGenerated: 0,
        aiInsights: 0,
        activeAnalysis: 0
    };
})
.addCase(getInsights.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            if (state.currentAnalysis) {
                state.currentAnalysis.summary = action.payload.insights;
            }

            if (action.payload.isFallback) {
                state.message = action.payload.message || "Comprehensive statistical analysis completed";
            } else {
                state.message = "AI insights generated successfully";
            }
        }).addCase(getInsights.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to generate insights";
        });

    }
});

export const {
    reset,
    setCurrentAnalysis,
    clearCurrentAnalysis,
    clearMessage
} = analysisSlice.actions;
export default analysisSlice.reducer;