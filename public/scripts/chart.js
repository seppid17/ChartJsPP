class ChartConfig {
    static chart = null;
    static canvas = null;
    constructor(type) {
        if (ChartConfig.canvas == null) throw new Error('No canvas selected');
        this.config = {};
        this.config.type = type;
        this.name = '';
        ChartConfig.canvas.onclick = evt => {
            let popup = document.getElementById("myPopup");
            popup.classList.remove("show");
            let myChart = ChartConfig.chart;
            if (!myChart) {
                return;
            }
            let points = myChart.getActiveElements(evt);
            var colors = myChart.data.datasets[0].backgroundColor;
            if (points.length) {
                const point = points[points.length - 1];

                setDivPos(popup, evt.offsetX, evt.offsetY, ChartConfig.canvas.width / 2.5)
                popup.classList.toggle("show");
                //set the current olor to colorPicker
                let crntColor = null;
                if (/^#[0-9A-F]{6}$/i.test(colors[point.index])) {
                    crntColor = colors[point.index];
                } else {
                    crntColor = rgb2hex(colors[point.index]);
                }
                colorPicker.value = crntColor;
                colorPicker.onchange = e => {
                    if (this instanceof HierarchicalChartConfig) {
                        ChartConfig.chart._metasets[0].controller.pointers[point.index].clr = ColorInput.value
                    } else {
                        colors[point.index] = ColorInput.value;
                    }
                    myChart.update('none');
                }
                document.getElementById('expandBtn').onclick = e => {
                    myChart.update('expand ' + point.index);
                    popup.classList.remove("show");
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
        if (this.config == null || ChartConfig.canvas == null) {
            return;
        }
        if (ChartConfig.chart instanceof Chart) {
            ChartConfig.chart.destroy();
        }
        ChartConfig.chart = new Chart(ChartConfig.canvas, this.config);
    }

    static update(mode) {
        if (ChartConfig.canvas == null) {
            return;
        }
        if (ChartConfig.chart instanceof Chart) {
            ChartConfig.chart.update(mode);
        }
    }
}

class BasicChartConfig extends ChartConfig {
    constructor(type) {
        super(type);
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
    constructor() {
        super('bar');
        super.setOptions({
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            },
            /*scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    ticks: {
                        font: { size: 20 }
                    }
                }
            },*/
            plugins: {
                legend: {
                    display: false
                }
            }
        });
    }
}

class PieChartConfig extends BasicChartConfig {
    constructor() {
        super('pie');
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
    constructor() {
        super('line');
        super.setOptions({
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            },
            /*scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    ticks: {
                        font: { size: 20 }
                    }
                }
            },*/
            plugins: {
                legend: {
                    display: false
                }
            }
        });
    }
}

class DoughnutChartConfig extends BasicChartConfig {
    constructor() {
        super('doughnut');
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
    constructor() {
        super('polarArea');
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
    constructor() {
        super('scatter');
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
    constructor() {
        super('bubble');
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
    constructor(type, maxLevels) {
        super(type);
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
        this.config.data = dataConf;
        this.maxLevels = maxLevels;
    }

    setLabels(data) {
    }

    setData(data) {
        if (this.config && this.config.data.datasets.length > 0) {
            this.config.data.datasets[0].tree = DataFormatHelper.preProcess(data);
        }
    }
}

class SunburstChartConfig extends HierarchicalChartConfig {
    constructor() {
        super('sunburst', 4);
        super.setOptions({
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: true
                }
            }
        });
    }
}

class TreemapChartConfig extends HierarchicalChartConfig {
    constructor() {
        super('treemap', 5);
        super.setOptions({
            maintainAspectRatio: false,
            responsive: true,
            text: {
                color: '#000000',
                font: {
                    family: 'Arial'
                }
            },
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

class IcicleChartConfig extends HierarchicalChartConfig {
    constructor() {
        super('icicle', 5);
        super.setOptions({
            maintainAspectRatio: false,
            responsive: true,
            text: {
                hAlign: 'left',
                vAlign: 'top',
                color: '#000000',
                font: {
                    family: 'Arial'
                }
            },
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
ChartConfig.canvas = canvas;
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
Chart.defaults.font.style = 'normal';
Chart.defaults.font.weight = 'normal';
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
                    console.log('invalid data for', type);
                    return;
                }
                values.push(val[0]);
            });
            myChart = new BarChartConfig();
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
            myChart = new PieChartConfig();
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
            myChart = new LineChartConfig();
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
            myChart = new DoughnutChartConfig();
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
            myChart = new PolarAreaChartConfig();
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
            myChart = new ScatterChartConfig();
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
            values = DataFormatHelper.unlist(data);
            myChart = new SunburstChartConfig();
            break;
        }

        case 'treemap': {
            values = DataFormatHelper.unlist(data);
            myChart = new TreemapChartConfig();
            break;
        }

        case 'icicle': {
            values = DataFormatHelper.unlist(data);
            myChart = new IcicleChartConfig();
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

var fontSizeSelect = document.getElementById('fontSize');
fontSizeSelect.onchange = e => {
    var size = fontSizeSelect.value;
    if (/^\d{1,3}$/.test(size)) {
        Chart.defaults.font.size = parseInt(size);
        ChartConfig.update();
    }
};

var fontStyleBtn = document.getElementById('italicBtn');
fontStyleBtn.onclick = e => {
    var style = Chart.defaults.font.style;
    if (style == 'normal') {
        Chart.defaults.font.style = 'italic';
        fontStyleBtn.classList.add('btn-icon-selected');
    } else if (style == 'italic') {
        Chart.defaults.font.style = 'normal';
        fontStyleBtn.classList.remove('btn-icon-selected');
    }
    ChartConfig.update();
};

var fontWeightBtn = document.getElementById('boldBtn');
fontWeightBtn.onclick = e => {
    var weight = Chart.defaults.font.weight;
    if (weight == 'normal') {
        Chart.defaults.font.weight = 'bold';
        fontWeightBtn.classList.add('btn-icon-selected');
    } else if (weight == 'bold') {
        Chart.defaults.font.weight = 'normal';
        fontWeightBtn.classList.remove('btn-icon-selected');
    }
    ChartConfig.update();
};

const colorPicker = document.getElementById('ColorInput');

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

function setDivPos(d, x, y, mid) {
    if (x > mid) {
        d.style.left = (x - 170) + 'px';
    } else {
        d.style.left = x + 'px';
    }
    d.style.top = y + 'px';
}

setCallback(drawChart);