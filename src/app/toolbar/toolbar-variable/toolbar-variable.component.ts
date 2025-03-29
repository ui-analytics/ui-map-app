import { Component, Input, OnInit, ViewChild, signal } from '@angular/core';
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
  varVisible?: boolean = false;
  @Input() id!:number;
  disabled?:boolean = false;
  backgroundColor:string = "#000000"

  variableList: Number[] =  []
  variables: MapVariable[] = [];
  hideSelection = signal(false);

  constructor(private mapService: MapService) {}

  getVariableList(): void {
    this.mapService.getMapVariables(this.variableList).subscribe((mv) => {
      this.variables = mv;
    })
  }

  ngOnInit() {
    this.getVariableList();
    this.mapService.getCurrentVariable()
    .subscribe((cv) => {
      if (this.variable.name == cv.name) {
        this.varVisible = true;
        // console.log('change', this.varVisible, this.variable.name, cv.name);
      } else {
        this.varVisible = false;
      }

      if (this.variable.disabled == true) {
        this.disabled = true;
        this.backgroundColor ="#555555"
        // this.backgroundColor = "#61646b"
      }
    });
  }

  onToggleVariableChange(event:any) {
    console.log('change')
    let selectedValue = event.value
    let currentVariable = this.variables.filter((cat) => cat.name === selectedValue).reduce((acc: any, it) => it, { })
    console.log(currentVariable);
    this.mapService.updateCurrentVariable(currentVariable);
  }

}
