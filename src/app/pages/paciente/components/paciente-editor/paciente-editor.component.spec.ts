import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteEditorComponent } from './paciente-editor.component';

describe('PacienteEditorComponent', () => {
  let component: PacienteEditorComponent;
  let fixture: ComponentFixture<PacienteEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PacienteEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
