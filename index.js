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

window.trackPortfolioEvent = (action, label) => {
  if (typeof gtag === "function") {
    gtag("event", action, {
      event_category: "portfolio_engagement",
      event_label: label,
    });
  }
};

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
const shareButtons = document.querySelectorAll("[data-share-button]");
const folderButtons = document.querySelectorAll(".folder-btn");
const filePanels = document.querySelectorAll(".file-panel");
const filePath = document.getElementById("file-path");
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
    const isFormspreeConfigured = /formspree\.io\/f\//.test(contactForm.getAttribute("action") || "");

    if (isFormspreeConfigured) {
      return;
    }

    event.preventDefault();

    const name = document.querySelector("#contact-name")?.value.trim() || "";
    const email = document.querySelector("#contact-email")?.value.trim() || "";
    const subject = document.querySelector("#contact-subject")?.value.trim() || "";
    const message = document.querySelector("#contact-message")?.value.trim() || "";
    const emailBody = `Contact Name: ${name}\nEmail Address: ${email}\n\n${message}`;
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent("oewheless@gmail.com")}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    const mailtoUrl = `mailto:oewheless@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    const popup = window.open(gmailComposeUrl, "_blank", "noopener");

    if (!popup) {
      window.location.href = mailtoUrl;
    }
  });
}

const revealSections = document.querySelectorAll(".wire-section");

if (revealSections.length) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  revealSections.forEach((section) => {
    section.classList.add("reveal-section");
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealSections.forEach((section) => {
      section.classList.add("is-visible");
    });
  } else {
    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }
}

if (folderButtons.length && filePath) {
  const fileMap = {
    about: "C:\\OLIVIA\\about_me.txt",
    print: "C:\\OLIVIA\\print_background.txt",
    ux: "C:\\OLIVIA\\ux_ui.txt",
    resume: "C:\\OLIVIA\\resume.pdf",
    contact: "C:\\OLIVIA\\contact.txt",
  };

  folderButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFile = button.dataset.file;
      const selectedPanel = selectedFile ? document.getElementById(`file-${selectedFile}`) : null;

      if (!selectedPanel) {
        return;
      }

      folderButtons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");

      filePanels.forEach((panel) => panel.classList.remove("is-visible"));
      selectedPanel.classList.add("is-visible");

      filePath.textContent = fileMap[selectedFile] || "C:\\OLIVIA\\about_me.txt";

      window.trackPortfolioEvent("desktop_widget_click", selectedFile);
    });
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

shareButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const shareTitle = button.getAttribute("data-share-title") || document.title;
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        button.textContent = "Link copied!";
        window.setTimeout(() => {
          button.textContent = "Share this!";
        }, 1600);
      }
    } catch (error) {
      if (error && error.name === "AbortError") {
        return;
      }

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          button.textContent = "Link copied!";
          window.setTimeout(() => {
            button.textContent = "Share this!";
          }, 1600);
        } catch (clipboardError) {
          button.textContent = "Share unavailable";
          window.setTimeout(() => {
            button.textContent = "Share this!";
          }, 1600);
        }
      }
    }
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activePrototypeModal) {
    setPrototypeModal(activePrototypeModal, false);
  }
});
