<template>
  <nav class="navbar">
    <div class="navbar-left">
      <button class="menu-button" @click="toggleMenu">
        <i class="icon menu-icon">
          <img src="@/assets/menu-icon.png" alt="Menu" />
        </i>
      </button>
      <!-- Menu burger -->
      <div v-if="isMenuOpen" class="burger-menu">
        <ul>
          <li><a href="/home">Home</a></li>
          <li><a href="/wishlist">Wishlist</a></li>
          <li><a href="/collection">Collection</a></li>
        </ul>
      </div>
    </div>
    <div class="navbar-center">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
    </div>
    <div class="navbar-right">
      <div class="search-container">
        <input type="text" class="search-bar" placeholder="Recherche" />
        <i class="icon search-icon">
          <img src="@/assets/search-icon.svg" alt="Search" />
        </i>
      </div>
      <i class="icon heart-icon">
        <img src="@/assets/heart-icon.svg" alt="Heart" />
      </i>
      <i class="icon help-icon">
        <img src="@/assets/help-icon.svg" alt="Help" />
      </i>
      <i class="icon user-icon">
        <img src="@/assets/user-icon.svg" alt="User" />
      </i>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false, // Contrôle l'ouverture et la fermeture du menu burger
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen; // Inverse l'état du menu
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 60px;
  border-bottom: 1px solid #3f1107;
  background-color: white;
}

.navbar-left .menu-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.navbar-left .menu-button span {
  display: block;
  width: 20px;
  height: 2px;
  background: black;
}

.navbar-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.navbar-center .logo {
  height: 40px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-container {
  position: relative;
}
input {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
}
.search-bar {
  border: none;
  border-bottom: 1px solid #3f1107;
  outline: none;
  padding: 4px 8px;
  font-size: 14px;
  padding-right: 30px;
}

.search-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  cursor: pointer;
}

.menu-button .icon img {
  width: 24px;
  height: 24px;
}

.navbar-right .icon {
  font-size: 18px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: auto;
}

.navbar-right .icon img {
  width: 100%;
  height: 100%;
}

/* Style du menu burger */
.burger-menu {
  position: absolute;
  top: 100%; /* Place le menu juste en dessous de l'icône */
  left: 0;
  width: 100%; /* Réduit la largeur du menu */
  height: 200%;
  background-color: #baa393;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.burger-menu ul {
  list-style: none;
  padding: 0;
}

.burger-menu li {
  margin: 8px 0;
}

.burger-menu a {
  text-decoration: none;
  color: white;
  font-size: 14px;
}

.burger-menu a:hover {
  color: #3f1107;
}
</style>