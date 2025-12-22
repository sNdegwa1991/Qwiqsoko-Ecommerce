import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugsShoppingComponent } from './drugs-shopping.component';

describe('DrugsShoppingComponent', () => {
  let component: DrugsShoppingComponent;
  let fixture: ComponentFixture<DrugsShoppingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugsShoppingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrugsShoppingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
