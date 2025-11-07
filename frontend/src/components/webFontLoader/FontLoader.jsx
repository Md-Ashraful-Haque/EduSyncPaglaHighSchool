import { useEffect } from "react";
import WebFont from "webfontloader";

const FontLoader = () => {
  useEffect(() => {
    WebFont.load({
      google: {
        families: [
          "Open+Sans:400,600,700",
          "Muli:900,600,400,700,300,400,500,600,700",
        ],
      },
    });
  }, []);

  return null; // This component doesn't render anything
};

export default FontLoader;
