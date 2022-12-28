const { getHistoricalRates } = require('dukascopy-node');

(async () => {
  try {
    const data = await getHistoricalRates({
      instrument: 'eurusd',
      dates: {
        from: new Date('2022-12-01'),
        to: new Date('2022-12-28')
      },
      timeframe: 'm5',
      format: 'csv'
    });

    console.log(data);
  } catch (error) {
    console.log('error', error);
  }
})();
