export const ROLES = {
  STUDENT: "student",
  ALUMNI: "alumni",
  FACULTY: "faculty",
  ADMIN: "admin",
};

export const VALID_ROLES = Object.values(ROLES);

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 12,
  patterns: {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    special: /[!@#$%^&*(),.?":{}|<>]/,
  },
  commonPasswords: [
    "password",
    "123456",
    "qwerty",
    "admin",
    "welcome",
    "letmein",
    "monkey",
    "dragon",
  ],
};
