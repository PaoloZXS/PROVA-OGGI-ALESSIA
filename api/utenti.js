import { createClient } from '@libsql/client';

export default async function handler(req, res) {
  const client = createClient({
    url: 'libsql://test-paolozxs.aws-eu-west-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzA3NTc4MTQsImlkIjoiYTU2ZTk3ZjUtZDZhNS00Y2VlLWIxZjItZjBkNTBiZmU5MDFkIiwicmlkIjoiZjM1YjAxMzMtOTllNC00M2Q1LWIyMGYtMGUxYTdmOWQ5NGNhIn0.UIhNjIc_22H0mV0zvNCrRyU1wvuIz8HOQEYGe2bpX5mlhVDA9sYrx7_iNKk8eoBsTe1l7jWpTs3sTvqQMi4WDw',
    database: 'test',
  });

  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    try {
      const result = await client.execute('SELECT * FROM utenti');
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Errore nel recupero utenti' });
    }
  } else if (req.method === 'POST') {
    const { nome, cognome, email } = req.body;
    
    if (!nome || !cognome || !email) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }
    
    try {
      await client.execute('INSERT INTO utenti (nome, cognome, email) VALUES (?, ?, ?)', [nome, cognome, email]);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Errore durante l\'inserimento' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
