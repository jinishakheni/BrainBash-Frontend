// Password validation
export const isValidPassword = (newPassword) => {
  const passwordValidator =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  return passwordValidator.test(newPassword);
};

// Function to validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate link format
export const isValidLink = (link) => {
  const linkRegex = /http[s]?:\/\/[^\s/$.?#].[^\s]*/;
  return linkRegex.test(link);
};

// Function to validate duration format
export const isValidDuration = (duration) => {
  const durationRegex = /^([0-9]|[1][0])H(?:([0-9]|[1-5][0-9])M)?$/;
  return durationRegex.test(duration);
};