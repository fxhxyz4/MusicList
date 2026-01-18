export function handleText() {
  let loginButton = document.querySelector(".nav-auth__link");
  const username = localStorage.getItem("_username");
  const displayName = localStorage.getItem("_displayName");

  const profileImage = localStorage.getItem("_profileImage");

  loginButton.textContent = "Login";

  if (username) {
    loginButton = document.querySelector(".nav-auth__link");

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
