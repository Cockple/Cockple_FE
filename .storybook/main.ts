import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  // .storybook/main.ts
  stories: [
    "../src/components/common/contentcard/stories/**/*.stories.@(ts|tsx|js|jsx)"
  ],
  addons: [
    '@storybook/addon-essentials', 
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
