import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconChooserComponent } from './icon-chooser.component';

describe('IconChooserComponent', () => {
  let component: IconChooserComponent;
  let fixture: ComponentFixture<IconChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconChooserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
