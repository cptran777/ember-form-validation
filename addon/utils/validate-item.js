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

  if (criteria.required &&
     (!value || (typeof value === 'string' && value.length === 0))) {
    return;
  }

  return true;
}
