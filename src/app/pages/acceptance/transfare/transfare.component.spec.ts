import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfareComponent } from './transfare.component';

describe('TransfareComponent', () => {
  let component: TransfareComponent;
  let fixture: ComponentFixture<TransfareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
