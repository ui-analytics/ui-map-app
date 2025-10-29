import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, of, Subscription, switchMap } from 'rxjs';
import { Chart, registerables } from 'chart.js';

import { MapService } from '../../services/map.service';
import { MapVariable } from '../../shared/models/map-variable';

@Component({
  selector: 'app-variable-line-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './variable-line-chart.component.html',
  styleUrls: ['./variable-line-chart.component.css']
})
export class VariableLineChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  private subs: Subscription[] = [];

  selectedId: string | null = null;
  variable?: MapVariable;
  loading = true;
  dataEmpty = true;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    // Ensure default controllers/elements are registered when not using 'chart.js/auto'
    Chart.register(...registerables);
    const sub = combineLatest([
      this.mapService.getCurrentVariable(),
      this.mapService.getSelectedLocationId()
    ])
      .pipe(
        switchMap(([variable, selectedId]) => {
          this.variable = variable;
          this.selectedId = selectedId;
          if (!selectedId) {
            return of([]);
          }
          return this.mapService.getTimeSeriesForVariable(variable, selectedId);
        })
      )
      .subscribe((series) => {
        this.loading = false;
        this.dataEmpty = series.length === 0 || !this.selectedId;
        this.renderChart(series);
      });

    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private renderChart(series: Array<{ year: number; value: number }>): void {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (!this.chart) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: series.map((d) => d.year.toString()),
          datasets: [
            {
              label: this.variable?.name || 'Variable',
              data: series.map((d) => d.value),
              borderColor: '#1976d2',
              backgroundColor: 'rgba(25,118,210,0.15)',
              tension: 0.25,
              pointRadius: 3,
              fill: true
            }
          ]
        },
        options: {
          plugins: {
            legend: { display: true }
          },
          scales: {
            x: { title: { display: true, text: 'Year' } },
            y: {
              title: { display: true, text: this.variable?.valueType === 'percentage' ? 'Percent' : 'Value' },
              ticks: {
                callback: (value: number | string) => {
                  const v = Number(value as any);
                  if (this.variable?.valueType === 'percentage') {
                    return `${v}%`;
                  }
                  return v;
                }
              }
            }
          }
        }
      });
    } else {
      // Update existing chart
      this.chart.data.labels = series.map((d) => d.year.toString());
      this.chart.data.datasets[0].label = this.variable?.name || 'Variable';
      this.chart.data.datasets[0].data = series.map((d) => d.value);
      this.chart.update();
    }
  }
}
