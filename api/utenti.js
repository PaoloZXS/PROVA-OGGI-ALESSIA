import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN,
  database: process.env.TURSO_DB || 'test',
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const result = await client.execute('SELECT * FROM utenti');
    res.status(200).json(result.rows);
  } else if (req.method === 'POST') {
    const { nome, cognome, email } = req.body;
    if (!nome || !cognome || !email) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }
    await client.execute('INSERT INTO utenti (nome, cognome, email) VALUES (?, ?, ?)', [nome, cognome, email]);
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
