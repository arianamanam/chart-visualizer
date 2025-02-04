import { Component, ElementRef, Input, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  template: `<div id="donut-chart"></div>`,
  styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent implements AfterViewInit {
  @Input() data: { name: string; value: number }[] = [];
  private isChartCreated = false;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    if (!this.isChartCreated) {
      this.createChart();
      this.isChartCreated = true;
    }
  }

  private createChart() {
    // حذف نمودار قبلی در صورت وجود
    d3.select(this.el.nativeElement.querySelector('#donut-chart'))
      .selectAll('*')
      .remove();

    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2;

    const arc = d3
      .arc()
      .innerRadius(radius * 0.67)
      .outerRadius(radius - 1);

    const pie = d3
      .pie()
      .sort(null)
      .value((d: any) => (d as { name: string; value: number }).value);

    const color = d3
      .scaleOrdinal()
      .domain(this.data.map((d) => d.name))
      .range(d3.schemeCategory10);

    const svg = d3
      .select(this.el.nativeElement.querySelector('#donut-chart'))
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .style('max-width', '100%')
      .style('height', 'auto');

    svg
      .append('g')
      .selectAll('path')
      .data(pie(this.data as any))
      .join('path')
      .attr('fill', (d: any) => color(d.data.name) as string)
      .attr('d', arc as any);

    svg
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12)
      .attr('text-anchor', 'middle')
      .selectAll('text')
      .data(pie(this.data as any))
      .join('text')
      .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
      .text((d: any) => `${d.data.name}: ${d.data.value}`);
  }
}
