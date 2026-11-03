import type { Meta, StoryObj } from '@storybook/vue3'
import TeamLogo from './TeamLogo.vue'

const meta: Meta<typeof TeamLogo> = {
  title: 'UI/TeamLogo',
  component: TeamLogo,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    shortName: { control: 'text' },
    src: { control: 'text' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
  args: { name: 'Wilki Legnica', shortName: 'WLK' },
}
export default meta

type Story = StoryObj<typeof TeamLogo>

export const WithLogo: Story = {
  args: { src: 'https://placehold.co/128x128/png?text=WLK' },
}
export const Fallback: Story = {}
export const FallbackWithoutShortName: Story = { args: { shortName: undefined } }
export const BrokenLogo: Story = { args: { src: 'https://invalid.example/missing.png' } }
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }