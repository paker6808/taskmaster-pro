import { TestBed } from '@angular/core/testing';
import { MaterialModule } from './material.module';

describe('MaterialModule (smoke)', () => {
  it('should be importable in a test module', async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule]
    }).compileComponents();

    expect(MaterialModule).toBeDefined();
  });
});
