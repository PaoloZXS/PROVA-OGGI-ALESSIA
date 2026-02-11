import sql from 'mssql';

const config = {
  server: '62.110.25.18',
  port: 1433,
  database: 'db_CondivisioneDati',
  authentication: {
    type: 'default',
    options: {
      userName: 'CondivisioneDati',
      password: 'CondivisioneDati'
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectionTimeout: 60000,
    requestTimeout: 60000
  }
};

async function testConnection() {
  console.log('🔄 Tentativo di connessione a SQL Server...');
  console.log(`📍 Server: 62.110.25.18:1433`);
  console.log(`📦 Database: db_CondivisioneDati\n`);
  
  try {
    const pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✅ CONNESSIONE RIUSCITA!\n');
    
    // Test query
    const request = pool.request();
    const result = await request.query('SELECT COUNT(*) as totale FROM utenti');
    console.log('📊 Utenti nel database:', result.recordset[0].totale);
    
    // Mostra schema tabella
    const schemaResult = await request.query(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'utenti'
    `);
    console.log('\n📋 Struttura tabella utenti:');
    schemaResult.recordset.forEach(col => {
      console.log(`   - ${col.COLUMN_NAME}: ${col.DATA_TYPE}`);
    });
    
    await pool.close();
    console.log('\n✅ Test completato con successo!');
  } catch (error) {
    console.error('❌ ERRORE DI CONNESSIONE:');
    console.error(error.message);
    console.error('\n⚠️ Possibili cause:');
    console.error('   1. Firewall aziendale blocca la porta 1433');
    console.error('   2. SQL Server non accetta connessioni remote');
    console.error('   3. Credenziali errate');
    console.error('   4. Database non esiste');
  }
}

testConnection();
