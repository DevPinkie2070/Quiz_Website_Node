const mysql = require('mysql2/promise');

async function testDbConnection() {
    // Datenbank-Konfigurationsdetails
    const config = {
        host: 'localhost', // Hostname oder IP-Adresse
        user: 'root',      // Benutzername
        password: 'password', // Passwort
        database: 'testdb',   // Datenbankname (optional)
    };

    try {
        // Verbindung herstellen
        const connection = await mysql.createConnection(config);
        console.log('Datenbankverbindung erfolgreich!');

        // Verbindung schließen
        await connection.end();
    } catch (error) {
        console.error('Fehler bei der Datenbankverbindung:', error.message);
    }
}

// Funktion aufrufen
testDbConnection();