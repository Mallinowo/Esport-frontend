import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BottomNav from './BottomNav.vue'

const meta = {
  title: 'Layout/BottomNav',
  component: BottomNav,
  parameters: { layout: 'fullscreen' },
  globals: { viewport: { value: 'mobile', isRotated: false } },
} satisfies Meta<typeof BottomNav>

export default meta
type Story = StoryObj<typeof meta>

export const Competitions: Story = { parameters: { route: '/rozgrywki' } }

export const Teams: Story = { parameters: { route: '/druzyny' } }

export const Matches: Story = { parameters: { route: '/mecze' } }

export const Profile: Story = { parameters: { route: '/profil' } }
