<template>
  <div class="login">
    <form @submit.prevent="login">
      <h2>Login</h2>
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="loading">Login</button>
    </form>
    <p v-if="loading">Logging in...</p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  computed: {
    ...mapState(['loading']), // Accès à l'état de chargement
  },
  methods: {
    ...mapActions(['loginUser']),
    async login() {
      await this.loginUser({ email: this.email, password: this.password });
    },
  },
};
</script>

<style scoped>
.login {
  font-family: Avenir, sans-serif;
  padding: 5%;
  position: relative;
  display: flex;
  justify-content: center;
}
h2 {
  text-align: center;
  color: #3f1107;
}
form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 400px;
  margin: auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  align-items: center;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #baa393;
  border-radius: 5px;
  font-size: 16px;
  color: #3f1107;
  background-color: #efefef;
  transition: border 0.3s ease;
}

input:focus {
  border-color: #baa393;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #baa393;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #d3c6be;
}

button:disabled {
  background-color: #d3c6be;
  cursor: not-allowed;
}

p {
  font-size: 14px;
  color: #3f1107;
  text-align: center;
}
</style>