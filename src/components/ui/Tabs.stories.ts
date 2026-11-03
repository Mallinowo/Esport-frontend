import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import Tabs from './Tabs.vue'

const leagueTabs = [
  { value: 'table', label: 'Tabela' },
  { value: 'schedule', label: 'Terminarz' },
  { value: 'teams', label: 'Drużyny' },
  { value: 'rules', label: 'Regulamin' },
]

const roundTabs = Array.from({ length: 9 }, (_, index) => ({ value: `round-${index + 1}`, label: `Kolejka ${index + 1}` }))

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  args: {
    tabs: leagueTabs,
    label: 'Sekcje ligi',
    modelValue: 'table',
  },
  render: (args) => ({
    components: { Tabs },
    setup: () => ({ args, active: ref(args.modelValue) }),
    template: `
      <Tabs v-bind="args" v-model="active">
        <template #default="{ active }">
          <p class="text-body-sm text-fg-secondary">Zawartość zakładki: {{ active }}</p>
        </template>
      </Tabs>
    `,
  }),
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDisabled: Story = {
  args: {
    tabs: [...leagueTabs.slice(0, 3), { value: 'rules', label: 'Regulamin', disabled: true }],
  },
}

export const Rounds: Story = {
  args: { tabs: roundTabs, label: 'Kolejki', modelValue: 'round-3' },
  globals: { viewport: { value: 'mobile' } },
}
