
<template>
    <div>
      <h1>Плейлисты автора: {{ author }}</h1>
      <div v-if="playlists.length > 0">
        <ul>
          <li v-for="playlist in playlists" :key="playlist.id">
            <h3>{{ playlist.name }}</h3>
            <p><strong>Slug:</strong> {{ playlist.slug }}</p>
            <p><strong>Видео:</strong> {{ playlist.vids.join(", ") }}</p>
            <router-link :to="{ name: 'playlist-detail', params: { slug: playlist.slug } }">
              Подробнее
            </router-link>
            <button @click="likePlaylist(playlist.id)">
                Лайк
              </button>
          </li>
        </ul>
      </div>
      <p v-else>У этого автора пока нет плейлистов.</p>
    </div>
  </template>  
  
  <script>
  import axios from 'axios'; // Подключаем axios
  
  export default {
    data() {
      return {
        playlists: [], // Список плейлистов
        author: "", // Имя автора
      };
    },

    async mounted() {
      // Получение имени автора из параметров маршрута
      this.author = this.$route.params.author;
  
      // Запрос на сервер для получения плейлистов автора
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/author-playlists/${this.author}/`
        );
        if (response.ok) {
          this.playlists = await response.json();
        } else {
          console.error("Ошибка загрузки плейлистов автора");
        }
      } catch (error) {
        console.error("Ошибка запроса:", error);
      }
    },
    methods: {

      // Метод для лайка плейлиста
      async likePlaylist(playlistId) {
        console.log('Лайк плейлиста:', playlistId);
        try {
        const token = localStorage.getItem("authToken");
          const response = await fetch('http://127.0.0.1:8000/api/like-playlist/', {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ playlist: playlistId }),
            
          });

          if (response.status === 200) {
            console.log('Плейлист успешно лайкнут!');
            await this.fetchUserPlaylists(); // Обновляем список плейлистов после лайка
          }
        } catch (error) {
          console.error('Ошибка при лайке плейлиста:', error);
        }
      },
    },
  };
  </script>
  