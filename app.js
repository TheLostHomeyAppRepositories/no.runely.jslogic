'use strict';

const { sentry, init } = require('./lib/sentry-io'); // { sentry, init, startTransaction }

const Homey = require('homey');
const moment = require('moment');

const checkDateTime = require('./lib/check-date-time');

const tokens = [];

class MyApp extends Homey.App {
  onInit() {
    this.log(Homey.manifest.name.en + ' v' + Homey.manifest.version + ' is running...');

    // initialize sentry.io
    init(Homey);
    this.sentry = sentry;

    // flow tokens
    new Homey.FlowToken('formatted_date', { type: 'string', title: Homey.__('flowTokens.formatted_date') })
      .register()
      .then(token => tokens.push(token));

    // actions
    new Homey.FlowCardAction('get_formatted_date')
      .register()
      .registerRunListener(async (args, state) => {
        const day = moment().add(args.daysToAdd, 'days');

        tokens[0].setValue(day.format(args.format));

        return Promise.resolve(true);
      });

    // conditions
    new Homey.FlowCardCondition('value_in_array')
      .register()
      .registerRunListener((args, state) => {
        if (!args.array) {
          return Promise.resolve(false);
        }

        if (!args.value) {
          return Promise.resolve(false);
        }

        const array = args.array.split(';');
        const caseSensitive = (args.casesenitive === 'true');
        let value = (typeof args.value === 'string' ? args.value.trim() : args.value);

        if (!caseSensitive) {
          value = value.toLowerCase();
        }

        this.log('value_in_array: Array items:', array);
        this.log('value_in_array: Case sensitive:', caseSensitive);
        this.log('value_in_array: Value:', value);

        const result = array.some(item => {
          const arrayItem = (!caseSensitive ? item.toLowerCase() : item);
          return (arrayItem === value);
        });
        this.log('value_in_array: Is value in array:', result);

        return Promise.resolve(result);
      });

    new Homey.FlowCardCondition('value_empty')
      .register()
      .registerRunListener((args, state) => {
        if (args.value) {
          this.log('value_empty: Value:', args.value);
          const result = (args.value === undefined || args.value === '' || args.value === ' ');
          this.log('value_empty: Is value undefined, empty or one whitespce:', result);
          return Promise.resolve(result);
        }

        return Promise.resolve(true);
      });

    new Homey.FlowCardCondition('value_too_long')
      .register()
      .registerRunListener((args, state) => {
        if (!args.maxLength) {
          return Promise.resolve(false);
        }

        if (!args.value) {
          return Promise.resolve(true);
        }

        const value = args.value.trim();
        this.log('value_too_long: Value:', value);
        this.log('value_too_long: Length:', value.length);
        this.log('value_too_long: MaxLength:', args.maxLength);
        const result = (value.length < args.maxLength);
        this.log('value_too_long: Is value length too long:', result);
        return Promise.resolve(result);
      });

    new Homey.FlowCardCondition('value_contains_array')
      .register()
      .registerRunListener((args, state) => {
        if (!args.array) {
          return Promise.resolve(false);
        }

        if (!args.value) {
          return Promise.resolve(false);
        }

        const array = args.array.split(';');
        const caseSensitive = (args.casesenitive === 'true');
        let value = (typeof args.value === 'string' ? args.value.trim() : args.value);

        if (!caseSensitive) {
          value = value.toLowerCase();
        }

        this.log('value_contains_array: Case sensitive:', caseSensitive);
        this.log('value_contains_array: Array items:', array);
        this.log('value_contains_array: Value:', value);

        const result = array.some(item => {
          const arrayItem = (!caseSensitive ? item.toLowerCase() : item);
          return (value.includes(arrayItem));
        });
        this.log('value_contains_array: Value contains one of:', result);
        return Promise.resolve(result);
      });

    new Homey.FlowCardCondition('date_before_date')
      .register()
      .registerRunListener((args, state) => {
        if (!args.dateOne) {
          return Promise.resolve(false);
        }

        if (!args.dateTwo) {
          return Promise.resolve(false);
        }

        return checkDateTime(this, args.dateOne, args.dateTwo, 'DateOne', 'DateTwo', 'date_before_date');
      });

    new Homey.FlowCardCondition('time_before_time')
      .register()
      .registerRunListener((args, state) => {
        if (!args.timeOne) {
          return Promise.resolve(false);
        }

        if (!args.timeTwo) {
          return Promise.resolve(false);
        }

        return checkDateTime(this, args.timeOne, args.timeTwo, 'TimeOne', 'TimeTwo', 'time_before_time');
      });

    new Homey.FlowCardCondition('datetime_before_datetime')
      .register()
      .registerRunListener((args, state) => {
        if (!args.dateTimeOne) {
          return Promise.resolve(false);
        }

        if (!args.dateTimeTwo) {
          return Promise.resolve(false);
        }

        return checkDateTime(this, args.dateTimeOne, args.dateTimeTwo, 'DateTimeOne', 'DateTimeTwo', 'datetime_before_datetime');
      });

    new Homey.FlowCardCondition('is_random_true_false')
      .register()
      .registerRunListener((args, state) => {
        const random = Math.random();
        const result = random > 0.5;
        this.log(`is_random_true_false: ${random} > 0.5 == ${result}`);
        return Promise.resolve(result);
      });

    new Homey.FlowCardCondition('daynum_between_daynum')
      .register()
      .registerRunListener((args, state) => {
        if (!args.dayOne) {
          this.log('daynum_between_daynum: Argument \'dayOne\' missing...');
          return Promise.resolve(false);
        }

        if (!args.dayTwo) {
          this.log('daynum_between_daynum: Argument \'dayTwo\' missing...');
          return Promise.resolve(false);
        }

        const today = new Date().getDate();
        const first = args.dayOne;
        const second = args.dayTwo;

        this.log(`daynum_between_daynum: Todays date: '${today}'`);
        this.log(`daynum_between_daynum: First  date: '${first}'`);
        this.log(`daynum_between_daynum: Second date: '${second}'`);

        // today is inside first and second
        if (today >= first && today <= second) {
          this.log(`daynum_between_daynum: Today(${today}) is (>= to first(${first}) && <= to second(${second})). Inside for this month!`);
          return Promise.resolve(true);
        }

        // second is lower than first and today is greater than first and greater than second (still inside for this month)
        if (second < first && today >= first && today >= second) {
          this.log(`daynum_between_daynum: Second(${second}) is < first(${first}) && today(${today}) is (>= to first(${first}) && >= to second(${second})). Inside for this month!`);
          return Promise.resolve(true);
        }

        // second is lower than first and today is greater than or equal to first and lower than or equal second (still inside for next month)
        if (second < first && today >= first && today <= second) {
          this.log(`daynum_between_daynum: Second(${second}) is < first(${first}) && today(${today}) is (>= to first(${first}) && <= to second(${second})). Inside for next month!`);
          return Promise.resolve(true);
        }

        // second is lower than first and today is lower than first and lower than second (still inside for next month)
        if (second < first && today < first && today <= second) {
          this.log(`daynum_between_daynum: Second(${second}) is < first(${first}) && today(${today}) is (< to first(${first}) && <= to second(${second})). Inside for next month!`);
          return Promise.resolve(true);
        }

        this.log('daynum_between_daynum: Not inside!');
        return Promise.resolve(false);
      });

    new Homey.FlowCardCondition('monthnum_between_monthnum')
      .register()
      .registerRunListener((args, state) => {
        if (!args.monthOne) {
          this.log('monthnum_between_monthnum: Argument \'monthOne\' missing...');
          return Promise.resolve(false);
        }

        if (!args.monthTwo) {
          this.log('monthnum_between_monthnum: Argument \'monthTwo\' missing...');
          return Promise.resolve(false);
        }

        const today = new Date().getMonth();
        const first = args.monthOne;
        const second = args.monthTwo;

        this.log(`monthnum_between_monthnum: Todays month: '${today}'`);
        this.log(`monthnum_between_monthnum: First  month: '${first}'`);
        this.log(`monthnum_between_monthnum: Second month: '${second}'`);

        // today is inside first and second
        if (today >= first && today <= second) {
          this.log(`monthnum_between_monthnum: Today(${today}) is (>= to first(${first}) && <= to second(${second})). Inside this year!`);
          return Promise.resolve(true);
        }

        // second is lower than first and today is greater than or equal to first and lower than or equal second (still inside for next year)
        if (second < first && today >= first && today <= second) {
          this.log(`monthnum_between_monthnum: Second(${second}) is < first(${first}) && today(${today}) is (>= to first(${first}) && <= to second(${second})). Inside for next year!`);
          return Promise.resolve(true);
        }

        this.log('monthnum_between_monthnum: Not inside!');
        return Promise.resolve(false);
      });
  }
}

module.exports = MyApp;
