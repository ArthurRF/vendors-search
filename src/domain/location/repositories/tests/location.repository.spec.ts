import { ILocation } from '../../types/location.interfaces';
import { LocationRepository } from '../location.repository';

describe('LocationRepository', () => {
  let locationRepository: LocationRepository;

  beforeEach(() => {
    locationRepository = new LocationRepository();
  });

  it('should find a location by name and state', () => {
    const locationName = 'Fayette TX';
    const expectedLocation: ILocation = {
      id: 10,
      name: 'Fayette',
      state: 'TX',
    };

    const foundLocation = locationRepository.getByName(locationName);

    expect(foundLocation).toEqual(expectedLocation);
  });

  it('should return undefined if location does not exist', () => {
    const locationName = 'Invalid Location';
    const foundLocation = locationRepository.getByName(locationName);

    expect(foundLocation).toBeUndefined();
  });

  it('should find the correct location ignoring case sensitivity', () => {
    const locationName = 'Fayette TX';
    const expectedLocation: ILocation = {
      id: 10,
      name: 'Fayette',
      state: 'TX',
    };

    const foundLocation = locationRepository.getByName(locationName);

    expect(foundLocation).toEqual(expectedLocation);
  });
});
