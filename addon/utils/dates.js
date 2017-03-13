import addError from 'ember-form-validation/utils/errors';
/*
 * Utilities functions related to testing validations for dates
 */

/**
 * Tests to see if a date matches a specified format (this is after it has passed
 * the regex test and will see if the actual numbers make sense)
 * @param  {String} dateString
 * @param  {String} format
 * @return {Boolean}
 */
const testDate = (dateString, format) => {
  // Take the date string and turn it into an array of parts as integers
  const dateArray = dateString.split('/').map(part => Number(part));
  const dateLength = dateArray.length;
  const year = dateArray[dateLength - 1];
  const month = dateArray[0];
  const day = format === 'MMDDYYYY' ? dateArray[1] : null;

  const dateMap = {
    month: 12,
    day: [31, year % 4 === 0 ? 29 : 28, 31,
      30, 31, 30, 31, 31, 30, 31, 30, 31]
  };

  // Check the month
  if (month > dateMap.month || month < 0) {
    return false;
  }
  // Check the day if necessary
  if (format === 'MMDDYYYY' && (day > dateMap.day[month - 1] || day < 0)) {
    return false;
  }

  return true;
};

const dateValidations = (format, value, criteria, item, errors) => {
  const test = criteria.date;
  const dateArray = value.split('/').map(val => Number(val));
  const dateLength = dateArray.length;

  let dateValue, dateYear, dateMonth, dateDay;
  let before, after;
  let beforeMessage, afterMessage;
  let beforeArray, afterArray;
  let beforeDate, afterDate;
  let beforeYear, beforeMonth, beforeDay;
  let afterYear, afterMonth, afterDay;

  if (!test) {
    return;
  }

  dateYear = dateArray[dateLength - 1];
  dateMonth = dateArray[0];
  dateDay = format === 'date-MMDDYYYY' ? dateArray[1] : null;
  dateValue = new Date(dateYear, dateMonth, dateDay);

  before = test.before;
  if (before) {
    beforeArray = before.split('/').map(val => Number(val));
    beforeYear = beforeArray[beforeArray.length - 1];
    beforeMonth = beforeArray[0];
    beforeDay = format === 'date-MMDDYYYY' ? beforeArray[1] : null;
    beforeDate = new Date(beforeYear, beforeMonth, beforeDay);

    if (dateValue > beforeDate) {
      return addError(item, 'format', criteria, errors, 'date', 'before');
    }
  }

  after = test.after;
  if (after) {
    afterArray = after.split('/').map(val => Number(val));
    afterYear = afterArray[afterArray.length - 1];
    afterMonth = afterArray[0];
    afterDay = format === 'date-MMDDYYYY' ? afterArray[1] : null;
    afterDate = new Date(afterYear, afterMonth, afterDay);

    if (dateValue < afterDate) {
      return addError(item, 'format', criteria, errors, 'date', 'after');
    }
  }
};

export {
  testDate,
  dateValidations
};
