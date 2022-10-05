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

let chartID = '';
let chartName = 'Untitled';
fontSizeSelect.value = Chart.defaults.font.size;
if (Chart.defaults.font.style == 'italic') {
    fontStyleBtn.classList.add('btn-icon-selected');
}
if (Chart.defaults.font.weight == 'bold') {
    fontWeightBtn.classList.add('btn-icon-selected');
}

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
            myChart = new BubbleChartConfig();
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

function make_thumb(canvas, width, height) {
    var width_source = canvas.width;
    var height_source = canvas.height;
    width = Math.round(width);
    height = Math.round(height);

    var ratio_w = width_source / width;
    var ratio_h = height_source / height;
    var ratio_min = Math.min(ratio_h, ratio_w);
    var ratio_w_half = Math.ceil(ratio_min / 2);
    var ratio_h_half = Math.ceil(ratio_min / 2);
    var x_off = (width_source - width * ratio_min) / 2;
    var y_off = (height_source - height * ratio_min) / 2;

    var ctx = canvas.getContext("2d");
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
            var center_y = y_off + (j + 0.5) * ratio_min;
            var yy_start = Math.floor(y_off + j * ratio_min);
            var yy_stop = Math.ceil(y_off + (j + 1) * ratio_min);
            for (var yy = yy_start; yy < yy_stop; yy++) {
                var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                var center_x = x_off + (i + 0.5) * ratio_min;
                var w0 = dy * dy; //pre-calc part of w
                var xx_start = Math.floor(x_off + i * ratio_min);
                var xx_stop = Math.ceil(x_off + (i + 1) * ratio_min);
                for (var xx = xx_start; xx < xx_stop; xx++) {
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
                    gx_a += weight * data[pos_x + 3];
                    weights_alpha += weight;
                    //colors
                    if (data[pos_x + 3] < 255)
                        weight = weight * data[pos_x + 3] / 250;
                    gx_r += weight * data[pos_x];
                    gx_g += weight * data[pos_x + 1];
                    gx_b += weight * data[pos_x + 2];
                    weights += weight;
                }
            }
            data2[x2] = gx_r / weights;
            data2[x2 + 1] = gx_g / weights;
            data2[x2 + 2] = gx_b / weights;
            data2[x2 + 3] = gx_a / weights_alpha;
        }
    }
    //make canvas
    let canvas2 = document.createElement('canvas');
    canvas2.width = width;
    canvas2.height = height;
    //draw
    let ctx2 = canvas2.getContext("2d");
    ctx2.putImageData(img2, 0, 0);
    return canvas2.toDataURL();
}

document.getElementById('downloadImgBtn').onclick = e => {
    let canvasUrl = canvas.toDataURL();

    const downLinkTmp = document.createElement('a');
    downLinkTmp.href = canvasUrl;
    downLinkTmp.download = chartName;

    downLinkTmp.click();
    downLinkTmp.remove();
};

document.getElementById('saveBtn').onclick = e => {
    var chartConfig = ChartConfig.instance;
    if (typeof chartConfig == 'undefined' || !(chartConfig instanceof ChartConfig)) {
        alert('No chart to save');
        return;
    }
    var type = chartConfig.getType();
    if (type == null) return;
    var data = chartConfig.getData();
    if (data == null) return;
    var properties = {
        fontSize: Chart.defaults.font.size,
        fontStyle: Chart.defaults.font.style,
        fontWeight: Chart.defaults.font.weight
    };
    if (/^\/chart\/[0-9a-fA-F]{16,32}$/.test(document.location.pathname)) {
        chartID = document.location.pathname.split('/')[2];
    }
    var thumb = make_thumb(ChartConfig.canvas, 400, 300);

    var xhrSender = new XHRSender();
    if (chartID.length > 0) xhrSender.addField('id', chartID);
    xhrSender.addField('name', chartName);
    xhrSender.addField('type', type);
    xhrSender.addField('thumbnail', thumb);
    xhrSender.addField('data', JSON.stringify(data));
    xhrSender.addField('properties', JSON.stringify(properties));
    xhrSender.send('/authChart/save', xhr => {
        try {
            let data = JSON.parse(xhr.responseText);
            if (!data.hasOwnProperty('success') || data['success'] !== true) {
                if (data.hasOwnProperty('reason') && typeof (data['reason']) === "string") {
                    showMsg(data['reason']);
                } else {
                    showMsg('Chart saving failed!');
                }
                return;
            }
            showMsg('Chart saved', true);
            if (data.hasOwnProperty('id') || typeof data['id'] == 'string') {
                chartID = data['id'];
            }
        } catch (error) {
            showMsg('Something went wrong! Please try again.');
        }
    });
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
        name = document.getElementById('nameInput').value;
        document.getElementById('chartNameView').innerText = name;
        chartName = name;
    };
    document.getElementById('cancellEditName').onclick = e => {
        nameView.style.display = 'block';
        nameEdit.style.display = 'none';
    };
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
        ChartConfig.update();
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
    ChartConfig.update();
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

const backDiv = document.getElementById('backDiv');

const breadcrumb = document.getElementById('breadcrumbA');
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
    let parent = first.p;
    let hasParent = true;
    while (hasParent) {
        path.push(parent.n);
        parent = parent.p;
        if (parent.p == undefined || parent.p == null) {
            hasParent = false;
        }
    }
    path.push('ROOT')
    console.log(path)
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
    if (typeof properties.fontSize != 'undefined') Chart.defaults.font.size = properties.fontSize;
    if (typeof properties.fontStyle != 'undefined') Chart.defaults.font.style = properties.fontStyle;
    if (typeof properties.fontWeight != 'undefined') Chart.defaults.font.weight = properties.fontWeight;
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
    myChart.setName(chartName);
    myChart.setSavedData(data);
    chartViewDiv.style.display = 'block';
    alertDiv.style.display = 'none';
    myChart.draw();
    document.getElementById('chartNameView').innerText = chartName;
    fontSizeSelect.value = Chart.defaults.font.size;
    if (Chart.defaults.font.style == 'italic') {
        fontStyleBtn.classList.add('btn-icon-selected');
    }
    if (Chart.defaults.font.weight == 'bold') {
        fontWeightBtn.classList.add('btn-icon-selected');
    }
}

if (/^\/chart\/[0-9a-fA-F]{16,32}$/.test(document.location.pathname)) {
    chartID = document.location.pathname.split('/')[2];
    var xhrSender = new XHRSender();
    xhrSender.addField('id', chartID);
    xhrSender.send('/authChart/retrieve', xhr => {
        try {
            let resp = JSON.parse(xhr.responseText);
            if (!resp.hasOwnProperty('success') || resp['success'] !== true || !resp.hasOwnProperty('info') || !resp.hasOwnProperty('data')) {
                if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === "string") {
                    showMsg(resp['reason']);
                } else {
                    showMsg('Chart retrieving failed!');
                }
                return;
            }
            let info = resp.info;
            let data = resp.data;
            let chartData = JSON.parse(data.data);
            let properties = JSON.parse(data.properties);
            drawSavedChart(info, data.type, chartData, properties);
        } catch (error) {
            showMsg('Something went wrong! Please try again.');
        }
    });
}

setCallback(drawChart);