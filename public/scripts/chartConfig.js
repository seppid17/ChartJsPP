function genColor(n) {
    return `rgba(${(121*n+51)%192+48},${(52*n+203)%192+48},${(165*n+67)%192+48},1)`
}

class ChartConfig {
    static chart = null;
    static instance = null;
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
            evt.stopImmediatePropagation(); // prevents document.onclick()
            if (this instanceof HierarchicalChartConfig) { // display expand button only for hierarchical charts
                document.getElementById('expandBtnDiv').style.display = 'block';
            } else {
                document.getElementById('expandBtnDiv').style.display = 'none';
            }
            let popup = document.getElementById("myPopup");
            popup.classList.remove("show");
            downloadPopup.classList.remove("show");
            let myChart = ChartConfig.chart;
            if (!myChart) {
                return;
            }
            let points = myChart.getActiveElements(evt);
            var colors = myChart.data.datasets[0].backgroundColor;
            if (points.length) {
                const point = points[points.length - 1];
                let clicked = ChartConfig.chart._metasets[0].controller.pointers[point.index];
                if (clicked.c.length == 0) document.getElementById('expandBtnDiv').style.display = 'none'; // hide expand button if the selected element dosent have child
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

                    path = setPath(clicked);
                    while (breadcrumb.hasChildNodes()) {
                        breadcrumb.removeChild(breadcrumb.firstChild);
                    }
                    path.forEach(createBreadcrumb);
                    popup.classList.remove("show");
                    backDiv.style.display = "block"
                    myChart.update('expand ' + point.index);
                }
            }
        };
        ChartConfig.instance = this;
    }

    setData(data) {
        if (this.config) {
            this.config.data = data;
        }
    }

    setSavedData(data) {
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

    getType() {
        return this.config.type;
    }

    getData() {
        return this.config.data;
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
                clr.push(genColor(i));
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

    setSavedData(data) {
        this.setData(data);
    }

    _unlinkTree(tree) {
        var unlinked = [];
        tree.c.forEach(item => {
            let newItem = {
                n: item.n,
                v: item.v,
                c: this._unlinkTree(item)
            };
            if (item.clr !== undefined) {
                newItem.clr = item.clr;
            }
            unlinked.push(newItem);
        });
        return unlinked;
    }

    getData() {
        if (this.config && this.config.data.datasets.length > 0) {
            return this._unlinkTree(this.config.data.datasets[0].tree);
        }
        return null;
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
