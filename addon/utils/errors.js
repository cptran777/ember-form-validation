/*
 * The add error function is used throughout the mixin to add errors onto the error
 * object that has been passed in.
 */

/**
 * Sets up the default error message for a certain item
 * @param  {String} item - Property being evaluated
 * @return {String}
 */
const defaultError = (item) => {
  return `Error for ${item} detected`;
};

/**
 * Takes the specified item and uses the criteria object to add an error message to
 * the error message
 * @param {String} item     - Name of the property being evaluated
 * @param {String} errProp  - Property name for the error
 * @param {Object} criteria - Object that houses the user's specified criteria
 * @param {[type]} errors   - Object that houses the errors
 * @param {String} extra    - The type of extra validation being performed
 *                            that gave rise to the error
 * @return {undefined}
 */
export default function addError(item, errProp, criteria, errors, format, extra) {
  let test = null,
      message = null;

  if (format) {
    test = criteria[format];
    message = test[`${extra}Message`];
  }

  errors[item] = message ||
                 criteria[`${errProp}Message`] ||
                 criteria.message ||
                 defaultError(item);
}
