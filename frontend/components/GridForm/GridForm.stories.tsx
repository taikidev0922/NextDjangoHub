import type { Meta, StoryObj } from "@storybook/react";
import GridForm from "./test/GridFormTest";
import { AccordionProvider } from "@/context/AccordionContext";
import { OperationHeaderProvider } from "@/context/OperationHeaderContext";
import { DialogProvider } from "@/context/DialogContext";
import { ToastProvider } from "@/context/Toast/ToastContext";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "components/GridForm",
  component: GridForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  args: {
    columns: [
      {
        binding: "column1",
        header: "Column 1",
        dataType: "string",
      },
      {
        binding: "column2",
        header: "Column 2",
        dataType: "string",
      },
      {
        binding: "column3",
        header: "Column 3",
        dataType: "string",
      },
    ],
  },
  decorators: [
    (Story) => (
      <AccordionProvider>
        <OperationHeaderProvider>
          <DialogProvider>
            <ToastProvider>
              <Story />
            </ToastProvider>
          </DialogProvider>
        </OperationHeaderProvider>
      </AccordionProvider>
    ),
  ],
} satisfies Meta<typeof GridForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {},
};
