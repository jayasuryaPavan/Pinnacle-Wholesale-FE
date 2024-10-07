import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoCanvasComponent } from './logo-canvas.component';

describe('LogoCanvasComponent', () => {
  let component: LogoCanvasComponent;
  let fixture: ComponentFixture<LogoCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
