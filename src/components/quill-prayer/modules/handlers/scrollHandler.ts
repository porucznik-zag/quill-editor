export const createScrollHandler = () => {
  let scrollTimeout: NodeJS.Timeout;

  const hideDeleteButtons = () => {
    const existingButtons = document.querySelectorAll(
      ".prayer-line-delete-btn-overlay"
    );
    existingButtons.forEach((btn) => {
      btn.classList.remove("visible");
      // Remove button after animation
      setTimeout(() => {
        btn.remove();
      }, 300);
    });
  };

  const handleScroll = () => {
    // Hide delete buttons immediately when scrolling starts
    hideDeleteButtons();

    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Set new timeout to allow interactions again after scroll stops
    scrollTimeout = setTimeout(() => {
      // Scroll has stopped, interactions are allowed again
    }, 150);
  };

  const addScrollListener = (element: HTMLElement) => {
    element.addEventListener("scroll", handleScroll, { passive: true });
    // Also listen to parent containers that might scroll
    window.addEventListener("scroll", handleScroll, { passive: true });
  };

  const removeScrollListener = (element: HTMLElement) => {
    element.removeEventListener("scroll", handleScroll);
    window.removeEventListener("scroll", handleScroll);

    // Clean up timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
  };

  return {
    addScrollListener,
    removeScrollListener,
    hideDeleteButtons,
  };
};
