<template>
    <div>
      <h1>Лайкнутые видео</h1>
      <div v-if="likedVideos.length > 0">
        <ul>
          <li v-for="video in likedVideos" :key="video.url">
            <h2>{{ video.name }}</h2>
            <p><strong>Автор:</strong> {{ video.author_name }}</p>
            <p><strong>Дата создания:</strong> {{ formatDate(video.created_at) }}</p>
            <router-link :to="{ name: 'video-detail', params: { slug: video.url.split('/')[3] } }">Подробнее</router-link>
          </li>
        </ul>
      </div>
      <p v-else>Нет лайкнутых видео.</p>
    </div>
  </template>
<script>
export default {
  data() {
    return {
      likedVideos: [],
    };
  },
  async created() {
    await this.fetchLikedVideos();
  },
  methods: {
    async fetchLikedVideos() {
      try {
        const token = localStorage.getItem("authToken"); // Получаем токен из localStorage
        const response = await fetch("http://127.0.0.1:8000/api/rated-videos/", {
          headers: {
            Authorization: `Token ${token}`, // Передаем токен
          },
        });

        const data = await response.json();
        this.likedVideos = data.results;
      } catch (error) {
        console.error("Ошибка при получении лайкнутых видео:", error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
  },
};
</script>
