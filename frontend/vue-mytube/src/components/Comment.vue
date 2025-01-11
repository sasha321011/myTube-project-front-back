<template>
  <div class="comment">
    <!-- Основной комментарий -->
    <div class="comment-main">
      <p><strong>{{ comment.author_name }}</strong>: {{ comment.text }}</p>
    </div>

    <!-- Вложенные комментарии -->
    <div v-if="hasReplies(comment)" class="replies">
      <div v-for="reply in getReplies(comment)" :key="reply.id">
        <Comment :comment="reply" :all-comments="allComments" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comment: Object,   // Получаем комментарий
    allComments: Array, // Все комментарии, чтобы можно было найти вложенные
  },
  methods: {
    // Проверяем, есть ли вложенные комментарии для данного комментария
    hasReplies(comment) {
      return this.getReplies(comment).length > 0;
    },
    // Получаем все вложенные комментарии для данного комментария
    getReplies(comment) {
      return this.allComments.filter(c => c.parent === comment.id);
    }
  },
};
</script>

<style scoped>
.comment {
  margin-bottom: 1em;
  padding-left: 20px;
}

.comment-main {
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  background-color: #f9f9f9;
}

.replies {
  padding-left: 20px;
  border-left: 2px solid #ddd;
  margin-left: 20px;
  background-color: #f1f1f1;
}

.replies .comment-main {
  margin-top: 5px;
  background-color: #e9e9e9;
  padding-left: 15px;
}
</style>
