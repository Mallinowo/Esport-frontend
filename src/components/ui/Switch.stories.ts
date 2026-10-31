import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import Switch from './Switch.vue'

const meta = {
  title: 'UI/Switch',
  component: Switch,
  args: {
    label: 'Powiadomienia o wynikach',
    disabled: false,
    modelValue: false,
  },
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args }),
    template: '<div class="max-w-sm"><Switch v-bind="args" v-model="args.modelValue" /></div>',
  }),
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = { args: { modelValue: true } }

export const Disabled: Story = { args: { disabled: true } }

export const DisabledChecked: Story = { args: { disabled: true, modelValue: true } }

export const Settings: Story = {
  render: () => ({
    components: { Switch },
    setup: () => ({ results: ref(true), invites: ref(false), newsletter: ref(false) }),
    template: `
      <fieldset class="flex max-w-sm flex-col">
        <legend class="mb-1 text-label text-fg-primary">Powiadomienia</legend>
        <Switch v-model="results" label="Wyniki obserwowanych drużyn" />
        <Switch v-model="invites" label="Zaproszenia do drużyn" />
        <Switch v-model="newsletter" label="Newsletter" disabled />
      </fieldset>
    `,
  }),
}
