/* eslint-disable no-console */
import { getHistoricRates, Config } from '../src';

(async () => {
  try {
    const config: Config = {
      instrument: 'eurusd',
      dates: {
        from: 1653004800000
      },
      timeframe: 'h1',
      format: 'array',
      useCache: false,
      ignoreFlats: false
    };
    // console.log('fetching started');
    // console.log(JSON.stringify(config));
    const d1 = +new Date();
    const quotes = await getHistoricRates(config);
    const d2 = +new Date();
    // console.log('fetching success');
    console.log(JSON.stringify(quotes));
    console.log(`time ms: ${d2 - d1}`);
  } catch (error) {
    console.log('error', error);
  }
})();
