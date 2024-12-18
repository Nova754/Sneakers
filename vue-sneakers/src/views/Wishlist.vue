<template>
  <div class="wishlist">
    <form>
    <h2>Votre Wishlist</h2>
 
    <!-- Tableau des sneakers -->
    <div v-if="filteredWishlist.length === 0">
      <p>Votre wishlist est vide.</p>
    </div>
    <table v-else>
      <thead>
        <tr>
          <th>Image</th>
          <th>Nom</th>
          <th>Marque</th>
          <th>Prix</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sneaker in paginatedWishlist" :key="sneaker.id">
          <td><img :src="sneaker.image" :alt="sneaker.name" class="sneaker-image" /></td>
          <td>{{ sneaker.name }}</td>
          <td>{{ sneaker.brand }}</td>
          <td>{{ sneaker.retailPrice }} €</td>
          <td>
            <button class="actions" @click="removeFromWishlist(sneaker.id)">Retirer</button>
            <button class="actions" @click="addToCollection(sneaker.id)">Ajouter à la collection</button>
          </td>
        </tr>
      </tbody>
    </table>
  </form>
  </div>
</template>
 
<script>
import axios from 'axios';
 
export default {
  name: 'Wishlist',
  data() {
    return {
      wishlist: [],
      searchQuery: '',
      minPrice: null,
      maxPrice: null,
      currentPage: 1,
      itemsPerPage: 20, // 5 sneakers par ligne, 4 lignes
    };
  },
  computed: {
    // Filtrer la wishlist selon les critères
    filteredWishlist() {
      return this.wishlist.filter((sneaker) => {
        const matchesSearch =
          !this.searchQuery ||
          sneaker.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          sneaker.brand.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesMinPrice = this.minPrice === null || sneaker.retailPrice >= this.minPrice;
        const matchesMaxPrice = this.maxPrice === null || sneaker.retailPrice <= this.maxPrice;
 
        return matchesSearch && matchesMinPrice && matchesMaxPrice;
      });
    },

    totalPages() {
      return Math.ceil(this.filteredWishlist.length / this.itemsPerPage);
    },
    paginatedWishlist() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredWishlist.slice(start, start + this.itemsPerPage);
    },
  },
  methods: {
    async fetchWishlist() {
      try {
        const userId = this.$store.state.user.id;
        const response = await axios.get(`http://localhost:3000/wishlists/${userId}`);
        this.wishlist = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération de la wishlist :', error.message);
      }
    },
    async removeFromWishlist(sneakerId) {
      try {
        const userId = this.$store.state.user.id;
        await axios.delete(`http://localhost:3000/wishlists/${userId}/${sneakerId}`);
        this.fetchWishlist(); // Rafraîchir la wishlist après suppression
        alert('Sneaker retirée de la wishlist avec succès.');
      } catch (error) {
        console.error('Erreur lors de la suppression de la sneaker de la wishlist :', error.message);
        alert('Impossible de retirer la sneaker de la wishlist.');
      }
    },
    async addToCollection(sneakerId) {
      try {
        const userId = this.$store.state.user.id;
        await axios.delete(`http://localhost:3000/wishlists/${userId}/${sneakerId}`);
        this.fetchWishlist(); // Rafraîchir la wishlist après suppression
        await axios.post('http://localhost:3000/collections', {
          userId,
          sneakerId,
        });
        
        alert('Sneaker ajoutée à votre collection.');
        
      } catch (error) {
        console.error('Erreur lors de la suppression de la sneaker de la wishlist :', error.message);
        alert('Impossible de retirer la sneaker de la wishlist.');
      }
    },
    
    applyFilters() {
      this.currentPage = 1; // Revenir à la première page après application des filtres
    },
    resetFilters() {
      this.searchQuery = '';
      this.minPrice = null;
      this.maxPrice = null;
      this.currentPage = 1;
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
  mounted() {
    this.fetchWishlist();
  },
};
</script>
 
<style scoped>
.wishlist {
  font-family: Avenir, sans-serif;
  padding: 5%;
  position: relative;
  display: flex;
  justify-content: center;
}
form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 900px;
  margin: auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
h2 {
  text-align: center;
  color: #3f1107;
}

table th, table td {
  border: 1px solid #d3c6be;
  text-align: left;
}
table th {
  background-color: #d3c6be;
  color: #fff;
}
.sneaker-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
.actions {
  padding: 0.3rem 0.5rem;
  color: #fff;
  background-color: #baa393;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
.actions + .actions {
  margin-left: 10px;
}
</style>