export const isFormValid = {
  firstname: true,
  lastname: true,
  pseudo: true,
  email: true,
  oldPassword: true,
  newPassword: true,
  confirmPassword: true,
  tags: true,
  description: true,
  cgu: true,
};

export const formRules = {
  firstname: {
    maxLength: 30,
  },
  lastname: {
    maxLength: 30,
  },
  pseudo: {
    maxLength: 30,
  },
  oldPassword: {
    minLength: 8,
    hasLowercase: /[a-z]/,
    hasUppercase: /[A-Z]/,
    hasSpecialChar: /[\W_]/,
  },
  newPassword: {
    minLength: 8,
    hasLowercase: /[a-z]/,
    hasUppercase: /[A-Z]/,
    hasSpecialChar: /[\W_]/,
  },
  confirmPassword: {
    minLength: 8,
    hasLowercase: /[a-z]/,
    hasUppercase: /[A-Z]/,
    hasSpecialChar: /[\W_]/,
  },
  description: {
    minLength: 1,
  },
  email: {
    emailFormat:
      /^[^\s@]+@[^\s@]+.(fr|com|eu|org|de|be|lu|ch|ca|net|info|biz|gov|asso|paris|re)$/,
  },
  cgu: {
    isChecked: true,
  },
};

// Variable pour les messages d'erreur
export const errorMessages = {
  firstname: 'Veuillez renseigner un prénom de moins de 30 caractères',
  lastname: 'Veuillez renseigner un nom de moins de 30 caractères',
  pseudo: 'Veuillez renseigner un pseudo de moins de 30 caractères',
  email: 'Veuillez renseigner un email valide',
  oldPassword: 'Ce mot de passe ne correspond pas à votre mot de passe actuel',
  newPassword:
    'Le mot de passe doit contenir au moins 8 caractères dont une majuscule, une minuscule et un caractère spécial',
  confirmPassword:
    'La confirmation du mot de passe doit être identique au nouveau mot de passe',
  tags: 'Veuillez sélectionner au moins un language',
  description: 'Veuillez renseigner une description',
  cgu: "Veuillez accepter les conditions générales d'utilisation",
  multiple: 'Certains champs ne sont pas conforme',
};

// Variable pour les classes CSS
export const classMapping = {
  wrong: 'wrong',
  good: 'good',
};

// Fonction pour valider les champs du formulaire
export const validateField = (value, fieldName, options = {}) => {
  // options = {} permet de mettre un objet vide par défaut si on ne passe pas d'option
  const { newPasswordValue = undefined } = options; // newPasswordValue n'est pas utilisé dans toutes les vérifications, donc on le met en optionnel avec une valeur par défaut

  const fieldRules = formRules[fieldName];

  if (fieldName === 'newPassword') {
    const { minLength, hasLowercase, hasUppercase, hasSpecialChar } =
      fieldRules;

    if (
      value.length < minLength ||
      !hasLowercase.test(value) ||
      !hasUppercase.test(value) ||
      !hasSpecialChar.test(value)
    ) {
      isFormValid.newPassword = false;
      return {
        className: classMapping.wrong,
      };
    }

    isFormValid.newPassword = true;
  }
  if (fieldName === 'confirmPassword') {
    if (value !== newPasswordValue) {
      isFormValid.confirmPassword = false;
      return {
        className: classMapping.wrong,
      };
    }

    isFormValid.confirmPassword = true;
  }
  if (fieldName === 'email') {
    const { emailFormat } = fieldRules;

    if (!emailFormat.test(value)) {
      isFormValid.email = false;
      return {
        className: classMapping.wrong,
      };
    }
    isFormValid.email = true;
  }
  if (fieldName === 'description') {
    const { minLength } = fieldRules;

    if (value.length < minLength) {
      isFormValid.description = false;
      return {
        className: classMapping.wrong,
      };
    }
    isFormValid.description = true;
  }
  if (fieldName === 'cgu') {
    const { isChecked } = fieldRules;

    if (!isChecked) {
      isFormValid.cgu = false;
      return {
        className: classMapping.wrong,
      };
    }
    isFormValid.cgu = true;
  }
  if (fieldName === 'firstname') {
    const { minLength, maxLength } = fieldRules;

    if (value.length < minLength || value.length > maxLength) {
      isFormValid.firstname = false;
      return {
        className: classMapping.wrong,
      };
    }
    isFormValid.firstname = true;
  }
  if (fieldName === 'lastname') {
    const { minLength, maxLength } = fieldRules;

    if (value.length < minLength || value.length > maxLength) {
      isFormValid.lastname = false;
      return {
        className: classMapping.wrong,
      };
    }
    isFormValid.lastname = true;
  }
  if (fieldName === 'pseudo') {
    const { minLength, maxLength } = fieldRules;

    if (value.length < minLength || value.length > maxLength) {
      isFormValid.pseudo = false;
      return {
        className: classMapping.wrong,
      };
    }
    isFormValid.pseudo = true;
  }

  return { className: classMapping.good };
};