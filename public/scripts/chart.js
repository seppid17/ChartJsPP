const body = document.getElementsByTagName('body')[0];
const chartDiv = document.getElementById('chartDiv');
const canvas = document.getElementById('myChart');
ChartConfig.canvas = canvas;
const chartBtn = document.getElementById('drawBtn');

const uploadViewDiv = document.getElementById('uploadViewDiv');
const chartViewDiv = document.getElementById('chartViewDiv');
const alertDiv = document.getElementById('alertPop');
const fontSizeSelect = document.getElementById('fontSize');
const fontStyleBtn = document.getElementById('italicBtn');
const fontWeightBtn = document.getElementById('boldBtn');
const markerSizeSelect = document.getElementById('markerSize');
const markerStyleSelect = document.getElementById('markerStyle');
const chartNameView = document.getElementById('chartNameView');
const downloadPopup = document.getElementById('downloadPopup');
const nameView = document.getElementById('nameView');
const nameEdit = document.getElementById('nameEdit');
const nameInput = document.getElementById('nameInput');
const colorPicker = document.getElementById('ColorInput');
const backDiv = document.getElementById('backDiv');
const breadcrumb = document.getElementById('breadcrumbA');
const chartEditPopup = document.getElementById('chartEditPopup');
const saveNameBtn = document.getElementById('saveName');

resizeFn = () => {
    let height = window.innerHeight;
    let width = window.innerWidth;
    chartDiv.style.width = width + 'px';
    if (width >= height) {
        chartDiv.style.height = height + 'px';
    } else {
        chartDiv.style.height = width + 'px';
    }
}

window.onload = resizeFn;
window.onresize = resizeFn;

if (isDark) Chart.defaults.color = '#eee';
else Chart.defaults.color = '#333';
let themeClick = darkBtn.onclick;
darkBtn.onclick = e => {
    themeClick(e);
    if (darkBtn.checked) Chart.defaults.color = '#eee';
    else Chart.defaults.color = '#333';
    ChartConfig.update('none');
}
Chart.defaults.font.size = 18;
Chart.defaults.font.style = 'normal';
Chart.defaults.font.weight = 'normal';
Chart.defaults.borderColor = '#8e909240';
Chart.defaults.scale.ticks.backdropColor = '#0000';
Chart.defaults.plugins.legend.position = 'bottom';

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

Chart.register({
    id: 'legendColorUpdate',
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
            myChart = new BubbleChartConfig();
            break;
        }
        case 'radar': {
            data.forEach(item => {
                var val = item.v;
                if (val.length !== 1) {
                    console.log('invalid data for', type);
                    return;
                }
                values.push(val[0]);
            });
            myChart = new RadarChartConfig();
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
    if (['line', 'scatter', 'radar', 'bubble'].includes(type)) {
        body.classList.remove('noMarker');
    } else {
        body.classList.add('noMarker');
    }
};

function getCroppedCanvas(canvas) {
    var width_source = canvas.width;
    var height_source = canvas.height;

    var ctx = canvas.getContext('2d');
    var img = ctx.getImageData(0, 0, width_source, height_source);
    var data = img.data;

    var left = width_source;
    var top = height_source;
    var right = 0;
    var bottom = 0;

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
    var width = right - left + 1;
    var height = bottom - top + 1;
    if (width < 0) {
        width = 0;
        right = left - 1;
    }
    if (height < 0) {
        height = 0;
        bottom = top - 1;
    }

    var img2 = ctx.createImageData(width, height);
    var data2 = img2.data;
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

function make_thumb(canvas, width, height) {
    canvas = getCroppedCanvas(canvas);
    var width_source = canvas.width;
    var height_source = canvas.height;
    width = Math.round(width);
    height = Math.round(height);

    var ratio_w = width_source / width;
    var ratio_h = height_source / height;
    var ratio_max = Math.max(ratio_h, ratio_w);
    var ratio_w_half = Math.ceil(ratio_max / 2);
    var ratio_h_half = Math.ceil(ratio_max / 2);
    var x_off = (width_source - width * ratio_max) / 2;
    var y_off = (height_source - height * ratio_max) / 2;

    var ctx = canvas.getContext('2d');
    var img = ctx.getImageData(0, 0, width_source, height_source);
    var img2 = ctx.createImageData(width, height);
    var data = img.data;
    var data2 = img2.data;

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            var x2 = (i + j * width) * 4;
            var weight = 0;
            var weights = 0;
            var weights_alpha = 0;
            var gx_r = 0;
            var gx_g = 0;
            var gx_b = 0;
            var gx_a = 0;
            var center_y = y_off + (j + 0.5) * ratio_max;
            var yy_start = Math.floor(y_off + j * ratio_max);
            var yy_stop = Math.ceil(y_off + (j + 1) * ratio_max);
            for (var yy = yy_start; yy < yy_stop; yy++) {
                let inRange = (0 <= yy && yy <= height_source);
                var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                var center_x = x_off + (i + 0.5) * ratio_max;
                var w0 = dy * dy; //pre-calc part of w
                var xx_start = Math.floor(x_off + i * ratio_max);
                var xx_stop = Math.ceil(x_off + (i + 1) * ratio_max);
                for (var xx = xx_start; xx < xx_stop; xx++) {
                    if (inRange) inRange = (0 <= xx && xx <= width_source)
                    var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                    var w = Math.sqrt(w0 + dx * dx);
                    if (w >= 1) {
                        //pixel too far
                        continue;
                    }
                    //hermite filter
                    weight = 2 * w * w * w - 3 * w * w + 1;
                    var pos_x = 4 * (xx + yy * width_source);
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

document.getElementById('downloadImg').onclick = e => {
    let croppedCanvas = getCroppedCanvas(canvas);
    let canvasUrl = croppedCanvas.toDataURL();

    const downLinkTmp = document.createElement('a');
    downLinkTmp.href = canvasUrl;
    downLinkTmp.download = chartName;

    downLinkTmp.click();
    downLinkTmp.remove();
    downloadPopup.classList.remove('show');
};

document.getElementById('downloadPdf').onclick = e => {
    // create image
    let croppedCanvas = getCroppedCanvas(canvas);
    const canvasImage = croppedCanvas.toDataURL();
    window.jsPDF = window.jspdf.jsPDF;
    const padding = 15;
    const doc = new jsPDF(croppedCanvas.width < croppedCanvas.height ? 'p' : 'l', 'mm', [croppedCanvas.width + padding * 2, croppedCanvas.height + padding * 2]);
    doc.addImage(canvasImage, 'PNG', padding, padding, croppedCanvas.width, croppedCanvas.height);
    doc.save(chartName + '.pdf');
    downloadPopup.classList.remove('show');
};

document.getElementById('saveBtn').onclick = e => {
    var chartConfig = ChartConfig.instance;
    if (typeof chartConfig == 'undefined' || !(chartConfig instanceof ChartConfig)) {
        showFailure('No chart to save');
        return;
    }
    var type = chartConfig.getType();
    if (type == null) return;
    var data = chartConfig.getData();
    if (data == null) return;
    var properties = {
        fontSize: Chart.defaults.font.size,
        fontStyle: Chart.defaults.font.style,
        fontWeight: Chart.defaults.font.weight,
        markerSize: Chart.defaults.elements.point.radius,
        markerStyle: Chart.defaults.elements.point.pointStyle
    };

    var thumb = make_thumb(ChartConfig.canvas, 400, 300);

    var xhrSender = new XHRSender();
    if (chartID.length > 0) xhrSender.addField('id', chartID);
    xhrSender.addField('name', chartName);
    xhrSender.addField('type', type);
    xhrSender.addField('thumbnail', thumb);
    xhrSender.addField('data', JSON.stringify(data));
    xhrSender.addField('properties', JSON.stringify(properties));
    let cb = xhr => {
        try {
            let resp = JSON.parse(xhr.responseText);
            if (!resp.hasOwnProperty('success') || resp['success'] !== true) {
                if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === 'string') {
                    if (resp['reason'] == 'Unauthorized') {
                        popupLogin(success => {
                            if (success) {
                                xhrSender.send('/chart/save', cb);
                            } else {
                                showFailure('Unauthorized');
                            }
                        });
                        return;
                    }
                    showFailure(resp['reason']);
                } else {
                    showFailure('Chart saving failed!');
                }
                return;
            }
            showSuccess('Chart saved');
            body.classList.remove('authOnly');
            if (resp.hasOwnProperty('id') || typeof resp['id'] == 'string') {
                chartID = resp['id'];
            }
        } catch (error) {
            showFailure('Something went wrong! Please try again.');
        }
    }
    xhrSender.send('/chart/save', cb);
};

document.getElementById('deleteBtn').onclick = e => {
    if (chartID.length == 0) {
        showFailure('Chart is not saved');
        return;
    }
    promptConfirmation('Are you sure you want to delete this chart?', () => {
        let xhrSender = new XHRSender();
        xhrSender.addField('id', chartID);
        let cb = xhr => {
            try {
                let resp = JSON.parse(xhr.responseText);
                if (!resp.hasOwnProperty('success') || resp['success'] !== true) {
                    if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === 'string') {
                        if (resp['reason'] == 'Unauthorized') {
                            popupLogin(success => {
                                if (success) {
                                    xhrSender.send('/chart/delete', cb);
                                } else {
                                    showFailure('Unauthorized');
                                }
                            });
                            return;
                        }
                        showFailure(resp['reason']);
                    } else {
                        showFailure('Deleting chart failed!');
                    }
                    return;
                }
                showSuccess('Chart Deleted.', () => {
                    window.location = '/dashboard';
                });
            } catch (error) {
                showFailure('Delete failed!');
            }
        };
        xhrSender.send('/chart/delete', cb);
    });
};

document.getElementById('shareBtn').onclick = e => {
    if (chartID.length == 0) {
        showFailure('Chart is not saved');
        return;
    }
    let xhrSender = new XHRSender();
    xhrSender.addField('id', chartID);
    let cb = xhr => {
        try {
            let resp = JSON.parse(xhr.responseText);
            if (!resp.hasOwnProperty('success') || resp['success'] !== true) {
                if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === 'string') {
                    if (resp['reason'] == 'Unauthorized') {
                        popupLogin(success => {
                            if (success) {
                                xhrSender.send('/chart/share', cb);
                            } else {
                                showFailure('Unauthorized');
                            }
                        });
                        return;
                    }
                    showFailure(resp['reason']);
                } else {
                    showFailure('Sharing chart failed!');
                }
                return;
            }
            showSuccess('Chart shared');
            body.classList.remove('authOnly');
        } catch (error) {
            showFailure('Share failed!');
        }
    };
    xhrSender.send('/chart/share', cb);
};

document.getElementById('CloseEdit').onclick = e => {
    chartEditPopup.classList.remove('show');
};

document.getElementById('editName').onclick = e => {
    nameView.style.display = 'none';
    nameEdit.style.display = 'block';
    nameEdit.onkeypress = e => { keyPressFn(e, /^[\x20-\x7e]{0,50}$/, null, null, saveNameBtn); };
    let name = chartNameView.innerText
    nameInput.value = name;
    saveNameBtn.onclick = e => {
        nameView.style.display = 'block';
        nameEdit.style.display = 'none';
        name = nameInput.value;
        chartNameView.innerText = name;
        chartName = name;
        ChartConfig.instance.setName(chartName);
    };
    document.getElementById('cancelEditName').onclick = e => {
        nameView.style.display = 'block';
        nameEdit.style.display = 'none';
    };
};

markerSizeSelect.onchange = e => {
    var radius = markerSizeSelect.value;
    if (/^\d{1,2}$/.test(radius)) {
        radius = parseInt(radius);
        if (radius < 1) {
            radius = 1;
        }
        if (radius > 12) {
            radius = 12;
        }
        markerSizeSelect.value = radius;
        Chart.defaults.elements.point.radius = radius;
        Chart.defaults.elements.point.hoverRadius = radius + 3;
        ChartConfig.update('none');
    }
};

markerStyleSelect.onchange = e => {
    var style = markerStyleSelect.value;
    if (!['circle', 'cross', 'crossRot', 'dash', 'line', 'rect', 'rectRounded', 'rectRot', 'star', 'triangle'].includes(style)) {
        markerStyleSelect.value = 'circle';
        style = markerStyleSelect.value;
    }
    Chart.defaults.elements.point.pointStyle = style;
    ChartConfig.update('none');
};

fontSizeSelect.onchange = e => {
    var size = fontSizeSelect.value;
    if (/^\d{1,3}$/.test(size)) {
        size = parseInt(size);
        if (size < 8) {
            size = 8;
        }
        if (size > 36) {
            size = 36;
        }
        fontSizeSelect.value = size;
        Chart.defaults.font.size = size;
        ChartConfig.update('none');
    }
};

fontStyleBtn.onclick = e => {
    var style = Chart.defaults.font.style;
    if (style == 'normal') {
        Chart.defaults.font.style = 'italic';
        fontStyleBtn.classList.add('btn-icon-selected');
    } else if (style == 'italic') {
        Chart.defaults.font.style = 'normal';
        fontStyleBtn.classList.remove('btn-icon-selected');
    }
    ChartConfig.update('none');
};

fontWeightBtn.onclick = e => {
    var weight = Chart.defaults.font.weight;
    if (weight == 'normal') {
        Chart.defaults.font.weight = 'bold';
        fontWeightBtn.classList.add('btn-icon-selected');
    } else if (weight == 'bold') {
        Chart.defaults.font.weight = 'normal';
        fontWeightBtn.classList.remove('btn-icon-selected');
    }
    ChartConfig.update('none');
};

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? '#' +
        ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

let path = [];

document.getElementById('backBtn').onclick = e => {
    ChartConfig.update('parent');
    var first = ChartConfig.chart._metasets[0].controller.pointers[0];
    if (first == undefined || first.p == undefined || first.p == null) return;
    var parent = first.p;
    if (parent.p == undefined || parent.p == null) {
        backDiv.style.display = 'none';
    } else {
        path.shift();
        while (breadcrumb.hasChildNodes()) {
            breadcrumb.removeChild(breadcrumb.firstChild);
        }
        path.forEach(createBreadcrumb);
    }
}

function setPath(first) {
    let path = [];
    if (first == undefined || first.p == undefined || first.p == null) return null;
    let parent = first;
    let hasParent = true;
    while (hasParent) {
        path.push(parent.n);
        parent = parent.p;
        if (parent.p == undefined || parent.p == null) {
            hasParent = false;
        }
    }
    path.push('/')
    return path;
}

function createBreadcrumb(child) {
    let x = document.createElement('li');
    x.innerText = child;
    breadcrumb.prepend(x);
}

function setDivPos(d, x, y, mid) {
    if (x > mid) {
        d.style.left = (x - 221) + 'px';
    } else {
        d.style.left = x + 'px';
    }
    d.style.top = y + 'px';
}

function drawSavedChart(info, type, data, properties) {
    if (typeof info.name != 'undefined') chartName = info.name;
    if (typeof properties.markerSize != 'undefined') {
        markerSizeSelect.value = properties.markerSize;
        markerSizeSelect.onchange(null);
    }
    if (typeof properties.markerStyle != 'undefined') {
        markerStyleSelect.value = properties.markerStyle;
        markerStyleSelect.onchange(null);
    }
    if (typeof properties.fontSize != 'undefined') {
        fontSizeSelect.value = properties.fontSize;
        fontSizeSelect.onchange(null);
    }
    if (typeof properties.fontStyle != 'undefined') {
        if (['normal', 'italic'].includes(properties.fontStyle))
            Chart.defaults.font.style = properties.fontStyle;
    }
    if (typeof properties.fontWeight != 'undefined') {
        if (['normal', 'bold'].includes(properties.fontWeight))
            Chart.defaults.font.weight = properties.fontWeight;
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
    myChart.setSavedData(data);
    myChart.setName(chartName);
    chartViewDiv.style.display = 'block';
    alertDiv.style.display = 'none';
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
    if (['line', 'scatter', 'radar', 'bubble'].includes(type)) {
        body.classList.remove('noMarker');
    } else {
        body.classList.add('noMarker');
    }
}

if (/^\/chart\/[0-9a-fA-F]{16,32}$/.test(document.location.pathname)) {
    chartID = document.location.pathname.split('/')[2];
    showLoader();
    var xhrSender = new XHRSender();
    xhrSender.addField('id', chartID);
    let cb = xhr => {
        try {
            let resp = JSON.parse(xhr.responseText);
            if (!resp.hasOwnProperty('success') || resp['success'] !== true || !resp.hasOwnProperty('info') || !resp.hasOwnProperty('data')) {
                let errMsg;
                if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === 'string') {
                    if (resp['reason'] == 'Unauthorized') {
                        xhrSender.send('/chart/retrieveShared', cb);
                        hideLoader();
                        return;
                    }
                    if (resp['reason'] == 'NotShared') {
                        popupLogin(success => {
                            if (success) {
                                xhrSender.send('/chart/retrieve', cb);
                            } else {
                                showFailure('Unauthorized');
                            }
                        });
                        hideLoader();
                        return;
                    }
                    errMsg = resp['reason'];
                } else {
                    errMsg = 'Chart retrieving failed!';
                }
                showFailure(errMsg, () => {
                    window.location = '/chart';
                });
                hideLoader();
                return;
            }
            let info = resp.info;
            if (info.owner == null) {
                body.classList.add('authOnly');
            }
            let data = resp.data;
            let chartData = JSON.parse(data.data);
            let properties = JSON.parse(data.properties);
            drawSavedChart(info, data.type, chartData, properties);
        } catch (error) {
            showFailure('Something went wrong! Please try again.');
        }
        hideLoader();
    };
    xhrSender.send('/chart/retrieve', cb);
}

document.getElementById('downloadBtn').onclick = e => {
    e.stopImmediatePropagation(); // prevents document.onclick()
    downloadPopup.classList.toggle('show');
    chartEditPopup.classList.remove('show');
}

document.onclick = e => {
    downloadPopup.classList.remove('show');
    chartEditPopup.classList.remove('show');
}

setCallback(drawChart);