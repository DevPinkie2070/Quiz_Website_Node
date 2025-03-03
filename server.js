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
function createDatabaseConnectionPool() {
    const pool = mysql.createPool({
        connectionLimit: 10,  // Maximale Anzahl an gleichzeitigen Verbindungen
        host: 'w01d3373.kasserver.com',
        user: 'd0424373',
        password: 'XMrodFRJY2T7ZqCzhDo4',
        database: 'd0424373'
    });

    // Fehlerbehandlung für den Pool
    pool.on('error', (err) => {
        console.error('Datenbankpool-Fehler:', err.message);
        if (err.fatal) {
            console.error('Schwerwiegender Fehler. Anwendung wird beendet.');
            process.exit(1);
        }
    });

    return pool;
}

const dbPool = createDatabaseConnectionPool();

db.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
        return console.error('Fehler bei der Abfrage:', err.message);
    }
    console.log('Abfrageergebnis:', results);
});

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
    response.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/auth', function (request, response) {
    let username = request.body.username;
    let password = request.body.password;

    if (username && password) {
        db.query('SELECT * FROM users WHERE username = ?', [username], function (error, results, fields) {
            if (error) throw error;

            // Wenn Benutzer gefunden wird
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password, function (err, result) {
                    if (result) {
                        // Überprüfen der Rolle
                        let role = results[0].role;
                        if (role === 0 || role === 1) {
                            // Speichern von Informationen in der Session
                            request.session.loggedin = true;
                            request.session.username = username;
                            request.session.role = role;  // Rolle speichern

                            // Highscore-Daten aus der DB laden
                            request.session.highscores = {
                                quiz_1: results[0].quiz_1,
                                quiz_2: results[0].quiz_2,
                                quiz_3: results[0].quiz_3
                            };

                            // Weiterleitung je nach Rolle (Admin- oder Benutzerbereich)
                            if (role === 1) {
                                // Administrator wird weitergeleitet
                                response.redirect('/quiz/admin');  // Beispielroute für Admin
                            } else {
                                // Normaler Benutzer wird zum Quiz weitergeleitet
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

app.use('/quiz/admin', (request, response, next) => {
    if (request.session.loggedin && request.session.role === 1) {
        next(); // Wenn der Benutzer ein Admin ist, weiter zu den eigentlichen Admin-Routen
    } else {
        response.status(403).send('Zugriff verweigert: Administrator erforderlich');
    }
});

// Admin-Dashboard Route
app.get('/quiz/admin', function (request, response) {
    response.sendFile(path.join(__dirname, '/public/admin-dashboard.html'));  // Beispiel für Admin-Dashboard
});

// Beispiel: Admin-Routen zum Verwalten von Benutzern
app.get('/admin/users', function (request, response) {
    const query = 'SELECT id, username, email, quiz_1, quiz_2, quiz_3, role FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Fehler bei der Benutzerabfrage:', err);
            return response.status(500).send('Interner Serverfehler');
        }

        // Die Rolle von Zahlen in Strings umwandeln
        const users = results.map(user => {
            // Umwandeln der Rolle von 0 auf 'user' und von 1 auf 'admin'
            if (user.role === 0) {
                user.role = 'Benutzer';
            } else if (user.role === 1) {
                user.role = 'Administrator';
            }
            return user;
        });

        response.json(users);
    });
});

// Admin: Benutzerrolle ändern
app.put('/admin/users/:id/role', function (request, response) {
    const userId = request.params.id;
    let { role } = request.body;

    // Wenn die Rolle "admin" ist, setze sie auf 1, andernfalls auf 0
    if (role === 'admin') {
        role = 1;
    } else if (role === 'user') {
        role = 0;
    } else {
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

app.get('/logout', function (request, response) {
    request.session.destroy(err => {
        console.log('Logout')
        if (err) {
            return response.status(500).send('Fehler beim Abmelden');
        }
        response.redirect('/');
    });
});

app.get('/quiz', function (request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname + '/public/quiz.html'));
    } else {
        response.redirect('/');
    }
});

app.get('/quiz/bug', function (request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname + '/public/bug-report.html'));
    } else
        response.redirect('/');
}
)

// Passwort für einen Benutzer ändern
app.post('/admin/users/:id/change-password', function (request, response) {
    if (!request.session.loggedin || request.session.role !== 1) {
        return response.status(403).send('Zugriff verweigert: Administrator erforderlich');
    }

    const userId = request.params.id;
    const { newPassword } = request.body;

    if (!newPassword || newPassword.length < 6) {
        return response.status(400).json({ success: false, message: 'Das Passwort muss mindestens 6 Zeichen lang sein.' });
    }

    // Das neue Passwort hashen
    bcrypt.hash(newPassword, 10, function (err, hashedPassword) {
        if (err) {
            console.error('Fehler beim Hashen des Passworts:', err);
            return response.status(500).json({ success: false, message: 'Fehler beim Hashen des Passworts.' });
        }

        // Passwort in der Datenbank aktualisieren
        const query = 'UPDATE users SET password = ? WHERE id = ?';
        db.query(query, [hashedPassword, userId], (err, results) => {
            if (err) {
                console.error('Fehler beim Aktualisieren des Passworts:', err);
                return response.status(500).json({ success: false, message: 'Fehler beim Aktualisieren des Passworts.' });
            }

            if (results.affectedRows > 0) {
                response.json({ success: true, message: 'Passwort erfolgreich geändert.' });
            } else {
                response.status(404).json({ success: false, message: 'Benutzer nicht gefunden.' });
            }
        });
    });
});

app.get('/about', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname + '/public/wartung.html'));
    } else {
        response.redirect('/');
    }
})

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

app.get('/quiz/leaderboard', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname + '/public/leaderboard.html'));
    } else {
        response.redirect('/');
    }
});

app.post('/update-highscore', function (request, response) {
    if (request.session.loggedin) {
        const username = request.session.username;
        const { quizId, score } = request.body;

        // Prüfen, ob die erforderlichen Daten gesendet wurden
        if (!quizId || typeof score !== 'number') {
            return response.status(400).send('Ungültige Anfrage');
        }

        // Highscore aktualisieren
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

app.post('/save-score', function(request, response) {
    if (!request.session.loggedin) {
      return response.status(401).send('Nicht eingeloggt');
    }
  
    const username = request.session.username;  // Benutzername des eingeloggten Benutzers
    const quizMode = request.body.quizMode;  // Quizmodus (z. B. quiz_1, quiz_2, quiz_3)
    const score = request.body.score;  // Der erreichte Highscore
  
    // Überprüfen, ob der neue Score höher ist als der gespeicherte Highscore
    const query = `SELECT * FROM users WHERE username = ?`;
    db.query(query, [username], (err, results) => {
      if (err) throw err;
  
      if (results.length > 0) {
        let user = results[0];
        let updateQuery = '';
  
        // Entscheide, welches Quiz die höchste Punktzahl erhalten soll
        if (quizMode === 'quiz_1' && score > user.quiz_1) {
          updateQuery = 'UPDATE users SET quiz_1 = ? WHERE username = ?';
        } else if (quizMode === 'quiz_2' && score > user.quiz_2) {
          updateQuery = 'UPDATE users SET quiz_2 = ? WHERE username = ?';
        } else if (quizMode === 'quiz_3' && score > user.quiz_3) {
          updateQuery = 'UPDATE users SET quiz_3 = ? WHERE username = ?';
        }
  
        // Wenn die Abfrage zum Aktualisieren des Scores existiert, dann ausführen
        if (updateQuery) {
          db.query(updateQuery, [score, username], (err) => {
            if (err) throw err;
            response.send({ success: true, message: 'Highscore gespeichert!' });
          });
        } else {
          response.send({ success: true, message: 'Highscore ist bereits aktuell.' });
        }
      } else {
        response.status(404).send('Benutzer nicht gefunden');
      }
    });
  });

app.get('/leaderboarddata', (req, res) => {
    const quiz = req.query.quiz; // quiz_1, quiz_2, quiz_3

    // Eingabe validieren
    if (!['quiz_1', 'quiz_2', 'quiz_3'].includes(quiz)) {
        return res.status(400).send('Ungültiges Quiz.');
    }

    // Abfrage basierend auf dem gewünschten Quiz, Benutzer mit role = 1 ausschließen
    const query = `
        SELECT username, ${quiz} AS score
        FROM users
        WHERE role != 1
        ORDER BY ${quiz} DESC
        LIMIT 10
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Fehler bei der Abfrage:', err.message);
            return res.status(500).send('Interner Serverfehler');
        }
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});