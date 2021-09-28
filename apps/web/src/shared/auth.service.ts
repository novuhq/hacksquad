export function setToken(token: string) {
  localStorage.setItem('squad_token', token);
}

export function getToken() {
  return localStorage.getItem('squad_token');
}

export function isLoggedIn() {
  return !!getToken();
}
