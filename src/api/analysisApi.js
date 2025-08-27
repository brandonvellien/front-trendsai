import axios from 'axios';
import { auth } from '../firebase';

const API_BASE_URL = 'https://trends-ai-backend-image2-382329904395.europe-west1.run.app/api';
//const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// === Fonctions d'API Corrigées ===

export const startAnalysisJob = (jobData) => {
  // CORRECT : Le chemin commence par /analysis/, pas /api/analysis/
  return apiClient.post('/analysis/start', jobData);
};

export const getJobStatus = (jobId) => {
  return apiClient.get(`/analysis/status/${jobId}`);
};

export const fetchMyJobs = async () => {
    // CORRECT : Le chemin commence par /analysis/
    const { data } = await apiClient.get('/analysis/my-jobs');
    return data;
};

export const enrichAnalysis = (jobId) => {
    return apiClient.post(`/analysis/enrich/${jobId}`);
};

export const generateCreativeImage = (data) => {
    return apiClient.post('/analysis/generate-image', data);
};

// === Presets API (si vous les avez ajoutés) ===

export const getUserPresets = async () => {
  // CORRECT : Le chemin commence par /presets
  const { data } = await apiClient.get('/presets');
  return data;
};

export const createPreset = async (presetData) => {
  const { data } = await apiClient.post('/presets', presetData);
  return data;
};

export const deletePreset = async (presetId) => {
  await apiClient.delete(`/presets/${presetId}`);
};