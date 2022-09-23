class ChartConfig {
    static canvasChartMap = {}
    constructor(canvas, type) {
        this.canvas = canvas;
        this.config = {};
        this.config.type = type;
        this.name = '';
        canvas.onclick = evt => {
            let myChart = ChartConfig.canvasChartMap[this.canvas];
            if (!myChart){
                return;
            }
            let points = myChart.getActiveElements();
            if (points.length) {
                const firstPoint = points[points.length - 1];
                colors[firstPoint.index] = '#f00';
                dataConf.datasets[0].backgroundColor = colors;
                dataConf.datasets[0].borderColor = colors;
                myChart.update();
            }
        };
    }

    setData(data) {
        if (this.config) {
            this.config.data = data;
        }
    }

    setName(name) {
        this.name = name;
    }

    setOptions(options) {
        this.config.options = options;
    }

    draw() {
        if (this.config == null || this.canvas == null) {
            return;
        }
        if (ChartConfig.canvasChartMap[this.canvas] instanceof Chart) {
            ChartConfig.canvasChartMap[this.canvas].destroy();
        }
        ChartConfig.canvasChartMap[this.canvas] = new Chart(this.canvas, this.config);
    }
}

class BasicChartConfig extends ChartConfig {
    constructor(canvas, type) {
        super(canvas, type);
        var dataConf = {
            labels: [],
            datasets: [{
                label: this.name,
                data: [],
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1
            }]
        };
        this.config.data = dataConf;
    }

    setName(name) {
        super.setName(name);
        if (this.config && this.config.data.datasets.length > 0) {
            this.config.data.datasets[0].label = name;
        }
    }

    setLabels(labels) {
        if (this.config) {
            this.config.data.labels = labels;
        }
    }

    setData(data) {
        if (this.config && this.config.data.datasets.length > 0) {
            this.config.data.datasets[0].data = data;
        }
    }
}

class BarChartConfig extends BasicChartConfig {
    constructor(canvas) {
        super(canvas, 'bar');
        super.setOptions({
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            },
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    ticks: {
                        font: { size: 20 }
                    }
                }
            }
        });
    }
}

class PieChartConfig extends BasicChartConfig {
    constructor(canvas) {
        super(canvas, 'pie');
        super.setOptions({
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            }
        });
    }
}

class LineChartConfig extends BasicChartConfig {
    constructor(canvas) {
        super(canvas, 'line');
        super.setOptions({
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            },
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    ticks: {
                        font: { size: 20 }
                    }
                }
            }
        });
    }
}

const chartDiv = document.getElementById('chartDiv');
const canvas = document.getElementById('myChart');

window.onload = () => {
    let height = window.innerHeight;
    let width = window.innerWidth;
    let size = Math.min(height, width);
    chartDiv.style.width = size + 'px';
    chartDiv.style.height = size + 'px';
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
}

Chart.defaults.font.size = 18;
const chartName = 'Dataset_1'
const colors = [
    'rgba(255, 99, 132, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 205, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(201, 203, 207, 1)'
];

/*let myChart = null;
const drawChart = (labels, data) => {
    var types = document.getElementsByName('charttype');
    let type = 'bar';
    for (i = 0; i < types.length; i++) {
        if (types[i].checked) {
            type = types[i].value;
        }
    }
    const dataConf = {
        labels: labels,
        datasets: [{
            label: chartName,
            data: data,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1
        }]
    };

    const config = {
        type: type,
        data: dataConf,
        options: {
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            },
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    ticks: {
                        font: { size: 20 }
                    }
                }
            }
        },
    };

    if (myChart != null) {
        myChart.destroy();
    }
    myChart = new Chart(canvas, config);
}
// const labels = ['A', 'B', 'C', 'D', 'E'];
// const data = [5, 9, 2, 3, 7];
*/

const drawChart = (labels, data) => {
    var types = document.getElementsByName('charttype');
    let type = 'bar';
    for (i = 0; i < types.length; i++) {
        if (types[i].checked) {
            type = types[i].value;
        }
    }
    let myChart;
    switch (type) {
        case 'bar': {
            myChart = new BarChartConfig(canvas);
            break;
        }
        case 'pie': {
            myChart = new PieChartConfig(canvas);
            break;
        }
        case 'line': {
            myChart = new LineChartConfig(canvas);
            break;
        }
        default:
            return;
            break;
    }
    myChart.setName(chartName);
    myChart.setLabels(labels);
    myChart.setData(data);
    myChart.draw();
};

chartDiv.onresize = e => {
    let width = chartDiv.style.width;
    let height = chartDiv.style.height;
    canvas.style.width = width;
    canvas.style.height = height;
};

window.onresize = e => {
    let height = window.innerHeight;
    let width = window.innerWidth;
    let size = Math.min(height, width);
    chartDiv.style.width = size + 'px';
    chartDiv.style.height = size + 'px';
    chartDiv.onresize(e);
};

document.getElementById('downloadImgBtn').onclick = e => {
    let canvasUrl = canvas.toDataURL();

    const downLinkTmp = document.createElement('a');
    downLinkTmp.href = canvasUrl;
    downLinkTmp.download = chartName;

    downLinkTmp.click();
    downLinkTmp.remove();
};

document.getElementById('CloseEdit').onclick = e => {
    document.getElementById('EditChartOption').style.display = 'none';
}

document.getElementById('DisplayEdit').onclick = e => {
    document.getElementById('EditChartOption').style.display = 'block';
}

setCallback(drawChart);