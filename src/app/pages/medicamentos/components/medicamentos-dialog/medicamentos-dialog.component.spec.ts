import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentosDialogComponent } from './medicamentos-dialog.component';

describe('MedicamentosDialogComponent', () => {
  let component: MedicamentosDialogComponent;
  let fixture: ComponentFixture<MedicamentosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicamentosDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
