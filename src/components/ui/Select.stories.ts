import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Select from './Select.vue'

const games = [
  { value: 'cs2', label: 'Counter-Strike 2' },
  { value: 'lol', label: 'League of Legends' },
  { value: 'val', label: 'Valorant' },
  { value: 'r6', label: 'Rainbow Six Siege', disabled: true },
  { value: 'rl', label: 'Rocket League' },
]

const rounds = Array.from({ length: 12 }, (_, index) => ({ value: index + 1, label: `Kolejka ${index + 1}` }))

const meta = {
  title: 'UI/Select',
  component: Select,
  args: {
    label: 'Gra',
    options: games,
    placeholder: 'Wybierz grę',
    disabled: false,
    modelValue: null,
  },
  render: (args) => ({
    components: { Select },
    setup: () => ({ args }),
    template: '<div class="max-w-sm pb-72"><Select v-bind="args" v-model="args.modelValue" /></div>',
  }),
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = { args: { modelValue: 'lol' } }

export const Open: Story = {
  args: { modelValue: 'cs2' },
  play: ({ canvasElement }) => {
    canvasElement.querySelector<HTMLButtonElement>('[role="combobox"]')?.click()
  },
}

export const Rounds: Story = { args: { label: 'Kolejka', options: rounds, placeholder: 'Wybierz kolejkę', modelValue: 3 } }

export const WithError: Story = { args: { error: 'Wybierz grę, w której odbędą się rozgrywki' } }

export const Disabled: Story = { args: { disabled: true, modelValue: 'cs2' } }

export const AllStates: Story = {
  render: () => ({
    components: { Select },
    setup: () => ({ games }),
    template: `
      <div class="flex max-w-sm flex-col gap-5 pb-72">
        <Select label="Domyślne" :options="games" placeholder="Wybierz grę" />
        <Select label="Wybrane" :options="games" model-value="lol" />
        <Select label="Z błędem" :options="games" placeholder="Wybierz grę" error="Wybierz grę, w której odbędą się rozgrywki" />
        <Select label="Wyłączone" :options="games" model-value="cs2" disabled />
      </div>
    `,
  }),
}
