import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  data = [
    { letter: 'A', frequency: 0.08167 },
    { letter: 'B', frequency: 0.01492 },
    { letter: 'C', frequency: 0.02782 },
    { letter: 'D', frequency: 0.04253 },
    // بیشتر داده‌ها را اینجا وارد کنید
  ];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.createChart();
  }

  private createChart(): void {
    const width = 928;
    const height = 500;
    const marginTop = 30;
    const marginRight = 0;
    const marginBottom = 30;
    const marginLeft = 40;

    const x = d3
      .scaleBand()
      .domain(
        d3.groupSort(
          this.data,
          ([d]) => -d.frequency,
          (d) => d.letter
        )
      ) // descending frequency
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d.frequency) || 0])
      .range([height - marginBottom, marginTop]);

    const svg = d3
      .select(this.el.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto;');

    svg
      .append('g')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(this.data)
      .join('rect')
      .attr('x', (d) => x(d.letter) ?? 0)
      .attr('y', (d) => y(d.frequency))
      .attr('height', (d) => y(0) - y(d.frequency))
      .attr('width', x.bandwidth());

    svg
      .append('g')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    svg
      .append('g')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(
        d3
          .axisLeft(y)
          .tickFormat((y: d3.NumberValue) => (y.valueOf() * 100).toFixed())
      )
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .append('text')
          .attr('x', -marginLeft)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text('↑ Frequency (%)')
      );
  }
}
