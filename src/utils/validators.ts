export const validatePin = (
  pin: string,
): boolean => {
  return /^\d{4}$/.test(pin);
};

export const validatePassword = (
  password: string,
): boolean => {
  return password.length >= 6;
};