export const patterns = {
  email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/,
  userName: /[A-Za-z]/,
  vatNumber: /^[0-9]{11,20}/,
  nationalIdentity: /^\d{10}$/,
  phone: /^\d{9}$/,
  // phone: /^\+966\d{9}$/,
  // phone: '051[01]\d{5}'
};
