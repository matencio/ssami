import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-estadistica-page',
  templateUrl: './estadistica-page.component.html',
  styleUrls: ['./estadistica-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EstadisticaPageComponent implements OnInit {
  @ViewChild('pieChart') pieChart: any; //TemplateRef<any>;
  pieChartLabels: any[] = [];

  isLoading: boolean = false;
  data: any[] = [];
  multiplePie: any[] = [];

  pieData1: any[] = [];
  pieTitle1: string;
  pieData2: any[] = [];
  pieTitle2: string;
  pieData3: any[] = [];
  pieTitle3: string;


  view = undefined;

  breakpoint: number;
  maxColumn: number = 3;
  showLegend: boolean = true; //false; true;
  showLabels: boolean = true; //true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below'; //'rigth or below';
  legendTitle: string = 'Leyenda';

  xAxisLabel: string = "Porcentaje de quemaduras";
  yAxisLabel: string = "Promedio de días internados";
  showDataLabel: boolean = true; 
  //scheme: string = "air";

  colorScheme = {
		domain: ['#203864','#0077A3','#00B9C6','#70FACB']
    //domain: ['#ff6384', '#36a2eb', '#ffce56', '#4cc0c0', '#9c6aff', '#ff9f40']
    //domain: ['#ffe0e6', '#d7ecfb', '#ebe0ff', '#fff5dd', '#ffecd9'];
    //domain: ['#203864', '#204571','#1f537e','#1d618a','#1b6f96','#177ea1','#138cab','#0e9bb5','#07aabe','#00b9c6']
    
    
    //domain: ['#203864', '#204571','#1f537e','#177ea1','#07aabe','#00b9c6']
  };
   

  //table
  desserts: any[] = [
    {name: 'Frozen yogurt', calories: 159, fat: 6, carbs: 24, protein: 4},
    {name: 'Ice cream sandwich', calories: 237, fat: 9, carbs: 37, protein: 4},
    {name: 'Eclair', calories: 262, fat: 16, carbs: 24, protein: 6},
    {name: 'Cupcake', calories: 305, fat: 4, carbs: 67, protein: 4},
    {name: 'Gingerbread', calories: 356, fat: 16, carbs: 49, protein: 4},
  ];

  sortedData: any[];

  constructor() { }

  ngOnInit(): void {
    this.isLoading = true;
    this.breakpoint = (window.innerWidth <= 1100) ? 1 : this.maxColumn;

    this.sortedData = this.desserts.slice();

    this.getData();

    //test data
    /*this.data = [
      {
        "name": "Germany",
        "value": 40632,
        "extra": {
          "code": "de"
        }
      },
      {
        "name": "United States",
        "value": 50000,
        "extra": {
          "code": "us"
        }
      },
      {
        "name": "France",
        "value": 36745,
        "extra": {
          "code": "fr"
        }
      },
      {
        "name": "United Kingdom",
        "value": 36240,
        "extra": {
          "code": "uk"
        }
      },
      {
        "name": "Spain",
        "value": 33000,
        "extra": {
          "code": "es",
        }
      },
      {
        "name": "Italy",
        "value": 35800,
        "extra": {
          "code": "it"
        }
      }
    ];
    var sum = 0;
    this.data.forEach(d => sum = sum + d.value);
    this.data.forEach(d => d.extra.percent = (d.value*100)/sum);*/

    setTimeout( () => { this.isLoading = false}, 1100)

    //setTimeout( () => { this.drawOnPieChart(); }, 2500)
  }

  getData() {
    var quemadurasPromedioDias = [
     /* {
        "name": "0 - 5",
        "value": 5,
        "extra": {
          "percent": 0
        }
      },
      {
        "name": "6 - 10",
        "value": 8,
        "extra": {
          "percent": 0
        }
      },
      {
        "name": "11 - 15",
        "value": 12,
        "extra": {
          "percent": 0
        }
      },
      {
        "name": "6 - 10",
        "value": 8,
        "extra": {
          "percent": 0
        }
      },
      {
        "name": "11 - 15",
        "value": 12,
        "extra": {
          "percent": 0
        }
      },
      {
        "name": "6 - 10",
        "value": 8,
        "extra": {
          "percent": 0
        }
      },
      {
        "name": "11 - 15",
        "value": 12,
        "extra": {
          "percent": 0
        }
      },
      {
        "name": "6 - 10",
        "value": 8,
        "extra": {
          "percent": 0
        }
      },
      {
        "name": "11 - 15",
        "value": 12,
        "extra": {
          "percent": 0
        }
      },*/
      //desde aca era
      {
      "name": "0 - 5",
      "value": 5,
      "extra": {
        "percent": 0
      }
    },
    {
      "name": "6 - 10",
      "value": 8,
      "extra": {
        "percent": 0
      }
    },
    {
      "name": "11 - 15",
      "value": 12,
      "extra": {
        "percent": 0
      }
    },
    {
      "name": "16 - 20",
      "value": 10,
      "extra": {
        "percent": 0
      }
    }];
    var sum = 0;
    quemadurasPromedioDias.forEach(d => sum = sum + d.value);
    quemadurasPromedioDias.forEach(d => d.extra.percent = (d.value*100)/sum);

    this.data = quemadurasPromedioDias;

    //PIES

    var datapie1 = {
      title: 'Qxs / R. Social',
      data: null
    }
    //Pie1
    var data = [
      {
        "name": "Con Riesgo",
        "value": 23,
        "extra": {

          "percent": 0
        }
      },
      {
        "name": "Sin Riesgo",
        "value": 53,
        "extra": {

          "percent": 0
        }
      }
    ];

    sum = 0;
    data.forEach(d => sum = sum + d.value);
    data.forEach(d => d.extra.percent = (d.value*100)/sum);

    datapie1.data = data;
    this.multiplePie.push(datapie1);

    this.pieData1 = datapie1.data;
    this.pieTitle1 = datapie1.title;

    var datapie2 = {
      title: 'Etiología / Estacionalidad',
      data: null
    }
    //Pie2
    var data = [
      {
        "name": "Verano",
        "value": 3,
        "extra": {

          "percent": 0
        }
      },
      {
        "name": "Otoño",
        "value": 17,
        "extra": {

          "percent": 0
        }
      },
      {
        "name": "Privamera",
        "value": 9,
        "extra": {

          "percent": 0
        }
      },
      {
        "name": "Invierno",
        "value": 36,
        "extra": {

          "percent": 0
        }
      }
    ];
    sum = 0;
    data.forEach(d => sum = sum + d.value);
    data.forEach(d => d.extra.percent = (d.value*100)/sum);

    datapie2.data = data;

    this.pieData2 = datapie2.data;
    this.pieTitle2 = datapie2.title;

    this.multiplePie.push(datapie2);

    //Pie3
    var datapie3 = {
      title: 'Etiología',
      data: null
    }
    //Pie1
    var data = [
      {
        "name": "A",
        "value": 42,
        "extra": {

          "percent": 0
        }
      },
      {
        "name": "AB",
        "value": 2,
        "extra": {
 
          "percent": 0
        }
      },
      {
        "name": "B",
        "value": 53,
        "extra": {

          "percent": 0
        }
      }
    ];

    sum = 0;
    data.forEach(d => sum = sum + d.value);
    data.forEach(d => d.extra.percent = (d.value*100)/sum);
    //console.

    datapie3.data = data;
    this.multiplePie.push(datapie3);
    this.pieData3 = datapie3.data;
    this.pieTitle3 = datapie3.title;

    console.log(JSON.stringify(this.multiplePie))
  }

  getLabelFormat(labelName) {
    return this.labelFormat;
  }

  pieChartLabel(series, name): string {
    const item = series.filter(data => data.name === name);
    //console.log(item.extra.percent)
    if (item.length > 0) {
        //return item[0].label;
        return `${this.round(item[0].extra.percent, 2)}%`;
    }
    return name;
}

  public myLabelFormatter(ev) {
    return ev + '%';
  }

  formatDataLabel(value )
  {
    return value + '%';
  }

  labelFormat = (labelName) => {
    //Find the data by labelName from chartData 
    const dataPoint = this.data.find(x => x.name === labelName);
    console.log("dataPoint " + dataPoint)
    return `${this.round(dataPoint.extra.percent, 2)}%`;
  }

  labelFormatAbstract(data, labelName) {
    //Find the data by labelName from chartData 
    const dataPoint = data.find(x => x.name === labelName);
    console.log("dataPoint " + dataPoint)
    return `${this.round(dataPoint.extra.percent, 2)}%`;
  }

  labelFormatPie1 = (labelName) => {
    return this.labelFormatAbstract(this.pieData1, labelName)
  }

  labelFormatPie2 = (labelName) => {
    return this.labelFormatAbstract(this.pieData2, labelName)
  }

  labelFormatPie3 = (labelName) => {
    return this.labelFormatAbstract(this.pieData3, labelName)
  }

  round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 1000) ? 1 : this.maxColumn;
  }

  /** HELPERS */
  /*private drawOnPieChart() {
    console.log(this.pieChart);
    let node = this.pieChart.chartElement.nativeElement;
    let svg: any;
    for (let i = 0; i < 5; i++) {
      if (i === 3) {
        svg = node.childNodes[0]; // pie chart svg
      }
      // at the end of this loop, the node should contain all slices in its children node
      node = node.childNodes[0];
    }
    // clear the previous text if any
    this.pieChartLabels.forEach(i => {
      if (svg.childNodes[1]) {
        svg.removeChild(svg.childNodes[1]);
      }
    });
    const slices: HTMLCollection = node.children;
    let minX = 0;
    let maxX = 0;
    for (let i = 0; i < slices.length; i++) {
      const bbox = (<any>slices.item(i)).getBBox();
      minX = Math.round((bbox.x < minX ? bbox.x : minX) * 10) / 10;
      maxX =
        Math.round(
          (bbox.x + bbox.width > maxX ? bbox.x + bbox.width : maxX) * 10
        ) / 10;
    }

    for (let i = 0; i < slices.length; i++) {
      const percent = this.data[i].value;
      let startingValue = 0;
      for (let j = 0; j < i; j++) {
        startingValue += this.data[j].value;
      }
      if (percent >= 2) {
        const text = this.generateText(percent, maxX - minX, startingValue);
        this.pieChartLabels.push(text);
        console.log("LABELS: " + percent)
        svg.append(text);
      }
    }
  }

  private generateText(percent: number, diagonal: number, startingValue: number) {
    // create text element
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const r = Math.round(diagonal / 2.5);
    // angle = summed angle of previous slices + half of current slice - 90 degrees (starting at the top of the circle)
    const angle = ((startingValue * 2 + percent) / 100 - 0.5) * Math.PI;
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle) + 5;

    text.setAttribute('x', '' + x);
    text.setAttribute('y', '' + y);
    text.setAttribute('fill', 'white');
    text.textContent = percent + '%';
    text.setAttribute('text-anchor', 'middle');
    return text;
  }*/

}
