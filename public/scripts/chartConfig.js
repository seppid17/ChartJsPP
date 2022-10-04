class ChartConfig {
    static chart = null;
    static canvas = null;
    constructor(type) {
        if (ChartConfig.canvas == null) throw new Error('No canvas selected');
        this.config = {};
        this.config.type = type;
        this.name = '';
        backDiv.style.display = "none"
        while (breadcrumb.hasChildNodes()) {
            breadcrumb.removeChild(breadcrumb.firstChild);
        }
        ChartConfig.canvas.onclick = evt => {
            if (this instanceof HierarchicalChartConfig) {
                document.getElementById('expandBtnDiv').style.display = 'block';
            } else {
                document.getElementById('expandBtnDiv').style.display = 'none';
            }
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
                    }
                    colors[point.index] = ColorInput.value;

                    myChart.update('none');
                }
                document.getElementById('expandBtn').onclick = e => {
                    myChart.update('expand ' + point.index);
                    var first = ChartConfig.chart._metasets[0].controller.pointers[0];
                    console.log(first)
                    path = setPath(first);
                    while (breadcrumb.hasChildNodes()) {
                        breadcrumb.removeChild(breadcrumb.firstChild);
                    }
                    path.forEach(createBreadcrumb);
                    popup.classList.remove("show");
                    backDiv.style.display = "block"
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
