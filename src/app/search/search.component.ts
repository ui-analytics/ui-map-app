import {Component, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Extent } from '../shared/models/extent';
import { MapService } from '../services/map.service';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'app-search',
  imports: [FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  constructor(private mapService: MapService) { }

  searchControl = new FormControl('');
  filteredOptions?: Observable<Extent[]>;
  extents: Extent[] = [];

  ngOnInit() {
    this.mapService.getExtents().subscribe((extents) => {
      this.extents = extents
      // console.log('EXTENTS',this.extents);
    })

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): Extent[] {
    const filterValue = value.toLowerCase();
    // console.log(filterValue);
    return this.extents.filter(option => option.name.toString().toLowerCase().includes(filterValue));
  }

  onSelectionChange(event: MatOptionSelectionChange, option:Extent) {
    console.log('selected:',option);
  }

}
