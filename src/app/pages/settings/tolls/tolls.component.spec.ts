import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TollsComponent } from './tolls.component';

describe('TollsComponent', () => {
  let component: TollsComponent;
  let fixture: ComponentFixture<TollsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
