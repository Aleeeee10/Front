<template>
  <div class="admin-news-container">
    <h2 class="title">📰 Administrar Noticias</h2>

    <form @submit.prevent="handleSubmit" class="form">
      <input v-model="form.title" placeholder="Título" required />
      <textarea v-model="form.description" placeholder="Descripción" required></textarea>
      <input v-model="form.image_url" placeholder="URL de imagen" />

      <select v-model="form.matchId">
        <option value="">(Opcional) Relacionar con partido</option>
        <option v-for="match in matches" :key="match.id" :value="match.id">
          {{ match.team1?.name }} vs {{ match.team2?.name }} - {{ match.date }}
        </option>
      </select>

      <div class="form-buttons">
        <button type="submit" class="btn btn-submit">
          {{ editing ? 'Actualizar Noticia' : 'Crear Noticia' }}
        </button>
        <button v-if="editing" @click.prevent="cancelEdit" class="btn btn-cancel">
          Cancelar
        </button>
      </div>
    </form>

    <div class="news-list">
      <div v-for="item in news" :key="item.id" class="news-card">
        <img :src="item.image_url || 'https://via.placeholder.com/120'" alt="img" />
        <div class="news-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <p class="date">
            {{ formatDate(item.date) }}
            <span v-if="item.match"> — {{ item.match.team1?.name }} vs {{ item.match.team2?.name }}</span>
          </p>
          <div class="card-actions">
            <button @click="editNews(item)" class="btn-icon">✏️</button>
            <button @click="deleteNews(item.id)" class="btn-icon">🗑️</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const news = ref([])
const matches = ref([])
const editing = ref(false)

const form = ref({
  id: null,
  title: '',
  description: '',
  image_url: '',
  matchId: ''
})

const fetchNews = async () => {
  const res = await axios.get('http://localhost:3000/news')
  news.value = res.data
}

const fetchMatches = async () => {
  const res = await axios.get('http://localhost:3000/matches')
  matches.value = res.data
}

const handleSubmit = async () => {
  const payload = {
    title: form.value.title,
    description: form.value.description,
    image_url: form.value.image_url,
    match: form.value.matchId ? { id: form.value.matchId } : null
  }

  if (editing.value) {
    await axios.put(`http://localhost:3000/news/${form.value.id}`, payload)
  } else {
    await axios.post('http://localhost:3000/news', payload)
  }

  resetForm()
  fetchNews()
}

const editNews = (item) => {
  form.value = {
    id: item.id,
    title: item.title,
    description: item.description,
    image_url: item.image_url,
    matchId: item.match?.id || ''
  }
  editing.value = true
}

const cancelEdit = () => resetForm()

const deleteNews = async (id) => {
  if (confirm('¿Eliminar esta noticia?')) {
    await axios.delete(`http://localhost:3000/news/${id}`)
    fetchNews()
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    title: '',
    description: '',
    image_url: '',
    matchId: ''
  }
  editing.value = false
}

const formatDate = (str) =>
  new Date(str).toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

onMounted(() => {
  fetchNews()
  fetchMatches()
})
</script>

<style scoped>
.admin-news-container {
  max-width: 1000px;
  margin: auto;
  padding: 2rem;
}

.title {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #2d3748;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.form input,
.form select,
.form textarea {
  padding: 0.6rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  font-size: 1rem;
  width: 100%;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-submit {
  background-color: #2b6cb0;
  color: white;
}
.btn-submit:hover {
  background-color: #2c5282;
}

.btn-cancel {
  background-color: #e53e3e;
  color: white;
}
.btn-cancel:hover {
  background-color: #c53030;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.news-card {
  display: flex;
  gap: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  background-color: #fff;
  align-items: center;
}

.news-card img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.news-content h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2d3748;
}

.news-content p {
  margin: 0;
}

.date {
  color: #718096;
  font-size: 0.9rem;
}

.card-actions {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
}
</style>
