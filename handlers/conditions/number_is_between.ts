import { ConditionCardArgs, ConditionCardOptions } from '../../types/types';
import { MockConditionCardOptions } from '../../types/tests.types';

import hasData from "../../lib/has-data";

export default (options: ConditionCardOptions | MockConditionCardOptions): boolean => {
  const { app } = options;
  const { value1, value2, value3, includes } = options.args as ConditionCardArgs;

  if (value1 === undefined || !hasData<number>(value1) || value2 === undefined || !hasData<number>(value2) ||
    value3 === undefined || !hasData<number>(value3) || includes === undefined || !hasData<string>(includes)) {
    app.logError('number_is_between: Argument \'value1\' or \'value2\' or \'value3\' or \'includes\' missing...');
    return false;
  }

  return includes.toLowerCase() === 'true'
    ? value1 >= value2 && value1 <= value3
    : value1 > value2 && value1 < value3;
};
