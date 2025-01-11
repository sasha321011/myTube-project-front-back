<template>
  <div class="video-detail">
    <h1>{{ video.name }}</h1>
    <div class="video-wrapper">
      <video :src="video.the_video" controls></video>
    </div>
    <p>{{ video.description }}</p>

    <div class="meta">
      <p><strong>Автор:</strong> {{ video.author_name }}</p>
      <p><strong>Длительность:</strong> {{ video.length_time }} минут</p>
            <p><strong>Просмотры:</strong> {{ video.views }}</p>
      <p><strong>Теги:</strong> {{ video.tags_name.map(tag => tag.tag_name).join(', ') }}</p>
      <p><strong>Лайки:</strong> {{ video.likes }}</p>
      <p><strong>Дизлайки:</strong> {{ video.dislikes }}</p>
    </div>
    <div class="subscription">
  <button
    v-if="!isSubscribed"
    @click="toggleSubscription('create')"
    class="subscribe-button"
  >
    Подписаться
  </button>
  <button
    v-else
    @click="toggleSubscription('destroy')"
    class="unsubscribe-button"
  >
    Отписаться
  </button>
</div>

    <div class="like-dislike">
      <button @click="sendVote('1')">Лайк</button>
      <button @click="sendVote('-1')">Дизлайк</button>
    </div>

    <div class="comments">
      <h3>Комментарии</h3>
      <div v-if="video.comments && video.comments.length > 0">
        <div v-for="comment in video.comments.filter(c => c.parent === null)" :key="comment.id">
          <Comment :comment="comment" :all-comments="video.comments" />
        </div>
      </div>
      <p v-else>Комментариев пока нет.</p>
    </div>
  </div>
</template>

<script>
import Comment from "@/components/Comment.vue";

export default {
  data() {
    return {
      video: {},
    };
  },
  async created() {
    await this.fetchVideoDetail();
    await this.checkSubscription();

  },
  methods: {
    async checkSubscription() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await fetch(
          "http://127.0.0.1:8000/api-users/make-sub/",
          {
            method: "GET", // Предположим, что GET возвращает список подписок
            headers: { Authorization: `Token ${token}` },
          }
        );
        if (response.ok) {
          const subscriptions = await response.json();
          this.isSubscribed = subscriptions.some(
            (sub) => sub.channel === this.video.author
          );
        }
      } catch (error) {
        console.error("Ошибка при проверке подписки:", error);
      }
    },
    // Создание или удаление подписки
    async toggleSubscription(action) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Токен авторизации отсутствует");

        const method = action === "create" ? "POST" : "DELETE";
        console.log(this.video.author);
        console.log(this.video.author);
        const response = await fetch(
          "http://127.0.0.1:8000/api-users/make-sub/",
          {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({ channel: this.video.author }),
          }
        );

        if (!response.ok)
          throw new Error(
            `Ошибка ${action === "create" ? "подписки" : "отписки"}: ${
              response.status
            }`
          );

        this.isSubscribed = action === "create";
        console.log(
          `Успешно ${
            action === "create" ? "подписались" : "отписались"
          } на канал`
        );
      } catch (error) {
        console.error("Ошибка при изменении подписки:", error);
      }
    },

    async fetchVideoDetail() {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/video-detail/${this.$route.params.slug}/`
        );
        this.video = await response.json();
      } catch (error) {
        console.error("Ошибка при получении видео:", error);
      }
    },
    async sendVote(voteType) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Токен авторизации отсутствует");

        const response = await fetch("http://127.0.0.1:8000/api/rate/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ vid: this.video.id, vote: voteType }),
        });

        if (!response.ok) throw new Error(`Ошибка при голосовании: ${response.status}`);
        console.log("Голос успешно отправлен:", await response.json());
      } catch (error) {
        console.error("Ошибка при голосовании:", error);
      }
    },
  },
  components: {
    Comment,
  },
};
</script>

<style scoped>

.subscribe-button,
.unsubscribe-button {
  padding: 10px 15px;
  margin-top: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #fff;
}

.subscribe-button {
  background-color: #28a745; /* Зелёный */
}

.subscribe-button:hover {
  background-color: #218838;
}

.unsubscribe-button {
  background-color: #dc3545; /* Красный */
}

.unsubscribe-button:hover {
  background-color: #c82333;
}

.video-detail {
  padding: 20px;
}

.video-wrapper video {
  max-width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.meta p {
  margin: 5px 0;
}

.like-dislike button {
  margin-right: 10px;
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.like-dislike button:hover {
  background-color: #0056b3;
}

.comments {
  margin-top: 20px;
}
</style>
