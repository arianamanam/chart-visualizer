import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: `<div #chartContainer></div>`,
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements AfterViewInit {
  @Input() data: { letter: string; frequency: number }[] = [];
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  private isChartCreated = false;

  ngAfterViewInit() {
    if (!this.isChartCreated) {
      this.createChart();
      this.isChartCreated = true;
    }
  }

  private createChart() {
    // حذف محتوای قبلی قبل از رسم نمودار جدید
    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();

    const width = 928;
    const height = 500;
    const margin = { top: 30, right: 0, bottom: 30, left: 40 };

    const x = d3
      .scaleBand()
      .domain(this.data.map((d) => d.letter))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d.frequency)!])
      .range([height - margin.bottom, margin.top]);

    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .style('max-width', '100%')
      .style('height', 'auto');

    svg
      .append('g')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(this.data)
      .join('rect')
      .attr('x', (d) => x(d.letter)!)
      .attr('y', (d) => y(d.frequency))
      .attr('height', (d) => y(0) - y(d.frequency))
      .attr('width', x.bandwidth());

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat((d) => `${d}`))
      .call((g) => g.select('.domain').remove());
  }
}
