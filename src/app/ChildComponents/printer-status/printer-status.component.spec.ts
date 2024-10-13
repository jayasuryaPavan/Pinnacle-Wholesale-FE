import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterStatusComponent } from './printer-status.component';

describe('PrinterStatusComponent', () => {
  let component: PrinterStatusComponent;
  let fixture: ComponentFixture<PrinterStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrinterStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrinterStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
