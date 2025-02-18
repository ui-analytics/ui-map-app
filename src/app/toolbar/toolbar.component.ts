import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonToggleModule, MatButtonToggleGroup } from '@angular/material/button-toggle'

import { MapCategory } from '../shared/models/map-category'

import { MapService } from "../services/map.service"
import { ToolbarItemComponent } from "./toolbar-item/toolbar-item.component";
import { MapVariable } from '../shared/models/map-variable';
import { ToolbarVariableComponent } from "./toolbar-variable/toolbar-variable.component";

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule, CommonModule, ToolbarItemComponent, MatButtonToggleModule, ToolbarVariableComponent],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent implements AfterViewInit {

  private categorySubscription:Subscription;
  private variableSubscription:Subscription;

  constructor(private mapService: MapService, private cdr: ChangeDetectorRef) { 
    this.categorySubscription = this.mapService.getCurrentCategory().subscribe((value) => {
      // console.log('current category is:',value)
      this.selectedCategory = value;
      this.variableList = this.selectedCategory.mapVariables;
      // console.log(' map variables available are', this.variableList)
    });

    this.variableSubscription = this.mapService.getCurrentVariable().subscribe((value) => {
      // console.log('current variable is:',value)
      this.selectedVariable = value;
    });

  }

  @Input() toolbar_name: string = '';
  categories: MapCategory[] = [];
  selectedCategory?: MapCategory;
  variableList: Number[] =  [];

  variables: MapVariable[] = [];
  selectedVariable?: MapVariable;

  hideSelection = signal(false);


  getCategories(): void {
      this.mapService.getMapCategories()
      .subscribe(mc => {
        this.categories = mc
      })
    }

    getVariableList(): void {
      this.mapService.getMapVariables(this.variableList).subscribe((mv) => {
        this.variables = mv;
      })
    }

    ngAfterViewInit(): void {
      console.log('t');
      this.getCategories();
      this.getVariableList();
      this.cdr.detectChanges();
  }

  onToggleGroupChange(event:any) {
    let selectedValue = event.value
    let selectedCategory = this.categories.filter((cat) => cat.name === selectedValue).reduce((acc: any, it) => it, { })
    this.mapService.updateCurrentCategory(selectedCategory);
    this.getVariableList();
    // this.mapService.updateCurrentVariable(this.variables[0]);
    
  }

  onToggleVariableChange(event:any) {
    let selectedValue = event.value
    let currentVariable = this.variables.filter((cat) => cat.name === selectedValue).reduce((acc: any, it) => it, { })
    this.mapService.updateCurrentVariable(currentVariable);
    
  }

  
}

