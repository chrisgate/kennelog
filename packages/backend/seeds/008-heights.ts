import * as Knex from 'knex';
import { insertMeasures, mergeIdAndData } from './util/common';

export async function seed(knex: Knex): Promise<any> {
  const measures = await insertMeasures(knex);

  const data = mergeIdAndData(measures, [
    { height: 50 },
    { height: 80 },
    { height: 100 }
  ]);

  return knex('heights').insert(data);
}
