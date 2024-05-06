import type { Meta, StoryObj } from "@storybook/react";
import SampleList from "./SampleList";
import { ToastProvider } from "@/context/Toast/ToastContext";
import { DialogProvider } from "@/context/DialogContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { AccordionProvider } from "@/context/AccordionContext";
import { OperationHeaderProvider } from "@/context/OperationHeaderContext";
import { http, HttpResponse } from "msw";
import { createSampleData } from "@/mocks/sampleDataFactory";
import { userEvent as user, waitFor, within } from "@storybook/testing-library";
import { expect, jest } from "@storybook/jest";

async function logStreamData(stream: ReadableStream<Uint8Array> | null) {
  // ReadableStreamのリーダーを取得
  const reader = stream?.getReader();
  if (!reader) return;

  // ループしてデータを読み取る
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    // valueはUint8Arrayであることが多いので、テキストとして解釈する
    return new TextDecoder().decode(value);
  }
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "pages/SampleList",
  component: SampleList,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
    msw: {
      handlers: [
        http.get("http://localhost:8000/api/v1/sample/", () => {
          const sampleDataArray = Array.from({ length: 30 }, createSampleData);
          return HttpResponse.json(sampleDataArray);
        }),
        http.put(
          "http://localhost:8000/api/v1/sample/bulk_update/",
          async ({ request, params }) => {
            const payload = await logStreamData(request.body);
            return HttpResponse.json(
              JSON.parse(payload ?? "[]").map((item: any) => ({
                ...item,
                isSelected: undefined,
              }))
            );
          }
        ),
      ],
    },
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="wijmo-vgrid">
        <ToastProvider>
          <DialogProvider>
            <LoadingProvider>
              <AccordionProvider>
                <OperationHeaderProvider>
                  <Story />
                </OperationHeaderProvider>
              </AccordionProvider>
            </LoadingProvider>
          </DialogProvider>
        </ToastProvider>
      </div>
    ),
  ],
} satisfies Meta<typeof SampleList>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Success: Story = {
  args: {
    className: "btn-primary",
  },
  parameters: {
    msw: {
      handlers: [
        http.get("http://localhost:8000/api/v1/sample/", (request) => {
          const sampleDataArray = Array.from({ length: 30 }, createSampleData);
          return HttpResponse.json(
            [createSampleData({ title: "hoge" }), ...sampleDataArray],
            { status: 200 }
          );
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await user.click(canvas.getByRole("textbox", { name: "title" }));
    await user.type(canvas.getByRole("textbox", { name: "title" }), "test");
    await waitFor(() => {
      // 10行目が表示されるまで待機
      expect(canvas.getByText("10")).toBeInTheDocument();
    });
    await user.click(canvas.getByRole("button", { name: "F1 検索" }));
    await waitFor(async () => {
      expect(canvas.getByText("hoge")).toBeInTheDocument();
    });
  },
};
