document.addEventListener("DOMContentLoaded", function () {
  const mainContent = document.querySelector(".main-content");
  const sidebar = document.querySelector(".sidebar");
  const SCROLL_OFFSET = -20; // Pixels to offset the scroll position

  document.querySelectorAll(".highlight").forEach((highlight) => {
    highlight.addEventListener("click", (e) => {
      const critiqueId = e.target.dataset.critique;
      const critiqueTarget = document.getElementById(critiqueId);

      document.querySelectorAll(".critique-target").forEach((target) => {
        target.classList.remove("active-critique");
      });

      // Remove and re-add the class to restart the animation
      critiqueTarget.classList.remove("active-critique");
      void critiqueTarget.offsetWidth; // Trigger reflow
      critiqueTarget.classList.add("active-critique");

      // Calculate the relative position of the clicked element
      const clickedRect = e.target.getBoundingClientRect();
      const mainContentRect = mainContent.getBoundingClientRect();
      const relativeClickPosition = clickedRect.top - mainContentRect.top;

      // Calculate the position to scroll to in the sidebar
      const critiqueRect = critiqueTarget.getBoundingClientRect();
      const sidebarRect = sidebar.getBoundingClientRect();
      const scrollPosition =
        sidebar.scrollTop +
        critiqueRect.top -
        sidebarRect.top -
        relativeClickPosition -
        SCROLL_OFFSET;

      // Scroll the sidebar
      sidebar.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: "smooth",
      });
    });
  });
});
