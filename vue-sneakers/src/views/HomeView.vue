<template>
  <div class="sneakers-container">
    <div class="breadcrumb">
      <a href="#">Accueil</a> / <span href="#">Sneakers (Très) Rares</span>
    </div>
    <div class="filters">
      <button class="filter-button">Trier</button>
      <button class="filter-button filter-dark">Filtrer</button>
    </div>
    <!-- Message de chargement -->
    <div v-if="isLoading" class="loading-message">
      Chargement des sneakers en cours...
    </div>
    <!-- Grille des sneakers -->
    <div v-else class="sneakers-grid">
      <div v-for="sneaker in sneakers" :key="sneaker.id" class="sneaker-card">
        <img :src="sneaker.image" :alt="sneaker.name" class="sneaker-image" />
        <h3>{{ sneaker.brand }}</h3>
        <p>{{ sneaker.name }}</p>
        <p class="price">{{ sneaker.price }}€</p>
        <button v-if="sneaker.stock > 0" class="discover-button" @click="openModal(sneaker)">Découvrir</button>
        <span v-else class="out-of-stock">Rupture de stock</span>
      </div>
    </div>
    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      sneakers: [], // Sneakers de la page actuelle
      currentPage: 1, // Page actuelle
      totalPages: 0, // Nombre total de pages
      isLoading: false, // Indicateur de chargement
      showModal: false, // Indicateur de modal
      selectedSneaker: {}, // Sneaker sélectionné pour le modal
    };
  },
  methods: {
    async fetchItems() {
      this.isLoading = true;
      try {
        const response = await axios.get(`http://localhost:3000/item?page=${this.currentPage}`);
        this.sneakers = response.data.data.map(sneaker => ({
          ...sneaker,
          price: sneaker.estimatedMarketValue, // Utiliser estimatedMarketValue comme prix
          stock: 10, // Vous pouvez ajuster la logique pour gérer le stock réel
          releaseDate: sneaker.releaseDate, // Stocker la date de sortie
        }));
        this.totalPages = response.data.total_pages;
      } catch (error) {
        console.error("Erreur lors du chargement des items :", error);
      } finally {
        this.isLoading = false;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchItems();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchItems();
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    openModal(sneaker) {
      this.selectedSneaker = sneaker;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
  },
  created() {
    this.fetchItems();
  },
};
</script>

<style scoped>
.sneakers-container {
  width: 100%;
  margin: 10px auto;
}

.breadcrumb {
  font-size: 14px;
  color: white;
  text-align: left;
}

.breadcrumb a {
  font-weight: bold;
  text-decoration: none;
  color: white;
  margin: 10px;
}

.breadcrumb span {
  color: white;
  margin: 10px;
}

.filters {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
  margin-right: 10px;
}

.filter-button {
  border: 1px solid #baa393;
  background: white;
  padding: 8px 12px;
  cursor: pointer;
  color: #baa393;
}

.filter-dark {
  background: #baa393;
  color: white;
}

.loading-message {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #baa393;
  margin: 40px 0;
}

.sneakers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 97%;
  margin: 0 auto;
}

.sneaker-card {
  text-align: center;
  border: 1px solid #D7CBC2;
  padding: 20px;
  border-radius: 8px;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  position: relative;
  background-color: white;
}

.sneaker-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.sneaker-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.price {
  font-size: 16px;
  color: #000;
  font-weight: bold;
}

.discover-button {
  background: #baa393;
  color: #fff;
  padding: 12px 20px; /* Augmenter les valeurs pour un rectangle plus marqué */
  border: none;
  cursor: pointer;
  border-radius: 0; /* Supprimer les coins arrondis */
  opacity: 0; /* Caché par défaut */
  transition: opacity 0.3s ease;
  width: 100%; /* Faire correspondre la largeur au parent si nécessaire */
  text-align: center; /* Centrer le texte */
}

.sneaker-card:hover .discover-button {
  opacity: 1; /* Rendre visible au survol */
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
  padding-bottom: 20px;
  color: white;
  font-weight:500;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #baa393;
  color : #baa393;
  background-color: white;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}

.modal-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}
</style>