import { Global } from "@mantine/core";
import regularSerif from "../../../assets/fonts/Lora-Regular.ttf";
import italicSerif from "../../../assets/fonts/Lora-Italic.ttf";
import boldSerif from "../../../assets/fonts/Lora-Bold.ttf";
import regularSans from "../../../assets/fonts/WorkSans-Regular.ttf";
import italicSans from "../../../assets/fonts/WorkSans-Italic.ttf";
import boldSans from "../../../assets/fonts/WorkSans-Bold.ttf";

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

        //sans-serif font: Work Sans
        {
          "@font-face": {
            fontFamily: "Work Sans",
            fontStyle: "normal",
            fontWeight: 400,
            src: `url(${regularSans}) format("truetype")`,
          },
        },
        {
          "@font-face": {
            fontFamily: "Work Sans",
            fontStyle: "italic",
            fontWeight: 400,
            src: `url(${italicSans}) format("truetype")`,
          },
        },
        {
          "@font-face": {
            fontFamily: "Work Sans",
            fontStyle: "normal",
            fontWeight: 700,
            src: `url(${boldSans}) format("truetype")`,
          },
        },
      ]}
    />
  );
}
export { CustomFonts };
