export function handleText() {
  const loginButton = document.querySelector(".nav-auth__link");
  if (!loginButton) return;

  const textSpan = loginButton.querySelector(".nav-auth__text");
  const svgIcon = loginButton.querySelector(".nav-auth__icon");

  const username = localStorage.getItem("_username");
  const displayName = localStorage.getItem("_displayName");
  const profileImage = localStorage.getItem("_profileImage");

  const mqText = window.matchMedia("(max-width: 1400px)");
  const mqIcon = window.matchMedia("(max-width: 1200px)");

  const violet = "138, 43, 226";

  Object.assign(loginButton.style, {
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    willChange: "transform, box-shadow",
  });

  loginButton.addEventListener("mouseenter", () => {
    loginButton.style.transform = "translateY(-1px)";
    loginButton.style.boxShadow = `0 6px 16px rgba(${violet}, 0.35)`;
  });

  loginButton.addEventListener("mouseleave", () => {
    loginButton.style.transform = "translateY(0)";
    loginButton.style.boxShadow = "none";
  });

  loginButton.addEventListener("mousedown", () => {
    loginButton.style.transform = "translateY(1px)";
    loginButton.style.boxShadow = `0 3px 8px rgba(${violet}, 0.25)`;
  });

  loginButton.addEventListener("mouseup", () => {
    loginButton.style.transform = "translateY(-1px)";
    loginButton.style.boxShadow = `0 6px 16px rgba(${violet}, 0.35)`;
  });

  loginButton.addEventListener("focus", () => {
    loginButton.style.boxShadow = `0 0 0 2px rgba(${violet}, 0.45)`;
  });

  loginButton.addEventListener("blur", () => {
    loginButton.style.boxShadow = "none";
  });

  function render() {
    const compactText = mqText.matches;
    const hideIcon = mqIcon.matches;

    if (!username) {
      textSpan.textContent = compactText ? "Login" : "Login with Twitch";

      if (svgIcon) {
        svgIcon.style.display = hideIcon ? "none" : "inline-flex";
      }

      return;
    }

    if (svgIcon) svgIcon.style.display = "none";

    if (profileImage) {
      textSpan.innerHTML = `
        <img src="${profileImage}"
             alt="${username}"
             style="
               width:30px;
               height:30px;
               border-radius:50%;
               margin-right:6px;
               vertical-align:middle;
             ">
        <span style="font-weight:600;">
          ${displayName || username}
        </span>
      `;
    } else {
      textSpan.textContent = displayName || username;
    }
  }

  render();

  mqText.addEventListener("change", render);
  mqIcon.addEventListener("change", render);
}
