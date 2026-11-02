import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import Checkbox from './Checkbox.vue'

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  args: {
    label: 'Tylko otwarte zapisy',
    disabled: false,
    modelValue: false,
  },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: '<div class="max-w-sm"><Checkbox v-bind="args" v-model="args.modelValue" /></div>',
  }),
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = { args: { modelValue: true } }

export const Disabled: Story = { args: { disabled: true } }

export const DisabledChecked: Story = { args: { disabled: true, modelValue: true } }

export const Filters: Story = {
  render: () => ({
    components: { Checkbox },
    setup: () => ({ league: ref(true), cup: ref(false), archived: ref(false) }),
    template: `
      <fieldset class="flex max-w-sm flex-col">
        <legend class="mb-1 text-label text-fg-primary">Format</legend>
        <Checkbox v-model="league" label="Liga" />
        <Checkbox v-model="cup" label="Turniej pucharowy" />
        <Checkbox v-model="archived" label="Archiwalne" disabled />
      </fieldset>
    `,
  }),
}
