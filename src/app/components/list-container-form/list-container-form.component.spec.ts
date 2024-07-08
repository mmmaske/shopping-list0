import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContainerFormComponent } from './list-container-form.component';

describe('ListContainerFormComponent', () => {
  let component: ListContainerFormComponent;
  let fixture: ComponentFixture<ListContainerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListContainerFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListContainerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
