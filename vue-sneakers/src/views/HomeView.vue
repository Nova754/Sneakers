<template>
  <div class="sneakers-container">
    <div class="breadcrumb">
      <a href="#">Accueil</a> / <a href="#">Sneakers</a> / <span>(Très) Rares</span>
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
        <p class="release-date">Sortie le : {{ formatDate(sneaker.releaseDate) }}</p>
        <button v-if="sneaker.stock > 0" class="discover-button">Découvrir</button>
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
  },
  created() {
    this.fetchItems();
  },
};
</script>

<style scoped>
.sneakers-container {
  width: 100%;
  margin: 0 auto;
  text-align: left;
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
  color: #555;
}

.breadcrumb a {
  text-decoration: none;
  color: #000;
}

.breadcrumb span {
  color: #999;
}

.filters {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-button {
  border: 1px solid #000;
  background: transparent;
  padding: 8px 12px;
  cursor: pointer;
}

.filter-dark {
  background: #2a002b;
  color: white;
}

.loading-message {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #555;
  margin: 40px 0;
}

.sneakers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.sneaker-card {
  text-align: center;
  border: 1px solid #eaeaea;
  padding: 20px;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
}

.sneaker-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  background: #2a002b;
  color: #fff;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.out-of-stock {
  color: red;
  font-size: 14px;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #000;
  background-color: transparent;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>