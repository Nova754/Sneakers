<template>
  <div>
    <h1>Sneakers</h1>
    <div v-for="sneaker in sneakers" :key="sneaker.id">
      <h3>{{ sneaker.name }}</h3>
      <p>{{ sneaker.brand }}</p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        sneakers: []
      };
    },
    created() {
      axios.get('http://54.37.12.181:1337/api/sneakers')
        .then(response => {
          this.sneakers = response.data;
        })
        .catch(error => {
          console.log('There was an error: ', error);
        });
    }
  };
</script>