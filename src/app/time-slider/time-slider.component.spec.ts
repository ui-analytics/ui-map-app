import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-slider.component.html',
  styleUrls: ['./time-slider.component.css']
})
export class TimeSliderComponent {
  @Input() compact = false;   // 
}
