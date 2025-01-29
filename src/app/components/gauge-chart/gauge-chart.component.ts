// // import { Component, OnInit } from '@angular/core';
// // import { Chart, ChartConfiguration, ChartTypeRegistry } from 'chart.js';

// // // Extend ChartTypeRegistry to include 'gauge'
// // declare module 'chart.js' {
// //   interface ChartTypeRegistry {
// //     gauge: {
// //       chartOptions: any;
// //       datasetOptions: any;
// //       defaultDataPoint: number;
// //     };
// //   }
// // }
// // import 'chartjs-gauge'; // Import the gauge chart plugin

// // @Component({
// //   selector: 'app-gauge-chart',
// //   templateUrl: './gauge-chart.component.html',
// //   styleUrls: ['./gauge-chart.component.scss'],
// //   standalone: true,
// // })
// // export class GaugeChartComponent implements OnInit {
// //   chart: any;

// //   ngOnInit(): void {
// //     this.createGaugeChart();
// //   }

// //   randomScalingFactor(): number {
// //     return Math.round(Math.random() * 100);
// //   }

// //   randomData(): number[] {
// //     return [
// //       this.randomScalingFactor(),
// //       this.randomScalingFactor(),
// //       this.randomScalingFactor(),
// //       this.randomScalingFactor(),
// //     ];
// //   }

// //   randomValue(data: number[]): number {
// //     return Math.max.apply(null, data) * Math.random();
// //   }

// //   createGaugeChart(): void {
// //     const data = this.randomData();
// //     const value = this.randomValue(data);

// //     const config: ChartConfiguration<'gauge'> = {
// //       type: 'gauge',
// //       data: {
// //         datasets: [
// //           {
// //             data: data,
// //             value: value,
// //             backgroundColor: ['green', 'yellow', 'orange', 'red'],
// //             borderWidth: 2,
// //           },
// //         ],
// //       },
// //       options: {
// //         responsive: true,
// //         title: {
// //           display: true,
// //           text: 'Gauge chart',
// //         },
// //         layout: {
// //           padding: {
// //             bottom: 30,
// //           },
// //         },
// //         needle: {
// //           radiusPercentage: 2,
// //           widthPercentage: 3.2,
// //           lengthPercentage: 80,
// //           color: 'rgba(0, 0, 0, 1)',
// //         },
// //         valueLabel: {
// //           formatter: Math.round,
// //         },
// //       },
// //     };

// //     const ctx = document.getElementById('gaugeChart') as HTMLCanvasElement;
// //     this.chart = new Chart(ctx, config);

// //     document.getElementById('randomizeData')?.addEventListener('click', () => {
// //       config.data.datasets.forEach((dataset: any) => {
// //         dataset.data = this.randomData();
// //         dataset.value = this.randomValue(dataset.data);
// //       });

// //       this.chart.update();
// //     });
// //   }
// // }

// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import * as d3 from 'd3';

// @Component({
//   selector: 'app-gauge-chart',
//   templateUrl: './gauge-chart.component.html',
//   styleUrls: ['./gauge-chart.component.scss'],
// })
// export class GaugeChartComponent implements OnInit {
//   @ViewChild('chart') chartElement!: ElementRef;

//   ngOnInit(): void {
//     this.createGaugeChart();
//   }

//   private createGaugeChart(): void {
//     const width = 400;
//     const height = 400;
//     const margin = 30;

//     const radius = Math.min(width, height) / 2 - margin;

//     // ایجاد داده‌های تصادفی
//     const randomScalingFactor = () => Math.round(Math.random() * 100);
//     const randomData = [
//       randomScalingFactor(),
//       randomScalingFactor(),
//       randomScalingFactor(),
//       randomScalingFactor(),
//     ];

//     const value = Math.max(...randomData) * Math.random(); // مقدار تصادفی برای needle

//     // ساخت قطب‌نما (Needle)
//     const arc = d3
//       .arc()
//       .innerRadius(radius - 30)
//       .outerRadius(radius)
//       .startAngle(
//         (d: d3.DefaultArcObject) => (d.startAngle - 90) * (Math.PI / 180)
//       ); // تبدیل زاویه به رادیان

//     const svg = d3
//       .select(this.chartElement.nativeElement)
//       .append('svg')
//       .attr('width', width)
//       .attr('height', height)
//       .append('g')
//       .attr('transform', `translate(${width / 2},${height / 2})`);

//     const background = svg.append('g').attr('class', 'background');

//     background
//       .append('path')
//       .datum({
//         startAngle: 0,
//         endAngle: Math.PI,
//         innerRadius: radius - 30,
//         outerRadius: radius,
//       })
//       .style('fill', 'lightgray')
//       .attr('d', arc);

//     const foreground = svg.append('g').attr('class', 'foreground');

//     foreground
//       .append('path')
//       .datum({
//         startAngle: 0,
//         endAngle: value * (Math.PI / 100),
//         innerRadius: radius - 30,
//         outerRadius: radius,
//       })
//       .style('fill', 'steelblue')
//       .attr('d', arc);

//     // اضافه کردن Needle
//     const needleLength = radius - 10;
//     const needle = svg
//       .append('line')
//       .attr('x1', 0)
//       .attr('y1', 0)
//       .attr('x2', 0)
//       .attr('y2', -needleLength)
//       .style('stroke', 'black')
//       .style('stroke-width', 3)
//       .attr('transform', `rotate(${(value - 90) * (Math.PI / 180)})`);

//     // اضافه کردن نوشته
//     svg
//       .append('text')
//       .attr('x', 0)
//       .attr('y', radius + 20)
//       .attr('text-anchor', 'middle')
//       .style('font-size', '20px')
//       .style('font-weight', 'bold')
//       .text('Gauge Chart');
//   }
// }

import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-gauge-chart',
  template: `<div #chart></div>`,
  styleUrls: ['./gauge-chart.component.scss'],
})
export class GaugeChartComponent implements AfterViewInit {
  @ViewChild('chart') chartElement!: ElementRef;

  ngAfterViewInit(): void {
    this.createGaugeChart();
  }

  private createGaugeChart(): void {
    const width = 500;
    const height = 300;
    const margin = 30;
    const radius = Math.min(width, height * 2) / 2 - margin;

    const value = 9; // مقدار دلخواه برای نمایش

    // تقسیم‌بندی بازه‌ها
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

    // پس‌زمینه نیم‌دایره خاکستری
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

    // رسم بخش‌های رنگی
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

    // مقدار مقیاس از -40 تا 100
    const scale = d3.scaleLinear().domain([-40, 100]).range([-135, 135]);
    const needleAngle = scale(value);

    // نمایش سوزن
    svg
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', -(radius - 10))
      .style('stroke', '#ff9800')
      .style('stroke-width', 6)
      .attr('transform', `rotate(${needleAngle})`);

    // دایره کوچک وسط گیج
    svg
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 30)
      .style('fill', '#ff9800');

    // نمایش مقدار درون دایره
    svg
      .append('text')
      .attr('x', 0)
      .attr('y', 5)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .text(value);

    // نمایش نام دسته‌ها روی بازه‌ها
    sections.forEach((d, i) => {
      const midAngle = startAngle + (i + 0.5) * angleStep;
      const x = (radius - 10) * Math.cos(midAngle);
      const y = (radius - 10) * Math.sin(midAngle);

      svg
        .append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .style('fill', 'white')
        .style('font-size', '10px')
        .style('font-weight', 'bold');
    });
  }
}
