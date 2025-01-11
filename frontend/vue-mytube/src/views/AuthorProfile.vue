<template>
    <div>
      <h1>Профиль пользователя</h1>
      <div v-if="user">
        <p><strong>Имя пользователя:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
  
        <nav>
          <ul>
            <!-- Ссылка на плейлисты автора -->
            <li>
              <router-link :to="{ name: 'author-playlists', params: { author: user.username } }">
                Плейлисты автора
              </router-link>
            </li>
            <!-- Ссылка на видео автора -->
            <li>
              <router-link :to="{ name: 'author-videos', params: { author: user.username } }">
                Видео автора
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
      <p v-else>Информация о пользователе недоступна.</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        user: null,  // Информация о пользователе
      };
    },
    async mounted() {
      const { username } = this.$route.params;
      await this.fetchUserProfile(username);  // Получаем данные профиля
    },
    methods: {
      async fetchUserProfile(username) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api-users/current-user/${username}/`);
          if (response.ok) {
            this.user = await response.json();
          } else {
            console.error("Ошибка загрузки профиля пользователя.");
          }
        } catch (error) {
          console.error("Ошибка при получении данных профиля:", error);
        }
      },
    },
  };
  </script>
  