import type { Meta, StoryObj } from '@storybook/vue3-vite'
import IconPlus from '@/components/icons/IconPlus.vue'
import TextField from './TextField.vue'

const meta = {
  title: 'UI/TextField',
  component: TextField,
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'number'] },
  },
  args: {
    label: 'Nazwa drużyny',
    type: 'text',
    placeholder: 'Wpisz nazwę',
    disabled: false,
  },
  render: (args) => ({
    components: { TextField },
    setup: () => ({ args }),
    template: '<div class="max-w-sm"><TextField v-bind="args" /></div>',
  }),
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Email: Story = { args: { label: 'Adres e-mail', type: 'email', placeholder: 'kapitan@example.com' } }

export const Password: Story = { args: { label: 'Hasło', type: 'password', placeholder: '' } }

export const Number: Story = { args: { label: 'Wynik', type: 'number', placeholder: '0' } }

export const Filled: Story = { args: { modelValue: 'Wilki Legnica' } }

export const WithError: Story = { args: { label: 'Wynik', type: 'number', modelValue: 120, error: 'Wynik musi być liczbą od 0 do 99' } }

export const Disabled: Story = { args: { disabled: true, modelValue: 'Wilki Legnica' } }

export const WithIcon: Story = {
  render: (args) => ({
    components: { TextField, IconPlus },
    setup: () => ({ args }),
    template: '<div class="max-w-sm"><TextField v-bind="args"><template #icon><IconPlus /></template></TextField></div>',
  }),
}

export const AllStates: Story = {
  render: () => ({
    components: { TextField, IconPlus },
    template: `
      <div class="flex max-w-sm flex-col gap-5">
        <TextField label="Domyślne" placeholder="Wpisz nazwę" />
        <TextField label="Wypełnione" model-value="Wilki Legnica" />
        <TextField label="Z ikoną" placeholder="Szukaj drużyny"><template #icon><IconPlus /></template></TextField>
        <TextField label="Z błędem" type="number" model-value="120" error="Wynik musi być liczbą od 0 do 99" />
        <TextField label="Wyłączone" model-value="Wilki Legnica" disabled />
      </div>
    `,
  }),
}
