const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

function createDatabaseConnection() {
    let connection;

    const connect = () => {
        connection = mysql.createConnection({
            host: 'w01d3373.kasserver.com',
            user: 'd0424373',
            password: 'XMrodFRJY2T7ZqCzhDo4',
            database: 'd0424373'
        });

        connection.connect(err => {
            if (err) {
                console.error('Fehler beim Verbinden zur Datenbank:', err.message);
                console.log('Erneuter Verbindungsversuch in 5 Sekunden...');
                setTimeout(connect, 5000);
            } else {
                console.log('Erfolgreich mit der Datenbank verbunden!');
            }
        });

        connection.on('error', err => {
            console.error('Datenbankfehler:', err.message);

            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log('Verbindung verloren. Versuche erneut zu verbinden...');
                connect();
            } else if (err.code === 'ECONNRESET') {
                console.log('Verbindung zurückgesetzt. Erneuter Verbindungsversuch...');
                connect();
            } else if (err.fatal) {
                console.error('Schwerwiegender Fehler. Anwendung wird beendet.');
                process.exit(1);
            } else {
                console.error('Unerwarteter Fehler:', err);
            }
        });
    };

    connect();

    return connection;
}

const db = createDatabaseConnection();

const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/index.html'));
});

// Login-Route
app.post('/auth', function (request, response) {
    let username = request.body.username;
    let password = request.body.password;

    if (username && password) {
        db.query('SELECT * FROM users WHERE username = ?', [username], function (error, results, fields) {
            if (error) throw error;

            if (results.length > 0) {
                bcrypt.compare(password, results[0].password, function (err, result) {
                    if (result) {
                        let role = results[0].role;
                        if (role === 0 || role === 1) {
                            request.session.loggedin = true;
                            request.session.username = username;
                            request.session.role = role;
                            request.session.highscores = {
                                quiz_1: results[0].quiz_1,
                                quiz_2: results[0].quiz_2,
                                quiz_3: results[0].quiz_3
                            };

                            if (role === 1) {
                                response.redirect('/admin');
                            } else {
                                response.redirect('/quiz');
                            }
                        } else {
                            response.send('Unzulässige Rolle.');
                        }
                    } else {
                        response.send('Falsches Passwort!');
                    }
                });
            } else {
                response.send('Benutzername existiert nicht!');
            }
        });
    } else {
        response.send('Bitte Benutzername und Passwort eingeben!');
    }
});

// Admin-Routen Middleware
app.use('/admin', (request, response, next) => {
    if (request.session.loggedin && request.session.role === 1) {
        next();
    } else {
        response.status(403).send('Zugriff verweigert: Administrator erforderlich');
        response.redirect('/');
    }
});

// Admin Dashboard
app.get('/admin', function (request, response) {
    response.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

// Admin-Benutzerverwaltung
app.get('/admin/users', function (request, response) {
    const query = 'SELECT id, username, email, role FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Fehler bei der Benutzerabfrage:', err);
            return response.status(500).send('Interner Serverfehler');
        }
        response.json(results);
    });
});

// Admin: Benutzerrolle ändern
app.put('/admin/users/:id/role', function (request, response) {
    const userId = request.params.id;
    const { role } = request.body;

    if (![0, 1].includes(role)) {
        return response.status(400).send('Ungültige Rolle');
    }

    const query = 'UPDATE users SET role = ? WHERE id = ?';
    db.query(query, [role, userId], (err, results) => {
        if (err) {
            console.error('Fehler beim Aktualisieren der Benutzerrolle:', err);
            return response.status(500).send('Fehler beim Ändern der Benutzerrolle');
        }

        if (results.affectedRows > 0) {
            response.send('Benutzerrolle erfolgreich aktualisiert');
        } else {
            response.status(404).send('Benutzer nicht gefunden');
        }
    });
});

// Admin: Benutzer löschen
app.delete('/admin/users/:id', function (request, response) {
    const userId = request.params.id;

    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Fehler beim Löschen des Benutzers:', err);
            return response.status(500).send('Fehler beim Löschen des Benutzers');
        }

        if (results.affectedRows > 0) {
            response.send('Benutzer erfolgreich gelöscht');
        } else {
            response.status(404).send('Benutzer nicht gefunden');
        }
    });
});

// Registrierungs-Route
app.post('/register', function (request, response) {
    let username = request.body.username;
    let password = request.body.password;

    if (username && password) {
        db.query('SELECT * FROM users WHERE username = ?', [username], function (error, results, fields) {
            if (error) {
                console.error(error);
                return response.status(500).json({ success: false, message: 'Interner Serverfehler. Bitte versuchen Sie es später erneut.' });
            }
            if (results.length > 0) {
                return response.status(400).json({ success: false, message: 'Der Benutzername existiert bereits!' });
            }

            bcrypt.hash(password, 10, function (err, hash) {
                if (err) {
                    console.error(err);
                    return response.status(500).json({ success: false, message: 'Fehler beim Verschlüsseln des Passworts.' });
                }

                db.query('INSERT INTO users (username, password, email, quiz_1, quiz_2, quiz_3) VALUES (?, ?, ?, 0, 0, 0)', [username, hash, ''], function (error, results, fields) {
                    if (error) {
                        console.error(error);
                        return response.status(500).json({ success: false, message: 'Fehler beim Speichern des Benutzers in der Datenbank.' });
                    }
                    response.status(403).send('Registrierung Erfolgreich!');
                });
            });
        });
    } else {
        response.status(400).json({ success: false, message: 'Bitte geben Sie Benutzername und Passwort ein!' });
    }
});

// Logout-Route
app.get('/logout', function (request, response) {
    request.session.destroy(err => {
        if (err) {
            return response.status(500).send('Fehler beim Abmelden');
        }
        response.redirect('/');
    });
});

// Quiz-Route
app.get('/quiz', function (request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname + '/quiz.html'));
    } else {
        response.redirect('/');
    }
});

// Weitere Routen für Highscores, User-Daten, etc.
app.get('/user-data', function (request, response) {
    if (request.session.loggedin) {
        response.json({
            username: request.session.username,
            highscores: request.session.highscores
        });
    } else {
        response.status(403).send('Not logged in');
    }
});

// Highscore aktualisieren
app.post('/update-highscore', function (request, response) {
    if (request.session.loggedin) {
        const username = request.session.username;
        const { quizId, score } = request.body;

        if (!quizId || typeof score !== 'number') {
            return response.status(400).send('Ungültige Anfrage');
        }

        const column = `quiz_${quizId}`;
        const query = `UPDATE users SET ${column} = GREATEST(${column}, ?) WHERE username = ?`;
        db.query(query, [score, username], function (error, results) {
            if (error) {
                console.error(error);
                return response.status(500).send('Fehler beim Speichern des Highscores');
            }
            response.send('Highscore aktualisiert!');
        });
    } else {
        response.status(401).send('Nicht eingeloggt');
    }
});

// Server starten
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});