<script setup lang="ts">
import { io } from 'socket.io-client'

const authStore = useAuthStore()
if (import.meta.client) {
  const user = localStorage.getItem('user')
  const expiresAt = localStorage.getItem('expiresAt')
  if (!authStore.user && expiresAt && Date.now() < Number(expiresAt) && user) {
    authStore.user = JSON.parse(user)
  }
}

// setup socket
const isConnected = ref(false)
const socket = io({
  path: '/api/ws',
  addTrailingSlash: false,
})

socket.on('connect', () => {
  console.info('connect')
  socket.emit('toggleOnline')
  isConnected.value = true
})

socket.on('reconnect', () => {
  console.info('reconnect')
  socket.emit('toggleOnline')
  isConnected.value = true
})

function onDisconnect() {
  socket.emit('toggleOffline')
  isConnected.value = false
}

socket.on('disconnect', () => {
  onDisconnect()
})

window.addEventListener('beforeunload', () => {
  onDisconnect()
  socket.off()
})

provide(socketKey, { socket, isConnected })

useHead({
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: '',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap',
    },
  ],
})
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-leave-active {
  transition: all 0.2s;
}
</style>
