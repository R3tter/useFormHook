import { Errors, Validation, Form } from '../types';

export const styledConsole = (message) =>
  console.log(`%c An error has occurred: ${message}`, 'color: red; font-size: 12px');

export const ThrowError = (param: boolean, message: string) => {
  if (param) throw message;
};

export const validate = (
  form: Form,
  validation: Validation,
  setForm: (data: Form) => void,
  fieldName?: string
): boolean => {
  try {
    let errors: Errors = {};

    validation.forEach(({ rules, name, matchWithField }) => {
      if (!fieldName || fieldName === name) {
        let isError = false;
        const value = form.values[name];
        const valueIsArr = Array.isArray(value);

        if (!matchWithField) {
          rules.forEach(({ regex, message }) => {
            const isFunc = typeof regex === 'function';
            ThrowError(valueIsArr && !isFunc, 'Use function to check array like values');
            if (!isError) {
              // @ts-ignore
              isError = isFunc ? !regex(value, form.values) : !regex.test(value);
              errors = isError ? { ...errors, [name]: message } : errors;
            }
          });
        } else {
          errors =
            value !== form.values[matchWithField]
              ? { ...errors, [name]: `Should be equal to ${matchWithField}` }
              : errors;
        }
      }
    });

    setForm({
      ...form,
      errors
    });
    return !Object.keys(errors).length;
  } catch (e) {
    styledConsole(e);
  }
};

export const createEvent = ({
  name,
  value,
  type,
  checked
}: {
  name: string;
  value: any;
  type?: string;
  checked?: boolean;
}) => ({
  target: {
    name,
    value,
    type,
    checked
  }
});
