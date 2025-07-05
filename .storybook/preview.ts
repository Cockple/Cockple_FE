import type { Preview } from "@storybook/react";
import "../src/index.css"; 

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: {
        iphone13mini: {
          name: "iPhone 13 mini",
          styles: {
            width: "375px",
            height: "812px",
          },
          type: "mobile",
        },
      },
      defaultViewport: "iphone13mini",
    },
  },
};

export default preview;
