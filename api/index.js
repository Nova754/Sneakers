const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors'); 
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');


// Utilisation de CORS pour autoriser les requêtes provenant de n'importe quelle origine
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'teo',
    database: 'sneakersapi',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// Vérification initiale de la connexion
db.getConnection((err, connection) => {
    if (err) {
        console.error('Erreur de connexion au pool MySQL :', err.message);
        return process.exit(1);
    }
    console.log('Connecté au pool de connexions MySQL');
    connection.release(); // Libère immédiatement la connexion de test
});

// Routes
 
// GET /item - Fetch sneakers with pagination
app.get('/item', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;
 
    const sql = `SELECT * FROM item LIMIT ? OFFSET ?`;
    db.query(sql, [limit, offset], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des items:', err.message);
            return res.status(500).send('Erreur lors de la récupération des items.');
        }
 
        db.query('SELECT COUNT(*) AS total FROM item', (countErr, countResults) => {
            if (countErr) {
                console.error('Erreur lors du comptage des items:', countErr.message);
                return res.status(500).send('Erreur lors du comptage des items.');
            }
 
            const totalItems = countResults[0].total;
            const totalPages = Math.ceil(totalItems / limit);
 
            res.status(200).json({
                data: results,
                meta: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    itemsPerPage: limit,
                },
            });
        });
    });
});
 
// POST /register - Register a new user
app.post('/register', async (req, res) => {
    const { lastName, name, email, password } = req.body;
 
    if (!lastName || !name || !email || !password) {
        return res.status(400).send('Tous les champs sont requis.');
    }
 
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
 
        const sql = `INSERT INTO users (lastName, name, email, password, role) VALUES (?, ?, ?, ?, 'USER')`;
        db.query(sql, [lastName, name, email, hashedPassword], (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', err.message);
                return res.status(500).send('Erreur lors de l\'enregistrement de l\'utilisateur.');
            }
            res.status(201).send('Utilisateur enregistré avec succès.');
        });
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe:', error.message);
        res.status(500).send('Erreur interne du serveur.');
    }
});
 
// POST /login - User login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
 
    if (!email || !password) {
        return res.status(400).send('Tous les champs sont requis.');
    }
 
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', err.message);
            return res.status(500).send('Erreur interne du serveur.');
        }
 
        if (results.length === 0) {
            return res.status(404).send('Utilisateur introuvable.');
        }
 
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
 
        if (!passwordMatch) {
            return res.status(401).send('Mot de passe incorrect.');
        }
 
        res.status(200).json({
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        });
    });
});
 
// GET /users - Fetch all users
app.get('/users', (req, res) => {
    const sql = 'SELECT id, name, lastName, email, role FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs :', err.message);
            return res.status(500).send('Erreur lors de la récupération des utilisateurs.');
        }
        res.status(200).json(results);
    });
});
 
 
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT id, name, lastName, email FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération des détails de l'utilisateur :", err.message);
            return res.status(500).send('Erreur lors de la récupération des détails de l\'utilisateur.');
        }
        if (results.length === 0) {
            return res.status(404).send('Utilisateur non trouvé.');
        }
        res.status(200).json(results[0]);
    });
});
 
// PUT /users/:id - Update user role
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;
 
    if (!role) {
        return res.status(400).send('Rôle requis.');
    }
 
    const validRoles = ['USER', 'ADMIN'];
    if (!validRoles.includes(role)) {
        return res.status(400).send('Rôle invalide.');
    }
 
    const sql = 'UPDATE users SET role = ? WHERE id = ?';
    db.query(sql, [role, userId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du rôle:', err.message);
            return res.status(500).send('Erreur lors de la mise à jour du rôle.');
        }
 
        if (results.affectedRows === 0) {
            return res.status(404).send('Utilisateur non trouvé.');
        }
 
        res.status(200).send('Rôle mis à jour avec succès.');
    });
});
 
// DELETE /users/:id - Delete a user
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
 
    // Étape 1 : Supprimer les dépendances
    const deleteCollections = 'DELETE FROM collections WHERE user_id = ?';
    const deleteWishlists = 'DELETE FROM wishlists WHERE user_id = ?';
    const deleteValidations = 'DELETE FROM sneaker_validations WHERE user_id = ?';
    const deleteHistory = 'DELETE FROM history WHERE user_id = ?';
 
    // Étape 2 : Supprimer l'utilisateur
    const deleteUser = 'DELETE FROM users WHERE id = ?';
 
    db.query(deleteCollections, [userId], (err) => {
        if (err) {
            console.error('Erreur lors de la suppression des collections :', err.message);
            return res.status(500).send('Erreur lors de la suppression des collections.');
        }
 
        db.query(deleteWishlists, [userId], (err) => {
            if (err) {
                console.error('Erreur lors de la suppression des wishlists :', err.message);
                return res.status(500).send('Erreur lors de la suppression des wishlists.');
            }
 
                    // Enfin, supprimer l'utilisateur
                    db.query(deleteUser, [userId], (err, results) => {
                        if (err) {
                            console.error('Erreur lors de la suppression de l\'utilisateur :', err.message);
                            return res.status(500).send('Erreur lors de la suppression de l\'utilisateur.');
                        }
 
                        if (results.affectedRows === 0) {
                            return res.status(404).send('Utilisateur non trouvé.');
                        }
 
                        res.status(200).send('Utilisateur supprimé avec succès.');
                    });
                });
            });
        });
 
// POST /collections - Add sneaker to user collection
app.post('/collections', (req, res) => {
    const { userId, sneakerId } = req.body;
 
    if (!userId || !sneakerId) {
        return res.status(400).send('Utilisateur et sneaker requis.');
    }
 
    const sql = 'INSERT INTO collections (user_id, sneaker_id) VALUES (?, ?)';
 
    db.query(sql, [userId, sneakerId], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout à la collection :', err.message);
            return res.status(500).send('Erreur lors de l\'ajout à la collection.');
        }
    });
});
 
// POST /wishlists - Add sneaker to user wishlist
app.post('/wishlists', (req, res) => {
    const { userId, sneakerId } = req.body;
 
    if (!userId || !sneakerId) {
        return res.status(400).send('Utilisateur et sneaker requis.');
    }
 
    const sql = 'INSERT INTO wishlists (user_id, sneaker_id) VALUES (?, ?)';

    db.query(sql, [userId, sneakerId], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout à la wishlist :', err.message);
            return res.status(500).send('Erreur lors de l\'ajout à la wishlist.');
        }
    });
});
 
app.get('/wishlists/:userId', (req, res) => {
    const userId = req.params.userId;
 
    if (!userId) {
        return res.status(400).send('ID utilisateur requis.');
    }
 
    const sql = `
        SELECT i.id, i.name, i.brand, i.colorway, i.retailPrice, i.estimatedMarketValue, i.image
        FROM wishlists w
        JOIN item i ON w.sneaker_id = i.id
        WHERE w.user_id = ?
    `;
 
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de la wishlist :', err.message);
            return res.status(500).send('Erreur lors de la récupération de la wishlist.');
        }
 
        res.status(200).json(results);
    });
});
 
// GET /collections/:userId - Récupérer la collection d'un utilisateur
app.get('/collections/:userId', (req, res) => {
    const userId = req.params.userId;
 
    if (!userId) {
        return res.status(400).send('ID utilisateur requis.');
    }
 
    const sql = `
        SELECT i.id, i.name, i.brand, i.colorway, i.retailPrice, i.estimatedMarketValue, i.image
        FROM collections c
        JOIN item i ON c.sneaker_id = i.id
        WHERE c.user_id = ?
    `;
 
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de la collection :', err.message);
            return res.status(500).send('Erreur lors de la récupération de la collection.');
        }
 
        res.status(200).json(results);
    });
});
 
app.delete('/wishlists/:userId/:sneakerId', (req, res) => {
    const { userId, sneakerId } = req.params;
 
    if (!userId || !sneakerId) {
        return res.status(400).send('Utilisateur et sneaker requis.');
    }
 
    const sql = 'DELETE FROM wishlists WHERE user_id = ? AND sneaker_id = ?';
 
    db.query(sql, [userId, sneakerId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la suppression de la sneaker de la wishlist :', err.message);
            return res.status(500).send('Erreur lors de la suppression de la sneaker de la wishlist.');
        }
 
        if (results.affectedRows === 0) {
            return res.status(404).send('Sneaker non trouvée dans la wishlist.');
        }
 
        res.status(200).send('Sneaker supprimée de la wishlist.');
    });
});
 
// POST /send-collection-email - Envoyer la collection par e-mail
app.post('/send-collection-email', (req, res) => {
    const { userId, userEmail } = req.body;
 
    if (!userId || !userEmail) {
        return res.status(400).send('L\'ID utilisateur et l\'e-mail sont requis.');
    }
 
    // Récupérer la collection de l'utilisateur
    const sql = `
        SELECT i.name, i.brand, i.colorway, i.estimatedMarketValue, i.retailPrice
        FROM collections c
        JOIN item i ON c.sneaker_id = i.id
        WHERE c.user_id = ?
    `;
 
    db.query(sql, [userId], async (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de la collection :', err.message);
            return res.status(500).send('Erreur lors de la récupération de la collection.');
        }
 
        if (results.length === 0) {
            return res.status(404).send('Aucune collection trouvée.');
        }
 
        // Formatage des données pour l'e-mail
        let emailContent = `<h2>Votre Collection de Sneakers</h2><ul>`;
        results.forEach(sneaker => {
            emailContent += `
                <li>
                    <strong>Nom :</strong> ${sneaker.name}<br>
                    <strong>Marque :</strong> ${sneaker.brand}<br>
                    <strong>Colorway :</strong> ${sneaker.colorway || 'N/A'}<br>
                    <strong>Valeur Marché :</strong> ${sneaker.estimatedMarketValue}€<br>
                    <strong>Prix de Vente :</strong> ${sneaker.retailPrice}€
                </li>
            `;
        });
        emailContent += `</ul>`;
 
        // Configuration de Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Ou utilisez un autre service de messagerie
            auth: {
                user: 'lea.berhamel1@gmail.com', // Remplacez par votre e-mail
                pass: 'kjmx tcor gedz rmnn', // Mot de passe ou App Password
            },
        });
 
        // Options de l'e-mail
        const mailOptions = {
            from: '"SneakR" <lea.berhamel1@gmail.com>',
            to: userEmail,
            subject: 'Votre Collection SneakR',
            html: emailContent,
        };
 
        // Envoi de l'e-mail
        try {
            await transporter.sendMail(mailOptions);
            res.status(200).send('E-mail envoyé avec succès.');
        } catch (emailErr) {
            console.error('Erreur lors de l\'envoi de l\'e-mail :', emailErr.message);
            res.status(500).send('Erreur lors de l\'envoi de l\'e-mail.');
        }
    });
});
 
// Start server
app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});