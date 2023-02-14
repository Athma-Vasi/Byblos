import { Global } from "@mantine/core";
import regularSerif from "../../../assets/fonts/Lora-Regular.ttf";
import italicSerif from "../../../assets/fonts/Lora-Italic.ttf";
import boldSerif from "../../../assets/fonts/Lora-Bold.ttf";

function CustomFonts() {
  return (
    <Global
      styles={[
        //serif font: Source Serif Pro
        {
          "@font-face": {
            fontFamily: "Lora",
            fontStyle: "normal",
            fontWeight: 400,
            src: `url(${regularSerif}) format("truetype")`,
          },
        },
        {
          "@font-face": {
            fontFamily: "Lora",
            fontStyle: "italic",
            fontWeight: 400,
            src: `url(${italicSerif}) format("truetype")`,
          },
        },
        {
          "@font-face": {
            fontFamily: "Lora",
            fontStyle: "normal",
            fontWeight: 700,
            src: `url(${boldSerif}) format("truetype")`,
          },
        },
      ]}
    />
  );
}
export { CustomFonts };
