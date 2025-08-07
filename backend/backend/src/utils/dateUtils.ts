// Форматирует дату в формат дд/мм/гггг
export const formatDateToDDMMYYYY = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
};

export const transformDatesInObject = (obj: any): any => {
  if (!obj) return obj;
  
  const transformed = { ...obj };
  
  // Форматируем createdAt если есть
  if (transformed.createdAt) {
    transformed.createdAt = formatDateToDDMMYYYY(transformed.createdAt);
  }
  
  // Переименовываем uploadedAt в createdAt для файлов и форматируем
  if (transformed.uploadedAt) {
    transformed.createdAt = formatDateToDDMMYYYY(transformed.uploadedAt);
    delete transformed.uploadedAt;
  }
  
  // Убираем updatedAt
  delete transformed.updatedAt;
  
  // Если есть файлы, форматируем их даты тоже
  if (transformed.files && Array.isArray(transformed.files)) {
    transformed.files = transformed.files.map((file: any) => transformDatesInObject(file));
  }
  
  return transformed;
};
