import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterOutlet } from '@angular/router';
import { MapComponent } from "./map/map.component";
import { ToolbarComponent } from './toolbar/toolbar.component';

import { projectConfig } from './projectConfig';

import { MapService } from './services/map.service';
import { MapCategory } from './shared/models/map-category';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MapComponent, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private mapService: MapService) { }

  async initializeApp() {
    await this.getProject(projectConfig.projectId);
  }

  title = 'angular-app';
  projectName = '';
  projectId?:number;

  getProject(id: number): void {
    this.mapService.getProject(id)
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
}

