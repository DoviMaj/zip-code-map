export const validateZipCode = (zipCode: string): boolean => {
  // Regex for 5-digit or 5+4 digit ZIP codes
  const zipCodeRegex = /^\d{5}(-\d{4})?$/;

  return zipCodeRegex.test(zipCode);
};
