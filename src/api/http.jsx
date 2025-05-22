import axios from "axios";

// axios 인스턴스 생성 
export const makeupApi = axios.create({
    baseURL: process.env.REACT_APP_MAKEUP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});