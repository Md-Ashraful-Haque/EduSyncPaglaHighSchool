import maximize from '../assets/04-section/01-dashboard/assets/img/maximize.svg'
import minimize from '../assets/04-section/01-dashboard/assets/img/minimize.svg'

import { useEffect, useState } from "react";

const FullScreenToggle = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Function to toggle fullscreen mode
  const handleFullScreen = () => {
    const element = document.documentElement;
    if (!isFullScreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Function to handle fullscreen state changes
  const handleFullscreenChange = () => {
    const isFull = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
    setIsFullScreen(isFull);

    // Run your custom command here
    if (isFull) {
      console.log("The window is now in fullscreen mode.");
    } else {
      console.log("The window has exited fullscreen mode.");
    }
  };

  useEffect(() => {
    // Attach event listeners for fullscreen changes
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // Cleanup listeners on component unmount
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      className="menu-item"
      onClick={handleFullScreen}
      style={{ cursor: "pointer" }}
    >
      <img
        src={isFullScreen ? minimize : maximize  }
        alt={isFullScreen ? "Minimize" : "Maximize"}
      />
    </div>
  );
};

export default FullScreenToggle;
