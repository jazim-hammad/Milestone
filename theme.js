document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");

  function updateTheme() {
    document.body.classList.toggle("dark-theme");
  }

  themeToggle.addEventListener("change", updateTheme);

  // Function to create a trail element
  function createTrailElement(x, y) {
    const trail = document.createElement("div");
    trail.classList.add("cursor-trail");
    // Add the appropriate class based on the current theme
    if (document.body.classList.contains("dark-theme")) {
      trail.classList.add("dark-mode-trail");
    } else {
      trail.classList.add("light-mode-trail");
    }
    trail.style.left = `${x}px`;
    trail.style.top = `${y}px`;
    document.body.appendChild(trail);

    // Remove the trail element after the animation ends
    trail.addEventListener("animationend", () => {
      trail.remove();
    });
  }

  // Track cursor movement and create trail elements
  document.addEventListener("mousemove", (e) => {
    createTrailElement(e.clientX, e.clientY);
  });

  // Initialize the correct theme on page load
  if (themeToggle.checked) {
    document.body.classList.add("dark-theme");
  }
});
