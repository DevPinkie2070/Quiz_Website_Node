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
    response.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/auth', function (request, response) {
    let username = request.body.username;
    let password = request.body.password;
    if (username && password) {
        db.query('SELECT * FROM users WHERE username = ?', [username], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password, function (err, result) {
                    if (result) {
                        request.session.loggedin = true;
                        request.session.username = username;

                        request.session.highscores = {
                            quiz_1: results[0].quiz_1,
                            quiz_2: results[0].quiz_2,
                            quiz_3: results[0].quiz_3
                        };

                        response.redirect('/quiz');
                    } else {
                        response.send('Incorrect Username and/or Password!');
                    }
                });
            } else {
                response.send('Incorrect Username and/or Password!');
            }
        });
    } else {
        response.send('Please enter Username and Password!');
    }
});

app.post('/register', function (request, response) {
    let username = request.body.username;
    let password = request.body.password;
    if (username && password) {
        db.query('SELECT * FROM users WHERE username = ?', [username], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                response.send('Username already exists!');
            } else {
                bcrypt.hash(password, 10, function (err, hash) {
                    if (err) throw err;
                    db.query('INSERT INTO users (username, password, email, quiz_1, quiz_2, quiz_3) VALUES (?, ?, ?, 0, 0, 0)', [username, hash, ''], function (error, results, fields) {
                        if (error) throw error;
                        response.redirect('/');
                    });
                });
            }
        });
    } else {
        response.send('Please enter Username and Password!');
    }
});

app.get('/quiz', function (request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname + '/quiz.html'));
    } else {
        response.redirect('/');
    }
});

app.get('/leaderboard', function (request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname + '/leaderboard.html'));
    } else {
        response.redirect('/');
    }
});

app.get('/about', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname + '/about.html'));
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

app.get('/home', function (request, response) {
    if (request.session.loggedin) {
        response.send(`Welcome back, ${request.session.username}!`);
    } else {
        response.send('Please login to view this page!');
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
