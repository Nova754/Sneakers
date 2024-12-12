const axios = require('axios');
const xlsx = require('xlsx');
 
// Configuration de l'API
const baseURL = 'http://54.37.12.181:1337/api/sneakers';
const pageSize = 100;
 
// Fonction pour récupérer les données avec pagination
async function fetchSneakers() {
    let currentPage = 1;
    let allData = [];
    let totalPages;
 
    try {
        do {
            const response = await axios.get(baseURL, {
                params: {
                    'pagination[page]': currentPage,
                    'pagination[pageSize]': pageSize,
                },
            });
 
            const data = response.data;
            totalPages = data.meta.pagination.pageCount;
 
            allData = allData.concat(data.data);
            console.log(`Page ${currentPage}/${totalPages} récupérée.`);
 
            currentPage++;
        } while (currentPage <= totalPages);
 
        return allData;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.response?.data || error.message);
    }
}
 
// Fonction pour exporter les données en Excel
function exportToExcel(data) {
    const formattedData = data.map((item) => ({
        ID: item.id,
        Nom: item.attributes.name,
        Marque: item.attributes.brand,
        Couleur: item.attributes.colorway,
        Prix_Retail: item.attributes.retailPrice,
        Valeur_Marché: item.attributes.estimatedMarketValue,
        Date_Lancement: item.attributes.releaseDate,
        Annee_Lancement: item.attributes.releaseYear,
        Silhouette: item.attributes.silhouette,
        Sku: item.attributes.sku,
        PublieA: item.attributes.publishedAt,
        Genre: item.attributes.gender,
        Histoire: item.attributes.story || 'N/A',
        Image: item.attributes.image.original,
        Lien_Goat: item.attributes.links.goat || 'N/A',
        Lien_StockX: item.attributes.links.stockX || 'N/A',
        Lien_FlightClub: item.attributes.links.flightClub || 'N/A',
    }));
 
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(formattedData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sneakers');
 
    const fileName = 'sneakers_adapted.xlsx';
    xlsx.writeFile(workbook, fileName);
    console.log(`Données exportées avec succès dans ${fileName}`);
}
 
// Lancer le processus
(async () => {
    const sneakersData = await fetchSneakers();
    if (sneakersData && sneakersData.length > 0) {
        exportToExcel(sneakersData);
    } else {
        console.log('Aucune donnée à exporter.');
    }
})();