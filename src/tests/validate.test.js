import { validate } from 'utils';
import { RULES } from 'constants'

const form = {
    values: {
        userName: 'Ivan',
        pass: '1234567',
        repeatPass: '12345672'
    },
    errors: {},
    submited: false
};

const validation = [
    {
        rules: [RULES.required],
        name: 'userName'
    },
    {
        rules: [RULES.numberOnly],
        name: 'pass'
    }
];
let setValue;

beforeEach(() => {
    setValue = jest.fn();
});

test('validation success', () => {
    const result = validate(form, validation, setValue);
    expect(result).toBe(true);
    expect(setValue).toHaveBeenCalledTimes(1);
});

test('functional regex should work', () => {
    const validateFn = jest.fn();
    validate(form, [{
        rules: [{
            regex: validateFn,
        }],
        name: 'userName',
    }], setValue);
    expect(validateFn).toHaveBeenCalledTimes(1);
    expect(validateFn.mock.calls[0][0]).toBe(form.values.userName);
});

describe('validation failed', () => {
    test('userName failed', () => {
        const newForm = {...form, values: { userName: '' }};
        const result = validate(newForm, validation, setValue);
        expect(result).toBe(false);
        expect(setValue).toHaveBeenCalledTimes(1);
        expect(setValue.mock.calls[0][0]).toMatchObject({
            ...newForm,
            errors: {
                userName: RULES.required.message
            }
        })
    });
    test('repeat pass failed', () => {
        const result = validate(form, [ ...validation, {
            rules: [],
            name: 'repeatPass',
            matchWithField: 'pass'
        }], setValue);
        expect(result).toBe(false);
        expect(setValue).toHaveBeenCalledTimes(1);
        expect(setValue.mock.calls[0][0]).toMatchObject({
            ...form,
            errors: {
                repeatPass: 'Should be equal to pass'
            }
        })
    })
});
