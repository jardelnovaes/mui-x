import createDescribe from '@mui-internal/test-utils/createDescribe';
import { MuiPickersAdapter } from '@mui/x-date-pickers';
import { testCalculations } from './testCalculations';
import { testLocalization } from './testLocalization';
import { DescribeJalaliAdapterParams } from './describeJalaliAdapter.types';

function innerJalaliDescribeAdapter<TDate>(
  Adapter: new (...args: any) => MuiPickersAdapter<TDate>,
  params: DescribeJalaliAdapterParams,
) {
  const adapter = new Adapter();

  describe(adapter.lib, () => {
    const testSuitParams = {
      ...params,
      adapter,
    };

    if (params.before) {
      before(params.before);
    }

    if (params.after) {
      after(params.after);
    }

    testCalculations(testSuitParams);
    testLocalization(testSuitParams);
  });
}

export const describeJalaliAdapter = createDescribe('Adapter methods', innerJalaliDescribeAdapter);
