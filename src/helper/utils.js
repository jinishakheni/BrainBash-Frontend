// Password validation
export const isValidPassword = (newPassword) => {
  const passwordValidator =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  return passwordValidator.test(newPassword);
};