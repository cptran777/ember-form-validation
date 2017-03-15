# ember-form-validation

This README outlines the details of collaborating on this Ember addon. The Ember Form
Validation addon that can be used as a mixin inside of a component or route that allows for an object to be passed in to validate a form

## Installation

* `ember install ember-form-validation`

## Repository

[Github Repository](https://github.com/cptran777/ember-form-validation)

[NPM Link](https://www.npmjs.com/package/ember-form-validation)

## Usage

### Basic Usage

The form validation is a mixin that can be used by importing it from the addon
and including in a component:

```
import Ember from 'ember';
import formValidation from 'ember-form-validation/mixins/form-validation';

export default Ember.Component.extend(formValidation, {
  ...
})
```

Within the definition for the component, you should use a property `validate` that is
an object containing a property `form` that is a nested object. Each property Each
property in `form` should correspond to a property you would like to validate on your
actual form. For each of these properties, this is where you can specify the criteria
for validation.

Example:

```
export default Ember.Component.extend(formValidation, {
  validate: {
    form: {
      // The form property we should be evaluating here is name
      name: {
        required: true,
        format: 'word',
        // Your defined basic default error message
        message: 'Name error',
        // A more specific message tailored to the 'required' test
        requiredMessage: 'You must enter a name'
      },
      age: {
        required: true,
        format: 'number'
        message: 'Age error'
      }
      ...
    }
  }
})
```

Validate also allows for custom validations, which will be covered below.

When validating a form, the mixin wants you to either define a `form` object that
contains all of the form's values to be tested. By default, the validation will
expect all the form values in a property on the component called `form`. However, in
the `validate` object, you can specify a different property name called `formName`.

Further, if you would like to keep the form properties as separate properties on the
component instead, then before calling the validation action you can simply gather
all the properties into an object and pass it into the validation action as an
argument.

Default Use Case:

```
export default Ember.Component.extend(formValidation, {
  validate: {
    ...
  },
  form: {
    // This name property corresponds to the same property inside the validate.form
    // object
    name: 'value goes here',
    age: 24,
    ...
  },

  ...
  actions: {
    yourAction() {
      // This will actually call the validation function
      this.send('validate_form_action');
    }
  }
})
```

Custom Form Property Case:

```
export default Ember.Component.extend(formValidation, {
  validate: {
    formName: 'customName',
    ...
  },
  customName: {
    name: 'value goes here',
    age: 69
  },
  ...

  actions: {
    yourAction() {
      this.send('validate_form_action');
    }
  }
})
```

Pass in Form Use Case:

```
export default Ember.Component.extend(formValidation, {
  validate: {
    form: {
      name: {
      ...
    }
  },

  actions: {
    yourAction() {
      const form = {
        name: 'name value',
        age: '42'
      }

      this.send('validate_form_action', form);
    }
  }
})
```

After running `validate_form_action`, the first error that appears for each property
will be written onto a property `validationErrors`. Priority for validation errors is

* required error
* custom specified format error
* basic format error
* extra validations error

These can then be accessed by calling the same property name as the one being tested
from the `validationErrors` object, or as a list of errors from the
`validationErrorsList` property.

A basic way to use this can be to use helpers on the template file to display the
messages if they exist:

```
// template.hbs

<div class="form">
  <form>
    <div>Name: {{input value=form.name}}</div>
    <div>{{validationErrors.name}}</div>
    <div>Age: {{input value=form.age}}</div>
    <div>{{validationErrors.age}}</div>
    <div>Birthday: {{input value=form.birthday}}</div>
    <div>{{validationErrors.birthday}}</div>
    <div>Current Day: {{input value=form.currentDay}}</div>
    <div>{{validationErrors.currentDay}}</div>
  </form>
</div>
```

Or to display them as a list of errors at the top of the form:

```
<div class="form">
    {{#if validationErrorExists}}
      {{#each validationErrorsList as |exampleError|}}
        <div>{{exampleError.property}}: {{exampleError.message}}</div>
      {{/each}}
    {{/if}}
  <form>
    <div>Name: {{input value=form.name}}</div>
    <div>Age: {{input value=form.age}}</div>
    <div>Birthday: {{input value=form.birthday}}</div>
    <div>Current Day: {{input value=form.currentDay}}</div>
  </form>
</div>
```

Note that `validationErrorExists` is another property that is a boolean to simply
detect whether an error was found in the latest run of the `validate_form_action`.

### Documentation

#### Validate [Object]

`validate` is the property on the component to store the criteria to use to run the
form validation.

Properties of `validate`:

* form [Object] - Each property on the `form` object should be the same as the
property to check on the form. For more information about the possible criteria,
check documentation for the `form` object

* formName [String] - (Optional) Specifies a different property on the component
that is the actual form object. By default, validation checks for a property
named `form`.

#### Form [Object]

`form` is a nested property on `validate`.

Example:

```
export default Ember.Component.extend(formValidation, {
  validate: {
    form: {
      name: {
      ...
    }
  },
```

`form` is an object where each property is the same property to be tested on the
actual form and each value is a further-nested object with the testing criteria for
each property.

Options available for each criteria-object in `form`:

* message [String] - The default error message to pass to `validationErrors` if an
error is detected. You can create more specific messages, but if one doesn't exist
for a certain type of validation test then it will fall back to this one.

* required [Boolean] - Specifies whether the form property is a required value. If
set to true, then the validation will produce an error if the form value is null,
undefined, or an empty string.

* requiredMessage [String] - Error message to pass to `validationErrors` object if
the form value specifically fails the `required` test.

* customFormat [RegExp] - User specified regular expression to test the form value
against. This can be used if none of the `format` options for testing meet the needs
for a specific form property.

* customFormatMessage [String] - Error message to pass to `validationErrors` object
if the form value specifically fails the `customFormat` test.

* format [String] - Specifies a format type to test the form value against.

### Example Validate Object

```
...
  validate: {
    formName: 'customform',
    form: {
      name: {
        required: true,
        requiredMessage: 'You must enter a name',
        format: 'word',
        message: 'Please enter a valid name',
        customFormatMessage: 'Custom name error',
        formatMessage: 'Please enter a real word',
        word: {
          minLength: 2,
          minLengthMessage: 'Please enter a word with at least 2 letters',
          maxLength: 15,
          maxLengthMessage: 'Please enter a word with less than 15 letters'
        }
      },
      age: {
        required: true,
        format: 'number',
        message: 'Please enter a valid age',
        number: {
          max: 10,
          maxMessage: 'Not under 10',
          min: 5,
          minMessage: 'Not over 5'
        }
      },
      birthday: {
        required: true,
        format: 'date-MMYYYY',
        // Can be used to specify before or after
        // Expected to be in the same format as 'format'
        date: {
          before: '10/2017',
          beforeMessage: 'Before message successful',
          after: '05/2015',
          afterMessage: 'After message successul'
        }
      },
      currentDay: {
        required: true,
        format: 'date-MMDDYYYY',
        date: {
          before: '11/20/2014',
          beforeMessage: 'Must be before 11/20/2014',
          after: '05/01/2010'
        }
      }
    }
  },
...

```
