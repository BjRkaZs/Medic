import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignfpassComponent } from './signfpass.component';

describe('SignfpassComponent', () => {
  let component: SignfpassComponent;
  let fixture: ComponentFixture<SignfpassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignfpassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignfpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
