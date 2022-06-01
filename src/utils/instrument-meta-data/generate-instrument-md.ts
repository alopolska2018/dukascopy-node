/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { getFormattedDate } from '../date';
import { titleMap } from './generate-instrument-title-map';
import { InstrumentMetaData } from './generate-meta';

import instrumentGroups from './generated/instrument-groups.json';
import instrumentMetaData from './generated/instrument-meta-data.json';

const saveFile = promisify(fs.writeFile);

const filePath = path.resolve(__dirname, 'generated', 'instruments.md');

(async () => {
  try {
    const contentListHeader = '## Instruments\n';
    const contentList = instrumentGroups
      .map(
        ({ id, instruments }) =>
          `* [${titleMap[id].title} ${titleMap[id].emoji} (${instruments.length})](#${id})`
      )
      .join('\n');

    const contentBody = [contentListHeader, contentList, '<hr>'].join('\n');

    const headers = [
      'Instrument',
      // 'Name',
      'id',
      'Earliset tick data (UTC)',
      'Earliset minute data (UTC)',
      'Earliset hour data (UTC)',
      'Earliset day data (UTC)'
    ];

    const header = headers.map((h, i) => `${!i ? '|' : ''}${h}|`).join('');
    const divider = headers.map((_, i) => `${!i ? '|' : ''}-|`).join('');

    const instrumentTable = instrumentGroups
      .map(({ id, instruments }) => {
        const groupTitle = `<h3 id="${id}">${titleMap[id].title} ${
          titleMap[id].emoji || ''
        }</h3>\n`;

        const listBody = instruments
          .map(instrumentId => {
            const {
              description,
              startHourForTicks,
              startDayForMinuteCandles,
              startMonthForHourlyCandles,
              startYearForDailyCandles
            } = instrumentMetaData[
              instrumentId as keyof typeof instrumentMetaData
            ] as InstrumentMetaData;

            const line = [
              description,
              `\`${instrumentId}\``,
              getFormattedDate(startHourForTicks, {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
              }),
              getFormattedDate(startDayForMinuteCandles, { hour: 'numeric', minute: 'numeric' }),
              getFormattedDate(startMonthForHourlyCandles, { hour: 'numeric' }),
              getFormattedDate(startYearForDailyCandles)
            ].join('|');

            return `|${line}|`;
          })
          .join('\n');

        return [groupTitle, header, divider, listBody].join('\n');
      })
      .join('\n');

    await saveFile(filePath, [contentBody, instrumentTable].join('\n'));
    console.log('Created file');
  } catch (err) {
    console.log(err);
  }
})();
