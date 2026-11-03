import type { Meta, StoryObj } from '@storybook/vue3'
import Badge from './Badge.vue'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    tone: { control: 'radio', options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'] },
  },
  args: { label: 'Rejestracja otwarta' },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Neutral: Story = { args: { tone: 'neutral', label: 'Szkic' } }
export const Brand: Story = { args: { tone: 'brand', label: 'Organizator' } }
export const Success: Story = { args: { tone: 'success', label: 'Zakończony' } }
export const Warning: Story = { args: { tone: 'warning', label: 'Oczekuje na potwierdzenie' } }
export const Danger: Story = { args: { tone: 'danger', label: 'Sporny' } }
export const Info: Story = { args: { tone: 'info', label: 'Rejestracja otwarta' } }

export const WithIcon: Story = {
  args: { tone: 'success', label: 'Potwierdzony' },
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: `
      <Badge v-bind="args">
        <template #icon>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd" />
          </svg>
        </template>
      </Badge>`,
  }),
}