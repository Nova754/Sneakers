<template>
  <div class="collection">
    <form>
      <h1>Votre collection</h1>
  
      <!-- Bouton pour envoyer la collection -->
      <div v-if="collection.length > 0" class="email-export">
        <button @click="sendCollectionByEmail">Envoyer par e-mail</button>
      </div>
  
      <div v-if="collection.length === 0">
        <p>Votre collection est vide.</p>
      </div>
  
      <!-- Affichage de la collection sous forme de tableau -->
      <table class="sneaker-table" v-if="collection.length > 0">
        <thead>
          <tr>
            <th>Image</th>
            <th>Nom</th>
            <th>Marque</th>
            <th>Couleur</th>
            <th>Valeur Marché</th>
            <th>Prix Vente</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sneaker in paginatedCollection" :key="sneaker.id">
            <td><img :src="sneaker.image" :alt="sneaker.name" /></td>
            <td>{{ sneaker.name }}</td>
            <td>{{ sneaker.brand }}</td>
            <td>{{ sneaker.colorway }}</td>
            <td>{{ sneaker.estimatedMarketValue }}€</td>
            <td>{{ sneaker.retailPrice }}€</td>
            <td>
              <button @click="removeFromCollection(sneaker.id)">Retirer</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Pagination -->
      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Précédent</button>
        <span>Page {{ currentPage }} sur {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Suivant</button>
      </div>
    </form>
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
      itemsPerPage: 10,
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
      try {
        const userId = this.$store.state.user.id;
        await axios.delete(`http://localhost:3000/collections/${userId}/${sneakerId}`);
        this.fetchCollection(); 
        alert('Sneaker retirée de la colection avec succès.');
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

.actions {
  padding: 0.3rem 0.5rem;
  color: #fff;
  background-color: #baa393;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-bottom: 5px;
}
 
.email-export {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
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
 
.sneaker-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}
 
.sneaker-table th,
.sneaker-table td {
  border: 1px solid #d3c6be;
  text-align: left;
}
 
.sneaker-table th {
  background-color: #d3c6be;
  color: #fff;
}
 
.sneaker-table img {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
 
.pagination {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
 
.pagination button {
  background-color: #baa393;
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