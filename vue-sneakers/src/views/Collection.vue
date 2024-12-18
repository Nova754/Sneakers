<template>
  <div class="collection">
    <h1>Votre collection</h1>
 
    <!-- Bouton pour envoyer la collection -->
    <div v-if="collection.length > 0" class="email-export">
      <button @click="sendCollectionByEmail">Envoyer par e-mail</button>
    </div>
 
    <div v-if="collection.length === 0">
      <p>Votre collection est vide.</p>
    </div>
 
    <!-- Affichage de la collection -->
    <div class="sneaker-grid">
      <div class="sneaker-card" v-for="sneaker in paginatedCollection" :key="sneaker.id">
        <img :src="sneaker.image" :alt="sneaker.name" />
        <h2>{{ sneaker.name }}</h2>
        <p><strong>Marque :</strong> {{ sneaker.brand }}</p>
        <p><strong>Colorway :</strong> {{ sneaker.colorway }}</p>
        <p><strong>Valeur Marché :</strong> {{ sneaker.estimatedMarketValue }}€</p>
        <p><strong>Prix Vente :</strong> {{ sneaker.retailPrice }}€</p>
        <button @click="removeFromCollection(sneaker.id)">Retirer de la collection</button>
      </div>
    </div>
 
    <!-- Pagination -->
    <div class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Suivant</button>
    </div>
  </div>
</template>
 
<script>
import axios from 'axios';
 
export default {
  name: 'Collection',
  data() {
    return {
      collection: [],
      currentPage: 1,
      itemsPerPage: 20,
    };
  },
  computed: {
    paginatedCollection() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.collection.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.collection.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchCollection() {
      const userId = this.$store.state.user.id;
      try {
        const response = await axios.get(`http://localhost:3000/collections/${userId}`);
        this.collection = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération de la collection :', error.message);
        alert('Impossible de récupérer votre collection.');
      }
    },
    async sendCollectionByEmail() {
      const userId = this.$store.state.user.id;
      const userEmail = this.$store.state.user.email;
 
      try {
        await axios.post('http://localhost:3000/send-collection-email', {
          userId,
          userEmail,
        });
        alert('Votre collection a été envoyée par e-mail avec succès.');
      } catch (error) {
        console.error("Erreur lors de l'envoi de la collection par e-mail :", error.message);
        alert("Impossible d'envoyer votre collection par e-mail.");
      }
    },
    async removeFromCollection(sneakerId) {
      const userId = this.$store.state.user.id;
      try {
        await axios.delete(`http://localhost:3000/collections/${userId}/${sneakerId}`);
        this.fetchCollection(); // Rafraîchir la collection après suppression
        alert('Sneaker retirée de la collection avec succès.');
      } catch (error) {
        console.error('Erreur lors de la suppression de la sneaker de la collection :', error.message);
        alert('Impossible de retirer la sneaker de la collection.');
      }
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
  mounted() {
    this.fetchCollection();
  },
};
</script>
 
<style>
.collection {
  font-family: Arial, sans-serif;
  max-width: 90%;
  margin: 2rem auto;
  text-align: center;
}
 
.email-export {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}
 
.email-export input {
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
 
.email-export button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
 
.email-export button:hover {
  background-color: #0056b3;
}
 
.sneaker-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}
 
.sneaker-card {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}
 
.sneaker-card img {
  max-width: 100%;
  height: auto;
  margin-bottom: 0.5rem;
}
 
.pagination {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
 
.pagination button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
 
.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
 