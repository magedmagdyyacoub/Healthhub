const commonPasswords = [
  '123456', 'password', '123456789', '12345678', '12345',
  '111111', '1234567', 'sunshine', 'qwerty', 'iloveyou',
  'admin', 'welcome', 'monkey', 'login', 'abc123'
];

function isStrongPassword(password) {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isCommon = commonPasswords.includes(password.toLowerCase());

  return (
    password.length >= minLength &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSymbol &&
    !isCommon
  );
}

module.exports = isStrongPassword;
