<template>
  <div class="news-container">
    <h1 class="title">Noticias</h1>

    <div v-if="loading" class="loading">Cargando noticias...</div>

    <div v-else class="news-list">
      <div v-for="item in news" :key="item.id" class="news-card">
        <img :src="item.image_url" alt="imagen noticia" class="news-img" />
        <div class="news-content">
          <h3>{{ item.title }}</h3>
          <p class="date">{{ formatDate(item.date) }}</p>
          <p>{{ item.description }}</p>
          <p v-if="item.match" class="related-match">
            Relacionado al partido:
            <strong>{{ item.match.team1?.name }}</strong> vs <strong>{{ item.match.team2?.name }}</strong>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const news = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/news')
    news.value = res.data
  } catch (err) {
    alert('Error al cargar noticias')
  } finally {
    loading.value = false
  }
})

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('es-EC', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.news-container {
  padding: 2.5rem 1rem;
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(61, 0, 102, 0.1);
}
.title {
  font-size: 2.3rem;
  color: #4b006e;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px #e0c3fc33;
}
.loading {
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  margin-top: 2rem;
}
.news-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;
}
.news-card {
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f9f6ff 60%, #ffd60022 100%);
  border: 2px solid #ffd600;
  border-radius: 18px;
  box-shadow: 0 4px 18px #4b006e18;
  overflow: hidden;
  transition:
    transform 0.18s cubic-bezier(0.4, 2.3, 0.3, 1),
    box-shadow 0.18s;
  cursor: pointer;
  min-height: 340px;
  position: relative;
}
.news-card:hover {
  transform: scale(1.035) translateY(-6px);
  box-shadow: 0 8px 32px #ffd60055;
  border-color: #4b006e;
}
.news-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 2px solid #ffd600;
  background: #eee;
}
.news-content {
  flex: 1;
  padding: 1.2rem 1.1rem 1.1rem 1.1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.news-content h3 {
  margin: 0 0 0.5rem 0;
  color: #4b006e;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.date {
  font-size: 0.9rem;
  color: #a08ccf;
  margin-bottom: 0.7rem;
  font-weight: 600;
}
.news-content p {
  margin: 0 0 0.5rem 0;
  color: #3d0066;
  font-size: 1.05rem;
}
.related-match {
  margin-top: 1rem;
  font-weight: 600;
  color: #ffd600;
  background: #4b006e;
  padding: 0.35rem 0.7rem;
  border-radius: 7px;
  font-size: 0.97rem;
  display: inline-block;
  box-shadow: 0 2px 8px #ffd60033;
}
@media (max-width: 700px) {
  .news-list {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
  .news-container {
    padding: 1rem 0.2rem;
  }
}
</style>
