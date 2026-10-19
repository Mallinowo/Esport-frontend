import type { Meta, StoryObj } from '@storybook/vue3'
import EmptyState from './EmptyState.vue'

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    headingLevel: { control: 'radio', options: [2, 3, 4] },
  },
}
export default meta

type Story = StoryObj<typeof EmptyState>

export const TitleOnly: Story = {
  args: { title: 'No tournaments yet' },
}

export const WithDescription: Story = {
  args: {
    title: 'No tournaments yet',
    description: 'Tournaments you create or join will appear here.',
  },
}

export const WithIconAndAction: Story = {
  args: {
    title: 'No matches found',
    description: 'Try changing the filters or clearing the search.',
  },
  render: (args) => ({
    components: { EmptyState },
    setup: () => ({ args }),
    template: `
      <EmptyState v-bind="args">
        <template #icon>
          <svg class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" stroke-linecap="round" />
          </svg>
        </template>
        <template #actions>
          <button type="button" class="rounded-md bg-indigo-700 px-4 py-2 text-sm font-medium text-white">
            Clear filters
          </button>
        </template>
      </EmptyState>`,
  }),
}
