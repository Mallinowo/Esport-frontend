import type { Meta, StoryObj } from '@storybook/vue3'
import Avatar from './Avatar.vue'

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    src: { control: 'text' },
    size: { control: 'radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
  args: { name: 'Jan Kowalski' },
}
export default meta

type Story = StoryObj<typeof Avatar>

export const WithImage: Story = {
  args: { src: 'https://i.pravatar.cc/128?img=12' },
}
export const Initials: Story = {}
export const SingleName: Story = { args: { name: 'kapitan_zmb' } }
export const BrokenImage: Story = { args: { src: 'https://invalid.example/missing.png' } }
export const Small: Story = { args: { size: 'sm' } }
export const ExtraSmall: Story = { args: { size: 'xs' } }
export const Large: Story = { args: { size: 'lg' } }
export const ExtraLarge: Story = { args: { size: 'xl' } }