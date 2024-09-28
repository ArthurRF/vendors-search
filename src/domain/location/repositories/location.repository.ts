import { Injectable } from '@nestjs/common';
import { ILocation } from '../types/location.interfaces';

@Injectable()
export class LocationRepository {
  private locations: ILocation[] = [
    {
      id: 1,
      name: 'Glades',
      state: 'FL',
    },
    {
      id: 2,
      name: 'Gulf',
      state: 'FL',
    },
    {
      id: 3,
      name: 'Hamilton',
      state: 'FL',
    },
    {
      id: 4,
      name: 'Hardee',
      state: 'FL',
    },
    {
      id: 5,
      name: 'Hendry',
      state: 'FL',
    },
    {
      id: 6,
      name: 'El Paso',
      state: 'TX',
    },
    {
      id: 7,
      name: 'Erath',
      state: 'TX',
    },
    {
      id: 8,
      name: 'Falls',
      state: 'TX',
    },
    {
      id: 9,
      name: 'Fannin',
      state: 'TX',
    },
    {
      id: 10,
      name: 'Fayette',
      state: 'TX',
    },
    {
      id: 11,
      name: 'Fisher',
      state: 'TX',
    },
  ];

  getByName(name: string): ILocation | undefined {
    return this.locations.find(
      (location) =>
        `${location.name.toLowerCase()} ${location.state.toLowerCase()}` ===
        name.toLowerCase(),
    );
  }
}
