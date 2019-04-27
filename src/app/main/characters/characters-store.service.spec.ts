import { TestBed } from '@angular/core/testing';

import { CharactersStoreService } from './characters-store.service';

describe('CharactersStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CharactersStoreService = TestBed.get(CharactersStoreService);
    expect(service).toBeTruthy();
  });
});
