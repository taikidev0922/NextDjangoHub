import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Button from "./Button";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "components/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    className: {
      control: "select",
      options: ["btn-primary", "btn-success", "btn-error", "btn-grid-action"],
    },
  },
  args: {
    type: "button",
    onClick: fn(),
    name: "name",
    children: "Click Me",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    className: "btn-primary",
  },
};

export const Success: Story = {
  args: {
    className: "btn-success",
  },
};

export const Error: Story = {
  args: {
    className: "btn-error",
  },
};

export const Disabled: Story = {
  play: () => {
    console.log("clicked");
  },
  args: {
    disabled: true,
  },
};
