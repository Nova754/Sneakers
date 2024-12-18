<template>
  <div class="dashboard">
    <form>
    <h1>Admin Dashboard</h1>
    <p>Welcome to the admin dashboard. Here you can manage users.</p>
 
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <select v-model="user.role" @change="updateUserRole(user)">
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </td>
          <td>
            <button @click="deleteUser(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </form>
  </div>
</template>
 
<script>
import axios from 'axios';
 
export default {
  name: 'Dashboard',
  data() {
    return {
      users: [],
    };
  },
  methods: {
    async fetchUsers() {
    try {
        const response = await axios.get('http://localhost:3000/users');
        this.users = response.data;
        console.log('Users fetched successfully:', this.users); // Log les utilisateurs récupérés
    } catch (error) {
        console.error('Error fetching users:', error.response || error.message);
        alert('An error occurred while fetching users.');
    }
  },
    async updateUserRole(user) {
      try {
        await axios.put(`http://localhost:3000/users/${id}`, { role: users.role });
        alert('User role updated successfully.');
      } catch (error) {
        console.error('Error updating user role:', error);
        alert('An error occurred while updating the user role.');
      }
    },
    async deleteUser(userId) {
    try {
        await axios.delete(`http://localhost:3000/users/${userId}`);
        this.fetchUsers(); // Rafraîchit la liste des utilisateurs
        alert('Utilisateur supprimé avec succès.');
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', error.message);
        alert('Impossible de supprimer l\'utilisateur.');
    }
},
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>
 

<style>

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 900px;
  margin: auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.dashboard {
  font-family: Avenir, sans-serif;
  padding: 5%;
  position: relative;
  display: flex;
  justify-content: center;
}
.dashboard h1, p{
  text-align: center;
  color: #3f1107;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  border: 1px solid #d3c6be;
  text-align: left;
  padding: 0.5rem;
}
th {
  background-color: #d3c6be;
  color: #fff;
}
button {
  padding: 0.3rem 0.5rem;
  color: #fff;
  background-color: #baa393;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-bottom: 5px;
}
button:hover {
  background-color: #d3c6be;
}
select {
  padding: 0.3rem;
  border: 1px solid #ddd;
  border-radius: 3px;
}

</style>
