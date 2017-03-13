import addError from 'ember-form-validation/utils/errors';
/*
 * Utilities functions related to extra testing validations for words
 */

/**
 * Validates a word type value against certain extra criteria the user may want
 * @param  {String} format    - specified word format
 * @param  {String} value     - value to be tested
 * @param  {Object} criteria  - general object for test criteria
 * @param  {String} item      - property being tested
 * @param  {Object} errors    - errors object to add to if needed
 * @return {undefined}
 */
export default function wordValidations(format, value, criteria, item, errors) {
  const test = criteria[format];

  let minLength, maxLength;
  let minLengthMessage, maxLengthMessage;

  if (!test) {
    return;
  }

  minLength = test.minLength;
  if (minLength && value < minLength) {
    return addError(item, 'format', criteria, errors, format, 'minLength');
  }

  maxLength = test.maxLength;
  if (maxLength && value > maxLength) {
    return addError(item, 'format', criteria, errors, format, 'maxLength');
  }
}
