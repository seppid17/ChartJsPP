const BarChart = document.getElementById('SampleBarChart');
const PieChart = document.getElementById('SamplePieChart');
const DoughnutChart = document.getElementById('SampleDoughnutChart');
const LineChart = document.getElementById('SampleLineChart');
const PolaChart = document.getElementById('SamplePolaChart');
const ScatterChart = document.getElementById('SampleScatterChart');
const BubbleChart = document.getElementById('SampleBubbleChart');
const SunburstChart = document.getElementById('SampleSunburstChart');
const TreemapChart = document.getElementById('SampleTreemapChart');
const IcicleChart = document.getElementById('SampleIcicleChart');
function scrollInViewTag(tag){
    tag.scrollIntoView();
}
BarChart.onclick = e => {
    scrollInViewTag(document.getElementById("cardBarChart"))
}
PieChart.onclick = e =>{
    scrollInViewTag(document.getElementById("cardPieChart"))
}
DoughnutChart.onclick = e =>{
    scrollInViewTag(document.getElementById("cardDoughnutChart"))
}
LineChart.onclick = e =>{
    scrollInViewTag(document.getElementById("cardLineChart"))
}
PolaChart.onclick = e =>{
    scrollInViewTag(document.getElementById("cardPolaChart"))
}
ScatterChart.onclick = e =>{
    scrollInViewTag(document.getElementById("cardScatterChart"))
}
BubbleChart.onclick = e =>{
    scrollInViewTag(document.getElementById("cardBubbleChart"))
}
SunburstChart.onclick = e =>{
    scrollInViewTag(document.getElementById("cardSunburstChart"))
}
TreemapChart.onclick = e =>{
    scrollInViewTag(document.getElementById("cardTreemapChart"))
}
IcicleChart.onclick = e =>{
    scrollInViewTag(document.getElementById("cardIcicleChart"))
    Download();
}

function Download(){
    var element = document.createElement('a');
    element.setAttribute('href','./Data/bar.csv');
    element.setAttribute('download','bar.csv')
    element.click()   
}

