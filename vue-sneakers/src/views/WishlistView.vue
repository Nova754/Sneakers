<template>
  <div class="wishlist-container">
    <h2>Ma Wishlist</h2>
    <div v-if="wishlist.length === 0" class="empty-wishlist">
      Votre wishlist est vide.
    </div>
    <ul>
      <li v-for="item in wishlist" :key="item.id">
        <img :src="item.image" :alt="item.name" class="wishlist-image" />
        <p>{{ item.brand }} - {{ item.name }} ({{ item.price }}€)</p>
        <button @click="removeFromWishlist(item.id)">Retirer</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wishlist: JSON.parse(localStorage.getItem('wishlist')) || [], // Récupérer la wishlist depuis le localStorage
    };
  },
  methods: {
    removeFromWishlist(itemId) {
      this.wishlist = this.wishlist.filter(item => item.id !== itemId);
      this.saveWishlist(); // Sauvegarder après la suppression
    },
    clearWishlist() {
      this.wishlist = [];
      this.saveWishlist(); // Sauvegarder après la vidange
    },
    saveWishlist() {
      localStorage.setItem('wishlist', JSON.stringify(this.wishlist)); // Sauvegarder dans le localStorage
    },
  },
  created() {
    // Vérifie si la wishlist est vide au début
    if (this.wishlist.length === 0) {
      console.log("La wishlist est vide");
    }
  },
};
</script>

<style scoped>
.wishlist-container {
  margin: 20px auto;
  padding: 10px;
  background: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.wishlist-container h2 {
  text-align: center;
  color: #333;
}

.wishlist-container ul {
  list-style: none;
  padding: 0;
}

.wishlist-container li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.wishlist-image {
  width: 50px;
  height: auto;
  border-radius: 4px;
}

.wishlist-button {
  background: #baa393;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.wishlist-button.remove {
  background: #ff6666;
}

.wishlist-button:hover {
  opacity: 0.8;
}

.empty-wishlist {
  text-align: center;
  color: #999;
  font-style: italic;
}
</style>