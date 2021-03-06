import * as Knex from 'knex';
import { uniq, random } from 'lodash';
import { getAllRecords } from './util/common';
import { MaleDogNames } from './data/male-dog-names';
import { FemaleDogNames } from './data/female-dog-names';

const randomDate = (start, end = new Date()) => {
  return new Date(Math.ceil(random(start.getTime(), end.getTime(), false)))
    .toISOString()
    .substr(0, 10);
};

const randomName = gender => {
  const names = gender === 'M' ? MaleDogNames : FemaleDogNames;
  const name = Math.random() < 0.5 ? names[random(0, names.length - 1)] : '';
  return name;
};

const generateDog = (breed, user) => {
  const gender = Math.random() > 0.5 ? 'M' : 'F';
  return {
    name: randomName(gender),
    dateOfBirth: randomDate(new Date('2001-01-01')),
    gender: gender,
    ownerId: user,
    breederId: user,
    breedId: breed,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

const generateMicrochipNos = length =>
  Array(length)
    .fill(0)
    .map(() => `${random(100000000000000, 999999999999999)}`.substr(0, 15));

const setMicrochipNos = dogs => {
  // generate random 15 digit numbers
  const microchipNos = uniq(generateMicrochipNos(dogs.length));

  return dogs.map((dog, i) => {
    // map microchips onto dogs
    dog.microChipNo = i >= microchipNos.length ? '' : microchipNos[i];
    return dog;
  });
};

const generateDogs = (length, breeds, users) => {
  // create the dogs (without microchip nos)
  const dogs = Array(length)
    .fill(0)
    .map(() =>
      generateDog(
        breeds[random(0, breeds.length - 1)].id,
        users[random(0, users.length - 1)].id
      )
    );

  // return the dogs with the microchip nos
  return setMicrochipNos(dogs);
};

export async function seed(knex: Knex): Promise<any> {
  const breeds = await getAllRecords(knex, 'breeds');
  const users = await getAllRecords(knex, 'users');
  // Deletes ALL existing entries
  return knex('dogs')
    .del()
    .then(async () => {
      // Inserts seed entries
      return knex('dogs')
        .insert(generateDogs(100, breeds, users))
        .insert(generateDogs(100, breeds, users));
    });
}
