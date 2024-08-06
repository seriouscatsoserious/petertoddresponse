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
  const rotateIcon = document.querySelector(".rotate-icon");
  let modalShown = false;

  function saveScrollPositions() {
    localStorage.setItem("mainContentScrollPos", mainContent.scrollTop);
    localStorage.setItem("sidebarScrollPos", sidebar.scrollTop);
  }

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

  mainContent.addEventListener("scroll", saveScrollPositions);
  sidebar.addEventListener("scroll", saveScrollPositions);

  window.addEventListener("beforeunload", saveScrollPositions);

  restoreScrollPositions();

  function modifyRGBA(rgba, opacity) {
    const values = rgba.match(/[\d.]+/g);
    if (values && values.length >= 3) {
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${opacity})`;
    }
    return rgba;
  }

  function setActiveStyle(element, isActive) {
    const currentBg = element.style.backgroundColor;
    if (isActive) {
      element.style.backgroundColor = modifyRGBA(currentBg, 0.6);
      element.classList.add("active-critique");
    } else {
      element.style.backgroundColor = modifyRGBA(currentBg, 0.2);
      element.classList.remove("active-critique");
    }
  }
  function handleCritiqueClick(e) {
    const critiqueId = e.currentTarget.id;
    const highlightElement = document.querySelector(
      `.highlight[data-critique="${critiqueId}"]`
    );

    document
      .querySelectorAll(".critique-target, .highlight")
      .forEach((element) => {
        setActiveStyle(element, false);
      });

    setActiveStyle(e.currentTarget, true);
    if (highlightElement) {
      setActiveStyle(highlightElement, true);

      const isMobileVertical =
        window.innerWidth <= 768 && window.innerHeight > window.innerWidth;

      if (isMobileVertical) {
        // Mobile scrolling logic (unchanged)
      } else {
        const mainContentRect = mainContent.getBoundingClientRect();
        const highlightRect = highlightElement.getBoundingClientRect();
        const critiqueRect = e.currentTarget.getBoundingClientRect();
        const sidebarRect = sidebar.getBoundingClientRect();

        // Calculate the position relative to the top of the sidebar
        const relativePosition = critiqueRect.top - sidebarRect.top;

        // Add an additional offset to lower the highlight position
        const additionalOffset = mainContentRect.height * 0.1; // Adjust this value as needed

        const scrollPosition =
          mainContent.scrollTop +
          highlightRect.top -
          mainContentRect.top -
          relativePosition +
          SCROLL_OFFSET;

        mainContent.scrollTo({
          top: Math.max(0, scrollPosition),
          behavior: "smooth",
        });
      }

      setTimeout(saveScrollPositions, 100);
    }
  }

  document.querySelectorAll(".critique-target").forEach((critique) => {
    critique.addEventListener("click", handleCritiqueClick);
  });

  document.querySelectorAll(".highlight").forEach((highlight) => {
    highlight.addEventListener("click", (e) => {
      const critiqueId = e.target.dataset.critique;
      const critiqueTarget = document.getElementById(critiqueId);

      document
        .querySelectorAll(".critique-target, .highlight")
        .forEach((element) => {
          setActiveStyle(element, false);
        });

      setActiveStyle(e.target, true);
      if (critiqueTarget) {
        setActiveStyle(critiqueTarget, true);

        const isMobileVertical =
          window.innerWidth <= 768 && window.innerHeight > window.innerWidth;

        if (isMobileVertical) {
          const mainContent = document.querySelector(".main-content");
          const header = document.querySelector("header");

          const headerHeight = header ? header.offsetHeight : 0;
          const mainContentHeight = mainContent.offsetHeight;
          const critiqueTopPosition =
            critiqueTarget.getBoundingClientRect().top + window.pageYOffset;

          const desiredScrollPosition =
            critiqueTopPosition - headerHeight - mainContentHeight;

          window.scrollTo({
            top: Math.max(0, desiredScrollPosition),
            behavior: "smooth",
          });
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

        setTimeout(saveScrollPositions, 100);
      }
    });
  });

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
  blurToggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("blur-active");
    } else {
      document.body.classList.remove("blur-active");
    }
    saveSettings();
  });

  document.addEventListener("click", function (event) {
    if (!settingsToggle.contains(event.target)) {
      settingsMenu.style.display = "none";
    }
  });

  function checkOrientation() {
    if (
      window.innerWidth <= 768 &&
      window.innerHeight > window.innerWidth &&
      !modalShown
    ) {
      rotateModal.style.display = "block";
      setTimeout(() => {
        rotateModal.style.opacity = "1";
      }, 10);
      modalShown = true;
    } else {
      rotateModal.style.display = "none";
      rotateModal.style.opacity = "0";
    }
  }

  window.addEventListener("load", checkOrientation);
  window.addEventListener("resize", checkOrientation);

  rotateOk.addEventListener("click", () => {
    rotateModal.style.opacity = "0";
    setTimeout(() => {
      rotateModal.style.display = "none";
    }, 300);
  });

  rotateCancel.addEventListener("click", () => {
    rotateModal.style.opacity = "0";
    setTimeout(() => {
      rotateModal.style.display = "none";
    }, 300);
  });

  let rotationInterval;

  function startRotation() {
    rotationInterval = setInterval(() => {
      rotateIcon.style.animation = "rotate 2s linear infinite";
    }, 100);
  }

  function stopRotation() {
    clearInterval(rotationInterval);
    rotateIcon.style.animation = "none";
  }

  rotateModal.addEventListener("mouseenter", startRotation);
  rotateModal.addEventListener("mouseleave", stopRotation);
  rotateModal.addEventListener("touchstart", startRotation);
  rotateModal.addEventListener("touchend", stopRotation);

  function loadSavedSettings() {
    const savedDarkMode = localStorage.getItem("darkMode");
    const savedBlurEffect = localStorage.getItem("blurEffect");

    if (savedDarkMode === "true") {
      darkModeToggle.checked = true;
      document.body.classList.add("dark-mode");
    }

    // Set blur on by default if there's no saved setting
    if (savedBlurEffect === null || savedBlurEffect === "true") {
      blurToggle.checked = true;
      document.body.classList.add("blur-active");
    } else {
      blurToggle.checked = false;
      document.body.classList.remove("blur-active");
    }
  }

  function saveSettings() {
    localStorage.setItem("darkMode", darkModeToggle.checked);
    localStorage.setItem("blurEffect", blurToggle.checked);
  }

  darkModeToggle.addEventListener("change", saveSettings);
  blurToggle.addEventListener("change", saveSettings);

  loadSavedSettings();
});
