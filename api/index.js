import express from 'express';
import bodyParser from 'body-parser';
import { createClient } from '@libsql/client';

const app = express();

const client = createClient({
  url: 'libsql://test-paolozxs.aws-eu-west-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzA3NTc4MTQsImlkIjoiYTU2ZTk3ZjUtZDZhNS00Y2VlLWIxZjItZjBkNTBiZmU5MDFkIiwicmlkIjoiZjM1YjAxMzMtOTllNC00M2Q1LWIyMGYtMGUxYTdmOWQ5NGNhIn0.UIhNjIc_22H0mV0zvNCrRyU1wvuIz8HOQEYGe2bpX5mlhVDA9sYrx7_iNKk8eoBsTe1l7jWpTs3sTvqQMi4WDw',
  database: 'test',
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('..'));

// GET: ottieni tutti gli utenti
app.get('/api/utenti', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM utenti');
    res.json(result.rows);
  } catch (err) {
    console.error('Errore:', err);
    res.status(500).json({ error: 'Errore nel recupero dei dati' });
  }
});

// POST: inserisci nuovo utente
app.post('/api/utenti', async (req, res) => {
  try {
    const { nome, cognome, email } = req.body;
    if (!nome || !cognome || !email) {
      return res.status(400).json({ error: 'Nome, cognome e email sono obbligatori' });
    }
    const result = await client.execute(
      'INSERT INTO utenti (nome, cognome, email) VALUES (?, ?, ?)',
      [nome, cognome, email]
    );
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: 'Errore nell\'inserimento', details: err.message });
  }
});

// API per eliminare un utente
app.delete('/api/utenti/:id', async (req, res) => {
  const id = req.params.id;
  await client.execute('DELETE FROM utenti WHERE id = ?', [id]);
  res.json({ success: true });
});

// API per modificare un utente
app.put('/api/utenti/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cognome, email } = req.body;
    await client.execute(
      'UPDATE utenti SET nome = ?, cognome = ?, email = ? WHERE id = ?',
      [nome, cognome, email, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Errore nell\'aggiornamento', details: err.message });
  }
});

// Rotta fallback per file statici
app.get('/:file', (req, res) => {
  const file = req.params.file;
  res.sendFile(`../${file}`, { root: '.' }, (err) => {
    if (err) {
      res.status(404).json({ error: 'File non trovato' });
    }
  });
});

export default app;
