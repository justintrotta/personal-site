import { TestBed } from '@angular/core/testing';

import { InfoToRenderService } from './info-to-render.service';

describe('InfoToRenderService', () => {
  let service: InfoToRenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoToRenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
