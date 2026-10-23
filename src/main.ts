import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

async function enableMocks() {
  if (!import.meta.env.DEV || import.meta.env.VITE_API_MOCKS === 'false') return
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledFrame: 'bypass', quiet: true })
}

enableMocks().then(() => {
  createApp(App).use(createPinia()).use(router).mount('#app')
})
