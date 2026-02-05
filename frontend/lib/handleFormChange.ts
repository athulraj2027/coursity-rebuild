export const areFieldsFilled = (
  form: HTMLFormElement,
  requiredFields: string[],
) => {
  const formData = new FormData(form);

  return requiredFields.every((field) => {
    const value = formData.get(field);
    return typeof value === "string" && value.trim().length > 0;
  });
};
