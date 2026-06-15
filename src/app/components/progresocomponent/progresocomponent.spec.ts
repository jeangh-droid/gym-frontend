import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Progresocomponent } from './progresocomponent';

describe('Progresocomponent', () => {
  let component: Progresocomponent;
  let fixture: ComponentFixture<Progresocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Progresocomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Progresocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
