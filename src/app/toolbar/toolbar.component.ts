import { AfterViewInit, Component, Input, OnChanges, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonToggleModule, MatButtonToggleGroup } from '@angular/material/button-toggle'

import { MapCategory } from '../shared/models/map-category'

import { MapService } from "../services/map.service"
import { ToolbarItemComponent } from "./toolbar-item/toolbar-item.component";
import { MapVariable } from '../shared/models/map-variable';
import { ToolbarVariableComponent } from "./toolbar-variable/toolbar-variable.component";

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule, CommonModule, ToolbarItemComponent, MatButtonToggleModule, ToolbarVariableComponent],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent implements OnInit {

  constructor(private mapService: MapService) { }

  @Input() toolbar_name: string = '';
  categories: MapCategory[] = [];
  variables: MapVariable[] = [];
  hideSelection = signal(false);

  defaultValue:String = 'Demographics';

  getCategories(): void {
      this.mapService.getMapCategories()
      .subscribe(mc => {
        this.mapService.mapCategories = mc
      })
    }

  getVariables(): void {
    this.mapService.getMapVariables()
    .subscribe(mv => {
      this.mapService.mapVariables = mv
    })
  }

  ngOnInit(): void {
    this.getCategories()
    this.categories = this.mapService.mapCategories
    if (this.categories.length > 0){
      this.mapService.selectedCategory = this.mapService.mapCategories[0]
      this.getVariables()
      this.variables = this.mapService.mapVariables
      if (this.variables.length > 0) {
        this.mapService.selectedVariable = this.mapService.mapVariables[0]
      }
    }
  }

  onToggleGroupChange(event:any) {
    let selectedValue = event.value
    this.mapService.selectedCategory = this.categories.filter((cat) => cat.name === selectedValue).reduce((acc: any, it) => it, { })
    this.getVariables()
    this.variables = this.mapService.mapVariables
      if (this.variables.length > 0) {
        this.mapService.selectedVariable = this.mapService.mapVariables[0]
        this.mapService.updateCurrentVariable(this.mapService.selectedVariable);
      }
  }

  onToggleVariableChange(event:any) {
    let selectedValue = event.value
    this.mapService.selectedVariable = this.variables.filter((cat) => cat.name === selectedValue).reduce((acc: any, it) => it, { })
    this.mapService.updateCurrentVariable(this.mapService.selectedVariable);
  }

  
}

