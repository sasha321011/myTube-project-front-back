<template>
    <div>
      <h1>Видео плейлиста</h1>
      <div v-if="videos.length > 0">
        <ul>
          <li v-for="video in videos" :key="video.url">
            <h2>{{ video.name }}</h2>
            <p><strong>Автор:</strong> {{ video.author_name }}</p>
            <p><strong>Длительность:</strong> {{ video.length_time }} мин</p>
            <router-link :to="{ name: 'video-detail', params: { slug: video.url.split('/')[3] } }">Подробнее</router-link>
          </li>
        </ul>
      </div>
      <p v-else>Нет видео в этом плейлисте.</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        videos: [],
      };
    },
    async created() {
      await this.fetchPlaylistVideos();
    },
    methods: {
      async fetchPlaylistVideos() {
        try {
          const token = localStorage.getItem("authToken"); // Получаем токен из localStorage
          const slug = this.$route.params.slug; // Получаем slug из маршрута
          const response = await fetch(`http://127.0.0.1:8000/api/playlist-videos/${slug}/`, {
            headers: {
              Authorization: `Token ${token}`, // Передаем токен
            },
          });
  
          const data = await response.json();
          this.videos = data;
        } catch (error) {
          console.error("Ошибка при получении видео плейлиста:", error);
        }
      },
    },
  };
  </script>
  