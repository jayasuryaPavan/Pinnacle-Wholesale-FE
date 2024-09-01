import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelPrinterComponent } from './label-printer.component';

describe('LabelPrinterComponent', () => {
  let component: LabelPrinterComponent;
  let fixture: ComponentFixture<LabelPrinterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelPrinterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
