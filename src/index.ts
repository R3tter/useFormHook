import { useState } from 'react';

export * from './constants';
import { Values, Validation, Target, Form, FromResult } from './types';
import { validate, styledConsole, ThrowError } from 'utils';

export const useForm = (initialValues: Values, validation?: Validation, validateOnChange?: boolean): FromResult => {
  const initialForm = {
    values: { ...initialValues },
    errors: {}
  };
  const [form, setForm] = useState<Form>(initialForm);

  const handleChange = ({ target }: { target: Target }) => {
    try {
      const { value, name, type, checked } = target;
      const newForm = {
        ...form,
        values: {
          ...form.values,
          [name]: type === 'checkbox' ? checked : value
        }
      };
      validateOnChange ? validation && validate(newForm, validation, setForm) : setForm(newForm);
    } catch (e) {
      styledConsole('Pass correct event object to handleChange function');
    }
  };

  const handleSubmit = (callback: (data: Values) => any) => () => {
    try {
      validation ? validate(form, validation, setForm) && callback(form.values) : callback(form.values);
    } catch (e) {
      styledConsole('Pass callback function to handleSubmit');
    }
  };

  const reset = () => setForm(initialForm);

  const setValue = (data: Values) => {
    try {
      const isObject = typeof data === 'object' && !Array.isArray(data);
      ThrowError(!isObject, 'setValue function should receive object - { [key]: value }');
      const newForm = {
        ...form,
        values: {
          ...data
        }
      };
      setForm(newForm);
    } catch (e) {
      styledConsole(e);
    }
  };

  return {
    ...form,
    handleChange,
    handleSubmit,
    reset,
    setValue
  };
};
