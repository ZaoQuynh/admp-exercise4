import axios from "axios";
import { API_BASE_URL } from "../constants/apiConfig";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const updateUserInfo = async (fullName: String, username: String, phoneNumber: String, avatar: String) => {
    const response = await api.put('/user/update', {fullName, username, phoneNumber, avatar});
    return response.data;
}
