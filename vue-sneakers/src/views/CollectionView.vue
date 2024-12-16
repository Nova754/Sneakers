<template>
    <div class="collection-container">
      <h2>Ma Collection</h2>
      <div v-if="collection.length === 0" class="empty-collection">
        Votre collection est vide.
      </div>
      <ul>
        <li v-for="item in collection" :key="item.id">
          <img :src="item.image" :alt="item.name" class="collection-image" />
          <p>{{ item.brand }} - {{ item.name }} ({{ item.price }}€)</p>
          <button @click="removeFromCollection(item.id)">Retirer</button>
        </li>
      </ul>
    </div>
</template>

<script>
export default {
  data() {
    return {
      collection: JSON.parse(localStorage.getItem('collection')) || [], // Récupérer la collection depuis le localStorage
    };
  },
  methods: {
    removeFromCollection(itemId) {
      this.collection = this.collection.filter(item => item.id !== itemId);
      this.saveCollection(); // Sauvegarder après la suppression
    },
    clearCollection() {
      this.collection = [];
      this.saveCollection(); // Sauvegarder après la vidange
    },
    saveCollection() {
      localStorage.setItem('collection', JSON.stringify(this.collection)); // Sauvegarder dans le localStorage
    },
  },
  created() {
    // Vérifie si la collection est vide au début
    if (this.collection.length === 0) {
      console.log("La collection est vide");
    }
  },
};
</script>

<style scoped>
.collection-container {
  margin: 20px auto;
  padding: 10px;
  background: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.collection-container h2 {
  text-align: center;
  color: #333;
}

.collection-container ul {
  list-style: none;
  padding: 0;
}

.collection-container li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.collection-image {
  width: 50px;
  height: auto;
  border-radius: 4px;
}

.collection-button {
  background: #baa393;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.collection-button.remove {
  background: #ff6666;
}

.collection-button:hover {
  opacity: 0.8;
}

.empty-collection {
  text-align: center;
  color: #999;
  font-style: italic;
}
</style>