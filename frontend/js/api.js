export const API = 'http://127.0.0.1:5000';
export async function saveCV(payload){
  const r = await fetch(`${API}/api/cv/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return await r.json();
}
