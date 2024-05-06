import type { Meta, StoryObj } from "@storybook/react";
import ChildComponent from "./ChildComponent";
import { ToastProvider } from "./ToastContext";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "context/Toast",
  component: ChildComponent,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  args: {},
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof ChildComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Success: Story = {
  args: {
    toastContext: { type: "success", text: "成功しました" },
  },
};

export const Error: Story = {
  args: {
    toastContext: { type: "error", text: "エラーが発生しました" },
  },
};
