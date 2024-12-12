<template>
  <nav class="navbar">
    <div class="navbar-left">
      <button class="menu-button">
        <span></span>
        <span></span>
      </button>
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

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 60px;
  width: 100%;
  border-bottom: 1px solid #eaeaea;
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

.search-bar {
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  padding: 4px 8px;
  font-size: 14px;
  padding-right: 30px; /* Crée de l'espace pour l'icône */
}

.search-icon {
  position: absolute;
  right: 8px; /* Positionne l'icône à la droite de la barre de recherche */
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  cursor: pointer;
}

.navbar-right .icon {
  font-size: 18px;
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
</style>