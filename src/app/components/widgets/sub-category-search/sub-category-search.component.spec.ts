import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategorySearchComponent } from './sub-category-search.component';

describe('SubCategorySearchComponent', () => {
  let component: SubCategorySearchComponent;
  let fixture: ComponentFixture<SubCategorySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCategorySearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubCategorySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
