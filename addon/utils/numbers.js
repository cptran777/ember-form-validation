import addError from 'ember-form-validation/utils/errors';
/*
 * Utilities functions related to extra testing validations for numbers
 */


/**
 * Validates a number type against optional criteria
 * @param  {String} value
 * @param  {Object} criteria
 * @param  {String} item
 * @param  {Object} errors
 * @return {undefined}
 */
export default function numberValiadtions(value, criteria, item, errors) {
  const test = criteria.number;
  const numVal = Number(value);

  let max, min;
  let maxMessage, minMessage;

  if (!test) {
    return;
  }

  min = test.min;
  if (min && numVal < min) {
    return addError(item, 'format', criteria, errors, 'number', 'min');
  }

  max = test.max;
  if (max && numVal > max) {
    return addError(item, 'format', criteria, errors, 'number', 'max');
  }
}
