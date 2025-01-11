<template>
    <div class="my-videos">
      <h1>Мои Видео</h1>
      <div v-if="videos.length > 0">
        <ul>
          <li v-for="video in videos" :key="video.url">
            <h2>{{ video.name }}</h2>
            <p><strong>Автор:</strong> {{ video.author_name }}</p>
            <p><strong>Теги:</strong>
              <span v-for="tag in video.tags_name" :key="tag.id">{{ tag.tag_name }} </span>
            </p>
            <p><strong>Длительность:</strong> {{ video.length_time }} мин.</p>
            <p><strong>Дата создания:</strong> {{ formatDate(video.created_at) }}</p>
            <router-link :to="{ name: 'video-detail', params: { slug: video.url.split('/')[3] } }">Подробнее</router-link>
          </li>
        </ul>
      </div>
      <p v-else>У этого автора нет видео.</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        videos: [],  // Массив видео
        author: "",  // Имя автора
        errorMessage: "",  // Сообщение об ошибке
      };
    },
    async mounted() {
      // Получение данных о текущем авторе
      this.author = this.$route.params.author || "default_author"; // Замените на реальный способ получения авторского ID
      
      // Запрос видео для текущего автора
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/author-videos/${this.author}/`
        );
        this.videos = response.data.results;  // Извлекаем данные из поля results
      } catch (error) {
        console.error("Ошибка при загрузке видео:", error);
        this.errorMessage = "Не удалось загрузить видео.";
      }
    },
    methods: {
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', options);  // Форматируем дату в русском формате
      }
    },
  };
  </script>
  
  <style scoped>
  .my-videos {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  
  h2 {
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
  