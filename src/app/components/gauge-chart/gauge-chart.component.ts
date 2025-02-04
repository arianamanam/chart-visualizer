import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-gauge-chart',
  template: '<div #chart></div>',
  styleUrls: ['./gauge-chart.component.scss'],
})
export class GaugeChartComponent implements AfterViewInit {
  @ViewChild('chart', { static: true }) chartElement!: ElementRef;
  private isChartCreated = false;

  ngAfterViewInit(): void {
    if (!this.isChartCreated) {
      this.createGaugeChart();
      this.isChartCreated = true;
    }
  }

  private createGaugeChart(): void {
    d3.select(this.chartElement.nativeElement).selectAll('*').remove();

    const width = 500;
    const height = 300;
    const margin = 30;
    const radius = Math.min(width, height * 2) / 2 - margin;

    const value = 9;

    const sections = [
      { color: '#e53935' },
      { color: '#fb8c00' },
      { color: '#fdd835' },
      { color: '#ffee58' },
      { color: '#c0ca33' },
      { color: '#43a047' },
      { color: '#1b5e20' },
    ];

    const startAngle = (-Math.PI * 3) / 4;
    const endAngle = (Math.PI * 3) / 4;
    const angleStep = (endAngle - startAngle) / sections.length;

    const svg = d3
      .select(this.chartElement.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height + 50)
      .append('g')
      .attr('transform', `translate(${width / 2},${height * 0.8})`);

    svg
      .append('path')
      .datum({ startAngle, endAngle })
      .style('fill', '#ddd')
      .attr(
        'd',
        d3
          .arc()
          .innerRadius(radius - 30)
          .outerRadius(radius) as any
      );

    sections.forEach((d, i) => {
      svg
        .append('path')
        .datum({
          startAngle: startAngle + i * angleStep,
          endAngle: startAngle + (i + 1) * angleStep,
        })
        .style('fill', d.color)
        .attr(
          'd',
          d3
            .arc()
            .innerRadius(radius - 30)
            .outerRadius(radius) as any
        );
    });

    const scale = d3.scaleLinear().domain([-40, 100]).range([-135, 135]);
    const needleAngle = scale(value);

    svg
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', -(radius - 10))
      .style('stroke', '#ff9800')
      .style('stroke-width', 6)
      .attr('transform', `rotate(${needleAngle})`);

    svg
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 30)
      .style('fill', '#ff9800');

    svg
      .append('text')
      .attr('x', 0)
      .attr('y', 5)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .text(value);
  }
}
