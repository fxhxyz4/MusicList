export function handleText() {
  const loginButton = document.querySelector(".nav-auth__link");
  if (!loginButton) return;

  const textSpan = loginButton.querySelector(".nav-auth__text");

  const username = localStorage.getItem("_username");
  const displayName = localStorage.getItem("_displayName");
  const profileImage = localStorage.getItem("_profileImage");

  const mq = window.matchMedia("(max-width: 1400px)");

  function renderText() {
    const isCompact = mq.matches;

    if (!username) {
      textSpan.textContent = isCompact ? "Login" : "Login with Twitch";
      return;
    }

    if (isCompact) {
      textSpan.textContent = "Login";
      return;
    }

    if (profileImage) {
      textSpan.innerHTML = `
        <img src="${profileImage}"
             alt="${username}"
             style="
               width:20px;
               height:20px;
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

  renderText();

  mq.addEventListener("change", renderText);
}
