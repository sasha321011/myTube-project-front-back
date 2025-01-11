<template>
  <div id="app">
    <header>
  <h1>
    <router-link to="/">MyTube</router-link>
  </h1>
  <p v-if="user">
    Добро пожаловать, 
    <router-link :to="{ name: 'UserProfile' }">{{ user.username }}</router-link>!
    <button @click="logout">Выйти</button>
  </p>
  <p v-else>
    <router-link to="/register">Зарегистрироваться</router-link> или
    <router-link to="/login">Войти</router-link>, чтобы смотреть и загружать видео.
  </p>
</header>

    <main>
      <router-view />
    </main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: null, // Хранит информацию о текущем пользователе
    };
  },
  methods: {
    async fetchUserProfile() {
      // Получаем токен из localStorage
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          // Делаем запрос на профиль пользователя
          const response = await fetch("http://127.0.0.1:8000/api-users/user-profile/", {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          if (response.ok) {
            this.user = await response.json(); // Сохраняем данные пользователя
          } else {
            console.error("Не удалось загрузить профиль");
            this.user = null;
          }
        } catch (error) {
          console.error("Ошибка при загрузке профиля:", error);
          this.user = null;
        }
      }
    },
    logout() {
      // Удаляем токен из localStorage и сбрасываем данные пользователя
      localStorage.removeItem("jwt_token");
      this.user = null;
    },
  },
  created() {
    this.fetchUserProfile(); // Загружаем профиль при загрузке приложения
  },
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  text-align: center;
}

header {
  background-color: #333;
  color: #fff;
  padding: 1rem;
}

header h1 a {
  color: #fff;
  text-decoration: none;
}

header h1 a:hover {
  text-decoration: underline;
}

main {
  padding: 1rem;
}
</style>
