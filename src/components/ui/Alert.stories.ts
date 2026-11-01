import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import Alert from './Alert.vue'
import Button from './Button.vue'

const meta = {
  title: 'UI/Alert',
  component: Alert,
  argTypes: {
    tone: { control: 'select', options: ['info', 'success', 'warning', 'danger'] },
  },
  args: {
    tone: 'info',
    title: 'Rejestracja trwa do 15 listopada',
    dismissible: false,
  },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: '<Alert v-bind="args">Po tym terminie wygenerujemy terminarz.</Alert>',
  }),
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {}

export const Success: Story = { args: { tone: 'success', title: 'Wynik zapisany' } }

export const Warning: Story = { args: { tone: 'warning', title: 'Połączenie na żywo przerwane' } }

export const Danger: Story = { args: { tone: 'danger', title: 'Nie udało się zapisać wyniku' } }

export const WithAction: Story = {
  args: { tone: 'danger', title: 'Nie udało się zapisać wyniku', actionLabel: 'Spróbuj ponownie' },
}

export const Dismissible: Story = {
  render: () => ({
    components: { Alert, Button },
    setup: () => ({ visible: ref(true) }),
    template: `
      <Alert v-if="visible" tone="success" title="Wynik zapisany" dismissible @close="visible = false">
        Drugi kapitan musi go potwierdzić.
      </Alert>
      <Button v-else variant="secondary" @click="visible = true">Pokaż ponownie</Button>
    `,
  }),
}

export const AllTones: Story = {
  render: () => ({
    components: { Alert },
    template: `
      <div class="flex max-w-md flex-col gap-3">
        <Alert title="Rejestracja trwa do 15 listopada">Po tym terminie wygenerujemy terminarz.</Alert>
        <Alert tone="success" title="Wynik zapisany" dismissible>Drugi kapitan musi go potwierdzić.</Alert>
        <Alert tone="warning" title="Połączenie na żywo przerwane">Odświeżamy dane co 15 sekund.</Alert>
        <Alert tone="danger" title="Nie udało się zapisać wyniku" action-label="Spróbuj ponownie">
          Sprawdź połączenie i spróbuj jeszcze raz.
        </Alert>
      </div>
    `,
  }),
}
