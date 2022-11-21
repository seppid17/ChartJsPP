const barChartSectionBtn = document.getElementById('SampleBarChart');
const pieChartSectionBtn = document.getElementById('SamplePieChart');
const doughnutChartSectionBtn = document.getElementById('SampleDoughnutChart');
const lineChartSectionBtn = document.getElementById('SampleLineChart');
const polarChartSectionBtn = document.getElementById('SamplePolarChart');
const scatterChartSectionBtn = document.getElementById('SampleScatterChart');
const bubbleChartSectionBtn = document.getElementById('SampleBubbleChart');
const sunburstChartSectionBtn = document.getElementById('SampleSunburstChart');
const icicleChartSectionBtn = document.getElementById('SampleIcicleChart');
const treemapChartSectionBtn = document.getElementById('SampleTreemapChart');
const radarChartSectionBtn = document.getElementById('SampleRadarChart');

const barDownloadBtn = document.getElementById('barDownload');
const pieDownloadBtn = document.getElementById('pieDownload');
const doughnutDownloadBtn = document.getElementById('doughnutDownload');
const lineDownloadBtn = document.getElementById('lineDownload');
const polarDownloadBtn = document.getElementById('polarDownload');
const scatterDownloadBtn = document.getElementById('scatterDownload');
const bubbleDownloadBtn = document.getElementById('bubbleDownload');
const sunburstDownloadBtn = document.getElementById('sunburstDownload');
const icicleDownloadBtn = document.getElementById('icicleDownload');
const treemapDownloadBtn = document.getElementById('treemapDownload');
const radarDownloadBtn = document.getElementById('radarDownload');

barChartSectionBtn.onclick = e => {
    document.getElementById("cardBarChart").scrollIntoView();
}
pieChartSectionBtn.onclick = e => {
    document.getElementById("cardPieChart").scrollIntoView();
}
doughnutChartSectionBtn.onclick = e => {
    document.getElementById("cardDoughnutChart").scrollIntoView();
}
lineChartSectionBtn.onclick = e => {
    document.getElementById("cardLineChart").scrollIntoView();
}
polarChartSectionBtn.onclick = e => {
    document.getElementById("cardPolarChart").scrollIntoView();
}
scatterChartSectionBtn.onclick = e => {
    document.getElementById("cardScatterChart").scrollIntoView();
}
bubbleChartSectionBtn.onclick = e => {
    document.getElementById("cardBubbleChart").scrollIntoView();
}
sunburstChartSectionBtn.onclick = e => {
    document.getElementById("cardSunburstChart").scrollIntoView();
}
icicleChartSectionBtn.onclick = e => {
    document.getElementById("cardIcicleChart").scrollIntoView();
}
treemapChartSectionBtn.onclick = e => {
    document.getElementById("cardTreemapChart").scrollIntoView();
}
radarChartSectionBtn.onclick = e => {
    document.getElementById("cardRadarChart").scrollIntoView();
}

function download(name) {
    var element = document.createElement('a');
    element.setAttribute('href', `/data/${name}.csv`);
    element.setAttribute('download', `${name}.csv`);
    element.click()
}

function handleClick(e, name) {
    e.preventDefault();
    e.stopPropagation();
    download(name);
}

barDownloadBtn.onclick = e => {
    handleClick(e, 'bar');
}
pieDownloadBtn.onclick = e => {
    handleClick(e, 'pie');
}
doughnutDownloadBtn.onclick = e => {
    handleClick(e, 'doughnut');
}
lineDownloadBtn.onclick = e => {
    handleClick(e, 'line');
}
polarDownloadBtn.onclick = e => {
    handleClick(e, 'polar');
}
scatterDownloadBtn.onclick = e => {
    handleClick(e, 'scatter');
}
bubbleDownloadBtn.onclick = e => {
    handleClick(e, 'bubble');
}
sunburstDownloadBtn.onclick = e => {
    handleClick(e, 'sunburst');
}
icicleDownloadBtn.onclick = e => {
    handleClick(e, 'icicle');
}
treemapDownloadBtn.onclick = e => {
    handleClick(e, 'treemap');
}

radarDownloadBtn.onclick = e => {
    handleClick(e, 'radar');
}