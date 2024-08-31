import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemNumberDialogComponent } from './item-number-dialog.component';

describe('ItemNumberDialogComponent', () => {
  let component: ItemNumberDialogComponent;
  let fixture: ComponentFixture<ItemNumberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemNumberDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemNumberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
