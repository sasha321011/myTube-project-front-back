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
          </li>
        </ul>
      </div>
      <p v-else>У этого автора пока нет плейлистов.</p>
    </div>
  </template>
  
  <script>
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
  };
  </script>
  
  <style scoped>
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  
  h3 {
    margin: 0;
  }
  
  router-link {
    color: #42b983;
    text-decoration: none;
  }
  
  router-link:hover {
    text-decoration: underline;
  }
  </style>
  