const canvas = document.getElementById('myChart');

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
        label: 'Dataset_1',
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
        responsive: false,
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
    var points = myChart.getActiveElements();
    if (points.length) {
        const firstPoint = points[points.length - 1];
        console.log(firstPoint);
        colors[firstPoint.index] = '#000';
        dataConf.datasets[0].backgroundColor = colors;
        dataConf.datasets[0].borderColor = colors;
        myChart.update();
    }
};