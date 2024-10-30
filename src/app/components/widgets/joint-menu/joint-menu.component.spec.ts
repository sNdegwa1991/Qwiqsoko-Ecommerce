import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JointMenuComponent } from './joint-menu.component';

describe('JointMenuComponent', () => {
  let component: JointMenuComponent;
  let fixture: ComponentFixture<JointMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JointMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JointMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
