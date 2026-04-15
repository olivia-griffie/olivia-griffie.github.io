export const initKeyboardMode = () => {
  const handleMouseDownOnce = () => {
    document.body.classList.remove("user-is-tabbing");
    window.removeEventListener("mousedown", handleMouseDownOnce);
    window.addEventListener("keydown", handleFirstTab);
  };

  const handleFirstTab = (event) => {
    if (event.key !== "Tab") {
      return;
    }

    document.body.classList.add("user-is-tabbing");
    window.removeEventListener("keydown", handleFirstTab);
    window.addEventListener("mousedown", handleMouseDownOnce);
  };

  window.addEventListener("keydown", handleFirstTab);
};
