# useForm - that is what you need to handle form
##Instalation
```
npm i use-form-validation-hook
```
##Usage
```
import {useForm, RULES} from 'use-form-validation-hook';

const Component = (data) => {
    const initialState = {
      merchants: [],
      name: '',
      password: '',
      repeatPassword: ''
    };

    const validation = [
      { rules: [RULES.required], name: 'name' },
      {
        rules: [{ regex: (value, formValues) => !!value.length, message: "Cannot be empty" }],
        name: 'merchants'
      },
      { rules: [RULES.required], name: 'password' },
      { name: 'repeatPassword', matchWithField: { field: 'password' } },
    ];
    
    const { values, errors, handleChange, handleSubmit, setValue } = useForm(
      initialState,
      validation
    );
    // You can use setValue if you want update fromData depending on props
    useEffect(() => {
        setValue(data);
    }, [data])

    return <form onSubmit={handleSubmit((formData) => Api.sendData(formData)}>
        <Input
            name="name"
            label="Name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
         />
         <Input
            name="password"
            label="Password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
         /> 
         <Input
            name="repeatPassword"
            label="Repeat password"
            value={values.repeatPassword}
            onChange={handleChange}
            error={errors.repeatPassword}
         />
         <MultiSelect
            name="merchants"
            label="Merchants"
            values={values.merchants}
            onChange={handleChange}
            error={errors.merchants}
         />
         <Button
            type="submit"
            label="Submit"
         />
    </form>
}
```

##Docs
###useForm takes three parameters:  

- ```initialValues``` -  initial form values (required)
- ```validation``` - array of object: (optional)
    ```
    [{
      rules: Array<Rule>;
      name: string;
      matchWithField?: {
        field: string;
        message: string;
      };
    }];
    
  // Rule -  { regex: /([^\s])/, message: 'Is required'}
  // regex - also can be a function to handle specific values 
  // matchWithField - object with field name and message (optional).
  ```
- ```validateOnChange``` - boolean. (optional)  
If true ```validate function``` will be called on every change.
By default it is equal to ```false``` - ```validate function``` will be called only on submit

###useForm return an object with:

- ```values``` - object that contains current form values.
- ```errors``` - object that contains current form errors.
- ```touched``` - object that represent changed fields.
- ```handleChange``` - will update values object. Should be passed to input onChange function.
If ```validateOnChange``` equal to true. ```handleChange``` also will trigger ```validate function``` and update ```errors```
- ```handleSubmit``` - takes ```callback``` and should be passed to ```<form>``` onSubmit function. ```callback``` will be called if validation has succeed, or there is no ```validation```.
- ```reset``` - will drop ```values``` and ```errors``` to initial state
- ```setValue``` - use this function on special cases, when you need directly pass some value to useForm ```values``` object.
- ```triggerValidation``` - use this function when you want to trigger validation manually
- ```isValid```: function - return boolean



