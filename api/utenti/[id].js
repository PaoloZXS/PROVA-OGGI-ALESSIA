import { createClient } from '@libsql/client';

export default async function handler(req, res) {
  const client = createClient({
    url: 'libsql://test-paolozxs.aws-eu-west-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzA3NTc4MTQsImlkIjoiYTU2ZTk3ZjUtZDZhNS00Y2VlLWIxZjItZjBkNTBiZmU5MDFkIiwicmlkIjoiZjM1YjAxMzMtOTllNC00M2Q1LWIyMGYtMGUxYTdmOWQ5NGNhIn0.UIhNjIc_22H0mV0zvNCrRyU1wvuIz8HOQEYGe2bpX5mlhVDA9sYrx7_iNKk8eoBsTe1l7jWpTs3sTvqQMi4WDw',
    database: 'test',
  });

  const { id } = req.query;
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'DELETE') {
    try {
      await client.execute('DELETE FROM utenti WHERE id = ?', [id]);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Errore durante l\'eliminazione' });
    }
  } else if (req.method === 'PUT') {
    const { nome, cognome, email } = req.body;
    if (!nome || !cognome || !email) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }
    try {
      await client.execute('UPDATE utenti SET nome = ?, cognome = ?, email = ? WHERE id = ?', [nome, cognome, email, id]);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Errore durante l\'aggiornamento' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
