import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudioComplementarioDialogComponent } from './estudio-complementario-dialog.component';

describe('EstudioComplementarioDialogComponent', () => {
  let component: EstudioComplementarioDialogComponent;
  let fixture: ComponentFixture<EstudioComplementarioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstudioComplementarioDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudioComplementarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
