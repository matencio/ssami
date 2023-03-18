import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DosisMedicamentoDialogComponent } from './dosis-medicamento-dialog.component';

describe('DosisMedicamentoDialogComponent', () => {
  let component: DosisMedicamentoDialogComponent;
  let fixture: ComponentFixture<DosisMedicamentoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DosisMedicamentoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DosisMedicamentoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
