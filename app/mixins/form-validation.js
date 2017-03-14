import Ember from 'ember';

import validateItem from 'ember-form-validation/utils/validate-item';

export default Ember.Mixin.create({
  /**
   * Looks for a specified key in the validate object passed
   * in by the user in the 'validate' object. Will default to
   * 'form' if nothing is specified
   * @return {string}
   */
  _validatorKey: Ember.computed('validate', function() {
    const validate = this.get('validate');

    return validate.formName ? validate.formName : 'form';
  }),

  /**
   * Returns a list of validation props that the user has
   * specified in the validation object
   * @param {object} validate - the user specified validation
   * object
   * @return {array} - an array of strings specifying the keys
   */
  _validatorItems: Ember.computed('validate', function() {
    const form = this.get('validate').form;

    return Object.keys(form || {});
  }),

  /**
   * An object that holds the errors that emerge from the
   * validation process that can be passed into the component
   * @type {object}
   */
  validationErrors: Ember.computed(function() {
    return Object.create({});
  }),

  /**
   * Whether a validation error exists. Useful if realtime
   * validations are needed
   * @type {boolean}
   */
  validationErrorExists: Ember.computed('validationErrors', function() {
    const validationErrors = this.get('validationErrors');
    const errorKeys = Object.keys(validationErrors);

    return errorKeys.reduce((result, key) =>
      result || !!validationErrors[key], false);
  }),

  actions: {
    /**
     * Method that performs the validation process
     * @method validate
     * @return {boolean} - whether or not the form was successfully
     * validated
     */
    validate_form_action(formObj) {
      let key, form, formItems, validations, validationItems;
      const validationErrors = {};

      try {
        // The key that signifies the actual property the form exists as
        key = this.get('_validatorKey');
      }
      catch (err) {
        console.log('validate-form error: Unable to verify the form. Did you create ' +
          'a validate object property on your component?');
      }
      // Uses the key to get the form itself
      form = formObj || this.get(key);

      if (!form) {
        console.log('validate-form error: Unable to retrieve form. Did you create a ' +
          'form property or specify another object as the form property by using ' +
          'formName in validate?');
      }
      // Gets the properties on the form that will be checked
      formItems = Object.keys(form);
      // Validation criteria specified on the component by the user
      validations = this.get('validate').form;
      // Enumerates through the validator and gets the properties to be tested
      validationItems = this.get('_validatorItems');

      validationItems.forEach(item => {
        let formItem = form[item];

        validateItem(item, formItem, validations[item], validationErrors);
      });

      this.set('validationErrors', validationErrors);
    }
  }
});
