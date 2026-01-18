export function handleText() {
  const username = localStorage.getItem("_username");
  const displayName = localStorage.getItem("_displayName");

  const profileImage = localStorage.getItem("_profileImage");

  if (username) {
    const loginButton = document.querySelector(".nav-auth__link");

    if (loginButton) {
      loginButton.textContent = displayName || username;

      if (profileImage) {
        loginButton.innerHTML = `
          <img src="${profileImage}" alt="${username}" style="width: 30px; border-radius: 50%;">
          <span>${displayName || username}</span>
        `;
      }
    }
  }
}
