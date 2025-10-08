import axios from 'axios';

export const api = axios.create({
  baseURL: "http://localhost:3334",
  headers: {
    "Content-Type": "application/json",
  },
});
