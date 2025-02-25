import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterOutlet } from '@angular/router';
import { MapComponent } from "./map/map.component";
import { ToolbarComponent } from './toolbar/toolbar.component';

import { projectConfig } from './projectConfig';

import { MapService } from './services/map.service';
import { MapCategory } from './shared/models/map-category';
import { TimeSliderComponent } from "./time-slider/time-slider.component";

import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MapComponent, ToolbarComponent, TimeSliderComponent,TimeSliderComponent,MatSidenavModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private mapService: MapService) { }

  async initializeApp() {
    await this.setProject(projectConfig.projectId);
  }

  title = 'angular-app';
  projectName = '';
  projectId?:number;

  isSidenavOpen = true;


  setProject(id: number): void {
    this.mapService.getProjectById(id)
      .subscribe(project => {
        this.mapService.project = project;
        this.projectName = project.name;
        this.projectId = project.projectId
      });
  }

  ngOnInit() {
    this.initializeApp().then(r => {
      return r;
    });
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}

