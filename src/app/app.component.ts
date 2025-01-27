import { Component } from '@angular/core';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { GaugeChartComponent } from './gauge-chart/gauge-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    BarChartComponent,
    DonutChartComponent,
    LineChartComponent,
    GaugeChartComponent,
  ],
})
export class AppComponent {
  barChartData = [
    { letter: 'A', frequency: 0.08167 },
    { letter: 'B', frequency: 0.01492 },
    { letter: 'C', frequency: 0.02782 },
    { letter: 'D', frequency: 0.04253 },
  ];

  donutChartData = [
    { name: 'Apples', value: 30 },
    { name: 'Bananas', value: 50 },
    { name: 'Cherries', value: 20 },
  ];
  lineChartData: any;
}
