<script setup lang="ts">
const authStore = useAuthStore()
if (process.client) {
  const user = localStorage.getItem('user')
  const expiresAt = localStorage.getItem('expiresAt')
  if (!authStore.user && expiresAt && Date.now() < Number(expiresAt) && user) {
    authStore.user = JSON.parse(user)
  }
}

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
  <div class="flex h-screen text-gray-100">
    <NavSidebar />
    <NuxtPage />
    <Dialog />
  </div>
</template>
