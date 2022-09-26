class ChartConfig {
    static canvasChartMap = {}
    constructor(canvas, type) {
        this.canvas = canvas;
        this.config = {};
        this.config.type = type;
        this.name = '';
        canvas.onclick = evt => {
            let popup = document.getElementById("myPopup");
            popup.classList.remove("show");
            let myChart = ChartConfig.canvasChartMap[this.canvas];
            if (!myChart) {
                return;
            }
            let points = myChart.getActiveElements(evt);
            var colors = myChart.data.datasets[0].backgroundColor;
            if (points.length) {

                popup.classList.toggle("show");
                //set the current olor to colorPicker
                const firstPoint = points[points.length - 1];
                let crntColor = null;
                console.log(colors[firstPoint.index]);
                if (/^#[0-9A-F]{6}$/i.test(colors[firstPoint.index])) {
                    crntColor = colors[firstPoint.index];
                } else {
                    crntColor = rgb2hex(colors[firstPoint.index]);
                }
                colorPicker.value = crntColor;
                console.log(crntColor);
                colorPicker.onchange = e => {
                    colors[firstPoint.index] = ColorInput.value;
                    myChart.update();
                }
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
        if (this.config && this.config.data.datasets.length > 0) {
            this.config.data.datasets[0].label = name;
        }
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
        var colors = [];
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

    setLabels(data) {
        if (this.config) {
            let labels = [];
            data.forEach(item => {
                labels.push(item.n);
            });
            this.config.data.labels = labels;
        }
    }

    setData(data) {
        if (this.config && this.config.data.datasets.length > 0) {
            var clr = [];
            data.forEach((d, i) => {
                var r = Math.abs(((i + ~~d) * 93) % 256);
                var g = Math.abs((i * ((2 * i) - ~~d) * 3) % 256);
                var b = Math.abs((384 - r - g) % 256);
                clr.push(`rgba(${r}, ${g}, ${b}, 1)`);
            });
            this.config.data.datasets[0].backgroundColor = clr;
            this.config.data.datasets[0].borderColor = clr;
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
            },
            plugins: {
                legend: {
                    display: false
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
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        });
    }
}

class DoughnutChartConfig extends BasicChartConfig {
    constructor(canvas) {
        super(canvas, 'doughnut');
        super.setOptions({
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            }
        });
    }
}

class PolarAreaChartConfig extends BasicChartConfig {
    constructor(canvas) {
        super(canvas, 'polarArea');
        super.setOptions({
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            }
        });
    }
}

class ScatterChartConfig extends BasicChartConfig {
    constructor(canvas) {
        super(canvas, 'scatter');
        super.setOptions({
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        });
    }
}

class BubbleChartConfig extends BasicChartConfig {
    constructor(canvas) {
        super(canvas, 'bubble');
        super.setOptions({
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        });
    }
}

class HierarchicalChartConfig extends ChartConfig {
    constructor(canvas, type, maxLevels) {
        super(canvas, type);
        var colors = [];
        var dataConf = {
            labels: [],
            datasets: [{
                label: this.name,
                data: [],
                tree: [],
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1
            }]
        };
        this.tree = [];
        this.config.data = dataConf;
        this.maxLevels = maxLevels;
    }

    setLabels(data) {
    }

    _makeTree(data, levelIndex, parent) {
        if (this.tree[levelIndex] == undefined) {
            this.tree[levelIndex] = [];
        }
        var level = this.tree[levelIndex];
        data.forEach(item => {
            var treeItem = {
                n: item.n,
                v: item.v,
                p: parent
            }
            var myIndex = level.push(treeItem) - 1;
            this._makeTree(item.c, levelIndex + 1, myIndex);
        });
    }

    setData(data) {
        this._makeTree(data, 0, 0);
        if (this.tree[this.tree.length - 1].length == 0) this.tree.length -= 1;
        if (this.config && this.config.data.datasets.length > 0) {
            this.config.data.datasets[0].tree = data;
            var datasetData = this.config.data.datasets[0].data;
            var colors = this.config.data.datasets[0].backgroundColor;
            var labels = this.config.data.labels;
            for (let levelIndex = 0; levelIndex < this.maxLevels; levelIndex++) {
                var level = this.tree[levelIndex];
                if (level == undefined || level.length == 0) break;
                level.forEach(item => {
                    datasetData.push(item.v);
                    var x = labels.push(item.n);
                    var color = `rgba(${(167 * x) % 256},${(71 * x) % 256},${(203 * x) % 256},1)`;
                    colors.push(color);
                });
            }
        }
    }
}

class SunburstChartConfig extends HierarchicalChartConfig {
    constructor(canvas) {
        super(canvas, 'sunburst', 4);
        super.setOptions({
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            },
            plugins: {
                legend: {
                    display: true,
                },
                tooltip: {
                    enabled: true
                }
            }
        });
    }
}

class IcicleChartConfig extends HierarchicalChartConfig {
    constructor(canvas) {
        super(canvas, 'icicle', 5);
        super.setOptions({
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true
                }
            }
        });
    }
}

const chartDiv = document.getElementById('chartDiv');
const canvas = document.getElementById('myChart');
const chartBtn = document.getElementById('drawBtn');

const uploadViewDiv = document.getElementById('uploadViewDiv');
const chartViewDiv = document.getElementById('chartViewDiv');

window.onload = () => {
    let height = window.innerHeight;
    let width = window.innerWidth;
    chartDiv.style.width = width + 'px';
    chartDiv.style.height = height + 'px';
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
}

Chart.defaults.font.size = 18;
const chartName = 'Dataset_1'

Chart.register({
    id: "legendColorUpdate",
    afterRender: function (c) {
        var legends = c.legend.legendItems;
        var colors = c.data.datasets[0].backgroundColor;
        legends.forEach((e, i) => {
            e.fillStyle = colors[i % colors.length];
        });
    }
});

let unlist = (list, out) => {
    var success = true;
    list.forEach(item => {
        var unlistC = [];
        if (!unlist(item.c, unlistC)) {
            success = false;
            return;
        }
        if (item.v.length !== 1) {
            success = false;
            console.log('invalid list', item);
            return;
        }
        unlistItem = { n: item.n, v: item.v[0], c: unlistC };
        out.push(unlistItem);
    });
    return success;
}

let types = document.getElementsByName('charttype');
const drawChart = (data) => {
    if (!(data instanceof Array) || data.length <= 0) {
        console.log('invalid data', data);
        return;
    }
    let type = 'bar';
    for (i = 0; i < types.length; i++) {
        if (types[i].checked) {
            type = types[i].value;
        }
    }
    let myChart;
    let values = [];
    switch (type) {
        case 'bar': {
            data.forEach(item => {
                var val = item.v;
                if (val.length !== 1) {
                    console.log('invalid data for', type, val);
                    return;
                }
                values.push(val[0]);
            });
            myChart = new BarChartConfig(canvas);
            break;
        }
        case 'pie': {
            data.forEach(item => {
                var val = item.v;
                if (val.length !== 1) {
                    console.log('invalid data for', type);
                    return;
                }
                values.push(val[0]);
            });
            myChart = new PieChartConfig(canvas);
            break;
        }
        case 'line': {
            data.forEach(item => {
                var val = item.v;
                if (val.length !== 1) {
                    console.log('invalid data for', type);
                    return;
                }
                values.push(val[0]);
            });
            myChart = new LineChartConfig(canvas);
            break;
        }
        case 'doughnut': {
            data.forEach(item => {
                var val = item.v;
                if (val.length !== 1) {
                    console.log('invalid data for', type);
                    return;
                }
                values.push(val[0]);
            });
            myChart = new DoughnutChartConfig(canvas);
            break;
        }
        case 'polarArea': {
            data.forEach(item => {
                var val = item.v;
                if (val.length !== 1) {
                    console.log('invalid data for', type);
                    return;
                }
                values.push(val[0]);
            });
            myChart = new PolarAreaChartConfig(canvas);
            break;
        }
        case 'scatter': {
            data.forEach(item => {
                var val = item.v;
                if (val.length !== 2) {
                    console.log('invalid data for', type);
                    return;
                }
                values.push({ x: val[0], y: val[1] });
            });
            myChart = new ScatterChartConfig(canvas);
            break;
        }
        case 'bubble': {
            data.forEach(item => {
                var val = item.v;
                if (val.length !== 3) {
                    console.log('invalid data for', type);
                    return;
                }
                values.push({ x: val[0], y: val[1], r: val[2] });
            });
            myChart = new BubbleChartConfig(canvas);
            break;
        }
        case 'sunburst': {
            values = [];
            unlist(data, values);
            myChart = new SunburstChartConfig(canvas);
            break;
        }

        case 'icicle': {
            values = [];
            unlist(data, values);
            myChart = new IcicleChartConfig(canvas);
            break;
        }
        default:
            return;
            break;
    }
    myChart.setName(chartName);
    myChart.setLabels(data);
    myChart.setData(values);
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
    chartDiv.style.width = width + 'px';
    chartDiv.style.height = height + 'px';
    // chartDiv.onresize(e);
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
    // document.getElementById('EditChartOption').style.display = 'none';
    let popup = document.getElementById("myPopup");
    popup.classList.remove("show");
}

let nameView = document.getElementById('nameView')
let nameEdit = document.getElementById('nameEdit')

document.getElementById('editName').onclick = e => {
    console.log(document.getElementById('chartNameView').innerText);
    nameView.style.display = 'none';
    nameEdit.style.display = 'block';
    let name = document.getElementById('chartNameView').innerText
    document.getElementById('nameInput').value = name;
    document.getElementById('saveName').onclick = e => {
        nameView.style.display = 'block';
        nameEdit.style.display = 'none';
        name = document.getElementById('nameInput').value
        document.getElementById('chartNameView').innerText = name
    };
    document.getElementById('cancellEditName').onclick = e => {
        nameView.style.display = 'block';
        nameEdit.style.display = 'none';
    };
};


const colorPicker = document.getElementById('ColorInput');
let color = ColorInput.value;
colorPicker.onchange = e => {
    color = ColorInput.value;
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

setCallback(drawChart);