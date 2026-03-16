import type { Preview } from '@storybook/react';
import '../styles.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Dark or light theme',
      defaultValue: 'dark',
      toolbar: {
        icon: 'moon',
        items: [
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'light', title: 'Light', icon: 'sun' },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      name: 'Density',
      description: 'Comfortable or compact',
      defaultValue: 'comfortable',
      toolbar: {
        icon: 'grid',
        items: [
          { value: 'comfortable', title: 'Comfortable' },
          { value: 'compact', title: 'Compact' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'dark';
      const density = context.globals.density || 'comfortable';
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.setAttribute('data-density', density);
      return Story();
    },
  ],
};

export default preview;
