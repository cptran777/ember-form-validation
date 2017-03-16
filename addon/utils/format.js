/*
 * The format util will take a string as input and the type of comparison to make
 * and test it against the specified regex (or a custom regex)
 */

import { FORMAT_ERROR } from 'ember-form-validation/constants/messages';

/**
 * An object of regex expressions that are used to check the
 * format specifications of the user
 * @type {object}
 */
const validationFormats = {
  word: /^\b[a-zA-Z]+\b$/,
  words: /^\b[a-zA-Z ]+\b$/,
  number: /^\b[0-9]+\b$/,
  fullname: /^\b[a-zA-Z]+\s[a-zA-Z]+$/,
  email: /^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  'date-MMYYYY': /^\b[0-1][0-9]\/[1-2][0-9]{3}\b$/,
  'date-MMDDYYYY': /^\b[0-1][0-9]\/[0-3][0-9]\/[1-2][0-9]{3}\b$/
};

/**
 * Takes a string input and type and compares to specified regex
 * @param  {String} type
 * @param  {String} inputString
 * @param  {String} custom
 * @return {Boolean}
 */
export default function formatTest(type, inputString, custom) {
  if (type === 'custom') {
    return custom.test(inputString);
  }

  try {
    return validationFormats[type].test(inputString);
  }
  catch (err) {
    console.log(new Error(FORMAT_ERROR));
  }
}
