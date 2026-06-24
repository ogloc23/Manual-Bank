export const validatePin = (pin: string): boolean => {
  return /^\d{4}$/.test(pin);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateSSN = (ssn: string): boolean => {
  const normalized = ssn.trim();
  return /^\d{3}-\d{2}-\d{4}$/.test(normalized) || /^\d{9}$/.test(normalized);
};
