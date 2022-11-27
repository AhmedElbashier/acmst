import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraservicesComponent } from './extraservices.component';

describe('ExtraservicesComponent', () => {
  let component: ExtraservicesComponent;
  let fixture: ComponentFixture<ExtraservicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraservicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
