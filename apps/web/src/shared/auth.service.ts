import jwtDecode from 'jwt-decode';
import { IJwtPayload } from '@hacksquad/shared';

export function setToken(token: string) {
  localStorage.setItem('squad_token', token);
}

export function getToken() {
  return localStorage.getItem('squad_token');
}

export function isLoggedIn() {
  return !!getToken();
}

export function getUser(): IJwtPayload | null {
  const token = getToken();
  if (!token) {
    return null;
  }

  return jwtDecode(token);
}
