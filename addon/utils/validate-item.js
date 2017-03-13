import addError from 'ember-form-validation/utils/errors';
import formatTest from 'ember-form-validation/utils/format';
import { testDate, dateValidations } from 'ember-form-validation/utils/dates';

/*
 * The validateItem function is used in the form-validation mixin to handle the
 * validation for a single item. Thus, this is also the main entry point for all
 * the single item validation utilities
 */

/**
 * Takes an item and related criteria and adds to the errors object/list if an
 * error is found
 * @param  {String} item      - name of property being evaluated
 * @param  {String} value     - value of the property being evaluated
 * @param  {Object} criteria  - object that houses the user's specified criteria
 * @param  {Object} errors    - object that houses the errors
 * @return {undefined}
 */
export default function validateItem(item, value, criteria, errors) {
  let format, customFormat;

  // First check to see if the item is required, and if so it has a valid value
  if (criteria.required &&
     (!value || (typeof value === 'string' && value.length === 0))) {
    return addError(item, 'required', criteria, errors);
  }
  // Priority check for a custom format, otherwise check for a regular format
  customFormat = criteria.customFormat;
  format = customFormat ? 'custom' : criteria.format;

  if (format && !formatTest(format, value, customFormat)) {
    return addError(item,
                    format === 'custom' ? 'customFormat' : 'format',
                    criteria,
                    errors);
  }
  // Setup additional tests if necessary
  switch (format) {
    case 'word':
    case 'words':
    case 'fullname':
      break;

    case 'number':
      break;

    case 'date-MMYYYY':
    case 'date-MMDDYYYY':
      break;

    case 'custom':
      break;

    default:
      // Hmm...
  }

  return true;
}
