import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Spinner from './Spinner.vue'

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: {
    size: 'md',
    label: 'Ładowanie',
  },
  render: (args) => ({
    components: { Spinner },
    setup: () => ({ args }),
    template: '<div class="text-brand-fg"><Spinner v-bind="args" /></div>',
  }),
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Medium: Story = {}

export const Small: Story = { args: { size: 'sm' } }

export const WithText: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex items-center gap-2 text-body text-fg-muted">
        <Spinner size="sm" />
        Ładowanie tabeli
      </div>
    `,
  }),
}

export const AllSizes: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex items-center gap-4 text-brand-fg">
        <Spinner size="sm" label="Ładowanie" />
        <Spinner size="md" label="Ładowanie" />
      </div>
    `,
  }),
}
