<template>
    <div>
      <h1>Регистрация</h1>
      <form @submit.prevent="register">
        <label for="username">Имя пользователя:</label>
        <input type="text" id="username" v-model="form.username" required />
  
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="form.email" required />
  
        <label for="password">Пароль:</label>
        <input type="password" id="password" v-model="form.password" required />
  
        <label for="date_birth">Дата рождения:</label>
        <input type="date" id="date_birth" v-model="form.date_birth" required />
  
        <label for="photo">Фото:</label>
        <input type="file" id="photo" @change="handleFileUpload" />
  
        <button type="submit">Зарегистрироваться</button>
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
          email: '',
          password: '',
          date_birth: '',
        },
        file: null,
        message: '',
      };
    },
    methods: {
      handleFileUpload(event) {
        this.file = event.target.files[0];
      },
      async register() {
        try {
          const formData = new FormData();
          for (const key in this.form) {
            formData.append(key, this.form[key]);
          }
          if (this.file) {
            formData.append('photo', this.file);
          }
  
          const response = await fetch('http://127.0.0.1:8000/api-users/auth/users/', {
            method: 'POST',
            body: formData,
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            this.message = errorData.detail || 'Ошибка регистрации.';
            return;
          }
  
          this.message = 'Регистрация успешна! Проверьте свою почту для активации.';
          this.$router.push('/login');
        } catch (error) {
          console.error('Ошибка регистрации:', error);
          this.message = 'Ошибка при попытке регистрации.';
        }
      },
    },
  };
  </script>
  