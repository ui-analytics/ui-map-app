import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../../services/map.service'

import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MapVariable } from '../../shared/models/map-variable';


@Component({
  selector: 'app-toolbar-variable',
  imports: [MatButtonToggleModule],
  templateUrl: './toolbar-variable.component.html',
  styleUrl: './toolbar-variable.component.css'
})
export class ToolbarVariableComponent {
  @Input() variable!: MapVariable;
  @Input() visible!: boolean;

  constructor(private mapService: MapService) {}

  ngAfterContentInit() {
    if (this.variable.name == this.mapService.selectedVariable.name) {
      this.visible = true;
    }
  }

}
