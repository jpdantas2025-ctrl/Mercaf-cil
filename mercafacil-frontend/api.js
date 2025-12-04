// api.js
const BASE_URL = 'http://localhost:3000/api';  // ajuste se backend estiver em outro host/porta

export async function apiPost(path, body, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const resp = await fetch(`${BASE_URL}/${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  return resp.json();
}

export async function apiGet(path, token = null) {
  const headers = {};
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const resp = await fetch(`${BASE_URL}/${path}`, { headers });
  return resp.json();
}