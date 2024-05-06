import type { Preview } from "@storybook/react";
import "../app/globals.css";
import "@grapecity/wijmo.styles/wijmo.css";
import { initialize, mswDecorator, mswLoader } from "msw-storybook-addon";
// import { http } from "msw";

initialize();
export const decorators = [mswDecorator];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    msw: {
      handlers: [
        // http.get("/api/user",(req,res,ctx)=>{
        //   return res(ctx.json({name:"John Doe"}))
        // })
      ],
    },
  },
  loaders: [mswLoader],
};

export default preview;
