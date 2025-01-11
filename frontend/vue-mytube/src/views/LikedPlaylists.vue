<template>
    <div>
      <h1>Лайкнутые плейлисты</h1>
      <div v-if="likedPlaylists.length > 0">
        <ul>
          <li v-for="playlist in likedPlaylists" :key="playlist.id">
            <h2>{{ playlist.name }}</h2>
            <p><strong>Видео:</strong> {{ playlist.vids.join(", ") }}</p>
            <router-link :to="{ name: 'playlist-detail', params: { slug: playlist.slug } }">Подробнее</router-link>
          </li>
        </ul>
      </div>
      <p v-else>Нет лайкнутых плейлистов.</p>
    </div>
  </template>
  

<script>
export default {
  data() {
    return {
      likedPlaylists: [],
    };
  },
  async created() {
    await this.fetchLikedPlaylists();
  },
  methods: {
    async fetchLikedPlaylists() {
      try {
        const token = localStorage.getItem("authToken"); // Получаем токен из localStorage
        const response = await fetch("http://127.0.0.1:8000/api/liked-playlists/", {
          headers: {
            Authorization: `Token ${token}`, // Передаем токен
          },
        });

        const data = await response.json();
        this.likedPlaylists = data;
      } catch (error) {
        console.error("Ошибка при получении лайкнутых плейлистов:", error);
      }
    },
  },
};
</script>
