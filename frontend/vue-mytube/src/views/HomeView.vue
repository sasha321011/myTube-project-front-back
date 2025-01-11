<template>
  <div class="container">
    <!-- Сайдбар слева -->
    <div class="sidebar">
      <h3>Подписки</h3>
      <ul>
        <li v-for="subscription in userSubscriptions" :key="subscription.username">
          <img :src="subscription.photo || 'https://via.placeholder.com/50'" alt="Фото пользователя"
            class="subscription-photo" />
          <router-link :to="{ name: 'user-profile', params: { username: subscription.username } }">
            <span>{{ subscription.username }}</span>
          </router-link>
        </li>
      </ul>
      <h3>Лайкнутые видео</h3>
      <router-link to="/liked-videos">
        <button>Посмотреть</button>
      </router-link>
      <h3>Лайкнутые плейлисты</h3>
      <router-link to="/liked-playlists">
        <button>Посмотреть</button>
      </router-link>
    </div>

    <!-- Контент: Видео -->
    <div class="content">


      <h2>Видео</h2>
      <!-- Поле поиска -->
      <div>
        <!-- Search input field -->
        <div>
  <input v-model="searchQuery" placeholder="Поиск видео..." />
  <button @click="performSearch">Поиск</button>
</div>


        <!-- Sorting buttons -->
        <button @click="sortVideos('created_at')">Sort by creation date</button>
        <button @click="sortVideos('length_time')">Sort by length</button>

        <!-- Video grid -->
        <div class="video-grid">
          <div v-for="video in videos" :key="video.url">
            <!-- Your video card template here -->
          </div>
        </div>
      </div>

      <!-- Сетка видео -->
      <div class="video-grid">
        <div v-for="video in videos" :key="video.url" class="video-card">
          <h3>{{ video.name }}</h3>
          <p><strong>Автор:</strong> {{ video.author_name }}</p>
          <p><strong>Продолжительность:</strong> {{ video.length_time }} минут</p>
          <router-link :to="{ name: 'video-detail', params: { slug: video.url.split('/')[3] } }">Подробнее</router-link>
        </div>
      </div>

      <!-- Пагинация -->
      <div class="pagination">
  <button :disabled="!previousPage" @click="fetchVideos(previousPage)">Предыдущая</button>
  <button :disabled="!nextPage" @click="fetchVideos(nextPage)">Следующая</button>
</div>

      <!-- Загрузка видео -->
      <div class="upload-video">
        <router-link to="/upload">Загрузить видео</router-link>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      videos: [],
      searchQuery: "",
      tags: [],
      likedPlaylists: [], // Лайкнутые плейлисты
      likedVideos: [], // Лайкнутые видео
      nextPage: null,
      previousPage: null,
      userSubscriptions: [],
    };
  },
  async created() {
    await this.fetchVideos();
    await this.fetchUserSubscriptions();
  },
  methods: {
    // Получение списка видео
    async fetchVideos(url = null) {
  try {
    // Если URL передан, используем его, иначе строим URL на основе searchQuery
    const baseUrl = "http://127.0.0.1:8000/api/video/";
    const searchParam = this.searchQuery.trim() ? `?search=${this.searchQuery.trim()}` : "";
    const finalUrl = url || `${baseUrl}${searchParam}`;

    console.log("Fetching videos from:", finalUrl);
    const response = await fetch(finalUrl);
    const data = await response.json();

    // Обновляем данные
    this.videos = data.results;
    this.nextPage = data.next;
    this.previousPage = data.previous;
  } catch (error) {
    console.error("Ошибка при получении видео:", error);
  }
},
performSearch() {
  // Сбрасываем ссылки на пагинацию, чтобы начать с первой страницы
  this.nextPage = null;
  this.previousPage = null;

  // Выполняем поиск
  this.fetchVideos();
},



    async fetchUserSubscriptions() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api-users/user-subs/", {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`, // Токен авторизации
          },
        });
        const data = await response.json();
        this.userSubscriptions = data;
      } catch (error) {
        console.error("Ошибка при получении подписок пользователя:", error);
      }
    },

    // Получение видео по тегу
    async fetchVideosByTag(tag) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/video/?tags=${tag.id}`
        );
        const data = await response.json();
        this.videos = data.results;
        this.nextPage = data.next;
        this.previousPage = data.previous;
      } catch (error) {
        console.error("Ошибка при получении видео по тегу:", error);
      }
    },

    // Получение лайкнутых плейлистов и видео
    async showLikedContent() {
      try {
        // Получаем лайкнутые плейлисты
        const playlistsResponse = await fetch(
          "http://127.0.0.1:8000/api/liked-playlists/"
        );
        this.likedPlaylists = await playlistsResponse.json();

        // Получаем лайкнутые видео
        const videosResponse = await fetch(
          "http://127.0.0.1:8000/api/rated-videos/"
        );
        const videosData = await videosResponse.json();
        this.likedVideos = videosData.results;
      } catch (error) {
        console.error("Ошибка при получении лайкнутого контента:", error);
      }
    },
    async sortVideos(sortField) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/video/?ordering=${sortField}`
        );
        const data = await response.json();
        this.videos = data.results;
      } catch (error) {
        console.error("Error sorting videos:", error);
      }
    },

    // Форматирование даты
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
  },

};
</script>

<style scoped>
.subscription-photo {
  width: 40px;
  /* Ширина фото */
  height: 40px;
  /* Высота фото */
  border-radius: 50%;
  /* Скругление для круглой формы */
  object-fit: cover;
  /* Обрезка изображения по контейнеру */
  margin-right: 10px;
  /* Отступ справа */
  vertical-align: middle;
  /* Выравнивание по центру строки */
}

/* Основной контейнер */
.container {
  display: flex;
  flex-direction: row;
}

/* Сайдбар */
.sidebar {
  width: 250px;
  padding: 20px;
  background-color: #f8f9fa;
  border-right: 1px solid #ddd;
  min-height: 100vh;
}

.sidebar h3 {
  margin-top: 20px;
}

.sidebar button {
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.sidebar button:hover {
  background-color: #0056b3;
}

/* Контент */
.content {
  flex-grow: 1;
  padding: 20px;
}

/* Сетка видео */
.video-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.video-card {
  flex: 1 1 calc(33.333% - 20px);
  /* Три колонки с отступами */
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.video-card h3 {
  margin-bottom: 10px;
  font-size: 18px;
}

.video-card p {
  margin-bottom: 5px;
  font-size: 14px;
}

.video-card a {
  color: #007bff;
  text-decoration: none;
}

.video-card a:hover {
  text-decoration: underline;
}

/* Пагинация */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.pagination button {
  width: 100px;
  height: 40px;
  padding: 10px;
  font-size: 18px;
  border: none;
  border-radius: 10px;
  background-color: #fff;
  cursor: pointer;
  margin: 10px;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Загрузка видео */
.upload-video a {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  text-decoration: none;
}

.upload-video a:hover {
  background-color: #218838;
}
</style>
