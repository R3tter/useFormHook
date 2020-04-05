import { useState } from 'react';

import { Values, Validation, Target, Form, FromResult } from './types';
import { validate } from 'utils';

export const useForm = (initialValues: Values, validation: Validation): FromResult => {
  const initialForm = {
    values: { ...initialValues },
    errors: {},
    submited: false
  };
  const [form, setForm] = useState<Form>(initialForm);

  const handleChange = ({ target }: { target: Target }) => {
    const { value, name, type, checked } = target;
    const newForm = {
      ...form,
      values: {
        ...form.values,
        [name]: type === 'checkbox' ? checked : value
      }
    };
    setForm(newForm);
  };

  const handleSubmit = (callback: (data: Values) => any) => () => {
    setForm({
      ...form,
      submited: true
    });
    validation ? validate(form, validation, setForm) && callback(form.values) : callback(form.values);
  };

  const reset = () => setForm(initialForm);

  const setValue = (data: Values) => {
    const newForm = {
      ...form,
      values: {
        ...data
      }
    };
    setForm(newForm);
  };

  return {
    ...form,
    handleChange,
    handleSubmit,
    reset,
    setValue
  };
};
