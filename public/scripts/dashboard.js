const cardsDiv = document.getElementById('cardsDiv');
const chartCount = document.getElementById("currentChartCount");

AuthUtils.mustLogin();

function showNoCharts() {
    let p = document.createElement('p');
    p.classList.add('text-no-chart');
    p.innerText = 'No saved charts';
    cardsDiv.appendChild(p);
    setChartCount(0);
}

/**
 * Sets the cards for charts on the dashboard.
 * @param {boolean} showLoader whether or not to show the loader
 */
function setCards(showLoader = true) {
    if (showLoader) Loader.show();
    let xhrSender = new XHRSender();
    xhrSender.send('/chart/list', xhr => {
        try {
            let resp = JSON.parse(xhr.responseText);
            if (!resp.hasOwnProperty('success') || resp['success'] !== true || !resp.hasOwnProperty('info') || !Array.isArray(resp.info)) {
                if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === "string") {
                    PopupMessage.showFailure(resp['reason']);
                } else {
                    PopupMessage.showFailure('Chart list retrieving failed!');
                }
                Loader.hide();
                return;
            }
            if (resp.info.length == 0) {
                showNoCharts();
            }
            while (cardsDiv.hasChildNodes()) {
                cardsDiv.removeChild(cardsDiv.firstChild);
            }
            resp.info.forEach(chart => {
                if (!Validator.validate('id', chart.id)) {
                    return;
                }
                let cardColDiv = document.createElement('div');
                cardColDiv.id = chart.id;
                cardColDiv.classList.add('col-md-4');
                cardColDiv.classList.add('card-col');

                let cardDiv = document.createElement('div');
                cardDiv.classList.add('card');
                cardColDiv.appendChild(cardDiv);

                cardDiv.onclick = evt => {
                    window.open('/chart/' + chart.id, '_blank');
                }

                let ul = document.createElement('ul');
                ul.classList.add('list-group');
                ul.classList.add('list-group-flush');
                cardDiv.appendChild(ul);

                let li1 = document.createElement('li');
                li1.classList.add('list-group-item');
                li1.classList.add('card-img-area');
                ul.appendChild(li1);

                let img = document.createElement('img');
                img.classList.add('card-img-top');
                img.alt = 'Chart thumbnail';
                img.src = chart.thumbnail;
                li1.appendChild(img);

                let li2 = document.createElement('li');
                li2.classList.add('list-group-item');
                ul.appendChild(li2);

                let cardBodyDiv = document.createElement('div');
                cardBodyDiv.classList.add('card-body');
                li2.appendChild(cardBodyDiv);

                let cardTextDiv = document.createElement('div');
                cardTextDiv.classList.add('card-text');
                cardBodyDiv.appendChild(cardTextDiv);

                if (!Validator.validate('chartName', chart.name)) {
                    return;
                }
                let h6 = document.createElement('h6');
                h6.classList.add('text-chart-name');
                h6.innerText = chart.name;
                cardTextDiv.appendChild(h6);

                let rowDiv = document.createElement('div');
                rowDiv.classList.add('row');
                cardTextDiv.appendChild(rowDiv);

                if (!Validator.validate('date', chart.lastModified)) {
                    return;
                }
                let p = document.createElement('p');
                p.classList.add('text-details');
                let shared = chart.shared ? ' · shared' : '';
                p.innerText = 'Last modified ' + chart.lastModified + shared;
                rowDiv.appendChild(p);

                let a = document.createElement('a');
                a.setAttribute('data-toggle', 'tab');
                p.appendChild(a);
                a.onclick = evt => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    PopupMessage.promptConfirmation('Are you sure you want to delete ' + chart.name + '?', () => {
                        Loader.show();
                        let xhrSender = new XHRSender();
                        xhrSender.addField('id', chart.id);
                        xhrSender.send('/chart/delete', xhr => {
                            try {
                                let resp = JSON.parse(xhr.responseText);
                                if (!resp.hasOwnProperty('success') || resp['success'] !== true) {
                                    if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === "string") {
                                        PopupMessage.showFailure(resp['reason']);
                                    } else {
                                        PopupMessage.showFailure('Deleting chart failed!');
                                    }
                                    Loader.hide();
                                    return;
                                }
                                cardsDiv.removeChild(cardColDiv);
                                setChartCount(cardsDiv.childElementCount);
                                if (cardsDiv.childElementCount == 0) {
                                    showNoCharts();
                                }
                            } catch (error) {
                                PopupMessage.showFailure('Delete failed!');
                            }
                            Loader.hide();
                        });
                    });
                }
                let i = document.createElement('i');
                i.classList.add('fa-solid');
                i.classList.add('fa-trash-can');
                i.title = 'delete'
                a.appendChild(i);

                cardsDiv.appendChild(cardColDiv);
            });
            setChartCount(cardsDiv.childElementCount);
        } catch (error) {
            PopupMessage.showFailure('Loading saved charts failed!');
        }
        Loader.hide();
    });
}

function setChartCount(count) {
    chartCount.innerText = count + "/5";
}

document.body.onload = setCards;
document.addEventListener('visibilitychange', e => {
    if (document.visibilityState == 'visible') {
        setCards(false);
    }
});