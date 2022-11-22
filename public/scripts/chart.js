const body = document.getElementsByTagName('body')[0];
const chartDiv = document.getElementById('chartDiv');
const canvas = document.getElementById('myChart');
const chartBtn = document.getElementById('drawBtn');
const drawBtnDiv = document.getElementById('drawBtnDiv');
const drawBtn = document.getElementById('drawBtn')
const uploadViewDiv = document.getElementById('uploadViewDiv');
const chartViewDiv = document.getElementById('chartViewDiv');
const alertDiv = document.getElementById('alertPop');
const chartNameView = document.getElementById('chartNameView');
const downloadPopup = document.getElementById('downloadPopup');
const nameView = document.getElementById('nameView');
const nameEdit = document.getElementById('nameEdit');
const nameInput = document.getElementById('nameInput');
const colorPicker = document.getElementById('ColorInput');
const backDiv = document.getElementById('backDiv');
const breadcrumb = document.getElementById('breadcrumbs');
const chartEditPopup = document.getElementById('chartEditPopup');
const saveNameBtn = document.getElementById('saveName');
const chartTypes = document.getElementsByName('charttype');
const selectChartType = document.getElementById('selectChartType');


/**
 * Resize chart div on page resize and load
 */
function resizeFn() {
    let height = window.innerHeight;
    let width = window.innerWidth;
    chartDiv.style.width = width + 'px';
    if (width >= height) {
        chartDiv.style.height = height + 'px';
    } else {
        chartDiv.style.height = width + 'px';
    }
}

window.addEventListener('load', resizeFn);
window.addEventListener('resize', resizeFn);

/**
 * Warn user before leaving the page if there are unsaved modifications
 */
window.onbeforeunload = function () {
    if (ChartConfig.instance != null) {
        if (ChartConfig.instance.modified) {
            return '';
        }
    }
};

/**
 * Set keyboard shortcuts for chart page
 * @param {KeyboardEvent} e event
 * @returns {void}
 */
function chartKeyListener(e) {
    if (e.key.toLowerCase() == 's' && !e.shiftKey && !e.altKey && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        saveBtn.click();
    }
    if (e.key.toLowerCase() == 's' && e.shiftKey && !e.altKey && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        if (body.classList.contains('authOnly')) return;
        e.preventDefault();
        if (shareBtn.hidden == false) {
            shareBtn.click();
        } else if (unshareBtn.hidden == false) {
            unshareBtn.click();
        }
    }
    if (e.key == (navigator.platform.match("Mac") ? 'Backspace' : 'Delete') && !e.shiftKey && !e.altKey && !(navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        if (body.classList.contains('authOnly')) return;
        e.preventDefault();
        deleteBtn.click();
    }
    if (e.key.toLowerCase() == 'o' && !e.shiftKey && !e.altKey && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        document.getElementById('selectFileBtn').click();
    }
    if (e.key == 'Enter' && !e.shiftKey && !e.altKey && !(navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        if (drawBtnDiv.hidden == false) {
            drawBtn.click();
        }
    }
}

document.addEventListener('keydown', chartKeyListener);

/**
 * Show chart canvas and hide alert message.
 * Scroll the view into chart.
 */
function showChartView() {
    chartViewDiv.style.display = 'block';
    alertDiv.style.display = 'none';
    chartViewDiv.scrollIntoView();
}

/**
 * Show an error message about chart type
 * @param {string} message error message
 */
function showChartError(message) {
    selectChartType.classList.add('error');
    alertDiv.style.display = 'block';
    selectChartType.querySelector('small').innerText = message;
    uploadViewDiv.scrollIntoView();
}

/**
 * Draw the chart with given data and selected chart type.
 * @param {object} json chart data, titles, and properties
 * @returns {void}
 */
function drawChart(json) {
    chartViewDiv.style.display = 'none';
    selectChartType.className = 'chart-type';
    let { title, data, properties } = json;
    if (!(data instanceof Array) || data.length <= 0) {
        return;
    }
    let type = getSelectedChartType();
    if (type == null) {
        showChartError("You have not selected a chart type");
        return;
    }
    let myChart;
    let values = [];
    switch (type) {
        case 'bar': {
            if (!data.every(item => {
                let val = item.v;
                if (val.length !== 1 || item.c && item.c.length > 0) {
                    return false;
                }
                values.push(val[0]);
                return true;
            })) {
                showChartError('This chart type is not compatible with this dataset');
                return;
            }
            myChart = new BarChartConfig();
            break;
        }

        case 'pie': {
            if (!data.every(item => {
                let val = item.v;
                if (val.length !== 1 || item.c && item.c.length > 0) {
                    return false;
                }
                values.push(val[0]);
                return true;
            })) {
                showChartError('This chart type is not compatible with this dataset');
                return;
            }
            myChart = new PieChartConfig();
            break;
        }

        case 'line': {
            if (!data.every(item => {
                let val = item.v;
                if (val.length !== 1 || item.c && item.c.length > 0) {
                    return false;
                }
                values.push(val[0]);
                return true;
            })) {
                showChartError('This chart type is not compatible with this dataset');
                return;
            }
            myChart = new LineChartConfig();
            break;
        }

        case 'doughnut': {
            if (!data.every(item => {
                let val = item.v;
                if (val.length !== 1 || item.c && item.c.length > 0) {
                    return false;
                }
                values.push(val[0]);
                return true;
            })) {
                showChartError('This chart type is not compatible with this dataset');
                return;
            }
            myChart = new DoughnutChartConfig();
            break;
        }

        case 'polarArea': {
            if (!data.every(item => {
                let val = item.v;
                if (val.length !== 1 || item.c && item.c.length > 0) {
                    return false;
                }
                values.push(val[0]);
                return true;
            })) {
                showChartError('This chart type is not compatible with this dataset');
                return;
            }
            myChart = new PolarAreaChartConfig();
            break;
        }

        case 'scatter': {
            if (!data.every(item => {
                let val = item.v;
                if (val.length !== 2 || item.c && item.c.length > 0) {
                    return;
                }
                values.push({ x: val[0], y: val[1] });
                return true;
            })) {
                showChartError('This chart type is not compatible with this dataset');
                return;
            }
            myChart = new ScatterChartConfig();
            break;
        }

        case 'bubble': {
            if (!data.every(item => {
                let val = item.v;
                if (val.length !== 3 || item.c && item.c.length > 0) {
                    return;
                }
                values.push({ x: val[0], y: val[1], r: val[2] });
                return true;
            })) {
                showChartError('This chart type is not compatible with this dataset');
                return;
            }
            data.forEach(item => {
                let val = item.v;
                if (val.length !== 3) {
                    return;
                }
                values.push({ x: val[0], y: val[1], r: val[2] });
            });
            myChart = new BubbleChartConfig();
            break;
        }

        case 'radar': {
            if (!data.every(item => {
                let val = item.v;
                if (val.length !== 1 || item.c && item.c.length > 0) {
                    return false;
                }
                values.push(val[0]);
                return true;
            })) {
                showChartError('This chart type is not compatible with this dataset');
                return;
            }
            myChart = new RadarChartConfig();
            break;
        }

        case 'sunburst': {
            if (data.length <= 0 || data[0].v.length !== 1) {
                showChartError('This chart type is not compatible with this dataset');
                return;
            }
            values = DataFormatHelper.unlist(data);
            myChart = new SunburstChartConfig();
            break;
        }

        case 'treemap': {
            if (data.length <= 0 || data[0].v.length !== 1) {
                showChartError('This chart type is not compatible with this dataset');
                return;
            }
            values = DataFormatHelper.unlist(data);
            myChart = new TreemapChartConfig();
            break;
        }

        case 'icicle': {
            if (data.length <= 0 || data[0].v.length !== 1) {
                showChartError('This chart type is not compatible with this dataset');
                return;
            }
            values = DataFormatHelper.unlist(data);
            myChart = new IcicleChartConfig();
            break;
        }

        default:
            return;
    }
    if (properties.hasOwnProperty('name')) chartName = properties.name;
    myChart.setName(chartName);
    myChart.setTitle(title);
    myChart.setLabels(data);
    myChart.setData(values);
    showChartView();
    myChart.draw();
    if (properties.hasOwnProperty('fontSize')) setFontSize(properties.fontSize);
    if (properties.hasOwnProperty('fontStyle')) setFontStyle(properties.fontStyle);
    if (properties.hasOwnProperty('fontWeight')) setFontWeight(properties.fontWeight);
};

/**
 * Get a new canvas element having the same content as the input canvas but the
 * unfilled borders are cropped out.
 * @param {HTMLCanvasElement} canvas the canvas having the chart
 * @returns {HTMLCanvasElement}
 */
function getCroppedCanvas(canvas, setLightTheme = true) {
    let savedColor = Chart.defaults.color;
    if (setLightTheme) {
        Chart.defaults.color = '#333';
        ChartConfig.update('none');
    }

    let width_source = canvas.width;
    let height_source = canvas.height;

    let ctx = canvas.getContext('2d');
    let img = ctx.getImageData(0, 0, width_source, height_source);

    if (setLightTheme) {
        Chart.defaults.color = savedColor;
        ChartConfig.update('none');
    }

    let data = img.data;

    let left = width_source;
    let top = height_source;
    let right = 0;
    let bottom = 0;

    for (let i = 0; i < height_source; i++) {
        for (let j = 0; j < width_source; j++) {
            if (data[(i * width_source + j) * 4 + 3] > 0) {
                if (i < top) {
                    top = i;
                }
                if (i > bottom) {
                    bottom = i;
                }
                if (j < left) {
                    left = j;
                }
                if (j > right) {
                    right = j;
                }
            }
        }
    }
    let width = right - left + 1;
    let height = bottom - top + 1;
    if (width < 0) {
        width = 0;
        right = left - 1;
    }
    if (height < 0) {
        height = 0;
        bottom = top - 1;
    }

    let img2 = ctx.createImageData(width, height);
    let data2 = img2.data;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let x = left + j;
            let y = top + i;
            pos0 = (x + y * width_source) * 4;
            pos = (j + i * width) * 4;
            data2[pos] = data[pos0];
            data2[pos + 1] = data[pos0 + 1];
            data2[pos + 2] = data[pos0 + 2];
            data2[pos + 3] = data[pos0 + 3];
        }
    }
    let canvas2 = document.createElement('canvas');
    canvas2.width = width;
    canvas2.height = height;
    let ctx2 = canvas2.getContext('2d');
    ctx2.putImageData(img2, 0, 0);
    return canvas2;
}

/**
 * Get a thumbnail of a given canvas in given resolution as a png image data URL.
 * @param {HTMLCanvasElement} canvas the canvas containing the chart
 * @param {number} width width of thumbnail
 * @param {number} height height of thumbnail
 * @returns {string}
 */
function make_thumb(canvas, width, height) {
    canvas = getCroppedCanvas(canvas, false);
    let width_source = canvas.width;
    let height_source = canvas.height;
    width = Math.round(width);
    height = Math.round(height);

    let ratio_w = width_source / width;
    let ratio_h = height_source / height;
    let ratio_max = Math.max(ratio_h, ratio_w);
    let ratio_w_half = Math.ceil(ratio_max / 2);
    let ratio_h_half = Math.ceil(ratio_max / 2);
    let x_off = (width_source - width * ratio_max) / 2;
    let y_off = (height_source - height * ratio_max) / 2;

    let ctx = canvas.getContext('2d');
    let img = ctx.getImageData(0, 0, width_source, height_source);
    let img2 = ctx.createImageData(width, height);
    let data = img.data;
    let data2 = img2.data;

    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            let x2 = (i + j * width) * 4;
            let weight = 0;
            let weights = 0;
            let weights_alpha = 0;
            let gx_r = 0;
            let gx_g = 0;
            let gx_b = 0;
            let gx_a = 0;
            let center_y = y_off + (j + 0.5) * ratio_max;
            let yy_start = Math.floor(y_off + j * ratio_max);
            let yy_stop = Math.ceil(y_off + (j + 1) * ratio_max);
            for (let yy = yy_start; yy < yy_stop; yy++) {
                let inRange = (0 <= yy && yy <= height_source);
                let dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                let center_x = x_off + (i + 0.5) * ratio_max;
                let w0 = dy * dy; //pre-calc part of w
                let xx_start = Math.floor(x_off + i * ratio_max);
                let xx_stop = Math.ceil(x_off + (i + 1) * ratio_max);
                for (let xx = xx_start; xx < xx_stop; xx++) {
                    if (inRange) inRange = (0 <= xx && xx <= width_source)
                    let dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                    let w = Math.sqrt(w0 + dx * dx);
                    if (w >= 1) {
                        //pixel too far
                        continue;
                    }
                    //hermite filter
                    weight = 2 * w * w * w - 3 * w * w + 1;
                    let pos_x = 4 * (xx + yy * width_source);
                    //alpha
                    let alpSrc = inRange ? data[pos_x + 3] : 0;
                    gx_a += weight * alpSrc;
                    weights_alpha += weight;
                    //colors
                    if (alpSrc < 255)
                        weight = weight * alpSrc / 250;
                    gx_r += weight * (inRange ? data[pos_x] : 255);
                    gx_g += weight * (inRange ? data[pos_x + 1] : 255);
                    gx_b += weight * (inRange ? data[pos_x + 2] : 255);
                    weights += weight;
                }
            }
            data2[x2] = gx_r / weights;
            data2[x2 + 1] = gx_g / weights;
            data2[x2 + 2] = gx_b / weights;
            data2[x2 + 3] = gx_a / weights_alpha;

            data2[x2] = 255 - (255 - data2[x2]) * data2[x2 + 3] / 255
            data2[x2 + 1] = 255 - (255 - data2[x2 + 1]) * data2[x2 + 3] / 255
            data2[x2 + 2] = 255 - (255 - data2[x2 + 2]) * data2[x2 + 3] / 255
            // data2[x2 + 3] = 255;
        }
    }
    //make canvas
    let canvas2 = document.createElement('canvas');
    canvas2.width = width;
    canvas2.height = height;
    //draw
    let ctx2 = canvas2.getContext('2d');
    ctx2.putImageData(img2, 0, 0);
    return canvas2.toDataURL('image/png', 0.8);
}

/**
 * Convert color string from rgba(r,g,b,a) format to #rrggbb format
 * @param {string} rgb rgba color string
 * @returns {string}
 */
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? '#' +
        ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

/**
 * Draw a chart from saved data
 * @param {object} info chart information
 * @param {string} type chart type
 * @param {object} data chart data
 * @param {object} properties chart properties
 * @returns {void}
 */
function drawSavedChart(info, type, data, properties) {
    if (!Validator.validate('chartName', info.name) || !Validator.validate('type', type)) {
        window.location = '/chart';
        return;
    }
    if (typeof info.name != 'undefined') chartName = info.name;
    if (typeof properties.fontSize != 'undefined') {
        setFontSize(properties.fontSize);
    }
    if (typeof properties.fontStyle != 'undefined') {
        setFontStyle(properties.fontStyle);
    }
    if (typeof properties.fontWeight != 'undefined') {
        setFontWeight(properties.fontWeight);
    }
    let myChart;
    switch (type) {
        case 'bar': {
            myChart = new BarChartConfig();
            break;
        }
        case 'pie': {
            myChart = new PieChartConfig();
            break;
        }
        case 'line': {
            myChart = new LineChartConfig();
            break;
        }
        case 'doughnut': {
            myChart = new DoughnutChartConfig();
            break;
        }
        case 'polarArea': {
            myChart = new PolarAreaChartConfig();
            break;
        }
        case 'scatter': {
            myChart = new ScatterChartConfig();
            break;
        }
        case 'bubble': {
            myChart = new BubbleChartConfig();
            break;
        }
        case 'radar': {
            myChart = new RadarChartConfig();
            break;
        }
        case 'sunburst': {
            myChart = new SunburstChartConfig();
            break;
        }

        case 'treemap': {
            myChart = new TreemapChartConfig();
            break;
        }

        case 'icicle': {
            myChart = new IcicleChartConfig();
            break;
        }
        default:
            return;
            break;
    }
    myChart.modified = false;
    myChart.setSavedData(data);
    myChart.setName(chartName);
    if (myChart.hasMarker) {
        if (myChart.hasMarkerSize && typeof properties.markerSize == 'number') {
            myChart.setMarkerSize(properties.markerSize);
        }
        if (typeof properties.markerStyle == 'string') {
            myChart.setMarkerStyle(properties.markerStyle);
        }
    }
    if (myChart.hasAxis) {
        if (typeof properties.xAxisVisible == 'boolean') {
            myChart.setAxisVisibility('x', properties.xAxisVisible);
        }
        if (typeof properties.xGridVisible == 'boolean') {
            myChart.setGridVisibility('x', properties.xGridVisible);
        }
        if (typeof properties.xTicksVisible == 'boolean') {
            myChart.setTicksVisibility('x', properties.xTicksVisible);
        }
        if (typeof properties.xTitleVisible == 'boolean') {
            myChart.setTitleVisibility('x', properties.xTitleVisible);
        }
        if (typeof properties.xTitle == 'string') {
            myChart.setAxisTitle('x', properties.xTitle);
        }
        if (typeof properties.yAxisVisible == 'boolean') {
            myChart.setAxisVisibility('y', properties.yAxisVisible);
        }
        if (typeof properties.yGridVisible == 'boolean') {
            myChart.setGridVisibility('y', properties.yGridVisible);
        }
        if (typeof properties.yTicksVisible == 'boolean') {
            myChart.setTicksVisibility('y', properties.xTicksVisible);
        }
        if (typeof properties.yTitleVisible == 'boolean') {
            myChart.setTitleVisibility('y', properties.yTitleVisible);
        }
        if (typeof properties.yTitle == 'string') {
            myChart.setAxisTitle('y', properties.yTitle);
        }
    }
    if (myChart.hasLegend) {
        if (typeof properties.legendVisible == 'boolean') {
            myChart.setLegendVisibility(properties.legendVisible);
        }
    }
    showChartView();
    myChart.draw();
    chartNameView.innerText = chartName;
    if (Chart.defaults.font.style == 'italic') {
        fontStyleBtn.classList.add('btn-icon-selected');
    } else {
        fontStyleBtn.classList.remove('btn-icon-selected');
    }
    if (Chart.defaults.font.weight == 'bold') {
        fontWeightBtn.classList.add('btn-icon-selected');
    } else {
        fontWeightBtn.classList.remove('btn-icon-selected');
    }
    showHideShareUnshare(info.shared);
}

/**
 * Try to copy a text to the clipboard.
 * Return true on success. Otherwise return false.
 * @param {boolean} retry try again
 * @returns {boolean}
 */
async function copyLinkToClipboard(retry = true) {
    try {
        let link = location.protocol + '//' + location.host + '/chart/' + chartID;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(link);
            return true;
        }
    } catch (e) {
        if (retry) {
            return await copyLinkToClipboard(false);
        }
    }
    return false;
}


/**
 * Set event listeners for elements
 */

document.onclick = function () {
    downloadPopup.classList.remove('show');
    chartEditPopup.classList.remove('show');
}

drawBtn.onclick = function () {
    FileInputManager.draw(drawChart);
}


/**
 * Update legend color after rendering
 */
Chart.register({
    id: 'legendColorUpdate',
    afterRender: function (c) {
        let legends = c.legend.legendItems;
        let colors = c.data.datasets[0].backgroundColor;
        legends.forEach((e, i) => {
            e.fillStyle = colors[i % colors.length];
        });
    }
});


/**
 * Initialize chart properties and configurations
 */
ChartConfig.canvas = canvas;
Chart.defaults.font.size = 14;
Chart.defaults.font.style = 'normal';
Chart.defaults.font.weight = 'normal';
Chart.defaults.borderColor = '#8e909280';
Chart.defaults.plugins.legend.position = 'bottom';

if (Theme.theme == Theme.DARK) Chart.defaults.color = '#eee';
else Chart.defaults.color = '#333';

/**
 * Set the text and line colors to match the theme
 */
Theme.addOnchangeTrigger(function (theme) {
    if (theme == Theme.DARK) Chart.defaults.color = '#eee';
    else Chart.defaults.color = '#333';
    ChartConfig.update('none');
});

/**
 * Set settings according to chart defaults
 */
let chartID = '';
let chartName = 'Untitled';
fontSizeSelect.value = Chart.defaults.font.size;
markerSizeSelect.value = Chart.defaults.elements.point.radius;
markerStyleSelect.value = Chart.defaults.elements.point.pointStyle;

if (Chart.defaults.font.style == 'italic') {
    fontStyleBtn.classList.add('btn-icon-selected');
}
if (Chart.defaults.font.weight == 'bold') {
    fontWeightBtn.classList.add('btn-icon-selected');
}

/**
 * Set click listeners for chart type selection buttons to show the
 * Generate button if there is valid extracted data.
 */
for (i = 0; i < chartTypes.length; i++) {
    chartTypes[i].onclick = function (e) {
        if (FileInputManager.extractedData != null) {
            drawBtnDiv.hidden = false;
        }
    }
}

if (/^\/chart\/[0-9a-fA-F]{16,32}$/.test(document.location.pathname)) {
    chartID = document.location.pathname.split('/')[2];
    Loader.show();
    let xhrSender = new XHRSender();
    xhrSender.addField('id', chartID);
    let cb = function (xhr) {
        try {
            let resp = JSON.parse(xhr.responseText);
            if (!resp.hasOwnProperty('success') || resp['success'] !== true || !resp.hasOwnProperty('info') || !resp.hasOwnProperty('data')) {
                let errMsg;
                if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === 'string') {
                    if (resp['reason'] == 'Unauthorized') {
                        xhrSender.send('/chart/retrieveShared', cb);
                        return;
                    }
                    if (resp['reason'] == 'NotShared') {
                        popupLogin(function (success) {
                            if (success) {
                                Loader.show();
                                xhrSender.send('/chart/retrieve', cb);
                            } else {
                                PopupMessage.showFailure('Unauthorized', function () {
                                    window.location = '/chart';
                                });
                            }
                        });
                        return;
                    }
                    errMsg = resp['reason'];
                } else {
                    errMsg = 'Chart retrieving failed!';
                }
                PopupMessage.showFailure(errMsg, function () {
                    window.location = '/chart';
                });
                return;
            }
            let info = resp.info;
            if (info.owner == null) {
                body.classList.add('authOnly');
            } else {
                body.classList.remove('authOnly');
            }
            let data = resp.data;
            let chartData = JSON.parse(data.data);
            let properties = JSON.parse(data.properties);
            Loader.hide();
            drawSavedChart(info, data.type, chartData, properties);
        } catch (error) {
            PopupMessage.showFailure('Something went wrong! Please try again.', function () {
                window.location = '/chart';
            });
        }
        Loader.hide();
    };
    xhrSender.send('/chart/retrieve', cb);
} else {
    body.classList.remove('authOnly');
}

let loadedScripts = [];
/**
 * Load a script from the given source.
 * Check the integrity if provided.
 * @param {string} src URL of the script source
 * @param {string|undefines} hash integrity
 * @returns {void}
 */
function loadScript(src, hash = null) {
    if (loadedScripts.includes(src)) return;
    let scriptElem = document.createElement('script');
    scriptElem.src = src;
    if (hash != null) {
        scriptElem.integrity = hash;
        scriptElem.crossOrigin = 'anonymous';
    }
    document.body.appendChild(scriptElem);
}

/**
 * Load the remaining optional javascript libraries after a delay
 * to prevent them blocking the page rendering
 */
setTimeout(function () {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'sha256-mMzxeqEMILsTAXYmGPzJtqs6Tn8mtgcdZNC0EVTfOHU=');
    loadScript('https://kit.fontawesome.com/8d62299fba.js');
}, 1000);