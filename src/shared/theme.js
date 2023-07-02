import { extendTheme } from "@chakra-ui/react";
import { mode, cssVar, SystemStyleFunction } from "@chakra-ui/theme-tools";

const $arrowBg = cssVar("popper-arrow-bg");
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    special: {
      jeka: "blue",
    },
    gray: {
      jeka: "red",
    },
  },
  components: {
    Tooltip: {
      baseStyle: {
        // ... other styles
        [$arrowBg.variable]: "orange",
      },
    },
  },
  styles: {
    global: {
      "html, body": {
        backgroundColor: "#FFFFFF",
        color: "#333",
        fontFamily: `"Source Sans Pro", Roboto, sans-serif`,
      },
    },
  },
});

export default theme;
