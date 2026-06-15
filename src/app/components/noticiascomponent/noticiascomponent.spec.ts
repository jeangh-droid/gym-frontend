import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Noticiascomponent } from './noticiascomponent';

describe('Noticiascomponent', () => {
  let component: Noticiascomponent;
  let fixture: ComponentFixture<Noticiascomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Noticiascomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Noticiascomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
