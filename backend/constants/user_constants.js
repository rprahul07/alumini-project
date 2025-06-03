export const ROLES = {
  STUDENT: 'student',
  ALUMNI: 'alumni',
  FACULTY: 'faculty'
};

export const VALID_ROLES = Object.values(ROLES);

export const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  patterns: {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
    special: /[!@#$%^&*(),.?":{}|<>]/,
    consecutive: /(.)\1{2,}/,
    sequential: /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i
  },
  commonPasswords: [
    "password", "123456", "qwerty", "admin",
    "welcome", "letmein", "monkey", "dragon"
  ]
}; 