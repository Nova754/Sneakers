<template>
  <div class="home">
    <h1>Our Products</h1>
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search for a product..."
        class="search-input"
      />
      <button class="search-button" @click="applyFilters">
        <img
          src="../assets/search-icon.svg"
          alt="Search"
          class="search-icon"
        />
      </button>
    </div>

    <div class="filters">
      <div class="filter-item">
        <label for="category">Category:</label>
        <select v-model="selectedCategory" class="filter-select">
          <option value="">All Categories</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="filter-item">
        <label for="minPrice">Min Price:</label>
        <input
          v-model.number="minPrice"
          type="number"
          class="filter-input"
          placeholder="Min Price"
          min="0"
        />
      </div>

      <div class="filter-item">
        <label for="maxPrice">Max Price:</label>
        <input
          v-model.number="maxPrice"
          type="number"
          class="filter-input"
          placeholder="Max Price"
          min="0"
        />
      </div>
    <div v-if="isLoading" class="loading">
      <p>Loading product details...</p>
    </div>
    <div v-else-if="paginatedProducts.length > 0" class="product-grid">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="product-card"
      >
        <router-link
          :to="`/products/${product.id}`"
          class="product-card-link"
        >
          <div
            class="product-image"
            :style="{ backgroundImage: `url(${product.image_url})` }"
          ></div>
          <h2>{{ product.name }}</h2>
          <p class="category">
            {{ product.categories[0]?.name || "Uncategorized" }}
          </p>
        </router-link>
        <div class="price-and-button">
          <p class="price">{{ product.price }} €</p>
          <button class="shop-button" @click="handleButtonClick(product)">
            <img src="../assets/shop.svg" alt="Shop" class="shop-icon" />
          </button>
        </div>
      </div>
    </div>
    <div v-else class="no-products">
      <p>No products available.</p>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button @click="previousPage" :disabled="currentPage === 1">
        Previous page
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Next page
      </button>
    </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      products: [],
      displayedProducts: [],
      categories: [],
      searchQuery: "",
      selectedCategory: "",
      minPrice: null,
      maxPrice: null,
      currentPage: 1,
      itemsPerPage: 10,
      isLoading: true,
    };
  },
  computed: {
    ...mapState(['token']),
    isAuthenticated() {
      return !!this.token;
    },
    paginatedProducts() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.displayedProducts.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.displayedProducts.length / this.itemsPerPage);
    },
  },
  methods: {
    ...mapMutations(['addToCart']),
    fetchProducts() {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      fetch("http://localhost/api/products", { headers })
        .then((response) => response.json())
        .then((data) => {
          this.products = data["hydra:member"].map((product) => ({
            ...product,
            image_url: product.image_url || "https://via.placeholder.com/200",
          }));
          this.displayedProducts = this.products;
          this.isLoading = false;
        })
        .catch((err) => {
          console.error("Error loading products:", err);
          this.isLoading = false;
        });
    },
    fetchCategories() {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      fetch("http://localhost/api/categories", { headers })
        .then((response) => response.json())
        .then((data) => {
          this.categories = data["hydra:member"];
        })
        .catch((err) => {
          console.error("Error loading categories:", err);
        });
    },
    applyFilters() {
      this.currentPage = 1;
      let minPrice = this.minPrice;
      let maxPrice = this.maxPrice;

      if (minPrice < 0 || isNaN(minPrice)) {
        minPrice = null;
        this.minPrice = null;
      }

      if (maxPrice < 0 || isNaN(maxPrice)) {
        maxPrice = null;
        this.maxPrice = null;
      }

      this.displayedProducts = this.products.filter((product) => {
        const searchLower = this.searchQuery.toLowerCase();
        const matchesSearchQuery =
          !this.searchQuery ||
          product.name.toLowerCase().includes(searchLower) ||
          (product.description &&
            product.description.toLowerCase().includes(searchLower));

        const matchesCategory =
          !this.selectedCategory ||
          product.categories.some(
            (cat) => cat.id === parseInt(this.selectedCategory)
          );

        const matchesMinPrice = minPrice == null || product.price >= minPrice;
        const matchesMaxPrice = maxPrice == null || product.price <= maxPrice;

        return (
          matchesSearchQuery &&
          matchesCategory &&
          matchesMinPrice &&
          matchesMaxPrice
        );
      });
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    handleButtonClick(product) {
      if (this.isAuthenticated) {
        this.addToCart(product);
        alert("Produit ajouté au panier !");
      } else {
        this.$router.push("/login");
      }
    },
  },
  created() {
    this.fetchProducts();
    this.fetchCategories();
  },
};
</script>

<style scoped>
.home {
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
  height: 100%;
}

h1 {
  text-align: center;
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 30px;
}

.search-bar {
  display: flex;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  margin-bottom: 30px;
}

.search-input {
  flex-grow: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  outline: none;
  font-size: 1.2rem;
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: 48px;
  width: 10%;
  background-color: #ddd;
  border: none;
  cursor: pointer;
}

.search-button:hover {
  background-color: #ccc;
}

.search-icon {
  width: 20px;
  height: 20px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  justify-content: left;
  text-align: center;
  font-weight: bold;
}

.filter-item {
  display: flex;
  flex-direction: column;
  width: 250px;
}

.filter-input,
.filter-select {
  padding: 12px;
  border: 2px solid #ced4da;
  border-radius: 25px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.filter-input:focus,
.filter-select:focus {
  border-color: #007bff;
}

.filter-input::placeholder,
.filter-select::placeholder {
  color: #aaa;
}

.filter-select {
  color: #aaa;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  margin-top: 30px;
}

.product-card {
  border: none;
  border-radius: 10px;
  padding: 20px;
  text-align: left;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 150px;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  margin-bottom: 15px;
}

.product-card-link {
  text-decoration: none;
  color: inherit;
}

h2 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 5px;
}

.category {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 10px;
}

.price-and-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  font-size: 1rem;
  font-weight: bold;
  color: #000000;
  margin-bottom: 15px;
}

/* Updated shop-button styles to match cart-button animation */
.shop-button {
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.shop-button:hover {
  transform: scale(1.1);
  background-color: rgba(0, 0, 0, 0.05);
}

.shop-icon {
  width: 30px;
  height: 30px;
}

.no-products {
  text-align: center;
  color: #666;
  font-size: 1.25rem;
  margin-top: 40px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 10px 15px;
  margin: 0 10px;
  border: none;
  border-radius: 25px;
  background-color: #333;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 1rem;
  color: #333;
}

.load-img {
  width: 50%;
  height: 50%;
  display: block;
  margin: 0 auto;
}
</style>
