import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { User } from '@/api/types'
import AppSidebar from './AppSidebar.vue'

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
  title: 'Layout/AppSidebar',
  component: AppSidebar,
  parameters: { layout: 'fullscreen' },
  globals: { viewport: { value: 'desktop', isRotated: false } },
  args: { user: null },
} satisfies Meta<typeof AppSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Guest: Story = {}

export const LoggedIn: Story = { args: { user } }

export const ProfileActive: Story = { args: { user }, parameters: { route: '/profil' } }
