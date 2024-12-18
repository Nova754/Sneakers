<template>
  <nav class="navbar">
    <!-- Section gauche avec le bouton menu (supprimé le menu burger) -->
    <div class="navbar-left">
    <li>
      <router-link to="/">
        <img src="@/assets/home-icon.svg" alt="Home" class="home" />
      </router-link>
    </li>
    </div>
 
    <!-- Section centrale avec le logo -->
    <div class="navbar-center">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
    </div>
 
    <!-- Section droite avec icônes utilisateur et liens après login -->
    <div class="navbar-right">
      <li v-if="!user">
        <router-link to="/login">Login</router-link>
      </li>
      <li v-if="!user">
        <router-link to="/register">Register</router-link>
      </li>
      <li v-if="user">
        <router-link to="/wishlist">Wishlist</router-link>
      </li>
      <li v-if="user">
        <router-link to="/collection">Collection</router-link>
      </li>
      <li v-if="user && user.role === 'admin'">
        <router-link to="/dashboard">AdminDashboard</router-link>
      </li>
      <!-- Icône utilisateur -->
      <i v-if="user" class="icon user-icon" @click="toggleUserMenu">
        <img src="@/assets/user-icon.svg" alt="User" />
      </i>
 
      <!-- Menu utilisateur spécifique -->
      <div v-if="isUserMenuOpen" class="user-menu">
        <span class="Welcome"><strong>Welcome</strong></span>
        <span class="user-info"><strong>Name</strong>: {{ user.lastName }} {{ user.name }}</span>
        <span class="user-info"><strong>Email</strong>: {{ user.email }}</span>
        <span class="user-info"><strong>Role</strong>: {{ user.role }}</span>
        <button @click="logout">Logout</button>
      </div>
    </div>
  </nav>
</template>
 
<script>
export default {
  name: "NavBar",
  props: ["user"],
  data() {
    return {
      isUserMenuOpen: false, // Contrôle l'ouverture/fermeture du menu utilisateur
    };
  },
  methods: {
    // Méthode pour basculer l'état du menu utilisateur
    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen;
      console.log("Menu utilisateur", this.isUserMenuOpen ? "ouvert" : "fermé");
    },
 
    // Méthode pour déconnecter l'utilisateur
    logout() {
      localStorage.removeItem("user"); // Efface les informations utilisateur
      this.$emit("logout"); // Émet un événement pour gérer la déconnexion
      this.isUserMenuOpen = false; // Ferme le menu utilisateur après déconnexion
    },
  },
};
</script>
 
<style scoped>
/* Style principal pour la barre de navigation */
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  height: 60px;
  border-bottom: 1px solid #3f1107;
  background-color: white;
}
.navbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.navbar-left li {
  display: inline;
  list-style: none;
  margin-right: 10px;
}
.navbar-left li img {
  width: 24px;
  height: 24px;
}
 
/* Section centrale : logo */
.navbar-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
 
.navbar-center .logo {
  height: 40px;
  margin-top: 10px;
}
 
/* Section droite : icônes et liens après login */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
 
.navbar-right li {
  display: inline;
  list-style: none;
  margin-right: 10px;
}
 
.navbar-right a {
  color: #3f1107;
  text-decoration: none;
  font-size: 1rem;
}
 
.navbar-right a:hover {
  text-decoration: underline;
}
 
/* Icône utilisateur */
.navbar-right .icon {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
}
 
.navbar-right .icon img {
  width: 100%;
  height: 100%;
}
 
.user-menu {
  position: absolute;
  top: 60px;
  right: 0;
  width: 200px;
  height: auto;
  background-color: #baa393;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 1001;
}

.user-menu .Welcome {
  font-size: 20px;
  color: white;
  margin-bottom: 30px;
}

.user-menu .user-info {
  display: block;
  font-size: 16px;
  color: white;
  margin-bottom: 10px;
  text-align: left; /* Aligner à gauche */
}

.user-menu button {
  background-color: #3f1107 !important;
  color: white;
  border: none;
  padding: 8px;
  width: 100%;
  cursor: pointer;
  font-size: 14px;
}

.user-menu button:hover {
  background-color: #5f2e1f !important;
}
</style>