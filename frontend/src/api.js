const API_BASE = '/api/songs';
export const AUTH_BASE = '/api/auth';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function loginApi(credentials) {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }
  return res.json();
}

export async function registerApi(credentials) {
  const res = await fetch(`${AUTH_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Registration failed');
  }
  return res.json();
}

export async function getSongs() {
  const res = await fetch(API_BASE, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch songs');
  return res.json();
}

export async function getSong(id) {
  const res = await fetch(`${API_BASE}/${id}`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch song');
  return res.json();
}

export async function createSong(data) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create song');
  return res.json();
}

export async function updateSong(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update song');
  return res.json();
}

export async function deleteSong(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete song');
  return res.json();
}
