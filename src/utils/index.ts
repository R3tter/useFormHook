import { Errors, Validation, Form } from '../types';

export const sum = (a: number, b: number) => a + b;

export const ThrowError = (param: boolean, message: string) => {
  if (param) throw message;
};

export const validate = (form: Form, validation: Validation, setForm: (data: Form) => void): boolean => {
  try {
    let errors: Errors = {};

    validation.forEach(({ rules, name, matchWithField }) => {
      let isError = false;
      const value = form.values[name];
      const valueIsArr = Array.isArray(value);
      if (!matchWithField) {
        rules.forEach(({ regex, message }) => {
          const isFunc = typeof regex === 'function';
          ThrowError(valueIsArr && !isFunc, 'Use function to check array values');
          if (!isError) {
            // @ts-ignore
            isError = isFunc ? !regex(value) : !regex.test(value);
            errors = isError ? { ...errors, [name]: message } : errors;
          }
        });
      } else {
        errors =
          value !== form.values[matchWithField]
            ? { ...errors, [name]: `Should be equal to ${matchWithField}` }
            : errors;
      }
    });

    setForm({
      ...form,
      errors
    });

    return !Object.keys(errors).length;
  } catch (e) {
    console.log(`%c An error has occurred: ${e}`, 'color: red; font-size: 12px');
  }
};
