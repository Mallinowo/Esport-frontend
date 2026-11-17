import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import Button from './Button.vue'
import Modal from './Modal.vue'

const meta = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: { story: { inline: false, iframeHeight: 480 } },
  },
  args: {
    title: 'Zasady ligi',
    open: true,
    closeOnBackdrop: true,
  },
  render: (args) => ({
    components: { Modal, Button },
    setup: () => {
      const open = ref(args.open)
      return { args, open }
    },
    template: `
      <Button variant="secondary" @click="open = true">Pokaż zasady</Button>
      <Modal v-bind="args" v-model:open="open">
        <p>Mecze rozgrywamy w formacie BO3. Za zwycięstwo drużyna dostaje 3 punkty, za remis 1.</p>
        <template #footer>
          <Button @click="open = false">Rozumiem</Button>
        </template>
      </Modal>
    `,
  }),
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutFooter: Story = {
  render: (args) => ({
    components: { Modal, Button },
    setup: () => {
      const open = ref(args.open)
      return { args, open }
    },
    template: `
      <Button variant="secondary" @click="open = true">Pokaż zasady</Button>
      <Modal v-bind="args" v-model:open="open">
        <p>Zgłoszenia przyjmujemy do 15 listopada. Terminarz pojawi się dzień później.</p>
      </Modal>
    `,
  }),
}

export const LongContent: Story = {
  args: { title: 'Regulamin rozgrywek' },
  render: (args) => ({
    components: { Modal, Button },
    setup: () => {
      const open = ref(args.open)
      const rules = Array.from({ length: 12 }, (_, index) => `§${index + 1}. Drużyna musi stawić się na mecz najpóźniej 10 minut przed startem, inaczej przegrywa walkowerem.`)
      return { args, open, rules }
    },
    template: `
      <Button variant="secondary" @click="open = true">Pokaż regulamin</Button>
      <Modal v-bind="args" v-model:open="open">
        <div class="flex flex-col gap-3">
          <p v-for="rule in rules" :key="rule">{{ rule }}</p>
        </div>
        <template #footer>
          <Button @click="open = false">Akceptuję</Button>
        </template>
      </Modal>
    `,
  }),
}
