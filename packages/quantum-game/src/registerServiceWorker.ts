import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready(): void {
      console.log(
        'App is being served from cache by a service worker. For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered(): void {
      console.log('Service worker has been registered.')
    },
    cached(): void {
      console.log('Content has been cached for offline use.')
    },
    updatefound(): void {
      console.log('New content is downloading.')
    },
    updated(): void {
      console.log('New content is available; please refresh.')
    },
    offline(): void {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error): void {
      console.error('Error during service worker registration:', error)
    },
  })
}
