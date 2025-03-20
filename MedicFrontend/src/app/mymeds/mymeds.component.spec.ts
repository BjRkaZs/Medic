import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MymedsComponent } from './mymeds.component';

describe('MymedsComponent', () => {
  let component: MymedsComponent;
  let fixture: ComponentFixture<MymedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MymedsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MymedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
