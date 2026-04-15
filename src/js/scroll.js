export const initScrollEffects = () => {
  const revealSections = document.querySelectorAll(".wire-section");
  if (!revealSections.length) {
    return;
  }

  revealSections.forEach((section) => {
    section.classList.add("is-visible");
  });
};
