const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',  // hôte, en général 'localhost' pour phpMyAdmin local
    user: 'root',       // ton nom d'utilisateur MySQL
    password: 'teo',       // ton mot de passe MySQL
    database: 'sneakersapi',  // Remplace par le nom de ta base de données
});

// Connexion à la base de données
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connecté à la base de données MySQL');
});

// Création d'une route pour récupérer les items avec pagination
app.get('/item', (req, res) => {
    const page = parseInt(req.query.page) || 1; // Page actuelle, par défaut 1
    const limit = parseInt(req.query.limit) || 8; // Limite d'items par page, par défaut 8
    const offset = (page - 1) * limit; // Calcul de l'offset

    // Requête SQL avec LIMIT et OFFSET pour la pagination
    const sql = `SELECT * FROM item LIMIT ${limit} OFFSET ${offset}`;

    // Exécution de la requête
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des items:', err);
            res.status(500).send('Erreur lors de la récupération des items');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Aucun item trouvé');
            return;
        }

        // Comptage total des items pour inclure des métadonnées de pagination
        const countSql = 'SELECT COUNT(*) AS total FROM item';
        db.query(countSql, (countErr, countResults) => {
            if (countErr) {
                console.error('Erreur lors du comptage des items:', countErr);
                res.status(500).send('Erreur lors du comptage des items');
                return;
            }

            const totalItems = countResults[0].total;
            const totalPages = Math.ceil(totalItems / limit);

            // Envoi des résultats avec métadonnées de pagination
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

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});