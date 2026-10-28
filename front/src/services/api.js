
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export function getCategories() {
  return api.get("/api/categories");
}

export function getFoods() {
  return api.get("/api/foods");
}

export function getImageUrl(path) {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}
