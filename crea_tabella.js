import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://test-paolozxs.aws-eu-west-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzA3NTc4MTQsImlkIjoiYTU2ZTk3ZjUtZDZhNS00Y2VlLWIxZjItZjBkNTBiZmU5MDFkIiwicmlkIjoiZjM1YjAxMzMtOTllNC00M2Q1LWIyMGYtMGUxYTdmOWQ5NGNhIn0.UIhNjIc_22H0mV0zvNCrRyU1wvuIz8HOQEYGe2bpX5mlhVDA9sYrx7_iNKk8eoBsTe1l7jWpTs3sTvqQMi4WDw',
  database: 'test',
});

async function createTable() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS utenti (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cognome TEXT NOT NULL,
      email TEXT NOT NULL
    );
  `);
  console.log('Tabella utenti creata o già esistente.');
}

createTable();
