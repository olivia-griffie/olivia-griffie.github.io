/* -----------------------------------------
  Have focus outline only for keyboard users 
 ---------------------------------------- */

const handleFirstTab = (e) => {
  if(e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing')

    window.removeEventListener('keydown', handleFirstTab)
    window.addEventListener('mousedown', handleMouseDownOnce)
  }

}

const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing')

  window.removeEventListener('mousedown', handleMouseDownOnce)
  window.addEventListener('keydown', handleFirstTab)
}

window.addEventListener('keydown', handleFirstTab)

const backToTopButton = document.querySelector(".back-to-top");
let isBackToTopRendered = false;

let alterStyles = (isBackToTopRendered) => {
  if (!backToTopButton) {
    return;
  }

  backToTopButton.style.visibility = isBackToTopRendered ? "visible" : "hidden";
  backToTopButton.style.opacity = isBackToTopRendered ? 1 : 0;
  backToTopButton.style.transform = isBackToTopRendered
    ? "scale(1)"
    : "scale(0)";
};

if (backToTopButton) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 700) {
      isBackToTopRendered = true;
      alterStyles(isBackToTopRendered);
    } else {
      isBackToTopRendered = false;
      alterStyles(isBackToTopRendered);
    }
  });
}

const contactForm = document.querySelector("#contact-form");
const copyButtons = document.querySelectorAll(".copy-btn");
const logoLinks = document.querySelectorAll(".nav__logo-link");
const prototypeOpenButtons = document.querySelectorAll("[data-prototype-open]");
const prototypeCloseButtons = document.querySelectorAll("[data-prototype-close]");
let activePrototypeModal = null;

logoLinks.forEach((link) => {
  const logoVideo = link.querySelector(".nav__logo-video");

  if (!logoVideo) {
    return;
  }

  logoVideo.loop = true;
  logoVideo.preload = "auto";
  logoVideo.muted = true;
  logoVideo.defaultMuted = true;
  logoVideo.load();

  const playLogo = () => {
    link.classList.add("nav__logo-link--playing");
    logoVideo.currentTime = 0;
    const playAttempt = logoVideo.play();

    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {});
    }
  };

  const stopLogo = () => {
    link.classList.remove("nav__logo-link--playing");
    logoVideo.pause();
    logoVideo.currentTime = 0;
  };

  link.addEventListener("mouseenter", playLogo);
  link.addEventListener("mouseleave", stopLogo);
  link.addEventListener("focus", playLogo);
  link.addEventListener("blur", stopLogo);
});

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const originalLabel = button.getAttribute("aria-label") || "Copy";
    const copyValue = button.dataset.copy || "";

    try {
      await navigator.clipboard.writeText(copyValue);
      button.dataset.status = "Copied";
      button.setAttribute("aria-label", "Copied");
      button.setAttribute("title", "Copied");
    } catch (error) {
      button.dataset.status = "Failed";
      button.setAttribute("aria-label", "Failed");
      button.setAttribute("title", "Failed");
    }

    window.setTimeout(() => {
      button.dataset.status = "";
      button.setAttribute("aria-label", originalLabel);
      button.setAttribute("title", originalLabel);
    }, 1400);
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#contact-name")?.value.trim() || "";
    const subject = document.querySelector("#contact-subject")?.value.trim() || "";
    const message = document.querySelector("#contact-message")?.value.trim() || "";
    const emailBody = `Contact Name: ${name}\n\n${message}`;
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent("oewheless@gmail.com")}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    const mailtoUrl = `mailto:oewheless@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    const popup = window.open(gmailComposeUrl, "_blank", "noopener");

    if (!popup) {
      window.location.href = mailtoUrl;
    }
  });
}

const setPrototypeModal = (modal, isOpen) => {
  if (!modal) {
    return;
  }

  modal.classList.toggle("is-open", isOpen);
  modal.setAttribute("aria-hidden", isOpen ? "false" : "true");
  document.body.style.overflow = isOpen ? "hidden" : "";
  activePrototypeModal = isOpen ? modal : null;
};

prototypeOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modalId = button.getAttribute("data-prototype-open");
    const modal = modalId ? document.getElementById(modalId) : null;
    setPrototypeModal(modal, true);
  });
});

prototypeCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".prototype-modal");
    setPrototypeModal(modal, false);
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activePrototypeModal) {
    setPrototypeModal(activePrototypeModal, false);
  }
});
