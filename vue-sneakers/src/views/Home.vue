<template>
  <div class="home">
    <!-- Action Buttons -->
    <div class="action-buttons">
      <button class="filter-btn" @click="toggleFilters">Filter</button>
      <button class="reset-btn" @click="resetFilters">Reset</button>
    </div>

    <!-- Filters Section (Burger Menu) -->
    <div class="filters" :class="{ visible: filtersVisible }">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher par marque, nom ou histoire..."
      />
      <input
        type="number"
        v-model.number="minPrice"
        placeholder="Prix minimum"
        min="0"
      />
      <input
        type="number"
        v-model.number="maxPrice"
        :min="minPrice"
        placeholder="Prix maximum"
      />
      <button @click="applyFilters">Appliquer les filtres</button>
    </div>

    <!-- Erreur lors de la récupération des sneakers -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div class="sneakers-grid">
      <div class="sneaker-card" v-for="sneaker in filteredSneakers" :key="sneaker.id" @click="openModal(sneaker)">
        <img :src="sneaker.image" :alt="sneaker.name" class="sneaker-image" />
        <p><strong>Nom :</strong> {{ sneaker.name }}</p>
        <p><strong>Marque :</strong> {{ sneaker.brand }}</p>
        <p><strong>Valeur Marché :</strong> {{ sneaker.estimatedMarketValue }}€</p>
        <button class="discover-button" @click="openModal(sneaker)">
          Découvrir
        </button>
      </div>
    </div>

    <div class="modal" v-if="selectedSneaker">
  <div class="modal-content">
  <span class="close" @click="closeModal">
    <img src="@/assets/close-icon.svg" alt="Fermer" />
  </span>
  <img :src="selectedSneaker.image" :alt="selectedSneaker.name" class="modal-image" />
  <h2>{{ selectedSneaker.name }}</h2>
  <p><strong>Marque :</strong> {{ selectedSneaker.brand }}</p>
  <p><strong>Colorway :</strong> {{ selectedSneaker.colorway }}</p>
  <p><strong>Valeur Marché :</strong> {{ selectedSneaker.estimatedMarketValue }}€</p>
  <p><strong>Histoire :</strong> {{ selectedSneaker.story || 'Aucune histoire disponible' }}</p>
  <p><strong>Prix de vente conseillé :</strong> {{ selectedSneaker.retailPrice }}€</p>
  <p><strong>Année de sortie :</strong> {{ selectedSneaker.releaseYear }}</p>

  <!-- Vérification de la connexion de l'utilisateur -->
  <div v-if="user">
    <button
      v-if="!collection.includes(selectedSneaker.id)"
      @click="addToCollection(selectedSneaker.id)">
      Ajouter à la collection
    </button>
    <button v-else>
      Déjà dans votre collection
    </button>
    <button
      v-if="!wishlist.includes(selectedSneaker.id)"
      @click="addToWishlist(selectedSneaker.id)">
      Ajouter à la wishlist
    </button>
    <button v-else>
      Déjà dans votre wishlist
    </button> 
  </div>

  <!-- Message pour demander à l'utilisateur de se connecter -->
  <div v-else>
    <p>Veuillez <router-link to="/login">vous connecter</router-link> ou <router-link to="/register">créer un compte</router-link> pour ajouter cette sneaker à votre collection ou wishlist.</p>
  </div>
</div>
</div>

    <div class="pagination">
      <button class="pagination-btn" @click="changePage(meta.currentPage - 1)" :disabled="meta.currentPage === 1">
        Précédent
      </button>
      <span class="pagination-info">
        Page
        <input
          class="pagination-input"
          type="number"
          v-model.number="meta.currentPage"
          @change="fetchSneakers(meta.currentPage)"
          min="1"
          :max="meta.totalPages"
        /> 
        /  
        <span class="total-pages">{{ meta.totalPages }}</span>
      </span>
      <button class="pagination-btn" @click="changePage(meta.currentPage + 1)" :disabled="meta.currentPage === meta.totalPages">
        Suivant
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
export default {
  name: 'Home',
  data() {
    return {
      sneakers: [],
      collection: [],
      wishlist: [],
      searchQuery: '',
      minPrice: null,
      maxPrice: null,
      filteredSneakers: [],
      filtersVisible: false,
      meta: {
        currentPage: 1,
        totalPages: 0,
        itemsPerPage: 8,
      },
      selectedSneaker: null,
      showUploadModal: false,
      selectedFile: null,
      selectedSneakerId: null,
    };
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    toggleFilters() {
      this.filtersVisible = !this.filtersVisible;
    },
    async fetchSneakers(page = 1) {
      try {
        const response = await axios.get('http://localhost:3000/item', {
          params: { page, limit: this.meta.itemsPerPage },
        });
        this.sneakers = response.data.data;
        this.meta.currentPage = response.data.meta.currentPage;
        this.meta.totalPages = response.data.meta.totalPages;
        this.filteredSneakers = this.sneakers;
      } catch (error) {
        console.error('Erreur lors de la récupération des sneakers :', error.message);
      }
    },
    applyFilters() {
      this.filteredSneakers = this.sneakers.filter(sneaker => {
        const matchesSearch =
          !this.searchQuery ||
          sneaker.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          sneaker.brand.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          sneaker.story?.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesMinPrice = this.minPrice === null || sneaker.retailPrice >= this.minPrice;
        const matchesMaxPrice = this.maxPrice === null || sneaker.retailPrice <= this.maxPrice;
 
        return matchesSearch && matchesMinPrice && matchesMaxPrice;
      });
    },
    resetFilters() {
      this.searchQuery = '';
      this.minPrice = null;
      this.maxPrice = null;
      this.filteredSneakers = this.sneakers;
    },
    openModal(sneaker) {
      this.selectedSneaker = sneaker;
    },
    closeModal() {
      this.selectedSneaker = null;
    },
    async addToCollection(sneakerId) {
      if (this.wishlists.includes(sneakerId)) {
        alert('Cette sneaker est déjà dans votre wishlist. Veuillez la retirer avant de l\'ajouter à votre collection.');
        return;
      }
      try {
        await axios.post('http://localhost:3000/collections', {
          userId: this.user.id,
          sneakerId,
        });
        alert('Sneaker ajoutée à votre collection.');
        this.fetchCollectionStatus();
      } catch (error) {
        console.error('Erreur lors de l\'ajout à la collection :', error.message);
        alert('Impossible d\'ajouter la sneaker à votre collection.');
      }
    },
    async addToWishlist(sneakerId) {
      if (this.collection.includes(sneakerId)) {
        alert('Cette sneaker est déjà dans votre collection. Vous ne pouvez pas l\'ajouter à votre wishlist.');
        return;
      }
      try {
        await axios.post('http://localhost:3000/wishlists', {
          userId: this.user.id,
          sneakerId,
        });
        alert('Sneaker ajoutée à votre wishlist.');
        this.fetchWishlistStatus();
      } catch (error) {
        console.error('Erreur lors de l\'ajout à la wishlist :', error.message);
        alert('Impossible d\'ajouter la sneaker à votre wishlist.');
      }
    },
    async fetchCollectionStatus() {
      if (!this.user) return;
      try {
        const response = await axios.get(`http://localhost:3000/collections/${this.user.id}`);
        this.collection = response.data.map(item => item.id);
      } catch (error) {
        console.error('Erreur lors de la récupération de votre collection :', error.message);
      }
    },
    
    async fetchWishlistStatus() {
      if (!this.user) return;
      try {
        const response = await axios.get(`http://localhost:3000/wishlists/${this.user.id}`);
        this.wishlist = response.data.map(item => item.id);
      }
      catch (error) {
        console.error('Erreur lors de la récupération de votre wishlist :', error.message);
      }
    },
    changePage(page) {
      if (page < 1 || page > this.meta.totalPages) return;
      this.fetchSneakers(page);
    },
  },
  mounted() {
    this.fetchSneakers();
    if (this.user) {
      this.fetchCollectionStatus();
      this.fetchWishlistStatus();
    }
  },
};
</script>

<style>
.home {
  font-family: Arial, sans-serif;
  max-width: 97%;
  margin: auto;
  padding: 1rem;
  position: relative;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;
  width: fit-content; /* Limite la largeur des boutons */
  margin-left: auto; /* Aligne à droite */
}

.filter-btn {
  border-radius: 0;
  background-color: #baa393;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
}

.reset-btn {
  border-radius: 0;
  background-color: white !important;
  color: #baa393 !important;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 0;
  border: 1px solid #baa393 !important;
}
.reset-btn:hover {
  background-color: #eeeeee !important;
}
.filter-btn:hover {
  background-color: #baa393;
}
/* Menu burger */
.filters {
  position: absolute;
  top: 60px;
  right: 0;
  width: 300px;
  background-color: #baa393;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  z-index: 1000;
  transform: translateX(100%); /* Caché par défaut */
  transition: transform 0.3s ease;
}

.filters.visible {
  transform: translateX(0); /* Affiché */
}

.filters input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  margin-bottom: 0.5rem;
}

.filters button {
  background-color: #c5b8ae;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  width: 100%;
}

.filters button:hover {
  background-color: #ac9687;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}



.sneakers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
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


.discover-button {
  background-color: #baa393;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  width: 100%;
}

.discover-button:hover {
  background-color: #c5b8ae;
}

.pagination {
  display: flex;
  justify-content: center; /* Centre les éléments horizontalement */
  align-items: center;
  gap: 1rem; /* Espacement entre les boutons */
  margin-top: 1rem;
  width: fit-content; /* Assure que la pagination n'occupe pas toute la largeur de la page */
  margin: auto;
}

.pagination-btn {
  background-color: #baa393 !important;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.pagination-btn:hover {
  background-color: #ac9687 !important;
}

.pagination-btn:disabled {
  background-color: #d3c6be !important;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 1rem;
  color: white;
  display: flex; /* Utilisez flexbox pour une disposition horizontale */
  align-items: center; /* Aligner les éléments sur la même ligne */
  gap: 0.5rem; /* Espacement entre les éléments */
}

.total-pages {
  font-size: 1rem;
  color: white; /* Couleur blanche pour le total */
}

.pagination-input {
  width: 3rem;
  margin: 0 0.5rem;
  text-align: center;
  font-size: 1rem;
  border: 1px solid #ccc !important;
  border-radius: 4px;
  padding: 0.25rem;
  color: #3f1107 !important;
}

.pagination-input:focus {
  border-color: #baa393 !important;
  outline: none;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Fond sombre semi-transparent */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  position: relative;
  max-width: 600px;
  padding: 2rem;
  width: auto;
  height: auto;
  max-height: 799px;
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
  max-width: 50% !important;
  width: auto;
  height: auto;
  margin-bottom: 1rem;
}

.modal button {
  background-color: #baa393;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 0;
  margin-top: 0.5rem;
}
.modal button:hover {
  background-color: #c5b8ae;
}
.close img {
  width: 2rem; /* Ajustez la taille de l'image selon vos besoins */
  height: auto;
}
</style>
