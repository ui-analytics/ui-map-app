import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonToggleModule, MatButtonToggleGroup } from '@angular/material/button-toggle'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MapCategory } from '../shared/models/map-category'

import { MapService } from "../services/map.service"
import { ToolbarItemComponent } from "./toolbar-item/toolbar-item.component";
import { MapVariable } from '../shared/models/map-variable';
import { ToolbarVariableComponent } from "./toolbar-variable/toolbar-variable.component";

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule, CommonModule, ToolbarItemComponent, MatButtonToggleModule, ToolbarVariableComponent,
    MatButtonModule,MatIconModule],
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
      console.log('current variable is:',value)
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
  isSidenavOpen?:boolean;


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
      this.getCategories();
      this.getVariableList();
      this.cdr.detectChanges();

      this.mapService.getSidenavOpen().subscribe((state)=>{
        this.isSidenavOpen = state;
      })
  }

  onToggleGroupChange(event:any) {
    let selectedValue = event.value
    let selectedCategory = this.categories.find((cat) => cat.name === selectedValue);
    if (selectedCategory) {
      this.mapService.updateCurrentCategory(selectedCategory);
      this.getVariableList();
    }
  }

  onToggleVariableChange(event:any) {
    let selectedValue = event.value
    let currentVariable = this.variables.find((v) => v.name === selectedValue);
    if (currentVariable) {
      console.log('Selected variable:', currentVariable.name, 'valueType:', currentVariable.valueType);
      this.mapService.updateCurrentVariable(currentVariable);
    } else {
      console.warn('Variable not found:', selectedValue);
    }
  }

  toggleSideNav() {
    this.isSidenavOpen = !this.isSidenavOpen;
    this.mapService.setSidenavOpen(this.isSidenavOpen);
  }
  
}

