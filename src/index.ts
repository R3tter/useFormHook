import { useState, useCallback } from 'react';

export * from './constants';

import { Values, Validation, Target, Form, FromResult } from './types';
import { validate, styledConsole } from 'utils';

export const useForm = (initialValues: Values, validation?: Validation, validateOnChange?: boolean): FromResult => {
  const initialForm = {
    values: { ...initialValues },
    errors: {},
    touched: {}
  };
  const [form, setForm] = useState<Form>(initialForm);

  const handleChange = useCallback(({ target }: { target: Target }) => {
    try {
      const { value, name, type, checked } = target;
      setForm(prev => {
        const newForm = {
          ...prev,
          values: {
            ...prev.values,
            [name]: type === 'checkbox' ? checked : value
          },
          touched: {
            ...prev.touched,
            [name]: true
          }
        };
        const errors = validateOnChange && validation ? validate(newForm, validation, name) : prev.errors;
        return {
          ...newForm,
          errors
        }
      });
    } catch (e) {
      styledConsole('Pass correct event object to handleChange function');
    }
  }, []);

  const getLength = obj => Object.keys(obj).length;

  const isValid = () => (validation ? !getLength(validate(form, validation)) : true);

  const handleSubmit = (callback: (data: Values) => any) => () => {
    try {
      const errors = validation ? validate(form, validation) : form.errors;
      !getLength(errors) && callback(form.values);
      setForm({
        ...form,
        errors
      })
    } catch (e) {
      styledConsole('Pass callback function to handleSubmit');
    }
  };

  const reset = () => setForm(initialForm);

  const setValue = (param: Values | Function) => {
    try {
      setForm(prev => ({
          ...prev,
          values: typeof param === 'function' ? param(prev.values) : { ...param }
        })
      );
    } catch (e) {
      styledConsole(e);
    }
  };

  const triggerValidation = () => setForm(prev => ({
      ...prev,
      errors: validation ? validate(prev, validation) : prev.errors
  }))


  return {
    ...form,
    handleChange,
    handleSubmit,
    reset,
    setValue,
    triggerValidation,
    isValid
  };
};
