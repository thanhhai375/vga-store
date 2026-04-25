/**
 * Utility helpers cho admin
 */

// Format tin VND
export const formatCurrency = (amount) => {
  if (!amount) return '--';
  return `${Number(amount).toLocaleString('vi-VN')}đ`;
};

// Format ngy gi
export const formatDate = (dateStr) => {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleString('vi-VN');
};

// Ct vn bn di
export const truncate = (str, max = 80) => {
  if (!str) return '--';
  return str.length > max ? str.slice(0, max) + '...' : str;
};

// Ly ch ci u lm Avatar
export const getInitials = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};
