const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
export async function api(path, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('gestor_token') : null;
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    cache: 'no-store'
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'No se pudo completar la operación');
  return body;
}
