import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ejercicioscomponent } from './ejercicioscomponent';

describe('Ejercicioscomponent', () => {
  let component: Ejercicioscomponent;
  let fixture: ComponentFixture<Ejercicioscomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ejercicioscomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Ejercicioscomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
