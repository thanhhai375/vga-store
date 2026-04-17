/**
 * Utility helpers cho admin
 */

// Format tiền VND
export const formatCurrency = (amount) => {
  if (!amount) return '--';
  return `${Number(amount).toLocaleString('vi-VN')}đ`;
};

// Format ngày giờ
export const formatDate = (dateStr) => {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleString('vi-VN');
};

// Cắt văn bản dài
export const truncate = (str, max = 80) => {
  if (!str) return '--';
  return str.length > max ? str.slice(0, max) + '...' : str;
};

// Lấy chữ cái đầu làm Avatar
export const getInitials = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};
