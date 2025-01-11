<template>
  <div>
    <h1>Загрузить видео</h1>
    <form @submit.prevent="uploadVideo">
      <div>
        <label for="name">Название видео:</label>
        <input type="text" v-model="formData.name" id="name" required />
      </div>
      <div>
        <label for="video">Видео файл:</label>
        <input type="file" @change="handleFileChange('the_video', $event)" id="video" required />
      </div>
      <div>
        <label for="tags">Теги (через запятую):</label>
        <input type="text" v-model="formData.tags" id="tags" />
      </div>
      <div>
        <label for="cats">Категория:</label>
        <input type="text" v-model="formData.cats" id="cats" />
      </div>
      <div>
        <label for="description">Описание:</label>
        <textarea v-model="formData.description" id="description" required></textarea>
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? "Загрузка..." : "Загрузить видео" }}
      </button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: "",
        the_video: null, // Файл видео
        tags: "", // Строка тегов, разделенных запятой
        cats:"",
        description: "",
      },
      isLoading: false,
      errorMessage: null,
      successMessage: null,
    };
  },
  methods: {
    // Обработчик изменения файла
    handleFileChange(field, event) {
      this.formData[field] = event.target.files[0]; // Привязка файла
    },
    // Загрузка видео
    async uploadVideo() {
  this.isLoading = true;
  this.errorMessage = null;
  this.successMessage = null;

  const formData = new FormData();
  formData.append("name", this.formData.name);
  formData.append("the_video", this.formData.the_video);

  // Преобразуем строку тегов в массив чисел
  const tagsArray = this.formData.tags
    .split(",") // Разделяем строку по запятой
    .map(tag => parseInt(tag.trim(), 10)) // Преобразуем в числа
    .filter(tag => !isNaN(tag)); // Исключаем нечисловые значения

  // Проверяем, что массив тегов не пуст и содержит только числа
  if (tagsArray.length === 0) {
    this.errorMessage = "Введите корректные числовые ID для тегов.";
    this.isLoading = false;
    return;
  }

  // Добавляем теги в массив (JSON-формат)
  tagsArray.forEach(tag => formData.append("tags", tag));

  formData.append("description", this.formData.description);
  formData.append("cats", this.formData.cats);
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch("http://127.0.0.1:8000/api/upload-video/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`, // Токен авторизации
      },
      body: formData, // Передаем данные формы
    });

    if (response.ok) {
      this.successMessage = "Видео успешно загружено";
      this.resetForm();
    } else {
      const errorData = await response.json();
      this.errorMessage = errorData.tags || "Ошибка при загрузке видео";
    }
  } catch (error) {
    console.error("Error:", error);
    this.errorMessage = "Произошла ошибка на стороне клиента";
  } finally {
    this.isLoading = false;
  }
},
    // Сброс формы
    resetForm() {
      this.formData.name = "";
      this.formData.the_video = null;
      this.formData.tags = "";
      this.formData.description = "";
      this.formData.cats = "";
    },
  },
};
</script>

<style scoped>
/* Стили для формы */
.error {
  color: red;
  margin-top: 10px;
}
.success {
  color: green;
  margin-top: 10px;
}
button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
