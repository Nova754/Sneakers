<template>
  <div class="sneakers-container">
    <div class="filters">
      <!-- Bouton Trier avec menu burger -->
      <div class="filter-menu-container">
        <button class="filter-button" @click="toggleFilterMenu">
          Filtrer
          <span class="burger-icon">☰</span>
        </button>
        <div v-if="isFilterMenuOpen" class="filter-dropdown">
          <label for="brand">Brand:</label>
          <input type="text" v-model="fetchItems.brand" placeholder="Brand..." @input="fetchItems" />
        </div>
      </div>
      <button class="filter-button filter-dark">Aucun filtre</button>
    </div>

    <!-- Grille des sneakers -->
    <div class="sneakers-grid">
      <div v-for="sneaker in sneakers" :key="sneaker.id" class="sneaker-card">
        <img :src="sneaker.image" :alt="sneaker.name" class="sneaker-image" />
        <h3>{{ sneaker.brand }}</h3>
        <p>{{ sneaker.name }}</p>
        <p class="price">{{ sneaker.price }}€</p>
        <button v-if="sneaker.stock > 0" class="discover-button" @click="openModal(sneaker)">
          Découvrir
        </button>
        <span v-else class="out-of-stock">Rupture de stock</span>

        <!-- Boutons Wishlist -->
        <button
          v-if="!isInWishlist(sneaker.id)"
          class="wishlist-button"
          @click="addToWishlist(sneaker)"
        >
          Ajouter à la Wishlist
        </button>
        <button
          v-else
          class="wishlist-button remove"
          @click="removeFromWishlist(sneaker.id)"
        >
          Retirer de la Wishlist
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Précédent</button>
      <span>
        Page
        <input type="number" v-model.number="currentPage" @change="fetchItems" min="1" :max="totalPages" />
        / {{ totalPages }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      sneakers: [],
      currentPage: 1,
      totalPages: 0,
      isLoading: false,
      isFilterMenuOpen: false,
    };
  },
  methods: {
    async fetchItems(sortBy = null) {
      this.isLoading = true;
      try {
        const params = { page: this.currentPage };
        if (sortBy) params.sortBy = sortBy;

        const response = await axios.get("http://localhost:3000/item", { params });
        this.sneakers = response.data.data.map((sneaker) => ({
          ...sneaker,
          price: sneaker.estimatedMarketValue,
          stock: 10,
          releaseDate: sneaker.releaseDate,
        }));
        this.totalPages = response.data.meta.totalPages;
      } catch (error) {
        console.error("Erreur lors du chargement des items :", error);
      } finally {
        this.isLoading = false;
      }
    },
    addToWishlist(sneaker) {
      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      if (!wishlist.some(item => item.id === sneaker.id)) {
        wishlist.push(sneaker);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      }
    },
    removeFromWishlist(sneakerId) {
      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      wishlist = wishlist.filter(item => item.id !== sneakerId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    },
    isInWishlist(sneakerId) {
      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      return wishlist.some(item => item.id === sneakerId);
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
    toggleFilterMenu() {
      this.isFilterMenuOpen = !this.isFilterMenuOpen;
    },
    sortBy(criteria) {
      this.fetchItems(criteria);
      this.isFilterMenuOpen = false;
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
.filter-menu-container {
  position: relative;
  display: inline-block;
}

.filter-dropdown {
  position: absolute;
  right: 0;
  background-color: white;
  border: 1px solid #baa393;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 1000;
  min-width: 160px;
}

.filter-dropdown button {
  display: block;
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  color: #baa393;
}

.filter-dropdown button:hover {
  background-color: #f4f4f4;
}

.burger-icon {
  margin-left: 8px;
}
</style>