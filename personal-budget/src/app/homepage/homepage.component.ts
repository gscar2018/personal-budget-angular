import { AfterViewInit, Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../data.service';
import * as d3 from 'd3';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  public dataSource = {
    datasets: [
      {
        data: [] as number[],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
        ],
      }
    ],
    labels: [] as string[]
  };

  constructor(private dataService: DataService) {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.dataService.getData().subscribe((res: any) => {
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
      }
      this.createChart();
      this.createD3Chart(res.myBudget);
    });
  }

  createChart() {
    var ctx = document.getElementById('myChart') as HTMLCanvasElement;
    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: this.dataSource  // Pass the updated dataSource
    });
  }

  createD3Chart(data: { title: string; budget: number }[]): void {
    const width = 450;
    const height = 450;
    const margin = 40;

    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select("#d3chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.title))
      .range(d3.schemeCategory10);

    const pie = d3.pie<{ title: string; budget: number }>()
      .value(d => d.budget);

    const arc = d3.arc<d3.PieArcDatum<{ title: string; budget: number }>>()
      .innerRadius(0)
      .outerRadius(radius);

    const arcs = svg.selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.title) as string);

    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text(d => d.data.title);

    // Debugging: Log the data to ensure it's correct
    console.log('D3 Data:', data);
  }
}