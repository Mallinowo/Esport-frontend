import type { Meta, StoryObj } from '@storybook/vue3-vite'
import IconPlus from '@/components/icons/IconPlus.vue'
import Button from './Button.vue'

const meta = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Zgłoś wynik</Button>',
  }),
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Secondary: Story = { args: { variant: 'secondary' } }

export const Ghost: Story = { args: { variant: 'ghost' } }

export const Danger: Story = { args: { variant: 'danger' } }

export const Disabled: Story = { args: { disabled: true } }

export const Loading: Story = { args: { loading: true } }

export const IconLeft: Story = {
  render: (args) => ({
    components: { Button, IconPlus },
    setup: () => ({ args }),
    template: '<Button v-bind="args"><template #icon><IconPlus /></template>Utwórz rozgrywki</Button>',
  }),
}

export const IconOnly: Story = {
  render: (args) => ({
    components: { Button, IconPlus },
    setup: () => ({ args }),
    template: '<Button v-bind="args" aria-label="Utwórz rozgrywki"><template #icon><IconPlus /></template></Button>',
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { Button, IconPlus },
    setup: () => ({
      variants: ['primary', 'secondary', 'ghost', 'danger'],
      sizes: ['sm', 'md', 'lg'],
    }),
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex flex-wrap items-center gap-3">
          <Button v-for="size in sizes" :key="size" :variant="variant" :size="size">Przycisk {{ size }}</Button>
          <Button :variant="variant"><template #icon><IconPlus /></template>Z ikoną</Button>
          <Button :variant="variant" aria-label="Dodaj"><template #icon><IconPlus /></template></Button>
          <Button :variant="variant" loading>Zapisywanie</Button>
          <Button :variant="variant" disabled>Wyłączony</Button>
        </div>
      </div>
    `,
  }),
}
