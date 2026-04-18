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

const normalizeAnalyticsLabel = (value) => {
  return (value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_:/#.-]/g, "");
};

const getClickableLabel = (element) => {
  if (!element) {
    return "";
  }

  const href = element.getAttribute("href");
  const explicitLabel =
    element.getAttribute("data-analytics-label") ||
    element.getAttribute("aria-label") ||
    element.getAttribute("title");
  const textLabel = element.textContent || "";

  return normalizeAnalyticsLabel(explicitLabel || textLabel || href || element.tagName || "click_target");
};

if (typeof gtag === "function") {
  gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.hash}`,
  });
}

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
    const statusEl = button.parentElement
      ? button.parentElement.querySelector(".copy-status")
      : null;

    try {
      await navigator.clipboard.writeText(copyValue);
      button.dataset.status = "Copied";
      button.setAttribute("aria-label", "Copied");
      button.setAttribute("title", "Copied");
      if (statusEl) statusEl.textContent = "Copied!";
    } catch (error) {
      button.dataset.status = "Failed";
      button.setAttribute("aria-label", "Failed to copy");
      button.setAttribute("title", "Failed to copy");
      if (statusEl) statusEl.textContent = "Failed to copy";
    }

    window.setTimeout(() => {
      button.dataset.status = "";
      button.setAttribute("aria-label", originalLabel);
      button.setAttribute("title", originalLabel);
      if (statusEl) statusEl.textContent = "";
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
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent("griffiedesign@gmail.com")}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    const mailtoUrl = `mailto:griffiedesign@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    const popup = window.open(gmailComposeUrl, "_blank", "noopener");

    if (!popup) {
      window.location.href = mailtoUrl;
    }
  });
}

const revealSections = document.querySelectorAll(".wire-section");
const isCaseStudyPage = Boolean(document.querySelector(".case-study"));

if (revealSections.length) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!isCaseStudyPage) {
    revealSections.forEach((section) => {
      section.classList.add("reveal-section");
    });
  }

  if (isCaseStudyPage || prefersReducedMotion || !("IntersectionObserver" in window)) {
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

document.addEventListener("click", (event) => {
  const clickable = event.target.closest("a[href], button");

  if (!clickable || clickable.disabled) {
    return;
  }

  const isAnchor = clickable.matches("a[href]");
  const action = isAnchor ? "link_click" : "button_click";
  const destination = isAnchor ? clickable.getAttribute("href") || "" : clickable.id || clickable.className || "button";

  window.trackPortfolioEvent(action, getClickableLabel(clickable));

  if (typeof gtag === "function") {
    gtag("event", action, {
      event_category: "portfolio_navigation",
      event_label: getClickableLabel(clickable),
      link_url: destination,
      page_path: `${window.location.pathname}${window.location.hash}`,
    });
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activePrototypeModal) {
    setPrototypeModal(activePrototypeModal, false);
  }
});

const focusModeBtn = document.getElementById("focus-mode-toggle");
const focusChat = document.getElementById("focus-chat");
const focusChatMessages = document.getElementById("focus-chat-messages");
const focusChatReplies = document.getElementById("focus-chat-replies");
const focusChatClose = document.getElementById("focus-chat-close");

const chatResponses = {
  intro: "Hi! I'm a quick summary of Olivia's portfolio. Tap a question below to learn more.",
  overview: {
    q: "Overview",
    a: "Olivia is a UX/UI designer with 10+ years across print and web. She designs interfaces, builds brand identities, and writes the front-end code behind them. She's currently open to full-time remote roles."
  },
  tools: {
    q: "Tools & stack",
    a: "Figma is her primary design tool. On the dev side she works in HTML, CSS, JavaScript, and GitHub. For print she uses InDesign, Illustrator, and Photoshop."
  },
  work: {
    q: "What has she built?",
    a: "Recent work includes Book Buddy (an Electron writing app she designed and built end-to-end), Architect Mini (a web-to-print card builder widget), and Burgermeister (a branded eCommerce demo storefront for Devia Software). She's also done brand identity work for clients like Shenandoah Sovereign."
  },
  available: {
    q: "Is she available?",
    a: "Yes — Olivia is actively looking for full-time remote roles. She's also open to freelance and contract work. You can reach her through the contact form on this page or directly at griffiedesign@gmail.com."
  },
  schedule: {
    q: "Schedule a call",
    a: null
  }
};

let chatReady = false;

const addChatMessage = (text, type, withTyping) => {
  if (!focusChatMessages) return;

  if (type === "assistant" && withTyping) {
    const typing = document.createElement("div");
    typing.className = "focus-chat__message focus-chat__message--assistant focus-chat__message--typing";
    typing.innerHTML = "<span></span>";
    focusChatMessages.appendChild(typing);
    focusChatMessages.scrollTop = focusChatMessages.scrollHeight;

    window.setTimeout(() => {
      typing.remove();
      const msg = document.createElement("div");
      msg.className = "focus-chat__message focus-chat__message--assistant";
      msg.textContent = text;
      focusChatMessages.appendChild(msg);
      focusChatMessages.scrollTop = focusChatMessages.scrollHeight;
    }, 900);
  } else {
    const msg = document.createElement("div");
    msg.className = `focus-chat__message focus-chat__message--${type}`;
    msg.textContent = text;
    focusChatMessages.appendChild(msg);
    focusChatMessages.scrollTop = focusChatMessages.scrollHeight;
  }
};

const openChat = () => {
  if (!focusChat) return;
  focusChat.removeAttribute("hidden");
  if (!chatReady) {
    chatReady = true;
    window.setTimeout(() => addChatMessage(chatResponses.intro, "assistant", true), 300);
  }
};

const closeChat = () => {
  if (!focusChat) return;
  focusChat.setAttribute("hidden", "");
};

const resetChat = () => {
  chatReady = false;
  if (focusChatMessages) focusChatMessages.innerHTML = "";
  if (focusChatReplies) {
    focusChatReplies.querySelectorAll(".focus-chat__reply").forEach((btn) => {
      btn.disabled = false;
    });
  }
};

if (focusChatClose) {
  focusChatClose.addEventListener("click", closeChat);
}

const injectScheduleForm = () => {
  if (!focusChatMessages) return;

  const wrapper = document.createElement("div");
  wrapper.className = "focus-chat__message focus-chat__message--assistant focus-chat__schedule-form";
  wrapper.innerHTML = `
    <p style="margin:0 0 0.8rem;font-size:1.3rem;">Fill this out and I'll send Olivia the request!</p>
    <form id="schedule-call-form" action="https://formspree.io/f/mnjobdyp" method="POST">
      <input type="hidden" name="_subject" value="Call Request from Portfolio Assistant" />
      <input type="hidden" name="source" value="Portfolio Assistant — Schedule a Call" />
      <div class="schedule-form__field">
        <label for="schedule-name">Your name</label>
        <input id="schedule-name" name="name" type="text" placeholder="First and last name" required autocomplete="name" />
      </div>
      <div class="schedule-form__field">
        <label for="schedule-email">Your email</label>
        <input id="schedule-email" name="email" type="email" placeholder="you@email.com" required autocomplete="email" />
      </div>
      <div class="schedule-form__field">
        <label for="schedule-time">Preferred time</label>
        <input id="schedule-time" name="preferred_time" type="text" placeholder="e.g. Tues/Thurs afternoons ET" />
      </div>
      <div class="schedule-form__field">
        <label for="schedule-note">Quick note (optional)</label>
        <textarea id="schedule-note" name="message" rows="2" placeholder="What's on your mind?"></textarea>
      </div>
      <button type="submit" class="schedule-form__submit">Send Request</button>
      <p class="schedule-form__status" aria-live="polite"></p>
    </form>
  `;
  focusChatMessages.appendChild(wrapper);
  focusChatMessages.scrollTop = focusChatMessages.scrollHeight;

  const form = wrapper.querySelector("#schedule-call-form");
  const status = wrapper.querySelector(".schedule-form__status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector(".schedule-form__submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (res.ok) {
        form.innerHTML = "";
        status.textContent = "Request sent! Olivia will be in touch soon.";
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Request";
        status.textContent = "Something went wrong — please try again.";
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Request";
      status.textContent = "Something went wrong — please try again.";
    }
    focusChatMessages.scrollTop = focusChatMessages.scrollHeight;
  });
};

if (focusChatReplies) {
  focusChatReplies.addEventListener("click", (e) => {
    const btn = e.target.closest(".focus-chat__reply");
    if (!btn || btn.disabled) return;
    const key = btn.dataset.reply;
    const data = chatResponses[key];
    if (!data) return;
    btn.disabled = true;
    addChatMessage(data.q, "user", false);
    if (key === "schedule") {
      window.setTimeout(() => injectScheduleForm(), 600);
    } else {
      window.setTimeout(() => addChatMessage(data.a, "assistant", true), 200);
    }
  });
}

if (focusModeBtn) {
  focusModeBtn.addEventListener("click", () => {
    const isActive = document.body.classList.toggle("focus-mode");
    focusModeBtn.setAttribute("aria-pressed", String(isActive));
    if (isActive) {
      openChat();
    } else {
      closeChat();
      resetChat();
    }
  });
}
