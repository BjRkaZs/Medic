import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CformComponent } from './cform.component';

describe('CformComponent', () => {
  let component: CformComponent;
  let fixture: ComponentFixture<CformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
