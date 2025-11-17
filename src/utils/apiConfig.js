import Constants from 'expo-constants';


export const API_BASE_URL = Constants.expoConfig?.extra?.REACT_APP_BACKEND_URL || 'http://localhost:5001';

console.log('API Base URL:', API_BASE_URL);

export const buildApiUrl = (path = '') => {
    if (!path) return API_BASE_URL;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
};