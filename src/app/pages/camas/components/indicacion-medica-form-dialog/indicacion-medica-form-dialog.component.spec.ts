import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicacionMedicaFormDialogComponent } from './indicacion-medica-form-dialog.component';

describe('IndicacionMedicaFormDialogComponent', () => {
  let component: IndicacionMedicaFormDialogComponent;
  let fixture: ComponentFixture<IndicacionMedicaFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicacionMedicaFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicacionMedicaFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
