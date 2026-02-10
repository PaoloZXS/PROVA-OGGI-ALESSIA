import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN,
  database: process.env.TURSO_DB || 'test',
});

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'DELETE') {
    await client.execute('DELETE FROM utenti WHERE id = ?', [id]);
    res.status(200).json({ success: true });
  } else if (req.method === 'PUT') {
    const { nome, cognome, email } = req.body;
    if (!nome || !cognome || !email) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }
    await client.execute('UPDATE utenti SET nome = ?, cognome = ?, email = ? WHERE id = ?', [nome, cognome, email, id]);
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
