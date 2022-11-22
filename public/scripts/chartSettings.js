const xVisible = document.getElementById('xVisible');
const xGridVisible = document.getElementById('xGridVisible');
const xTicksVisible = document.getElementById('xTicksVisible');
const xTitleVisible = document.getElementById('xTitleVisible');
const yVisible = document.getElementById('yVisible');
const yGridVisible = document.getElementById('yGridVisible');
const yTicksVisible = document.getElementById('yTicksVisible');
const yTitleVisible = document.getElementById('yTitleVisible');
const legendVisible = document.getElementById('legendVisible');
const fontSizeSelect = document.getElementById('fontSize');
const fontStyleBtn = document.getElementById('italicBtn');
const fontWeightBtn = document.getElementById('boldBtn');
const markerSizeSelect = document.getElementById('markerSize');
const markerStyleSelect = document.getElementById('markerStyle');
const saveBtn = document.getElementById('saveBtn');
const deleteBtn = document.getElementById('deleteBtn');
const shareBtn = document.getElementById('shareBtn');
const unshareBtn = document.getElementById('unshareBtn');
const copyLinkBtn = document.getElementById('copyLinkBtn');

/**
 * Get the selected chart type
 * @returns {string|null}
 */
function getSelectedChartType() {
    let type = null;
    for (i = 0; i < chartTypes.length; i++) {
        if (chartTypes[i].checked) {
            type = chartTypes[i].value;
        }
    }
    return type;
}

/**
 * Set the selected chart type
 * @param {string} type chart type
 */
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

/**
 * Set the chart font size and update the font size selection setting
 * @param {number|string} size font size
 */
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

/**
 * Set the chart font weight and update the settings button
 * @param {string} weight font weight
 */
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

/**
 * Set the chart font style and update the settings button
 * @param {string} style font style
 */
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

/**
 * Update settings view according to current chart settings
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
            [xGridVisible, xTicksVisible, xTitleVisible].forEach(function (element) {
                element.disabled = false;
            });
        } else {
            [xGridVisible, xTicksVisible, xTitleVisible].forEach(function (element) {
                element.disabled = true;
            });
        }
        xGridVisible.checked = chartConfig.getGridVisibility('x');
        xTicksVisible.checked = chartConfig.getTicksVisibility('x');
        xTitleVisible.checked = chartConfig.getTitleVisibility('x');
        yVisible.checked = chartConfig.getAxisVisibility('y');
        if (yVisible.checked) {
            [yGridVisible, yTicksVisible, yTitleVisible].forEach(function (element) {
                element.disabled = false;
            });
        } else {
            [yGridVisible, yTicksVisible, yTitleVisible].forEach(function (element) {
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

/**
 * Clear the breadcrumbs if it is shown
 */
function clearBreadcrumb() {
    while (breadcrumb.hasChildNodes()) {
        breadcrumb.removeChild(breadcrumb.firstChild);
    }
}

/**
 * Add a breadcrumb item
 * @param {string} child lable of the child node
 */
function createBreadcrumb(child) {
    let x = document.createElement('li');
    x.innerText = child;
    breadcrumb.prepend(x);
}

/**
 * Update the bradcrumbs with new root of the subtree.
 * @param {object} start root node of the subtree
 * @returns {void}
 */
function updateBreadcrumb(start) {
    clearBreadcrumb();
    // check if the start is the root
    if (start == undefined || start.p == undefined || start.p == null) {
        backDiv.style.display = 'none';
        return;
    }
    let parent = start;
    while (typeof parent.p != 'undefined' && parent.p != null) {
        createBreadcrumb(parent.n);
        parent = parent.p;
    }
    createBreadcrumb('/');
    backDiv.style.display = 'block';
}

/**
 * Show or hide share and unshare buttons depending on whether the
 * chart is shared or not.
 * @param {boolean} isShared whether the chart is shared
 */
function showHideShareUnshare(isShared) {
    shareBtn.hidden = isShared;
    copyLinkBtn.hidden = !isShared;
    unshareBtn.hidden = !isShared;
}

/**
 * Set event listeners for elements
 */

document.getElementById('CloseEdit').onclick = function () {
    chartEditPopup.classList.remove('show');
};

document.getElementById('editName').onclick = function () {
    nameView.style.display = 'none';
    nameEdit.style.display = 'block';
    nameEdit.onkeydown = function (e) {
        e.stopImmediatePropagation();
        FormUtils.keyPressFn(e, FormUtils.chart_name_pattern, null, null, saveNameBtn);
    };
    let name = chartNameView.innerText
    nameInput.value = name;
    saveNameBtn.onclick = function () {
        nameView.style.display = 'block';
        nameEdit.style.display = 'none';
        name = nameInput.value;
        chartNameView.innerText = name;
        chartName = name;
        ChartConfig.instance.setName(chartName);
    };
    document.getElementById('cancelEditName').onclick = function () {
        nameView.style.display = 'block';
        nameEdit.style.display = 'none';
    };
};

document.getElementById("closeAlert").onclick = function () {
    alertDiv.style.display = 'none';
}

fontSizeSelect.onkeydown = function (e) {
    e.stopImmediatePropagation();
    e.stopPropagation();
};

fontSizeSelect.onchange = function () {
    let size = fontSizeSelect.value;
    setFontSize(size);
};

fontStyleBtn.onclick = function () {
    let style = Chart.defaults.font.style;
    if (style == 'normal') {
        setFontStyle('italic');
    } else {
        setFontStyle('normal');
    }
};

fontWeightBtn.onclick = function () {
    let weight = Chart.defaults.font.weight;
    if (weight == 'normal') {
        setFontWeight('bold')
    } else {
        setFontWeight('normal');
    }
};

markerSizeSelect.onchange = function () {
    let chart = ChartConfig.instance;
    if (!chart.hasMarkerSize) return;
    let radius = markerSizeSelect.value;
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

markerStyleSelect.onchange = function () {
    let chart = ChartConfig.instance;
    if (!chart.hasMarker) return;
    let style = markerStyleSelect.value;
    if (!['circle', 'cross', 'crossRot', 'dash', 'line', 'rect', 'rectRounded', 'rectRot', 'star', 'triangle'].includes(style)) {
        markerStyleSelect.value = 'circle';
        style = markerStyleSelect.value;
    }
    chart.setMarkerStyle(style);
    ChartConfig.update('none');
    ChartConfig.setDirty();
};

xVisible.onclick = function () {
    let chart = ChartConfig.instance;
    if (!chart.hasAxis) return;
    let show = xVisible.checked;
    chart.setAxisVisibility('x', show);
}

xGridVisible.onclick = function () {
    let chart = ChartConfig.instance;
    if (!chart.hasAxis) return;
    let show = xGridVisible.checked;
    chart.setGridVisibility('x', show);
}

xTicksVisible.onclick = function () {
    let chart = ChartConfig.instance;
    if (!chart.hasAxis) return;
    let show = xTicksVisible.checked;
    chart.setTicksVisibility('x', show);
}

xTitleVisible.onclick = function () {
    let chart = ChartConfig.instance;
    if (!chart.hasAxis) return;
    let show = xTitleVisible.checked;
    chart.setTitleVisibility('x', show);
}

yVisible.onclick = function () {
    let chart = ChartConfig.instance;
    if (!chart.hasAxis) return;
    let show = yVisible.checked;
    chart.setAxisVisibility('y', show);
}

yGridVisible.onclick = function () {
    let chart = ChartConfig.instance;
    if (!chart.hasAxis) return;
    let show = yGridVisible.checked;
    chart.setGridVisibility('y', show);
}

yTicksVisible.onclick = function () {
    let chart = ChartConfig.instance;
    if (!chart.hasAxis) return;
    let show = yTicksVisible.checked;
    chart.setTicksVisibility('y', show);
}

yTitleVisible.onclick = function () {
    let chart = ChartConfig.instance;
    if (!chart.hasAxis) return;
    let show = yTitleVisible.checked;
    chart.setTitleVisibility('y', show);
}

legendVisible.onclick = function () {
    let chart = ChartConfig.instance;
    if (!chart.hasLegend) return;
    let show = legendVisible.checked;
    chart.setLegendVisibility(show);
}

document.getElementById('backBtn').onclick = function () {
    ChartConfig.update('parent');
    let first = ChartConfig.chart._metasets[0].controller.pointers[0];
    if (first == undefined || first.p == undefined || first.p == null) return;
    let parent = first.p;
    updateBreadcrumb(parent);
}

/**
 * Download chart as a png image
 */
document.getElementById('downloadImg').onclick = function () {
    let croppedCanvas = getCroppedCanvas(canvas);
    let canvasUrl = croppedCanvas.toDataURL();

    const downLinkTmp = document.createElement('a');
    downLinkTmp.href = canvasUrl;
    downLinkTmp.download = chartName;

    downLinkTmp.click();
    downLinkTmp.remove();
    downloadPopup.classList.remove('show');
};

/**
 * Download chart as a PDF
 */
document.getElementById('downloadPdf').onclick = function () {
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

saveBtn.onclick = function () {
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

        let thumb = make_thumb(ChartConfig.canvas, 400, 300);

        let xhrSender = new XHRSender();
        if (chartID.length > 0) xhrSender.addField('id', chartID);
        xhrSender.addField('name', chartName);
        xhrSender.addField('type', type);
        xhrSender.addField('thumbnail', thumb);
        xhrSender.addField('data', JSON.stringify(data));
        xhrSender.addField('properties', JSON.stringify(properties));
        let cb = function (xhr) {
            Loader.hide();
            try {
                let resp = JSON.parse(xhr.responseText);
                if (!resp.hasOwnProperty('success') || resp['success'] !== true) {
                    if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === 'string') {
                        if (resp['reason'] == 'Unauthorized') {
                            popupLogin(function (success) {
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

deleteBtn.onclick = function () {
    if (chartID.length == 0) {
        PopupMessage.showFailure('Chart is not saved');
        return;
    }
    PopupMessage.promptConfirmation('Are you sure you want to delete this chart?', function () {
        Loader.show();
        let xhrSender = new XHRSender();
        xhrSender.addField('id', chartID);
        let cb = function (xhr) {
            Loader.hide()
            try {
                let resp = JSON.parse(xhr.responseText);
                if (!resp.hasOwnProperty('success') || resp['success'] !== true) {
                    if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === 'string') {
                        if (resp['reason'] == 'Unauthorized') {
                            popupLogin(function (success) {
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
                PopupMessage.showSuccess('Chart Deleted.', function () {
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

shareBtn.onclick = function () {
    if (chartID.length == 0) {
        PopupMessage.showFailure('Chart is not saved');
        return;
    }
    Loader.show();
    let xhrSender = new XHRSender();
    xhrSender.addField('id', chartID);
    let cb = async function (xhr) {
        Loader.hide();
        try {
            let resp = JSON.parse(xhr.responseText);
            if (!resp.hasOwnProperty('success') || resp['success'] !== true) {
                if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === 'string') {
                    if (resp['reason'] == 'Unauthorized') {
                        popupLogin(function (success) {
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

unshareBtn.onclick = function () {
    if (chartID.length == 0) {
        PopupMessage.showFailure('Chart is not saved');
        return;
    }

    Loader.show();
    let xhrSender = new XHRSender();
    xhrSender.addField('id', chartID);
    let cb = function (xhr) {
        Loader.hide();
        try {
            let resp = JSON.parse(xhr.responseText);
            if (!resp.hasOwnProperty('success') || resp['success'] !== true) {
                if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === 'string') {
                    if (resp['reason'] == 'Unauthorized') {
                        popupLogin(function (success) {
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

copyLinkBtn.onclick = async function (e) {
    e.preventDefault();
    let copySuccess = await copyLinkToClipboard();
    if (copySuccess) {
        PopupMessage.showSuccess('Link copied to the clipboard.');
    } else {
        let link = location.protocol + '//' + location.host + '/chart/' + chartID;
        PopupMessage.showSuccess('Link copying failed' + "\n" + link);
    }
};

document.getElementById('downloadBtn').onclick = function (e) {
    e.stopImmediatePropagation(); // prevents document.onclick()
    downloadPopup.classList.toggle('show');
    chartEditPopup.classList.remove('show');
}