<template>
  <nav>
    <NavBar /><router-view />
  </nav>
</template>
<script>
import NavBar from './components/NavBar.vue'
export default {
  components: {
    NavBar
  }
}
</script>
<style>
#app {
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
