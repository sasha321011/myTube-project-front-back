<template>
    <div>
      <h1>Активация учетной записи</h1>
      <div v-if="loading">Пожалуйста, подождите...</div>
      <div v-if="success">Ваш аккаунт успешно активирован!</div>
      <div v-if="error">Ошибка активации: {{ error }}</div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        loading: true,
        success: false,
        error: null,
      };
    },
    async created() {
      const { uid, token } = this.$route.params; // Извлечение параметров из маршрута
      if (uid && token) {
        try {
          // Отправка запроса на сервер для активации
          const response = await fetch('http://127.0.0.1:8000/api-users/auth/users/activation/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid, token }),
          });
  
          if (response.ok) {
            this.success = true;
          } else {
            const data = await response.json();
            this.error = data.detail || 'Не удалось активировать аккаунт.';
          }
        } catch (err) {
          this.error = 'Произошла ошибка при активации аккаунта.';
        } finally {
          this.loading = false;
        }
      } else {
        this.error = 'Отсутствуют параметры активации.';
        this.loading = false;
      }
    },
  };
  </script>
  