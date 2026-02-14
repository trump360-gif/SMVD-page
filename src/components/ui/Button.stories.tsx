import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
      description: 'Button 스타일 변형',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button 크기',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    onClick: {
      action: 'clicked',
      description: '클릭 이벤트 핸들러',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Primary Button',
    disabled: false,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    children: 'Secondary Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'md',
    children: 'Outline Button',
  },
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large Button',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Disabled Button',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button variant="primary" size="sm">Primary Small</Button>
        <Button variant="primary" size="md">Primary Medium</Button>
        <Button variant="primary" size="lg">Primary Large</Button>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button variant="secondary" size="sm">Secondary Small</Button>
        <Button variant="secondary" size="md">Secondary Medium</Button>
        <Button variant="secondary" size="lg">Secondary Large</Button>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button variant="outline" size="sm">Outline Small</Button>
        <Button variant="outline" size="md">Outline Medium</Button>
        <Button variant="outline" size="lg">Outline Large</Button>
      </div>
    </div>
  ),
};
