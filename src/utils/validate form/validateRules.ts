const formRules = {
  firstname: {
    minLength: 1,
    maxLength: 30,
  },
  name: {
    minLength: 1,
    maxLength: 30,
  },
  pseudo: {
    minLength: 1,
    maxLength: 30,
  },
  password: {
    minLength: 8,
    hasLowercase: /[a-z]/,
    hasUppercase: /[A-Z]/,
    hasSpecialChar: /[\W_]/,
  },
  tags: {
    minimumChoices: 1,
  },
  description: {
    minLength: 1,
  },
  email: {
    emailFormat: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  },
  cgu: {
    isChecked: true,
  },
};

export default formRules;
