import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MapCategory } from '../../shared/models/map-category';
import { MapService } from '../../services/map.service'

import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MapVariable } from '../../shared/models/map-variable';


@Component({
  selector: 'app-toolbar-item',
  imports: [MatButtonToggleModule],
  templateUrl: './toolbar-item.component.html',
  styleUrl: './toolbar-item.component.css'
})
export class ToolbarItemComponent {
  

  @Input() category!: MapCategory;
  @Input() variable!: MapVariable;
  @Input() visible!: boolean;

  constructor(private mapService: MapService) {}

  ngAfterContentInit() {
    this.mapService.getCurrentCategory().subscribe((value) => {
      if (this.category.name == value.name) {
        this.visible = true;
      }
    });
  }
}
