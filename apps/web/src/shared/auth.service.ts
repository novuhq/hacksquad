import { API_ROOT } from './api';

export function setToken(token: string) {
  localStorage.setItem('squad_token', token);
}

export function getToken() {
  return localStorage.getItem('squad_token');
}

export function isLoggedIn() {
  return !!getToken();
}

export const AUTH_URL = `${API_ROOT}/auth/github`;
