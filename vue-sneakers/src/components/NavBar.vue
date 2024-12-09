<template>
  <nav class="navbar">
    <div class="navbar-header">
      <div class="logo">
        <img src="../assets/logo.png" alt="MyShop Logo" class="logo-icon" aria-label="MyShop Logo" />
        <router-link to="/" class="logo-text" aria-label="Go to Home Page">Dynamico</router-link>
      </div>
      <button class="burger-menu" @click="toggleMenu" aria-label="Toggle Navigation Menu">
        <img src="../assets/menu-icon.svg" alt="Menu" />
      </button>
    </div>
    <div class="nav-links" :class="{ 'nav-links-visible': isMenuOpen }">
      <router-link to="/" aria-label="Go to Products Page">Products</router-link>
      <router-link v-if="isAuthenticated" to="/purchase-history" aria-label="Go to Purchase History">Purchase History</router-link>
      <router-link v-if="isAuthenticated" to="/cart" aria-label="Go to My Cart">My Cart</router-link>
      <router-link v-if="!isAuthenticated" to="/register" aria-label="Go to Register Page">Register</router-link>
      <router-link v-if="!isAuthenticated" to="/login" aria-label="Go to Login Page">Login</router-link>
      <router-link v-if="isAuthenticated" to="/admin/products" aria-label="Go to Admin Dashboard">Dashboard</router-link>
      <button v-if="isAuthenticated" @click="handleLogout" aria-label="Logout">Logout</button>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "NavBar",
  data() {
    return {
      isMenuOpen: false,
    };
  },
  computed: {
    ...mapState(["user", "token"]),
    isAuthenticated() {
      return !!this.token;
    },
    isAdmin() {
      return this.user && this.user.roles.includes("ROLE_ADMIN");
    },
  },
  methods: {
    ...mapActions(["logout"]),
    handleLogout() {
      this.logout();
      this.$router.push("/login");
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 10px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.navbar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-icon {
  width: 50px;
  height: 50px;
}

.logo-text {
  margin-left: 10px;
  font-size: 20px;
  text-decoration: none;
  color: black;
}

.burger-menu {
  background: none;
  border: none;
  cursor: pointer;
}

.burger-menu img {
  width: 25px;
  height: 25px;
}

.nav-links {
  display: none;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.nav-links.nav-links-visible {
  display: flex;
}

.nav-links a,
.nav-links button {
  color: black;
  text-decoration: none;
  background: none;
  border: none;
  padding: 10px;
  text-align: left;
  font-size: 16px;
}

.nav-links a:hover,
.nav-links button:hover {
  background-color: #f0f0f0;
}

@media (min-width: 768px) {
  .navbar {
    flex-direction: row;
    align-items: center;
    padding: 10px 50px;
  }

  .navbar-header {
    flex-grow: 1;
  }

  .burger-menu {
    display: none;
  }

  .nav-links {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 20px;
    margin-top: 0;
  }

  .nav-links a,
  .nav-links button {
    padding: 10px 20px;
    font-size: 18px;
  }

  .nav-links a:hover,
  .nav-links button:hover {
    background: none;
    text-decoration: underline;
  }
}
</style>