import { createStore } from 'vuex';
import axios from 'axios';
 
const store = createStore({
    state: {
        user: null, // Informations de l'utilisateur connecté (id, name, email, role)
        sneakers: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setSneakers(state, payload) {
            state.sneakers = payload.sneakers;
            state.totalItems = payload.totalItems;
            state.totalPages = payload.totalPages;
            state.currentPage = payload.currentPage;
        },
        clearUser(state) {
            state.user = null; // Déconnecte l'utilisateur
        },
    },
    actions: {
        async loginUser({ commit }, userData) {
            try {
                const response = await axios.post('http://localhost:3000/login', userData);
                commit('setUser', response.data); // Stocke l'utilisateur avec rôle
                localStorage.setItem('user', JSON.stringify(response.data)); // Stocke l'utilisateur dans localStorage
                alert('Login successful!');
            } catch (error) {
                console.error('Error during login:', error);
                alert('Invalid credentials. Please try again.');
            }
        },
        async registerUser({ commit }, userData) {
            try {
                await axios.post('http://localhost:3000/register', userData);
                alert('Registration successful!');
            } catch (error) {
                console.error('Error during registration:', error);
                alert('An error occurred during registration. Please try again.');
            }
        },
        async fetchSneakers({ commit }, { page = 1, limit = 8 }) {
            try {
                const response = await axios.get(`http://localhost:3000/item?page=${page}&limit=${limit}`);
                commit('setSneakers', {
                    sneakers: response.data.data,
                    totalItems: response.data.meta.totalItems,
                    totalPages: response.data.meta.totalPages,
                    currentPage: response.data.meta.currentPage,
                });
            } catch (error) {
                console.error('Error fetching sneakers:', error);
            }
        },
        logoutUser({ commit }) {
            commit('clearUser'); // Déconnecte l'utilisateur
            alert('You have been logged out.');
        },
    },
});
 
export default store;