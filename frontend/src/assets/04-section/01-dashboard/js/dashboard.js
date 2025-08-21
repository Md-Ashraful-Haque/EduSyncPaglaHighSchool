document.addEventListener("DOMContentLoaded", function () {
  // Get references to the buttons
  const maximizeBtn = document.getElementById("maximize-btn");
  const minimizeBtn = document.getElementById("minimize-btn");

  // The element you want to make fullscreen
  const contentWindow = document.documentElement;

  // Enter Fullscreen Mode
  maximizeBtn.addEventListener("click", function () {
      if (contentWindow.requestFullscreen) {
          contentWindow.requestFullscreen();
      } else if (contentWindow.webkitRequestFullscreen) { /* Safari */
          contentWindow.webkitRequestFullscreen();
      } else if (contentWindow.msRequestFullscreen) { /* IE11 */
          contentWindow.msRequestFullscreen();
      }

      // Show the minimize button, hide the maximize button
      maximizeBtn.classList.add("hidden");
      minimizeBtn.classList.remove("hidden");
  });

  // Exit Fullscreen Mode
  minimizeBtn.addEventListener("click", function () {
      if (document.exitFullscreen) {
          document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
          document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
          document.msExitFullscreen();
      }

      // Show the maximize button, hide the minimize button
      minimizeBtn.classList.add("hidden");
      maximizeBtn.classList.remove("hidden");
  });

  // Listen for the fullscreenchange event
  document.addEventListener("fullscreenchange", function () {
      if (!document.fullscreenElement) {
          // Fullscreen is exited
          minimizeBtn.classList.add("hidden");
          maximizeBtn.classList.remove("hidden");
      }
  });

  // For Safari support (Webkit-specific event)
  document.addEventListener("webkitfullscreenchange", function () {
      if (!document.webkitFullscreenElement) {
          // Fullscreen is exited
          minimizeBtn.classList.add("hidden");
          maximizeBtn.classList.remove("hidden");
      }
  });
});
