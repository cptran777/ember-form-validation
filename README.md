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

Within the definition for the component, there is a reserved property name `validate`
that should be used to define the validation criteria. `validate` is an object that
contains a property `form` that is an object that determines the form property names
and associated criteria for the validation of each name.

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
      }
    }
  }
})
```