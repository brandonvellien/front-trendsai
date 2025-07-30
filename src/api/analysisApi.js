import axios from 'axios';
import { auth } from '../firebase';

const API_BASE_URL = 'https://trends-ai-backend-image2-382329904395.europe-west1.run.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const startAnalysisJob = (data) => {
  // data = { sourceType: 'instagram', sourceInput: '...' }
  return apiClient.post('/api/analysis/start', data);
};

export const fetchJobStatus = async (jobId) => {
  const { data } = await apiClient.get(`/api/analysis/status/${jobId}`);
  return data;
};

export const enrichAnalysisReport = async (jobId) => {
  const { data } = await apiClient.post(`/api/analysis/enrich/${jobId}`);
  return data;
};

export const generateCreativeImage = async (selections) => {
  // selections = { style, garments, color }
  const { data } = await apiClient.post('/api/analysis/generate-image', selections);
  return data;
}

export const fetchMyJobs = async () => {
  const { data } = await apiClient.get('/api/analysis/my-jobs');
  return data;
};