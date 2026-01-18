import { handleText } from "./handleText.js";

function handleCallback() {
  const popup = window.open("/auth/twitch", "TwitchAuth", "width=600,height=700");
  window.addEventListener("message", handleAuthMessage, false);

  const interval = setInterval(() => {
    if (popup.closed) {
      clearInterval(interval);
      window.removeEventListener("message", handleAuthMessage);
    }
  }, 1000);
}

function handleAuthMessage(event) {
  if (event.origin !== window.location.origin) {
    return;
  }

  if (event.data.type === "TWITCH_AUTH_SUCCESS") {
    const { code, login } = event.data;

    if (login && code) {
      localStorage.setItem("_code", code);
      localStorage.setItem("_login", login);
      handleText();
    }
  }
}

export { handleCallback };
