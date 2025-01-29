import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  standalone: true,
})
export class LineChartComponent implements AfterViewInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  aapl: { date: Date; close: number }[] = [
    { date: new Date('2020-01-01'), close: 100 },
    { date: new Date('2020-01-02'), close: 105 },
    { date: new Date('2020-01-03'), close: 110 },
    { date: new Date('2020-01-04'), close: 120 },
  ];

  constructor() {}

  ngAfterViewInit() {
    this.createLineChart();
  }

  createLineChart() {
    // Declare the chart dimensions and margins
    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    // Parse the data dates
    const parseDate = d3.utcParse('%Y-%m-%d');
    this.aapl.forEach(
      (d) =>
        (d.date = parseDate(d.date.toISOString().split('T')[0]) || new Date())
    );

    // Declare the x (horizontal position) scale
    const x = d3.scaleUtc(d3.extent(this.aapl, (d) => d.date) as [Date, Date], [
      marginLeft,
      width - marginRight,
    ]);

    // Declare the y (vertical position) scale
    const y = d3.scaleLinear(
      [0, d3.max(this.aapl, (d) => d.close) as number],
      [height - marginBottom, marginTop]
    );

    // Declare the line generator
    const line = d3
      .line<{ date: Date; close: number }>()
      .x((d) => x(d.date))
      .y((d) => y(d.close));

    // Create the SVG container
    const svg = d3
      .create('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    // Add the x-axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0)
      );

    // Add the y-axis, remove the domain line, add grid lines and a label
    svg
      .append('g')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('x2', width - marginLeft - marginRight)
          .attr('stroke-opacity', 0.1)
      )
      .call((g) =>
        g
          .append('text')
          .attr('x', -marginLeft)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text('↑ Daily close ($)')
      );

    // Append a path for the line
    svg
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line(this.aapl));

    // Append the chart to the container div
    this.chartContainer.nativeElement.appendChild(svg.node());
  }
}
