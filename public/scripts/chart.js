const body = document.getElementsByTagName('body')[0];
const chartDiv = document.getElementById('chartDiv');
const canvas = document.getElementById('myChart');
const chartBtn = document.getElementById('drawBtn');
const saveBtn = document.getElementById('saveBtn');
const deleteBtn = document.getElementById('deleteBtn');
const shareBtn = document.getElementById('shareBtn');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const unshareBtn = document.getElementById('unshareBtn');
const drawBtnDiv = document.getElementById('drawBtnDiv');
const drawBtn = document.getElementById('drawBtn')
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
const breadcrumb = document.getElementById('breadcrumbs');
const chartEditPopup = document.getElementById('chartEditPopup');
const saveNameBtn = document.getElementById('saveName');
const chartTypes = document.getElementsByName('charttype');
const selectChartType = document.getElementById('selectChartType');
const xVisible = document.getElementById('xVisible');
const xGridVisible = document.getElementById('xGridVisible');
const xTicksVisible = document.getElementById('xTicksVisible');
const xTitleVisible = document.getElementById('xTitleVisible');
const yVisible = document.getElementById('yVisible');
const yGridVisible = document.getElementById('yGridVisible');
const yTicksVisible = document.getElementById('yTicksVisible');
const yTitleVisible = document.getElementById('yTitleVisible');
const legendVisible = document.getElementById('legendVisible');

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

const chartKeyListener = e => {
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

ChartConfig.canvas = canvas;
Chart.defaults.font.size = 14;
Chart.defaults.font.style = 'normal';
Chart.defaults.font.weight = 'normal';
Chart.defaults.borderColor = '#8e909280';
Chart.defaults.plugins.legend.position = 'bottom';

if (Theme.theme == Theme.DARK) Chart.defaults.color = '#eee';
else Chart.defaults.color = '#333';

Theme.addOnchangeTrigger(theme => {
    if (theme == Theme.DARK) Chart.defaults.color = '#eee';
    else Chart.defaults.color = '#333';
    ChartConfig.update('none');
});

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

for (i = 0; i < chartTypes.length; i++) {
    chartTypes[i].onclick = e => {
        if (FileInputManager.extractedData != null) {
            drawBtnDiv.hidden = false;
        }
    }
}

function getSelectedChartType() {
    let type = null;
    for (i = 0; i < chartTypes.length; i++) {
        if (chartTypes[i].checked) {
            type = chartTypes[i].value;
        }
    }
    return type;
}

function setSelectedChartType(type) {
    if (FileInputManager.extractedData != null) {
        drawBtnDiv.hidden = false;
    }
    for (i = 0; i < chartTypes.length; i++) {
        if (chartTypes[i].value == type) {
            chartTypes[i].checked = true;
        } else {
            chartTypes[i].checked = false;
        }
    }
}

function showChartView() {
    chartViewDiv.style.display = 'block';
    alertDiv.style.display = 'none';
    chartViewDiv.scrollIntoView();
}

const drawChart = (json) => {
    chartViewDiv.style.display = 'none';
    selectChartType.className = 'chart-type';
    let { title, data, properties } = json;
    if (!(data instanceof Array) || data.length <= 0) {
        return;
    }
    let type = getSelectedChartType();
    if (type == null) {
        selectChartType.className = 'chart-type error';
        alertDiv.style.display = 'block';
        selectChartType.querySelector('small').innerText = "You have not selected a chart type";
        document.getElementById('uploadViewDiv').scrollIntoView();
        return;
    }
    let myChart;
    let values = [];
    switch (type) {
        case 'bar': {
            data.forEach(item => {
                var val = item.v;
                if (val.length !== 1) {
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
    loadScript();
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

saveBtn.onclick = e => {
    try {
        let chartConfig = ChartConfig.instance;
        if (typeof chartConfig == 'undefined' || !(chartConfig instanceof ChartConfig)) {
            PopupMessage.showFailure('No chart to save');
            return;
        }

        let type = chartConfig.getType();
        if (type == null) return;

        let data = chartConfig.getData();
        if (data == null) return;

        Loader.show();

        let properties = {
            fontSize: Chart.defaults.font.size,
            fontStyle: Chart.defaults.font.style,
            fontWeight: Chart.defaults.font.weight,
        };

        if (chartConfig.hasMarker) {
            properties.markerSize = chartConfig.getMarkerSize();
            properties.markerStyle = chartConfig.getMarkerStyle();
        }

        if (chartConfig.hasAxis) {
            properties.xAxisVisible = chartConfig.getAxisVisibility('x');
            properties.xGridVisible = chartConfig.getGridVisibility('x');
            properties.xTicksVisible = chartConfig.getTicksVisibility('x');
            properties.xTitleVisible = chartConfig.getTitleVisibility('x');
            properties.xTitle = chartConfig.getAxisTitle('x');
            properties.yAxisVisible = chartConfig.getAxisVisibility('y');
            properties.yGridVisible = chartConfig.getGridVisibility('y');
            properties.yTicksVisible = chartConfig.getTicksVisibility('y');
            properties.yTitleVisible = chartConfig.getTitleVisibility('y');
            properties.yTitle = chartConfig.getAxisTitle('y');
        }
        if (chartConfig.hasLegend) {
            properties.legendVisible = chartConfig.getLegendVisibility();
        }

        var thumb = make_thumb(ChartConfig.canvas, 400, 300);

        var xhrSender = new XHRSender();
        if (chartID.length > 0) xhrSender.addField('id', chartID);
        xhrSender.addField('name', chartName);
        xhrSender.addField('type', type);
        xhrSender.addField('thumbnail', thumb);
        xhrSender.addField('data', JSON.stringify(data));
        xhrSender.addField('properties', JSON.stringify(properties));
        let cb = xhr => {
            Loader.hide();
            try {
                let resp = JSON.parse(xhr.responseText);
                if (!resp.hasOwnProperty('success') || resp['success'] !== true) {
                    if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === 'string') {
                        if (resp['reason'] == 'Unauthorized') {
                            popupLogin(success => {
                                if (success) {
                                    Loader.show();
                                    xhrSender.send('/chart/save', cb);
                                } else {
                                    PopupMessage.showFailure('Unauthorized');
                                }
                            });
                            return;
                        }
                        PopupMessage.showFailure(resp['reason']);
                    } else {
                        PopupMessage.showFailure('Chart saving failed!');
                    }
                    return;
                }
                chartConfig.modified = false;
                PopupMessage.showSuccess('Chart saved.');
                body.classList.remove('authOnly');
                if (resp.hasOwnProperty('id') || typeof resp['id'] == 'string') {
                    chartID = resp['id'];
                }
            } catch (error) {
                PopupMessage.showFailure('Something went wrong! Please try again.');
            }
        }
        xhrSender.send('/chart/save', cb);
    } catch (e) {
        Loader.hide();
    }
};

deleteBtn.onclick = e => {
    if (chartID.length == 0) {
        PopupMessage.showFailure('Chart is not saved');
        return;
    }
    PopupMessage.promptConfirmation('Are you sure you want to delete this chart?', () => {
        Loader.show();
        let xhrSender = new XHRSender();
        xhrSender.addField('id', chartID);
        let cb = xhr => {
            Loader.hide()
            try {
                let resp = JSON.parse(xhr.responseText);
                if (!resp.hasOwnProperty('success') || resp['success'] !== true) {
                    if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === 'string') {
                        if (resp['reason'] == 'Unauthorized') {
                            popupLogin(success => {
                                if (success) {
                                    Loader.show();
                                    xhrSender.send('/chart/delete', cb);
                                } else {
                                    PopupMessage.showFailure('Unauthorized');
                                }
                            });
                            return;
                        }
                        PopupMessage.showFailure(resp['reason']);
                    } else {
                        PopupMessage.showFailure('Deleting chart failed!');
                    }
                    return;
                }
                if (ChartConfig.instance) ChartConfig.instance.modified = false;
                PopupMessage.showSuccess('Chart Deleted.', () => {
                    if (typeof (Storage) !== "undefined") {
                        if (localStorage.opencount && Number(localStorage.opencount) > 1) {
                            window.close();
                        }
                    }
                    window.location = '/dashboard';
                });
            } catch (error) {
                PopupMessage.showFailure('Delete failed!');
            }
        };
        xhrSender.send('/chart/delete', cb);
    });
};

shareBtn.onclick = e => {
    if (chartID.length == 0) {
        PopupMessage.showFailure('Chart is not saved');
        return;
    }
    Loader.show();
    let xhrSender = new XHRSender();
    xhrSender.addField('id', chartID);
    let cb = async xhr => {
        Loader.hide();
        try {
            let resp = JSON.parse(xhr.responseText);
            if (!resp.hasOwnProperty('success') || resp['success'] !== true) {
                if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === 'string') {
                    if (resp['reason'] == 'Unauthorized') {
                        popupLogin(success => {
                            if (success) {
                                Loader.show();
                                xhrSender.send('/chart/share', cb);
                            } else {
                                PopupMessage.showFailure('Unauthorized');
                            }
                        });
                        return;
                    }
                    PopupMessage.showFailure(resp['reason']);
                } else {
                    PopupMessage.showFailure('Sharing chart failed!');
                }
                return;
            }
            let copySuccess = await copyLinkToClipboard();
            if (copySuccess) {
                PopupMessage.showSuccess('Chart shared. Link copied to the clipboard.');
            } else {
                let link = location.protocol + '//' + location.host + '/chart/' + chartID;
                PopupMessage.showSuccess('Chart shared' + "\n" + link);
            }
            showHideShareUnshare(true)
            body.classList.remove('authOnly');
        } catch (error) {
            PopupMessage.showFailure('Share failed!');
        }
    };
    xhrSender.send('/chart/share', cb);
};

unshareBtn.onclick = e => {
    if (chartID.length == 0) {
        PopupMessage.showFailure('Chart is not saved');
        return;
    }

    Loader.show();
    let xhrSender = new XHRSender();
    xhrSender.addField('id', chartID);
    let cb = xhr => {
        Loader.hide();
        try {
            let resp = JSON.parse(xhr.responseText);
            if (!resp.hasOwnProperty('success') || resp['success'] !== true) {
                if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === 'string') {
                    if (resp['reason'] == 'Unauthorized') {
                        popupLogin(success => {
                            if (success) {
                                Loader.show();
                                xhrSender.send('/chart/unshare', cb);
                            } else {
                                PopupMessage.showFailure('Unauthorized');
                            }
                        });
                        return;
                    }
                    PopupMessage.showFailure(resp['reason']);
                } else {
                    PopupMessage.showFailure('Unsharing chart failed!');
                }
                return;
            }
            PopupMessage.showSuccess('Chart unshared');
            showHideShareUnshare(false)
            body.classList.remove('authOnly');
        } catch (error) {
            PopupMessage.showFailure('Unshare failed!');
        }
    };
    xhrSender.send('/chart/unshare', cb);
};

copyLinkBtn.onclick = async e => {
    e.preventDefault();
    let copySuccess = await copyLinkToClipboard();
    if (copySuccess) {
        PopupMessage.showSuccess('Link copied to the clipboard.');
    } else {
        let link = location.protocol + '//' + location.host + '/chart/' + chartID;
        PopupMessage.showSuccess('Link copying failed' + "\n" + link);
    }
};

document.getElementById('CloseEdit').onclick = e => {
    chartEditPopup.classList.remove('show');
};

document.getElementById('editName').onclick = e => {
    nameView.style.display = 'none';
    nameEdit.style.display = 'block';
    nameEdit.onkeydown = e => {
        e.stopImmediatePropagation();
        FormUtils.keyPressFn(e, FormUtils.chart_name_pattern, null, null, saveNameBtn);
    };
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

fontSizeSelect.onkeydown = e => {
    e.stopImmediatePropagation();
    e.stopPropagation();
};

function setFontSize(size) {
    if (typeof size == 'number' || /^\d{1,3}$/.test(size)) {
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
        ChartConfig.setDirty();
    }
}

fontSizeSelect.onchange = e => {
    var size = fontSizeSelect.value;
    setFontSize(size);
};

function setFontStyle(style) {
    if (style == 'italic') {
        Chart.defaults.font.style = 'italic';
        fontStyleBtn.classList.add('btn-icon-selected');
    } else if (style == 'normal') {
        Chart.defaults.font.style = 'normal';
        fontStyleBtn.classList.remove('btn-icon-selected');
    }
    ChartConfig.update('none');
    ChartConfig.setDirty();
}

fontStyleBtn.onclick = e => {
    var style = Chart.defaults.font.style;
    if (style == 'normal') {
        setFontStyle('italic');
    } else {
        setFontStyle('normal');
    }
};

function setFontWeight(weight) {
    if (weight == 'bold') {
        Chart.defaults.font.weight = 'bold';
        fontWeightBtn.classList.add('btn-icon-selected');
    } else if (weight == 'normal') {
        Chart.defaults.font.weight = 'normal';
        fontWeightBtn.classList.remove('btn-icon-selected');
    }
    ChartConfig.update('none');
    ChartConfig.setDirty();
}

fontWeightBtn.onclick = e => {
    var weight = Chart.defaults.font.weight;
    if (weight == 'normal') {
        setFontWeight('bold')
    } else {
        setFontWeight('normal');
    }
};

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? '#' +
        ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

let path = [];

function clearBreadcrumb() {
    while (breadcrumb.hasChildNodes()) {
        breadcrumb.removeChild(breadcrumb.firstChild);
    }
}

document.getElementById('backBtn').onclick = e => {
    ChartConfig.update('parent');
    ChartConfig.setDirty();
    var first = ChartConfig.chart._metasets[0].controller.pointers[0];
    if (first == undefined || first.p == undefined || first.p == null) return;
    var parent = first.p;
    if (parent.p == undefined || parent.p == null) {
        backDiv.style.display = 'none';
    } else {
        path.shift();
        clearBreadcrumb();
        path.forEach(createBreadcrumb);
    }
}

function getPath(first) {
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

if (/^\/chart\/[0-9a-fA-F]{16,32}$/.test(document.location.pathname)) {
    chartID = document.location.pathname.split('/')[2];
    Loader.show();
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
                        return;
                    }
                    if (resp['reason'] == 'NotShared') {
                        popupLogin(success => {
                            if (success) {
                                Loader.show();
                                xhrSender.send('/chart/retrieve', cb);
                            } else {
                                PopupMessage.showFailure('Unauthorized', () => {
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
                PopupMessage.showFailure(errMsg, () => {
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
            PopupMessage.showFailure('Something went wrong! Please try again.', () => {
                window.location = '/chart';
            });
        }
        Loader.hide();
    };
    xhrSender.send('/chart/retrieve', cb);
} else {
    body.classList.remove('authOnly');
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

markerSizeSelect.onchange = e => {
    let chart = ChartConfig.instance;
    if (!chart.hasMarkerSize) return;
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
        chart.setMarkerSize(radius);
        ChartConfig.update('none');
        ChartConfig.setDirty();
    }
};

markerStyleSelect.onchange = e => {
    let chart = ChartConfig.instance;
    if (!chart.hasMarker) return;
    var style = markerStyleSelect.value;
    if (!['circle', 'cross', 'crossRot', 'dash', 'line', 'rect', 'rectRounded', 'rectRot', 'star', 'triangle'].includes(style)) {
        markerStyleSelect.value = 'circle';
        style = markerStyleSelect.value;
    }
    chart.setMarkerStyle(style);
    ChartConfig.update('none');
    ChartConfig.setDirty();
};

xVisible.onclick = e => {
    let chart = ChartConfig.instance;
    if (!chart.hasAxis) return;
    let show = xVisible.checked;
    chart.setAxisVisibility('x', show);
}

xGridVisible.onclick = e => {
    let chart = ChartConfig.instance;
    if (!chart.hasAxis) return;
    let show = xGridVisible.checked;
    chart.setGridVisibility('x', show);
}

xTicksVisible.onclick = e => {
    let chart = ChartConfig.instance;
    if (!chart.hasAxis) return;
    let show = xTicksVisible.checked;
    chart.setTicksVisibility('x', show);
}

xTitleVisible.onclick = e => {
    let chart = ChartConfig.instance;
    if (!chart.hasAxis) return;
    let show = xTitleVisible.checked;
    chart.setTitleVisibility('x', show);
}

yVisible.onclick = e => {
    let chart = ChartConfig.instance;
    if (!chart.hasAxis) return;
    let show = yVisible.checked;
    chart.setAxisVisibility('y', show);
}

yGridVisible.onclick = e => {
    let chart = ChartConfig.instance;
    if (!chart.hasAxis) return;
    let show = yGridVisible.checked;
    chart.setGridVisibility('y', show);
}

yTicksVisible.onclick = e => {
    let chart = ChartConfig.instance;
    if (!chart.hasAxis) return;
    let show = yTicksVisible.checked;
    chart.setTicksVisibility('y', show);
}

yTitleVisible.onclick = e => {
    let chart = ChartConfig.instance;
    if (!chart.hasAxis) return;
    let show = yTitleVisible.checked;
    chart.setTitleVisibility('y', show);
}

legendVisible.onclick = e => {
    let chart = ChartConfig.instance;
    if (!chart.hasLegend) return;
    let show = legendVisible.checked;
    chart.setLegendVisibility(show);
}

/**
 * Update settings view according to current chart settings
 * 
 * @returns {void}
 */
function updateSettings() {
    let chartConfig = ChartConfig.instance;
    if (chartConfig == null) return;

    chartName = chartConfig.getName();
    chartNameView.innerText = chartName;
    document.title = 'Chart - ' + chartName;

    if (chartConfig.hasMarker) {
        body.classList.remove('noMarker');
        markerStyleSelect.value = chartConfig.getMarkerStyle();
    } else {
        body.classList.add('noMarker');
    }

    if (chartConfig.hasMarkerSize) {
        body.classList.remove('noMarkerSize');
        markerSizeSelect.value = chartConfig.getMarkerSize();
    } else {
        body.classList.add('noMarkerSize');
    }

    if (chartConfig.hasLegend) {
        body.classList.remove('noLegend');
        legendVisible.checked = chartConfig.getLegendVisibility();
    } else {
        body.classList.add('noLegend');
    }

    if (chartConfig.hasAxis) {
        body.classList.remove('noAxis');
        xVisible.checked = chartConfig.getAxisVisibility('x');
        if (xVisible.checked) {
            [xGridVisible, xTicksVisible, xTitleVisible].forEach(element => {
                element.disabled = false;
            });
        } else {
            [xGridVisible, xTicksVisible, xTitleVisible].forEach(element => {
                element.disabled = true;
            });
        }
        xGridVisible.checked = chartConfig.getGridVisibility('x');
        xTicksVisible.checked = chartConfig.getTicksVisibility('x');
        xTitleVisible.checked = chartConfig.getTitleVisibility('x');
        yVisible.checked = chartConfig.getAxisVisibility('y');
        if (yVisible.checked) {
            [yGridVisible, yTicksVisible, yTitleVisible].forEach(element => {
                element.disabled = false;
            });
        } else {
            [yGridVisible, yTicksVisible, yTitleVisible].forEach(element => {
                element.disabled = true;
            });
        }
        yGridVisible.checked = chartConfig.getGridVisibility('y');
        yTicksVisible.checked = chartConfig.getTicksVisibility('y');
        yTitleVisible.checked = chartConfig.getTitleVisibility('y');
    } else {
        body.classList.add('noAxis');
    }
}

drawBtn.onclick = e => {
    FileInputManager.draw(drawChart);
}

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

function showHideShareUnshare(isShared) {
    shareBtn.hidden = isShared;
    copyLinkBtn.hidden = !isShared;
    unshareBtn.hidden = !isShared;
}

let loadedScripts = [];
function loadScript(src, hash = null) {
    if (loadedScripts.includes(src)) return;
    let scriptElem = document.createElement('script');
    scriptElem.src = src;
    if (hash != null) {
        scriptElem.integrity = hash;
        scriptElem.crossOrigin = 'anonymous';
    }
    document.body.appendChild(scriptElem);
    jspdfLoaded = true;
}

setTimeout(() => {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'sha256-mMzxeqEMILsTAXYmGPzJtqs6Tn8mtgcdZNC0EVTfOHU=');
    loadScript('https://kit.fontawesome.com/8d62299fba.js');
}, 1000);