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

* `message` [String] - The default error message to pass to `validationErrors` if an
error is detected. You can create more specific messages, but if one doesn't exist
for a certain type of validation test then it will fall back to this one.

* `required` [Boolean] - Specifies whether the form property is a required value. If
set to true, then the validation will produce an error if the form value is null,
undefined, or an empty string.

* `requiredMessage` [String] - Error message to pass to `validationErrors` object if
the form value specifically fails the `required` test.

* `customFormat` [RegExp] - User specified regular expression to test the form value
against. This can be used if none of the `format` options for testing meet the needs
for a specific form property.

* `customFormatMessage` [String] - Error message to pass to `validationErrors` object
if the form value specifically fails the `customFormat` test.

* `format` [String] - Specifies a format type to test the form value against. There
are a number of available options for format:

    - "word" - the value will be validated as a single word, letters only
    - "words" - the value will be validated as a single or multiple words, letters
    only
    - "number" - the value will be validated as a number
    - "fullname" - the value will be validated as exactly two words separated by a
    space
    - "email" - the value will be validated as a feasible email address (specifics
    such as validity of domain name are not checked though)
    - "password" - basic password validation for "must be at least 8 characters and
    include 1 uppercase letter, 1 lower case letter, and 1 number" situations
    - "date-MMYYYY" - the value will be validated as a date in the MMYYYY format
    (Example: 03/1997)
    - "date-MMDDYYYY" - the value will be validated as a date in the MMDDYYYY format
    (Example: 12/25/2017)

* `formatMessage` [String] - Error message to pass to the `validationErorrs` object
if the form value specifically fails the `format` test

* `word` [Object] - If `format` is set to `"word"` then the `word` property can be
used to specify additional criteria to test for. Options for properties on the
`word`:

    - `minLength` [Number] - Sets the shortest a word can be (in letters)
    - `minLengthMessage` [String] - Error message to pass to `validationErrors`
    object if the minLength test is specifically failed.
    - `maxLength` [Number] - Sets the longest a word can be (in letters)
    - `maxLengthMessage` [String] - Error message to pass to `validationErrors`
    object if the maxLength test is specifically failed

* `words` [Object] - If `format` is set to `"words"` then the `words` property can be
used to specify additional criteria to test for. Options for properties on the
`words` object:

    - `minLength` [Number] - Sets the shortest words can be (in letters)
    - `minLengthMessage` [String] - Error message to pass to `validationErrors`
    object if the minLength test is specifically failed.
    - `maxLength` [Number] - Sets the longest words can be (in letters)
    - `maxLengthMessage` [String] - Error message to pass to `validationErrors`
    object if the maxLength test is specifically failed

* `fullname` [Object] - If `format` is set to `"fullname"` then the `fullname`
property can be used to specify additional criteria to test for. Options for
properties on the `fullname` object:

    - `minLength` [Number] - Sets the shortest name can be (in letters)
    - `minLengthMessage` [String] - Error message to pass to `validationErrors`
    object if the minLength test is specifically failed.
    - `maxLength` [Number] - Sets the longest name can be (in letters)
    - `maxLengthMessage` [String] - Error message to pass to `validationErrors`
    object if the maxLength test is specifically failed

* `number` [Object] - If `format` is set to `"number"` then the `number` property can
be used to specify additional criteria to test for. Options for properties on the
`number` object:

    - `min` [Number] - Sets the lowest a number value can be
    - `minMessage` [String] - Error message to pass to `validationErrors` object if
    the min test is specifically failed
    - `max` [Number] - Sets the highest a number value can be
    - `maxMessage` [String] - Error message to pass to `validationErrors` object if
    the max test is specifically failed

* `date` [Object] - If `format` is set to `"date-MMYYYY"` or `"date-MMDDYYYY"` then
the `date` property can be used to specify additional criteria to test for. Options
for properties on the `date` object:

    - `before` [String] - Sets the latest time value that the date can be. Note that
    the format of this string should be the same as what is specified in the `format`
    property (i.e. if `format` is `"date-MMYYYY"` then `before` should be
    `"07/2010"`)
    - `beforeMessage` [String] - The error message to pass to `validationErrors`
    object if the `before` test is specifically failed
    - `after` [String] - Sets the earliest time value that the date can be. Note that
    the format of this string shold be the same as what is specified in the `format`
    property (i.e. if `format` is `"date-MMDDYYYY"` then `after` should be
    `"04/20/2017")
    - `afterMessage` [String] - The error message to pass to `validationErrors`
    object if the `after` test is specifically failed

#### validationErrors [Object]

`validationErrors` is an object property that can be access on the component to view
the latest errors detected on the most recent run of the test validation action.
Each property on `validationErrors` is the same as the property on the form being
tested. For example, if your form has a property called `carModel` that should be a
word, then if there is an invalid value then validation errors might look like this:

```
{
  carModel: "The value you entered is not a valid car model"
}
```

Note that the format of `validationErrors` is `property: "error message"`.

#### validationErrorExists [Boolean]

A property on your component provided by the mixin that will return true if the
latest validation action returned an error or false if `validationErrors` is empty

#### validationErrorsList [Array]

Will conveniently put the `validationErrors` into the form of a list of objects. For
each object, the format will be:

```
{
  property: "Name of your property",
  message: "Your provided error message or a default one"
}
```

So, for example, if you have a property on your form called `carModel` and an error
for validation is found with this property, one of the objects in the
`validationErrorsList` array may look like this:

```
{
  property: "carModel",
  message: "The value you entered is not a valid car model"
}
```

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

## Backlog

* Add ability to validate live on change to values
* Add ability to do multiple format/customFormat validations on a single value
* Ability to specify a "whitelist" of acceptable values or "blacklist" of
unacceptable values

## Changelog

[0.1.5] - Change format test to fix false negative cases where only partial strings
were tested