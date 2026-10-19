import type { Meta, StoryObj } from '@storybook/vue3'
import Skeleton from './Skeleton.vue'

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['text', 'circle', 'rect'] },
    width: { control: 'text' },
    height: { control: 'text' },
    lines: { control: { type: 'number', min: 1, max: 10 } },
    label: { control: 'text' },
  },
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: '<div class="max-w-sm"><Skeleton v-bind="args" /></div>',
  }),
}
export default meta

type Story = StoryObj<typeof Skeleton>

export const Text: Story = { args: { variant: 'text' } }
export const TextLines: Story = { args: { variant: 'text', lines: 3 } }
export const Circle: Story = { args: { variant: 'circle' } }
export const Rect: Story = { args: { variant: 'rect' } }
export const CustomSize: Story = { args: { variant: 'rect', width: '12rem', height: '4rem' } }