const xlsx = require('xlsx');
const mysql = require('mysql2/promise');
 
// Configuration de la base de données
const dbConfig = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'teo',
    database: 'sneakersapi',
};
 
// Fonction pour lire le fichier Excel et analyser les données
function readExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    return jsonData;
}
 
// Fonction pour remplacer les valeurs indéfinies ou invalides par null
function replaceUndefinedWithNull(value) {
    return value === undefined || value === '' ? null : value;
}
 
// Fonction pour valider et formater les dates
function validateDate(value) {
    if (!value || isNaN(Date.parse(value))) {
        return null;
    }
    return new Date(value).toISOString().split('T')[0]; // Format YYYY-MM-DD
}
 
// Fonction pour valider les longueurs des chaînes
function isValidLength(value, maxLength) {
    if (!value) return true; // Null ou vide sont acceptables
    return value.length <= maxLength; // Valide si la longueur est dans la limite
}
 
// Fonction pour valider le champ "gender"
function validateGender(value) {
    const validGenders = ['men', 'women', 'unisex'];
    return validGenders.includes(value) ? value : null; // Null pour valeurs invalides
}
 
// Fonction pour valider le champ "releaseYear"
function validateYear(value) {
    const year = parseInt(value, 10);
    if (isNaN(year) || year < 1900 || year > 9999) {
        return null; // Null pour années hors de portée ou non numériques
    }
    return year;
}
 
// Fonction pour insérer les données dans la base de données
async function importDataToDatabase(data) {
    const connection = await mysql.createConnection(dbConfig);
 
    try {
        console.log(`Filtered down to ${data.length} valid rows for import.`);
 
        // Requête SQL pour insérer les données (sans le champ `sku`)
        const insertQuery = `
            INSERT INTO item (
                brand, colorway, estimatedMarketValue, gender, image, links_goat, links_stockX, links_flightClub,
                name, releaseDate, releaseYear, retailPrice, silhouette, story, publishedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                brand = VALUES(brand),
                colorway = VALUES(colorway),
                estimatedMarketValue = VALUES(estimatedMarketValue),
                gender = VALUES(gender),
                image = VALUES(image),
                links_goat = VALUES(links_goat),
                links_stockX = VALUES(links_stockX),
                links_flightClub = VALUES(links_flightClub),
                releaseDate = VALUES(releaseDate),
                releaseYear = VALUES(releaseYear),
                retailPrice = VALUES(retailPrice),
                silhouette = VALUES(silhouette),
                story = VALUES(story),
                updatedAt = CURRENT_TIMESTAMP();
        `;
 
        for (const item of data) {
            const {
                Marque: brand,
                Couleur: colorway,
                Valeur_Marché: estimatedMarketValue,
                Genre: gender,
                Image: image,
                Lien_Goat: links_goat,
                Lien_StockX: links_stockX,
                Lien_FlightClub: links_flightClub,
                Nom: name,
                Date_Lancement: releaseDate,
                Annee_Lancement: releaseYear,
                Prix_Retail: retailPrice,
                Silhouette: silhouette,
                Histoire: story,
                PublieA: publishedAt,
            } = item;
 
            // Validation et formatage des données
            await connection.execute(insertQuery, [
                replaceUndefinedWithNull(brand),
                replaceUndefinedWithNull(colorway),
                replaceUndefinedWithNull(estimatedMarketValue),
                validateGender(gender), // Validation du champ "gender"
                replaceUndefinedWithNull(image),
                replaceUndefinedWithNull(links_goat),
                replaceUndefinedWithNull(links_stockX),
                replaceUndefinedWithNull(links_flightClub),
                replaceUndefinedWithNull(name),
                validateDate(releaseDate),
                validateYear(releaseYear), // Validation du champ "releaseYear"
                replaceUndefinedWithNull(retailPrice),
                replaceUndefinedWithNull(silhouette),
                replaceUndefinedWithNull(story),
                validateDate(publishedAt),
            ]);
        }
 
        console.log('Data imported successfully.');
    } catch (error) {
        console.error('Error during import:', error.message);
    } finally {
        await connection.end();
    }
}
 
// Fonction principale pour exécuter l'import
(async () => {
    const filePath = './sneakers_adapted.xlsx'; // Chemin du fichier Excel
    const rawData = readExcel(filePath);
    console.log(`Found ${rawData.length} rows in Excel file.`);
 
    // Filtrer les données pour supprimer les lignes invalides
    const validData = rawData.filter((item) => {
        return (
            item.Marque &&
            item.Nom &&
            validateGender(item.Genre) && // Vérification du champ "gender"
            item.Image &&
            item.Date_Lancement &&
            validateYear(item.Annee_Lancement) // Vérification du champ "releaseYear"
        );
    });
 
    console.log(`Filtered down to ${validData.length} valid rows for import.`);
 
    if (validData.length > 0) {
        await importDataToDatabase(validData);
    } else {
        console.log('No valid data to import.');
    }
})();