import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicacionMedicaDialogComponent } from './indicacion-medica-dialog.component';

describe('IndicacionMedicaDialogComponent', () => {
  let component: IndicacionMedicaDialogComponent;
  let fixture: ComponentFixture<IndicacionMedicaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicacionMedicaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicacionMedicaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
