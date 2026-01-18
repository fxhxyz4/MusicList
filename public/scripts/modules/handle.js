import { handleText } from "./handleText.js";

function handleCallback() {
  console.log('🔵 Opening Twitch login...');

  const popup = window.open(
    "/auth/twitch",
    "TwitchAuth",
    "width=600,height=700"
  );

  if (!popup) {
    alert('Popup blocked! Please allow popups for this site.');
    return;
  }

  // Слушаем сообщения от popup
  const messageHandler = (event) => {
    console.log('🔵 Message received:', event.data);

    // Проверка origin
    if (event.origin !== window.location.origin) {
      console.warn('❌ Wrong origin:', event.origin);
      return;
    }

    // Проверка типа сообщения
    if (event.data.type === 'TWITCH_AUTH_SUCCESS') {
      console.log('✅ Auth successful!');

      const user = event.data.user;

      // Сохраняем данные
      localStorage.setItem("_login", "true");
      localStorage.setItem("_username", user.username);
      localStorage.setItem("_displayName", user.displayName);
      localStorage.setItem("_profileImage", user.profileImage);
      localStorage.setItem("_userId", user.id);

      console.log('💾 Data saved:', user);

      // Обновляем UI
      handleText();

      // Удаляем слушатель
      window.removeEventListener("message", messageHandler);
    }
  };

  window.addEventListener("message", messageHandler);

  // Проверяем закрытие popup
  const checkClosed = setInterval(() => {
    if (popup.closed) {
      console.log('🔵 Popup closed');
      clearInterval(checkClosed);
      window.removeEventListener("message", messageHandler);
    }
  }, 1000);
}

export { handleCallback };
