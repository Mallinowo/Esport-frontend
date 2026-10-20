import type { Meta, StoryObj } from '@storybook/vue3'
import LiveIndicator from './LiveIndicator.vue'

const meta: Meta<typeof LiveIndicator> = {
  title: 'UI/LiveIndicator',
  component: LiveIndicator,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md'] },
    status: { control: 'radio', options: ['live', 'offline'] },
    label: { control: 'text' },
  },
}
export default meta

type Story = StoryObj<typeof LiveIndicator>

export const Live: Story = { args: { status: 'live', size: 'md' } }
export const LiveSmall: Story = { args: { status: 'live', size: 'sm' } }
export const Offline: Story = { args: { status: 'offline', size: 'md' } }
export const OfflineSmall: Story = { args: { status: 'offline', size: 'sm' } }
export const CustomLabel: Story = { args: { status: 'live', label: 'In progress' } }
