import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  framework: '@storybook/react-vite',
  addons: ['@storybook/addon-essentials'],
  viteFinal: async (config) => {
    const tailwindcss = (await import('@tailwindcss/vite')).default;
    config.plugins = [...(config.plugins || []), tailwindcss()];
    return config;
  },
};

export default config;
