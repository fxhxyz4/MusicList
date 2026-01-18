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

async function handleAuthMessage(event) {
  if (event.origin !== window.location.origin) {
    return;
  }

  if (event.data.type === "TWITCH_AUTH_SUCCESS") {
    const { code, login } = event.data;

    if (login && code) {
      try {
        const response = await fetch('/auth/twitch/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        const userData = await response.json();

        if (userData.username) {
          localStorage.setItem("_code", code);
          localStorage.setItem("_login", "true");

          localStorage.setItem("_username", userData.username);
          localStorage.setItem("_displayName", userData.displayName);

          localStorage.setItem("_profileImage", userData.profileImage);
          handleText();
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    }
  }
}

export { handleCallback };
