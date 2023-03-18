import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientePageComponent } from './paciente-page.component';

describe('PacientePageComponent', () => {
  let component: PacientePageComponent;
  let fixture: ComponentFixture<PacientePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PacientePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PacientePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
