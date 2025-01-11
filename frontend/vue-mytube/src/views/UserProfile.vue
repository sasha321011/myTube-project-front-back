<template>
  <div>
    <h1>Профиль пользователя</h1>
    <nav>
      <ul>
      
        <li v-if="user">
          <router-link :to="{ name: 'my-playlists', params: { author: user.username } }">
            Мои плейлисты
          </router-link>
        </li>
        <li v-if="user">
          <router-link :to="{ name: 'MyVideos', params: { author: user.username } }">
            Мои видео
          </router-link>
        </li>
        <li><router-link to="/create-playlist">Создать плейлист</router-link></li>
      </ul>
    </nav>
    <div v-if="user">
      <p><strong>Имя пользователя:</strong> {{ user.username }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Дата рождения:</strong> {{ user.date_birth }}</p>

      <button @click="editMode = !editMode">
        {{ editMode ? "Отменить" : "Редактировать данные" }}
      </button>
      <form v-if="editMode" @submit.prevent="updateUserProfile">
        <label>
          Имя пользователя:
          <input v-model="form.username" type="text" />
        </label>
        <label>
          Email:
          <input v-model="form.email" type="email" />
        </label>
        <label>
          Дата рождения:
          <input v-model="form.date_birth" type="date" />
        </label>
        <button type="submit">Сохранить изменения</button>
      </form>
    </div>
    <p v-else>Информация о пользователе недоступна.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      editMode: false,
      form: {
        username: "",
        email: "",
        date_birth: "",
      },
    };
  },
  async mounted() {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await fetch("http://127.0.0.1:8000/api-users/user-profile/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (response.ok) {
          this.user = await response.json();
          this.form = { ...this.user }; // Заполняем форму данными пользователя
        }
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
      }
    }
  },
  methods: {
    async updateUserProfile() {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await fetch("http://127.0.0.1:8000/api-users/user-profile/", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(this.form),
          });
          if (response.ok) {
            this.user = await response.json();
            this.editMode = false;
            alert("Данные успешно обновлены.");
          } else {
            alert("Не удалось обновить данные.");
          }
        } catch (error) {
          console.error("Ошибка обновления профиля:", error);
        }
      }
    },
  },
};
</script>
