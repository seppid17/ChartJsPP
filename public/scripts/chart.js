const chartDiv = document.getElementById('chartDiv');
const canvas = document.getElementById('myChart');

window.onload = () => {
    let height = window.innerHeight;
    let width = window.innerWidth;
    let size = Math.min(height, width);
    chartDiv.style.width = size+'px';
    chartDiv.style.height = size+'px';
    canvas.style.width = size+'px';
    canvas.style.height = size+'px';
}

Chart.defaults.font.size = 18;
const chartName = 'Dataset_1'
const labels = ['A', 'B', 'C', 'D', 'E'];
const data = [5, 9, 2, 3, 7];
const colors = [
    'rgba(255, 99, 132, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 205, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(201, 203, 207, 1)'
];

const dataConf = {
    labels: labels,
    datasets: [{
        label: chartName,
        data: data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1
    }]
};

const config = {
    type: 'bar',
    data: dataConf,
    options: {
        maintainAspectRatio: false,
        responsive: true,
        layout: {
            autoPadding: false
        },
        scales: {
            y: {
                beginAtZero: true
            },
            x: {
                ticks: {
                    font: { size: 20 }
                }
            }
        }
    },
};

const myChart = new Chart(canvas, config);

canvas.onclick = evt => {
    let points = myChart.getActiveElements();
    if (points.length) {
        const firstPoint = points[points.length - 1];
        colors[firstPoint.index] = '#000';
        dataConf.datasets[0].backgroundColor = colors;
        dataConf.datasets[0].borderColor = colors;
        myChart.update();
    }
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
    let size = Math.min(height, width);
    chartDiv.style.width = size+'px';
    chartDiv.style.height = size+'px';
    chartDiv.onresize(e);
};

document.getElementById('downloadImgBtn').onclick = e => {
    let canvasUrl = canvas.toDataURL();

    const downLinkTmp = document.createElement('a');
    downLinkTmp.href = canvasUrl;
    downLinkTmp.download = chartName;

    downLinkTmp.click();
    downLinkTmp.remove();
};