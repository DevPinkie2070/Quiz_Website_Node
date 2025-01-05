const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

// db.connect((err) => {
//     if (err) {
//         console.error('Datenbankverbindung fehlgeschlagen:', err);
//         return;
//     }
//     console.log('Verbunden mit der Datenbank!');
// });

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

// Login functionality
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

                        // Store scores in session
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
