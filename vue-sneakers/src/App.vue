<template>
  <div id="app">
  <nav>
    <NavBar :user="user" @logout="logout" />
    <router-view />
  </nav>
  </div>
</template>
 
<script>
import { mapState, mapMutations } from 'vuex';
import NavBar from './components/NavBar.vue';
 
export default {
  name: 'App',
  components: { NavBar },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapMutations(['setUser']),
    logout() {
      this.setUser(null); // Déconnecte l'utilisateur
      this.$router.push('/login'); // Redirige vers la page de login
    },
  },
};
</script>
 
<style>

body {
  margin:0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: url(./assets/background.png) no-repeat center center fixed;
  background-size: cover; /* Ajuste l'image pour couvrir toute la surface */
}

nav {
  position: relative; /* Assure que le contenu reste au-dessus du fond */
  z-index: 1; /* Place le contenu devant l'image */
}
</style>