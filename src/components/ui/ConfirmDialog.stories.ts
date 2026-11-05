import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import Button from './Button.vue'
import ConfirmDialog from './ConfirmDialog.vue'

const meta = {
  title: 'UI/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'centered',
    docs: { story: { inline: false, iframeHeight: 400 } },
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'danger'] },
  },
  args: {
    open: true,
    title: 'Zgłosić wynik 2:1?',
    message: 'Po zgłoszeniu wyniku nie można go edytować. Przeciwnik musi go potwierdzić.',
    variant: 'default',
    confirmLabel: 'Zgłoś wynik',
    cancelLabel: 'Anuluj',
    loading: false,
  },
  render: (args) => ({
    components: { ConfirmDialog, Button },
    setup: () => {
      const open = ref(args.open)
      return { args, open }
    },
    template: `
      <Button :variant="args.variant === 'danger' ? 'danger' : 'primary'" @click="open = true">{{ args.confirmLabel }}</Button>
      <ConfirmDialog v-bind="args" v-model:open="open" @confirm="open = false" />
    `,
  }),
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

export const ReportResult: Story = {}

export const Dispute: Story = {
  args: {
    variant: 'danger',
    title: 'Zgłosić spór?',
    message: 'Wynik trafi do administratora rozgrywek. Do czasu jego decyzji mecz nie będzie liczony w tabeli.',
    confirmLabel: 'Zgłoś spór',
  },
}

export const Loading: Story = {
  args: { loading: true },
}

export const WithSending: Story = {
  render: (args) => ({
    components: { ConfirmDialog, Button },
    setup: () => {
      const open = ref(args.open)
      const loading = ref(false)
      function confirm() {
        loading.value = true
        setTimeout(() => {
          loading.value = false
          open.value = false
        }, 1500)
      }
      return { args, open, loading, confirm }
    },
    template: `
      <Button @click="open = true">Zgłoś wynik</Button>
      <ConfirmDialog v-bind="args" v-model:open="open" :loading="loading" @confirm="confirm" />
    `,
  }),
}
