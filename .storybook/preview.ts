import type { Preview } from '@storybook/vue3-vite'
import '../src/style.css'

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    viewport: {
      options: {
        mobile: { name: 'Mobile 360', styles: { width: '360px', height: '740px' } },
        tablet: { name: 'Tablet 768', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop 1280', styles: { width: '1280px', height: '800px' } },
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Motyw',
      toolbar: {
        title: 'Motyw',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Jasny' },
          { value: 'dark', title: 'Ciemny' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (story, context) => {
      document.documentElement.classList.toggle('dark', context.globals.theme === 'dark')
      return story()
    },
  ],
}

export default preview
