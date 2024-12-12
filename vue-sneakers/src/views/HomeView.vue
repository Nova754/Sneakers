<template>
  <div class="sneakers-container">
    <div class="breadcrumb">
      <a href="#">Accueil</a> / <a href="#">Sneakers</a> / <span>(Très) Rares</span>
    </div>
    <div class="filters">
      <button class="filter-button">Trier</button>
      <button class="filter-button filter-dark">Filtrer</button>
    </div>
    <div class="sneakers-grid">
      <div
        v-for="sneaker in sneakers"
        :key="sneaker.id"
        class="sneaker-card"
      >
        <img :src="sneaker.image" :alt="sneaker.name" class="sneaker-image" />
        <h3>{{ sneaker.brand }}</h3>
        <p>{{ sneaker.name }}</p>
        <p class="price">{{ item.price }}€</p>
        <button
          v-if="item.stock > 0"
          class="discover-button"
        >
          Découvrir
        </button>
        <span v-else class="out-of-stock">Rupture de stock</span>
      </div>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      sneakers: [], // Données des sneakers récupérées depuis l'API
      currentPage: 1, // Page actuelle
      totalPages: 1, // Nombre total de pages
    };
  },
  methods: {
      fetchSneakers() {
        const offset = (this.currentPage - 1) * 10; // Assuming 10 sneakers per page
        fetch(`http://localhost:3000/sneakersapi/item?offset=${offset}&limit=10`, { headers })
          .then((response) => response.json())
          .then((data) => {
            this.sneakers = data.items;
            this.totalPages = Math.ceil(data.totalItems / 10);
          })
          .catch((err) => {
            console.error("Error loading products:", err);
          });
      },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchSneakers();
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchSneakers();
      }
    },
  },
  mounted() {
    this.fetchSneakers(); // Appel initial pour récupérer les sneakers
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

.sneakers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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