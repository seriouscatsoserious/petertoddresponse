document.addEventListener("DOMContentLoaded", function () {
  const mainContent = document.querySelector(".main-content");
  const sidebar = document.querySelector(".sidebar");
  const SCROLL_OFFSET = -20;

  const settingsToggle = document.getElementById("settings-toggle");
  const settingsButton = document.getElementById("settings-button");
  const settingsMenu = document.getElementById("settings-menu");
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const blurToggle = document.getElementById("blur-toggle");

  // Highlight click functionality
  document.querySelectorAll(".highlight").forEach((highlight) => {
    highlight.addEventListener("click", (e) => {
      const critiqueId = e.target.dataset.critique;
      const critiqueTarget = document.getElementById(critiqueId);

      document.querySelectorAll(".critique-target").forEach((target) => {
        target.classList.remove("active-critique");
      });

      critiqueTarget.classList.add("active-critique");

      const isMobileVertical =
        window.innerWidth <= 768 && window.innerHeight > window.innerWidth;

      if (isMobileVertical) {
        sidebar.scrollTop = critiqueTarget.offsetTop - sidebar.offsetTop;
      } else {
        const clickedRect = e.target.getBoundingClientRect();
        const mainContentRect = mainContent.getBoundingClientRect();
        const relativeClickPosition = clickedRect.top - mainContentRect.top;

        const critiqueRect = critiqueTarget.getBoundingClientRect();
        const sidebarRect = sidebar.getBoundingClientRect();
        const scrollPosition =
          sidebar.scrollTop +
          critiqueRect.top -
          sidebarRect.top -
          relativeClickPosition -
          SCROLL_OFFSET;

        sidebar.scrollTo({
          top: Math.max(0, scrollPosition),
          behavior: "smooth",
        });
      }
    });
  });

  // Settings toggle functionality
  settingsButton.addEventListener("click", function (event) {
    event.stopPropagation();
    settingsMenu.style.display =
      settingsMenu.style.display === "block" ? "none" : "block";
  });

  darkModeToggle.addEventListener("change", function () {
    document.body.classList.toggle("dark-mode");
    if (settingsMenu.style.display === "block") {
      settingsMenu.style.display = "none";
      setTimeout(() => {
        settingsMenu.style.display = "block";
      }, 0);
    }
  });

  // Updated blur toggle functionality
  blurToggle.addEventListener("change", function () {
    document.querySelectorAll(".critique-target").forEach((target) => {
      if (this.checked) {
        target.classList.add("blur-effect");
      } else {
        target.classList.remove("blur-effect");
      }
    });
  });

  // Close settings menu when clicking outside
  document.addEventListener("click", function (event) {
    if (!settingsToggle.contains(event.target)) {
      settingsMenu.style.display = "none";
    }
  });
});
