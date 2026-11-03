// ---------------------------------------------------------
// Language switch (Arabic <-> English)
// ---------------------------------------------------------

const page = document.documentElement;
const languageButton = document.getElementById("language-button");

const pageTitles = {
  ar: "شركة معاذ السلمي",
  en: "AlSolmi Chartered Accountants & Consultants",
};

function setLanguage(language) {
  page.lang = language;
  page.dir = language === "ar" ? "rtl" : "ltr";

  // Swap every translated piece of text
  document.querySelectorAll(`[data-${language}]`).forEach((element) => {
    element.innerHTML = element.dataset[language];
  });

  languageButton.textContent = language === "ar" ? "English" : "العربية";
  document.title = pageTitles[language];

  // Remember the choice for the next visit (ignored if the browser blocks it)
  try {
    localStorage.setItem("language", language);
  } catch (error) {}
}

function getSavedLanguage() {
  try {
    return localStorage.getItem("language") || "ar";
  } catch (error) {
    return "ar";
  }
}

languageButton.addEventListener("click", () => {
  setLanguage(page.lang === "ar" ? "en" : "ar");
});

setLanguage(getSavedLanguage());


// ---------------------------------------------------------
// Copy buttons (phone number and email)
// ---------------------------------------------------------

function showCopiedMessage(button) {
  button.textContent = page.lang === "ar" ? "تم النسخ" : "Copied";

  setTimeout(() => {
    button.textContent = button.dataset[page.lang];
  }, 1800);
}

// If copying is blocked, highlight the text so the visitor can copy it by hand
function selectText(elementId) {
  const range = document.createRange();
  range.selectNodeContents(document.getElementById(elementId));

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function setUpCopyButton(buttonId, textToCopy, textElementId) {
  const button = document.getElementById(buttonId);

  button.addEventListener("click", () => {
    try {
      navigator.clipboard.writeText(textToCopy).then(
        () => showCopiedMessage(button),
        () => selectText(textElementId)
      );
    } catch (error) {
      selectText(textElementId);
    }
  });
}

setUpCopyButton("copy-button", "+966550455405", "phone-number");
setUpCopyButton("copy-email-button", "info@alsolmicpa.com", "email-address");

// ---------------------------------------------------------
// Message form
// ---------------------------------------------------------

const messageForm = document.getElementById("message-form");
const formStatus = document.getElementById("form-status");
const fields = messageForm.elements;
const companyEmail = "info@alsolmicpa.com";

const formMessages = {
  missing: {
    ar: "اكتب اسمك وإيميلك ورسالتك قبل الإرسال.",
    en: "Please enter your name, email address and message.",
  },
  badEmail: {
    ar: "الإيميل غير صحيح، تأكد منه.",
    en: "Please enter a valid email address.",
  },
  opening: {
    ar: "جهّزنا رسالتك في برنامج البريد. اضغط إرسال هناك. وإذا ما فتح، راسلنا على " + companyEmail,
    en: "Your message is ready in your email app. Please press Send to deliver it. If the app did not open, email us at " + companyEmail,
  },
};

function showFormStatus(key) {
  formStatus.textContent = formMessages[key][page.lang];
}

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = fields.name.value.trim();
  const company = fields.company.value.trim();
  const email = fields.email.value.trim();
  const phone = fields.phone.value.trim();
  const message = fields.message.value.trim();

  if (!name || !email || !message) {
    showFormStatus("missing");
    return;
  }

  if (!fields.email.checkValidity()) {
    showFormStatus("badEmail");
    return;
  }

  const subject = "استفسار من الموقع / Website inquiry: " + name;
  const body = [
    "الاسم / Name: " + name,
    company ? "المنشأة / Company: " + company : "",
    "الإيميل / Email: " + email,
    phone ? "الجوال / Mobile: " + phone : "",
    "",
    message,
  ].filter((line, index) => line !== "" || index === 4).join("\n");

  window.location.href =
    "mailto:" + companyEmail +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(body);

  showFormStatus("opening");
});

// ---------------------------------------------------------
// Phone menu
// ---------------------------------------------------------

const menuButton = document.getElementById("menu-button");
const menuLinks = document.getElementById("menu-links");

function setMenuOpen(isOpen) {
  menuLinks.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
}

menuButton.addEventListener("click", () => {
  setMenuOpen(!menuLinks.classList.contains("is-open"));
});

// Close the menu after choosing a section
menuLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});
