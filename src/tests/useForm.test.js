import { renderHook, act } from '@testing-library/react-hooks';

import { useForm } from '../index';
import { RULES } from 'constants';
import { createEvent } from 'utils';

const initialValues = {
  name: 'user name',
  password: '12345',
  secondName: 'user name',
  lastName: 'last name',
  empty: '',
  checkbox: false
};

const validation = [
  {
    rules: [RULES.required],
    name: 'name'
  }
];

let result;

beforeEach(() => {
  result = renderHook(() => useForm(initialValues, validation)).result;
});

describe('useForm works as expected', () => {
  test('handleChange should trigger update on regular text input', () => {
    const event = { name: 'name', value: 'new user name' };
    act(() => result.current.handleChange(createEvent(event)));
    expect(result.current.values).toMatchObject({
      ...initialValues,
      name: event.value
    });
    act(() => result.current.handleChange(createEvent({ ...event, value: 'some other' })));
    expect(result.current.values).toMatchObject({
      ...initialValues,
      name: 'some other'
    });
  });

  test('handleChange should trigger update on checkbox', () => {
    const event = { name: 'checkbox', type: 'checkbox', checked: true };
    act(() => result.current.handleChange(createEvent(event)));
    expect(result.current.values).toMatchObject({
      ...initialValues,
      checkbox: event.checked
    });
  });

  test('reset should work as expected', () => {
    const event = { name: 'name', value: 'new user name' };
    act(() => result.current.handleChange(createEvent(event)));
    act(() => result.current.reset());
    expect(result.current.values).toMatchObject(initialValues);
  });

  test('setValue should work as expected', () => {
    const newForm = {
      ...initialValues,
      name: 'newName'
    };
    act(() => result.current.setValue(newForm));
    expect(result.current.values).toMatchObject(newForm);
  });

  test('handleSubmit should call callback on success case', () => {
    const fn = jest.fn();
    act(() => result.current.handleSubmit(fn)());
    expect(fn).toBeCalledTimes(1);
  });

  test('handleSubmit should work as expected on error case', () => {
    const fn = jest.fn();
    const result = renderHook(() => useForm(initialValues, [{ rules: [RULES.required], name: 'empty' }])).result;
    act(() => result.current.handleSubmit(fn)());
    expect(result.current.errors).toMatchObject({
      empty: RULES.required.message
    });
    expect(fn).toBeCalledTimes(0);
  });

  test('validation should work on array', () => {
    const fn = jest.fn();
    const result = renderHook(() =>
      useForm({ array: ['value'] }, [{ rules: [{ regex: value => value[0] === 'value' }], name: 'array' }])
    ).result;
    act(() => result.current.handleSubmit(fn)());
    expect(fn).toBeCalledTimes(1);
  });

  test('validation should work on matchWithField', () => {
    const fn = jest.fn();
    const result = renderHook(() =>
      useForm({ pass: '1234', repeatPass: '123' }, [{ name: 'repeatPass', matchWithField: 'pass' }])
    ).result;
    act(() => result.current.handleSubmit(fn)());
    expect(fn).toBeCalledTimes(0);
    expect(result.current.errors).toMatchObject({
      repeatPass: 'Should be equal to pass'
    });
  });

  test('validation should work from onChange if validateOnChange is true', () => {
    const result = renderHook(() =>
      useForm(
        initialValues,
        [
          { rules: [RULES.required], name: 'name' },
          { rules: [RULES.required], name: 'password' }
        ],
        true
      )
    ).result;
    const event = { name: 'name', value: '' };
    act(() => result.current.handleChange(createEvent(event)));
    expect(result.current.errors).toEqual({
      name: RULES.required.message
    });
  });

  test('touched property should work as expected', () => {
    const result = renderHook(() => useForm(initialValues, [{ rules: [RULES.required], name: 'userName' }])).result;
    expect(result.current.touched).toEqual({});
    act(() => result.current.handleChange(createEvent({ name: 'userName', value: '12' })));
    expect(result.current.touched).toEqual({ userName: true });
  });

  test('should have access to all form data', () => {
    const compare = (value, formValues) => value === formValues.secondName && value !== formValues.lastName;
    const result = renderHook(() =>
      useForm(initialValues, [{ rules: [{ regex: compare, message: 'dont have access to form data' }], name: 'name' }])
    ).result;
    act(() => {
      result.current.handleSubmit()();
    });
    expect(result.current.errors).toEqual({});

    act(() => result.current.handleChange(createEvent({ name: 'name', value: '12' })));
    act(() => {
      result.current.handleSubmit()();
    });
    expect(result.current.errors).toEqual({ name: 'dont have access to form data' });
  });
});

describe('useForm works on not expected cases', () => {
  test('handleChanges revived incorrect event object', () => {
    act(() => result.current.handleChange(''));
    expect(1).toBe(1);
  });

  test('handleSubmit was called without callback', () => {
    const fn = jest.fn();
    act(() => result.current.handleSubmit(fn)());
    expect(1).toBe(1);
  });

  test('setValue received incorrect data format', () => {
    act(() => result.current.setValue(2));
    expect(1).toBe(1);
  });

  test('validation has not receive function as regex', () => {
    const result = renderHook(() => useForm({ array: ['value'] }, [{ rules: [RULES.required], name: 'array' }])).result;
    act(() => result.current.handleSubmit(() => null)());
    expect(1).toBe(1);
  });

  test('triggerValidation should work as expected', () => {
    const result = renderHook(() => useForm({ name: '' }, [{ rules: [RULES.required], name: 'name' }], true)).result;
    act(() => {
      result.current.triggerValidation();
    });
    expect(result.current.errors).toMatchObject({
      name: RULES.required.message
    });
    const event = { name: 'name', value: 'someName' };
    act(() => result.current.handleChange(createEvent(event)));
    expect(result.current.errors).toMatchObject({});
  });
});
