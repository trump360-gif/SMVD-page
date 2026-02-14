import type { Preview } from '@storybook/nextjs-vite';
import '../src/app/globals.css'; // Tailwind 4 + CSS Custom Properties 포함

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'white',
      values: [
        { name: 'white', value: '#FFFFFF' },
        { name: 'light', value: '#F5F5F5' },
        { name: 'dark', value: '#141414' },
      ],
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    nextjs: {
      appDirectory: true, // Next.js 16 App Router
    },
  },
};

export default preview;