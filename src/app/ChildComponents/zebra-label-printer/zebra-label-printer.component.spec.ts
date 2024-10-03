import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZebraLabelPrinterComponent } from './zebra-label-printer.component';

describe('ZebraLabelPrinterComponent', () => {
  let component: ZebraLabelPrinterComponent;
  let fixture: ComponentFixture<ZebraLabelPrinterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZebraLabelPrinterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZebraLabelPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
