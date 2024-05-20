const changePasswordBtn = document.getElementById("changePasswordBtn");
const passwordFields = document.querySelectorAll(".password-fields");
const uncoverPasswordBtn = document.getElementById("uncoverPasswordBtn");
const eyeIcon = document.getElementById("eyeIcon");

changePasswordBtn.addEventListener("click", () => {
  passwordFields.forEach((field) => {
    field.style.display = field.style.display === "none" ? "block" : "none";
  });
});

uncoverPasswordBtn.addEventListener("click", () => {
  const passwordInputs = document.querySelectorAll(".password-fields input");
  passwordInputs.forEach((input) => {
    input.type = input.type === "password" ? "text" : "password";
  });
  eyeIcon.classList.toggle("bi-eye-slash");
  eyeIcon.classList.toggle("bi-eye");
});
