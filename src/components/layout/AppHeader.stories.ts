import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { User } from '@/api/types'
import AppHeader from './AppHeader.vue'

const user: User = {
  id: 1,
  name: 'Jakub Maliński',
  email: 'kuba@example.com',
  avatar_url: null,
  has_discord: true,
  roles: ['user', 'organizer'],
  captain_of_team_ids: [],
}

const meta = {
  title: 'Layout/AppHeader',
  component: AppHeader,
  parameters: { layout: 'fullscreen' },
  globals: { viewport: { value: 'mobile', isRotated: false } },
  args: { user: null },
} satisfies Meta<typeof AppHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Guest: Story = {}

export const LoggedIn: Story = { args: { user } }
