declare module '*.svg?inline' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}

declare module '*.svg' {
  const path: string
  export default path
}

declare module '*.jpg' {
  const path: string
  export default path
}
