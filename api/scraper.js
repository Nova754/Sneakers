// Importation des modules nécessaires
const axios = require('axios'); // Axios pour la requête HTTP
const XLSX = require('xlsx'); // XLSX pour la génération du fichier Excel

// Fonction pour récupérer les données de l'API avec gestion de la pagination
async function fetchAllData() {
  let allSneakers = [];
  const perPage = 100; // Nombre d'éléments par page (ajuste selon l'API)
  const batchSize = 5; // Nombre de pages à récupérer en parallèle

  try {
    // Récupérer le nombre total de pages
    const initialResponse = await axios.get(`http://54.37.12.181:1337/api/sneakers`, {
      params: {
        'pagination[page]': 1,
        'pagination[pageSize]': perPage
      }
    });
    const totalPages = initialResponse.data.meta.pagination.pageCount;

    // Fonction pour récupérer une page de données
    const fetchPage = async (page) => {
      const response = await axios.get(`http://54.37.12.181:1337/api/sneakers`, {
        params: {
          'pagination[page]': page,
          'pagination[pageSize]': perPage
        }
      });
      return response.data.data.map(item => ({
        id: item.id,
        name: item.attributes.name,
        brand: item.attributes.brand,
        colorway: item.attributes.colorway,
        estimatedRetailPrice: item.attributes.estimatedMarketValue,
        gender: item.attributes.gender,
        image: item.attributes.image.original, // Extraction de l'URL de l'image "original"
        releaseDate: item.attributes.releaseDate,
        releaseYear: item.attributes.releaseYear,
        retailprice: item.attributes.retailPrice, // Extraction du prix de détail (retailPrice)
        silhouette: item.attributes.silhouette,
        sku: item.attributes.sku,
        story: item.attributes.story,
        UID: item.attributes.UID,
        createdAt: item.attributes.createdAt,
        updatedAt: item.attributes.updatedAt,
        publishedAt: item.attributes.publishedAt,
      }));
    };

    // Boucle pour récupérer les données par lots
    for (let i = 1; i <= totalPages; i += batchSize) {
      const batchPromises = [];
      
      // Créer les promesses pour les pages du batch
      for (let j = 0; j < batchSize && (i + j) <= totalPages; j++) {
        batchPromises.push(fetchPage(i + j)); // Ajoute la promesse de récupération de page
      }

      // Attendre que toutes les promesses du batch soient résolues
      const batchResults = await Promise.all(batchPromises);

      // Fusionner les résultats dans allSneakers
      batchResults.forEach(sneakers => {
        allSneakers = [...allSneakers, ...sneakers]; // Ajouter les sneakers du batch
      });

      // Afficher un message de progression : nombre de pages récupérées sur le nombre total de pages
      console.log(`Pages récupérées : ${i} à ${Math.min(i + batchSize - 1, totalPages)} sur ${totalPages} pages total`);
    }

    // Conversion des données en un tableau de données pour le fichier Excel
    const ws = XLSX.utils.json_to_sheet(allSneakers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sneakers Data');

    // Génération et sauvegarde du fichier Excel
    XLSX.writeFile(wb, 'sneakers_data.xlsx');
    console.log('Fichier Excel généré avec succès!');
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
}

// Lancer la fonction
fetchAllData();