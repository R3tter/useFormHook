type Value = string | number | Array<any> | boolean;

export type Values = {
  [key: string]: Value;
};

type Rule = {
  regex: ((value: Value) => boolean) | RegExp;
  message: string;
};

export type Validation = Array<{
  rules?: Array<Rule>;
  name: string;
  matchWithField?: {
    field: string;
    message: string;
  };
}>;

export type Target = {
  value: Value;
  name: string;
  type: string;
  checked: boolean;
};

export type Errors = {
  [key: string]: string;
};

export type Form = {
  values: Values;
  errors: Errors | {};
  touched: {
    [key: string]: boolean;
  };
};

export type FromResult = {
  values: Values;
  errors: Errors | {};
  handleChange: (obj: { target: Target }) => void;
  handleSubmit: (callBack: (data: Values) => any) => void;
  reset: () => void;
  setValue: (data: Values) => void;
  triggerValidation: () => void;
  isValid: () => boolean;
};
