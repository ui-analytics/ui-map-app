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
export class ToolbarItemComponent implements OnInit {
  

  @Input() category!: MapCategory;
  @Input() variable!: MapVariable;
  @Input() visible!: boolean;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    // console.log(this.category.name)
  }

  ngAfterContentInit() {
    if (this.category.name == this.mapService.selectedCategory.name) {
      this.visible = true;
    }
  }
}
