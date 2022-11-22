const expandBtnDiv = document.getElementById('expandBtnDiv');

/**
 * Generate a color by a number
 * @param {number} n any number
 * @returns {string}
 */
function genColor(n) {
    return `rgba(${(121 * n + 51) % 192 + 48},${(52 * n + 203) % 192 + 48},${(165 * n + 67) % 192 + 48},1)`
}

/**
 * Deep copy from source to destination
 * @param {object} src source object
 * @param {object} dest destination object
 */
function copyObjectProperties(src, dest) {
    Object.keys(src).forEach(key => {
        let value = src[key];
        if (value instanceof Object) {
            if (!dest.hasOwnProperty(key)) dest[key] = {};
            copyObjectProperties(value, dest[key]);
        } else {
            if (!dest.hasOwnProperty(key)) dest[key] = value;
        }
    });
}

/**
 * Set the position of the chart settings popup
 * @param {HTMLElement} d popup div
 * @param {number} x X coordinate
 * @param {number} y Y coordinate
 * @param {number} mid X coordinate of the center of the canvas
 */
function setDivPos(d, x, y, mid) {
    if (x > mid) {
        d.style.left = (x - 221) + 'px';
    } else {
        d.style.left = x + 'px';
    }
    d.style.top = y + 'px';
}

/**
 * Super class for all chart configurations
 */
class ChartConfig {
    parents = [];
    // Chart object
    static chart = null;
    // instance of this class
    static instance = null;
    // HTML canvas element
    static canvas = null;

    /**
     * constructor of Chart configuration
     * @param {string} type chart type
     */
    constructor(type) {
        if (ChartConfig.canvas == null) throw new Error('No canvas selected');
        // whether this chart has an axis
        this.hasAxis = false;
        // whether this chart has a legend
        this.hasLegend = false;
        // whether this chart has a marker
        this.hasMarker = false;
        // whether this chart has a marker with changable size
        this.hasMarkerSize = false;

        // chart configuration
        this.config = {};
        this.config.type = type;
        this.name = '';
        this.modified = true;
        backDiv.style.display = 'none'
        clearBreadcrumb();

        ChartConfig.canvas.onclick = evt => {
            evt.stopImmediatePropagation(); // prevents document.onclick()
            if (this instanceof HierarchicalChartConfig) { // display expand button only for hierarchical charts
                expandBtnDiv.style.display = 'block';
            } else {
                expandBtnDiv.style.display = 'none';
            }
            // show the popup
            let popup = document.getElementById('chartEditPopup');
            popup.classList.remove('show');
            downloadPopup.classList.remove('show');
            let myChart = ChartConfig.chart;
            if (!myChart) {
                return;
            }
            let points = myChart.getActiveElements(evt);
            let colors = myChart.data.datasets[0].backgroundColor;
            if (points.length) {
                const point = points[points.length - 1];
                setDivPos(popup, evt.offsetX, evt.offsetY, ChartConfig.canvas.width / 2.5)
                popup.classList.toggle('show');
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

                    ChartConfig.update('none');
                    ChartConfig.setDirty();
                }
                if (ChartConfig.instance instanceof HierarchicalChartConfig) {
                    let clicked = ChartConfig.chart._metasets[0].controller.pointers[point.index];
                    if (clicked.c.length == 0) expandBtnDiv.style.display = 'none'; // hide expand button if the selected element dosent have child
                    document.getElementById('expandBtn').onclick = e => {
                        updateBreadcrumb(clicked);
                        popup.classList.remove('show');
                        ChartConfig.update('expand ' + point.index);
                    }
                }
            }
        };
        ChartConfig.instance = this;
    }

    /**
     * Getter for name
     * @returns {string}
     */
    getName() {
        return this.name;
    }

    /**
     * Getter for chart type
     * @returns {string}
     */
    getType() {
        return this.config.type;
    }

    /**
     * Getter for chart options
     * @returns {object}
     */
    getData() {
        return this.config.data;
    }

    /**
     * Setter for data. Sub classes can override this.
     * @param {object} data chart data
     */
    setData(data) {
        if (this.config) {
            this.config.data = data;
        }
    }

    /**
     * Setter for axis titles
     * @param {Array} titles chart axis titles
     */
    setTitle(titles) {
        if (this.hasAxis) {
            this.setAxisTitle('x', titles[0]);
            this.setAxisTitle('y', titles[1]);
        }
    }

    /**
     * Setter for data. Accepts already processed data.
     * @param {object} data chart data
     */
    setSavedData(data) {
        if (this.config) {
            this.config.data = data;
        }
    }

    /**
     * Setter for chart name
     * @param {string} name chart name
     */
    setName(name) {
        this.name = name;
        if (this.config && this.config.data.datasets.length > 0) {
            this.config.data.datasets[0].label = name;
        }
        updateSettings();
    }

    /**
     * Initialize options for all parent classes
     * @param {object} options chart options
     */
    initOptions(options) {
        this.parents.forEach(cls => {
            cls.initOptions(options);
        });
        if (!this.hasOwnProperty('config')) this.config = {};
        this.config.options = options;
    }

    /**
     * Draw the chart and update the settings
     * @returns {void}
     */
    draw() {
        if (this.config == null || ChartConfig.canvas == null) {
            return;
        }
        if (ChartConfig.chart instanceof Chart) {
            ChartConfig.chart.destroy();
        }
        ChartConfig.chart = new Chart(ChartConfig.canvas, this.config);
        updateSettings();
    }

    /**
     * If this has an axis, set color of its ticks and title
     */
    _update() {
        if (this.hasAxis) {
            this.config.options.scales.x.ticks.color = Chart.defaults.color;
            this.config.options.scales.y.ticks.color = Chart.defaults.color;
            this.config.options.scales.x.title.color = Chart.defaults.color;
            this.config.options.scales.y.title.color = Chart.defaults.color;
        }
    }

    /**
     * Set that the chart has unsaved changes
     */
    static setDirty() {
        if (ChartConfig.chart instanceof Chart) {
            ChartConfig.instance.modified = true;
        }
    }

    /**
     * Update the chart after options or data change.
     * Update the settings after that.
     * @param {string|undefined} mode update mode
     * @returns {void}
     */
    static update(mode) {
        if (ChartConfig.canvas == null) {
            return;
        }
        if (ChartConfig.chart instanceof Chart) {
            ChartConfig.instance._update();
            ChartConfig.chart.update(mode);
            updateSettings();
        }
    }
}

/**
 * Superclass for all basic chart configurations
 */
class BasicChartConfig extends ChartConfig {
    constructor(type) {
        super(type);
        let colors = [];
        this.config.data = {
            labels: [],
            datasets: [{
                label: this.name,
                data: [],
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1
            }]
        };
    }

    /**
     * Overrides the super class method
     * Pre-process chart data and extract labels before setting chart labels.
     * @param {object} data chart data
     */
    setLabels(data) {
        if (this.config) {
            let labels = [];
            data.forEach(item => {
                labels.push(item.n);
            });
            this.config.data.labels = labels;
        }
    }

    /**
     * Overrides the super class method
     * Pre-process chart data before setting them as the chart data.
     * @param {object} data chart data
     */
    setData(data) {
        if (this.config && this.config.data.datasets.length > 0) {
            let clr = [];
            data.forEach((d, i) => {
                clr.push(genColor(i));
            });
            this.config.data.datasets[0].backgroundColor = clr;
            this.config.data.datasets[0].borderColor = clr;
            this.config.data.datasets[0].data = data;
        }
    }
}

/**
 * Super class for chart configurations having an axis
 */
class AxisChartConfig extends BasicChartConfig {
    static initOptions(options) {
        copyObjectProperties({
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true
                    },
                    ticks: {
                        display: true
                    },
                    grid: {
                        display: true
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true
                    },
                    ticks: {
                        display: true
                    },
                    grid: {
                        display: true
                    }
                }
            }
        }, options);
    }

    getAxisVisibility(axis) {
        if (axis !== 'x' && axis !== 'y') return false;
        return this.config.options.scales[axis].display;
    }

    getGridVisibility(axis) {
        if (axis !== 'x' && axis !== 'y') return false;
        return this.config.options.scales[axis].grid.display;
    }

    getTicksVisibility(axis) {
        if (axis !== 'x' && axis !== 'y') return false;
        return this.config.options.scales[axis].ticks.display;
    }

    getTitleVisibility(axis) {
        if (axis !== 'x' && axis !== 'y') return false;
        return this.config.options.scales[axis].title.display;
    }

    getAxisTitle(axis) {
        if (axis !== 'x' && axis !== 'y') return;
        return this.config.options.scales[axis].title.text;
    }

    setAxisVisibility(axis, visible) {
        if (axis !== 'x' && axis !== 'y') return;
        this.config.options.scales[axis].display = visible;
        ChartConfig.update('none');
        ChartConfig.setDirty();
    }

    setGridVisibility(axis, visible) {
        if (axis !== 'x' && axis !== 'y') return;
        this.config.options.scales[axis].grid.display = visible;
        ChartConfig.update('none');
        ChartConfig.setDirty();
    }

    setTicksVisibility(axis, visible) {
        if (axis !== 'x' && axis !== 'y') return;
        this.config.options.scales[axis].ticks.display = visible;
        ChartConfig.update('none');
        ChartConfig.setDirty();
    }

    setTitleVisibility(axis, visible) {
        if (axis !== 'x' && axis !== 'y') return;
        this.config.options.scales[axis].title.display = visible;
        ChartConfig.update('none');
        ChartConfig.setDirty();
    }

    setAxisTitle(axis, title) {
        if (axis !== 'x' && axis !== 'y') return;
        if (typeof (title) !== 'string') title = '';
        this.config.options.scales[axis].title.text = title;
        if (title == '') {
            this.setTitleVisibility(axis, false);
        }
    }
}

/**
 * Super class for chart configurations having a legend
 */
class LegendChartConfig extends BasicChartConfig {
    static initOptions(options) {
        copyObjectProperties({
            plugins: {
                legend: {
                    display: true
                }
            }
        }, options);
    }

    getLegendVisibility() {
        return this.config.options.plugins.legend.display;
    }

    setLegendVisibility(visible) {
        this.config.options.plugins.legend.display = visible;
        ChartConfig.update('none');
        ChartConfig.setDirty();
    }
}

/**
 * Super class for chart configurations having a marker
 */
class MarkerChartConfig extends BasicChartConfig {
    static initOptions(options) {
        copyObjectProperties({
            elements: {
                point: {
                    radius: Chart.defaults.elements.point.radius,
                    hoverRadius: Chart.defaults.elements.point.radius + 3,
                    pointStyle: 'circle'
                }
            }
        }, options);
    }

    getMarkerSize() {
        return this.config.options.elements.point.radius;
    }

    getMarkerStyle() {
        return this.config.options.elements.point.pointStyle;
    }

    setMarkerSize(radius) {
        this.config.options.elements.point.radius = radius;
        this.config.options.elements.point.hoverRadius = radius + 3;
        ChartConfig.update('none');
        ChartConfig.setDirty();
    }

    setMarkerStyle(style) {
        this.config.options.elements.point.pointStyle = style;
        ChartConfig.update('none');
        ChartConfig.setDirty();
    }
}

/**
 * Configuration of bar chart
 */
class BarChartConfig extends BasicChartConfig {
    constructor() {
        super('bar');
        this.parents = this.constructor._parents;
        this.initOptions({
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
        this.hasAxis = true;
        this.config.options.scales.x.grid.display = false;
    }
}

/**
 * Configuration of pie chart
 */
class PieChartConfig extends BasicChartConfig {
    constructor() {
        super('pie');
        this.parents = this.constructor._parents;
        this.initOptions({
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            }
        });
        this.hasLegend = true;
    }
}

/**
 * Configuration of line chart
 */
class LineChartConfig extends BasicChartConfig {
    constructor() {
        super('line');
        this.parents = this.constructor._parents;
        this.initOptions({
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
        this.hasAxis = true;
        this.hasMarker = true;
        this.hasMarkerSize = true;
    }

    setData(data) {
        super.setData(data);
        this.config.data.datasets[0].borderColor = Chart.defaults.color;
    }

    _update() {
        super._update();
        this.config.data.datasets[0].borderColor = Chart.defaults.color;
    }
}

/**
 * Configuration of doughnut chart
 */
class DoughnutChartConfig extends BasicChartConfig {
    constructor() {
        super('doughnut');
        this.parents = this.constructor._parents;
        this.initOptions({
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            }
        });
        this.hasLegend = true;
    }
}

/**
 * Configuration of polar area chart
 */
class PolarAreaChartConfig extends BasicChartConfig {
    constructor() {
        super('polarArea');
        this.parents = this.constructor._parents;
        this.initOptions({
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            },
            scales: {
                r: {
                    ticks: {
                        backdropColor: '#0000'
                    }
                }
            }
        });
        this.hasLegend = true;
    }

    _update() {
        super._update();
        this.config.options.scales.r.ticks.color = Chart.defaults.color;
    }
}

/**
 * Configuration of scatter chart
 */
class ScatterChartConfig extends BasicChartConfig {
    constructor() {
        super('scatter');
        this.parents = this.constructor._parents;
        this.initOptions({
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
        this.hasAxis = true;
        this.hasMarker = true;
        this.hasMarkerSize = true;
    }

    setTitle(title) {
        if (this.hasAxis) {
            this.setAxisTitle('x', title[1]);
            this.setAxisTitle('y', title[2]);
        }
    }
}

/**
 * Configuration of bubble chart
 */
class BubbleChartConfig extends BasicChartConfig {
    constructor() {
        super('bubble');
        this.parents = this.constructor._parents;
        this.initOptions({
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
        this.hasAxis = true;
        // this.hasMarker = true;
    }

    setTitle(title) {
        if (this.hasAxis) {
            this.setAxisTitle('x', title[1]);
            this.setAxisTitle('y', title[2]);
        }
    }
}

/**
 * Configuration of radar chart
 */
class RadarChartConfig extends BasicChartConfig {
    constructor() {
        super('radar');
        this.parents = this.constructor._parents;
        this.initOptions({
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                autoPadding: false
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    display: false
                },
                r: {
                    ticks: {
                        backdropColor: '#0000'
                    }
                }
            }
        });
        this.hasMarker = true;
        this.hasMarkerSize = true;
    }

    _update() {
        super._update();
        this.config.options.scales.r.ticks.color = Chart.defaults.color;
        this.config.options.scales.r.pointLabels.color = Chart.defaults.color;
        this.config.options.scales.r.pointLabels.font.size = Chart.defaults.font.size;
    }

    setData(data) {
        super.setData(data);
        if (this.config && this.config.data.datasets.length > 0) {
            this.config.data.datasets[0].fill = false;
        }
    }
}

/**
 * Superclass for all hierarchical chart configurations
 */
class HierarchicalChartConfig extends ChartConfig {
    constructor(type, maxLevels) {
        super(type);
        let colors = [];
        let dataConf = {
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
        let unlinked = [];
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

/**
 * Configuration of sunburst chart
 */
class SunburstChartConfig extends HierarchicalChartConfig {
    constructor() {
        super('sunburst', 4);
        super.initOptions({
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

/**
 * Configuration of treemap chart
 */
class TreemapChartConfig extends HierarchicalChartConfig {
    constructor() {
        super('treemap', 5);
        super.initOptions({
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

/**
 * Configuration of icicle chart
 */
class IcicleChartConfig extends HierarchicalChartConfig {
    constructor() {
        super('icicle', 5);
        super.initOptions({
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

/**
 * Register LegendChartConfig as a parent class for the PieChartConfig, DoughnutChartConfig, and PolarAreaChartConfig classes.
 */
[PieChartConfig, DoughnutChartConfig, PolarAreaChartConfig].forEach(cls => {
    const parent = LegendChartConfig;
    if (typeof cls._parents == 'undefined') cls._parents = [];
    cls._parents.push(parent);
    cls.prototype.getLegendVisibility = parent.prototype.getLegendVisibility;
    cls.prototype.setLegendVisibility = parent.prototype.setLegendVisibility;
});

/**
 * Register AxisChartConfig as a parent class for the BarChartConfig, LineChartConfig, ScatterChartConfig, and BubbleChartConfig classes.
 */
[BarChartConfig, LineChartConfig, ScatterChartConfig, BubbleChartConfig].forEach(cls => {
    const parent = AxisChartConfig;
    if (typeof cls._parents == 'undefined') cls._parents = [];
    cls._parents.push(parent);
    cls.prototype.getAxisVisibility = parent.prototype.getAxisVisibility;
    cls.prototype.getGridVisibility = parent.prototype.getGridVisibility;
    cls.prototype.getTicksVisibility = parent.prototype.getTicksVisibility;
    cls.prototype.getTitleVisibility = parent.prototype.getTitleVisibility;
    cls.prototype.getAxisTitle = parent.prototype.getAxisTitle;
    cls.prototype.setAxisVisibility = parent.prototype.setAxisVisibility;
    cls.prototype.setGridVisibility = parent.prototype.setGridVisibility;
    cls.prototype.setTicksVisibility = parent.prototype.setTicksVisibility;
    cls.prototype.setTitleVisibility = parent.prototype.setTitleVisibility;
    cls.prototype.setAxisTitle = parent.prototype.setAxisTitle;
});

/**
 * Register MarkerChartConfig as a parent class for the LineChartConfig, ScatterChartConfig, BubbleChartConfig, and RadarChartConfig classes.
 */
[LineChartConfig, ScatterChartConfig, BubbleChartConfig, RadarChartConfig].forEach(cls => {
    const parent = MarkerChartConfig;
    if (typeof cls._parents == 'undefined') cls._parents = [];
    cls._parents.push(parent);
    cls.prototype.getMarkerSize = parent.prototype.getMarkerSize;
    cls.prototype.getMarkerStyle = parent.prototype.getMarkerStyle;
    cls.prototype.setMarkerSize = parent.prototype.setMarkerSize;
    cls.prototype.setMarkerStyle = parent.prototype.setMarkerStyle;
});