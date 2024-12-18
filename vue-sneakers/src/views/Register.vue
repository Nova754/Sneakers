<template>
    <div class="register">
      <div class="form">
        <h1>Register</h1>
        <form @submit.prevent="registerUser">
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input id="lastName" v-model="form.lastName" type="text" required />
          </div>
          <div class="form-group">
            <label for="name">First Name</label>
            <input id="name" v-model="form.name" type="text" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" v-model="form.email" type="email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" v-model="form.password" type="password" required />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Register',
    data() {
      return {
        form: {
          lastName: '',
          name: '',
          email: '',
          password: '',
        },
      };
    },
    methods: {
      async registerUser() {
        try {
          const response = await axios.post('http://localhost:3000/register', this.form);
          alert('Registration successful!');
          this.$router.push('/login'); // Redirect to login page after successful registration
        } catch (error) {
          console.error('Error registering user:', error);
          alert('An error occurred during registration. Please try again.');
        }
      },
    },
  };
  </script>
  
  <style>
  .register {
    font-family: Avenir, sans-serif;
    padding: 5%;
    position: relative;
    display: flex;
    justify-content: center;
  }
  h1 {
    text-align: center;
    color: #3f1107;
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 60%;
    margin: auto;
    padding: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  form {
    display: block;
    margin-bottom: 1rem;
    width: 100%;
  }
  label {
    display: block;
    margin-bottom: 0.5rem;
    width: 100%;
    text-align: center;
    color: #3f1107;
  }
  input {
    width: 90%;
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
  border-color: #83756c;
  outline: none;
  }
  button {
  padding: 12px;
  background-color: #baa393 !important;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  }

  
  button:hover {
  background-color: #d3c6be !important;
  }

  button:disabled {
    background-color: #d3c6be !important;
    cursor: not-allowed;
  }
  </style>
  