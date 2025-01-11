<template>
    <div>
      <h1>Вход</h1>
      <form @submit.prevent="login">
        <label for="username">Имя пользователя:</label>
        <input type="text" id="username" v-model="form.username" required />
  
        <label for="password">Пароль:</label>
        <input type="password" id="password" v-model="form.password" required />
  
        <button type="submit">Войти</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        form: {
          username: '',
          password: '',
        },
        message: '',
      };
    },
    methods: {
      async login() {
        try {
          const response = await fetch('http://127.0.0.1:8000/api-users/auth/token/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.form),
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            this.message = errorData.detail || 'Ошибка входа.';
            return;
          }
  
          const data = await response.json();
          localStorage.setItem('authToken', data.auth_token);
          this.message = 'Вы успешно вошли!';
          this.$router.push('/');
        } catch (error) {
          console.error('Ошибка входа:', error);
          this.message = 'Ошибка при попытке входа.';
        }
      },
    },
  };
  </script>
  