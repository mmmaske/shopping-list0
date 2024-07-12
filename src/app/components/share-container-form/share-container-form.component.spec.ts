import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareContainerFormComponent } from './share-container-form.component';

describe('ShareContainerFormComponent', () => {
  let component: ShareContainerFormComponent;
  let fixture: ComponentFixture<ShareContainerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShareContainerFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareContainerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
