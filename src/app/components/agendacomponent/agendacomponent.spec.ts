import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Agendacomponent } from './agendacomponent';

describe('Agendacomponent', () => {
  let component: Agendacomponent;
  let fixture: ComponentFixture<Agendacomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Agendacomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Agendacomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
