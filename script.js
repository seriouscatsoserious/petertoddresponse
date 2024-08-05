document.addEventListener("DOMContentLoaded", function () {
  const mainContent = document.querySelector(".main-content");
  const sidebar = document.querySelector(".sidebar");
  const SCROLL_OFFSET = -20;

  const settingsToggle = document.getElementById("settings-toggle");
  const settingsButton = document.getElementById("settings-button");
  const settingsMenu = document.getElementById("settings-menu");
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const blurToggle = document.getElementById("blur-toggle");

  const rotateModal = document.getElementById("rotate-modal");
  const rotateOk = document.getElementById("rotate-ok");
  const rotateCancel = document.getElementById("rotate-cancel");
  let modalShown = false;

  // Function to save scroll positions
  function saveScrollPositions() {
    localStorage.setItem("mainContentScrollPos", mainContent.scrollTop);
    localStorage.setItem("sidebarScrollPos", sidebar.scrollTop);
  }

  // Function to restore scroll positions
  function restoreScrollPositions() {
    const savedMainContentScrollPos = localStorage.getItem(
      "mainContentScrollPos"
    );
    const savedSidebarScrollPos = localStorage.getItem("sidebarScrollPos");

    if (savedMainContentScrollPos !== null) {
      mainContent.scrollTop = parseInt(savedMainContentScrollPos);
    }
    if (savedSidebarScrollPos !== null) {
      sidebar.scrollTop = parseInt(savedSidebarScrollPos);
    }
  }

  // Save scroll positions when user scrolls
  mainContent.addEventListener("scroll", saveScrollPositions);
  sidebar.addEventListener("scroll", saveScrollPositions);

  // Save scroll positions when user leaves the page
  window.addEventListener("beforeunload", saveScrollPositions);

  // Restore scroll positions when page loads
  restoreScrollPositions();

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

      // Save scroll positions after programmatic scrolling
      setTimeout(saveScrollPositions, 100);
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

  // Rotation modal functionality
  function checkOrientation() {
    if (
      window.innerWidth <= 768 &&
      window.innerHeight > window.innerWidth &&
      !modalShown
    ) {
      rotateModal.style.display = "block";
      modalShown = true;
    } else {
      rotateModal.style.display = "none";
    }
  }

  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);

  rotateOk.addEventListener("click", function () {
    rotateModal.style.display = "none";
    // You can add code here to encourage rotation, e.g., by showing an animation
    // For now, we'll just log a message
    console.log("User agreed to rotate");
  });

  rotateCancel.addEventListener("click", function () {
    rotateModal.style.display = "none";
    modalShown = true; // Prevent the modal from showing again in this session
  });

  // Initial orientation check
  checkOrientation();
});
