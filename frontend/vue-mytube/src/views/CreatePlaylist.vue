<template>
  <div class="create-playlist">
    <h1>Create Playlist</h1>
    <form @submit.prevent="createPlaylist">
      <div>
        <label for="name">Playlist Name:</label>
        <input
          type="text"
          id="name"
          v-model="name"
          placeholder="Enter playlist name"
          required
        />
      </div>

      <div>
        <label for="vids">Select Videos:</label>
        <select id="vids" multiple @change="updateSelectedVideos">
          <option v-for="video in videos" :key="video.id" :value="video.id">
            {{ video.name }}
          </option>
        </select>
      </div>

      <button type="submit">Create Playlist</button>
    </form>

    <div v-if="errorMessage" class="error">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-if="successMessage" class="success">
      <p>{{ successMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      selectedVideos: [], // Инициализация как пустой массив
      videos: [], // Список видео
      errorMessage: "",
      successMessage: "",
    };
  },

  created() {
    this.fetchVideos();
  },

  methods: {
    // Получение списка видео
    async fetchVideos() {
      try {
        let allVideos = [];
        let nextUrl = "http://127.0.0.1:8000/api/video/";

        while (nextUrl) {
          const response = await axios.get(nextUrl);
          console.log("Fetched Data:", response.data);

          // Преобразуем данные, добавляя поле id на основе url
          const validVideos = response.data.results.map((video) => ({
            id: video.id, // Используем id как уникальный идентификатор
            name: video.name,
          }));

          allVideos = [...allVideos, ...validVideos];
          nextUrl = response.data.next;
        }

        this.videos = allVideos;
      } catch (error) {
        console.error(error);
        this.errorMessage = "Failed to fetch videos.";
      }
    },

    // Создание плейлиста
    async createPlaylist() {
      const token = localStorage.getItem("authToken"); // Получаем токен из localStorage
      if (!token) {
        this.errorMessage = "User is not authenticated.";
        return;
      }

      // Генерация slug (например, на основе имени плейлиста)
      const slug = this.name.toLowerCase().replace(/\s+/g, "-");

      // Данные для отправки на сервер
      const payload = {
    name: this.name,
    vids: JSON.parse(JSON.stringify(this.selectedVideos)),
    slug: slug,
  };

      if (payload.vids.length === 0) {
        this.errorMessage = "Please select at least one video.";
        return;
      }

      console.log("Payload:", payload);

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/make-playlist/",
          {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();
        console.log("Server Response:", data);

        if (response.ok) {
          this.successMessage = "Playlist created successfully!";
          this.name = "";
          this.selectedVideos = [];
        } else {
          this.errorMessage =
            data.detail || "An error occurred while creating the playlist.";
        }
      } catch (error) {
        console.error("Request error:", error);
        this.errorMessage = "Failed to create playlist.";
      }
    },

    // Обновление выбранных видео
updateSelectedVideos(event) {
  const options = event.target.options;
  const selected = [];

  // Перебираем все опции и добавляем только те, которые были выбраны
  for (let i = 0; i < options.length; i++) {
    if (options[i].selected) {
      const value = options[i].value; // не преобразовываем в число
      selected.push(value);
    }
  }

  this.selectedVideos = selected;
  console.log("Updated Selected Videos:", this.selectedVideos);
}

  },
};

</script>



<style scoped>
.create-playlist {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

div {
  margin-bottom: 10px;
}

label {
  font-weight: bold;
}

input,
select {
  padding: 8px;
  margin-top: 5px;
}

button {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.error {
  color: red;
}

.success {
  color: green;
}
</style>
