import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarVariableComponent } from './toolbar-variable.component';

describe('ToolbarVariableComponent', () => {
  let component: ToolbarVariableComponent;
  let fixture: ComponentFixture<ToolbarVariableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarVariableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarVariableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
