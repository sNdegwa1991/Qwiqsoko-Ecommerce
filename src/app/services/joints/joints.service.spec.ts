import { TestBed } from '@angular/core/testing';

import { JointsService } from './joints.service';

describe('JointsService', () => {
  let service: JointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
