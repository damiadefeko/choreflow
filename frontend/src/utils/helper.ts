import axios from "axios";
import { API_BASE_URL } from "./constants";

export async function logout() {
    try {
        await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
        alert(error);
    }
}

// Taken from: https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
export function formatDate(date: string) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}