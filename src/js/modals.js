export const initModalShell = () => {
  const modalButtons = document.querySelectorAll("[data-prototype-open]");
  if (!modalButtons.length) {
    return;
  }

  document.documentElement.classList.add("has-prototype-modals");
};
