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

  let over, under;
  let overMessage, underMessage;

  if (!test) {
    return;
  }

  under = test.under;
  if (under && numVal >= under) {
    return addError(item, 'format', criteria, errors, format, 'under');
  }

  over = test.over;
  if (over && numVal <= over) {
    return addError(item, 'format', criteria, errors, format, 'over');
  }
}
