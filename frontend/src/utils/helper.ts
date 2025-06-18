import axios from "axios";
import { API_BASE_URL } from "./constants";

export async function logout() {
    try {
        await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
        alert(error);
    }
}