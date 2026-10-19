import type { Meta, StoryObj } from '@storybook/vue3'
import Card from './Card.vue'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['default', 'interactive'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    as: { control: 'text' },
  },
  render: (args) => ({
    components: { Card },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" class="max-w-sm">
        <template #header>Team Falcons</template>
        Next match: Saturday, 18:00
        <template #footer>Group A, 2nd place</template>
      </Card>`,
  }),
}
export default meta

type Story = StoryObj<typeof Card>

export const Default: Story = { args: { variant: 'default' } }
export const Interactive: Story = { args: { variant: 'interactive' } }
export const Selected: Story = { args: { variant: 'interactive', selected: true } }
export const Disabled: Story = { args: { variant: 'interactive', disabled: true } }
