const cardsDiv = document.getElementById('cardsDiv');

function showNoCharts() {
    let p = document.createElement('p');
    p.classList.add('text-details');
    p.innerText = 'No saved charts';
    cardsDiv.appendChild(p);
}
function setCards() {
    var xhrSender = new XHRSender();
    xhrSender.send('/authChart/list', xhr => {
        try {
            let resp = JSON.parse(xhr.responseText);
            if (!resp.hasOwnProperty('success') || resp['success'] !== true || !resp.hasOwnProperty('info') || !Array.isArray(resp.info)) {
                if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === "string") {
                    showMsg(resp['reason']);
                } else {
                    showMsg('Chart list retrieving failed!');
                }
                return;
            }
            if (resp.info.length == 0) {
                showNoCharts();
            }
            resp.info.forEach(chart => {
                let cardColDiv = document.createElement('div');
                cardColDiv.id = chart.id;
                cardColDiv.classList.add('col-md-4');
                cardColDiv.classList.add('card-col');
                cardsDiv.appendChild(cardColDiv);

                let cardDiv = document.createElement('div');
                cardDiv.classList.add('card');
                cardColDiv.appendChild(cardDiv);

                let ul = document.createElement('ul');
                ul.classList.add('list-group');
                ul.classList.add('list-group-flush');
                cardDiv.appendChild(ul);
                
                let li1 = document.createElement('li');
                li1.classList.add('list-group-item');
                li1.classList.add('card-img-area');
                ul.appendChild(li1);
                
                li1.onclick = evt => {
                    window.open('/authChart/retrieve/' + chart.id, '_blank');
                }

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

                let h6 = document.createElement('h6');
                h6.classList.add('text-chart-name');
                h6.innerText = chart.name;
                cardTextDiv.appendChild(h6);

                h6.onclick = evt => {
                    window.open('/authChart/retrieve/' + chart.id, '_blank');
                }

                let rowDiv = document.createElement('div');
                rowDiv.classList.add('row');
                cardTextDiv.appendChild(rowDiv);

                let p = document.createElement('p');
                p.classList.add('text-details');
                p.innerText = 'Last modified ' + chart.lastModified;
                rowDiv.appendChild(p);

                let a = document.createElement('a');
                a.setAttribute('data-toggle', 'tab');
                p.appendChild(a);
                a.onclick = evt => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    showMsg('Are you sure you want to delete ' + chart.name + '?', true, true);
                    document.getElementById("popupconfirm").onclick = e => {
                        document.getElementById("overlay").style.display = 'none';
                        document.getElementById("msgPopup").style.display = 'none';
                        let xhrSender = new XHRSender();
                        xhrSender.addField('id', chart.id);
                        xhrSender.send('/authChart/delete', xhr => {
                            try {
                                let resp = JSON.parse(xhr.responseText);
                                if (!resp.hasOwnProperty('success') || resp['success'] !== true) {
                                    if (resp.hasOwnProperty('reason') && typeof (resp['reason']) === "string") {
                                        showMsg(resp['reason']);
                                    } else {
                                        showMsg('Deleting chart failed!');
                                    }
                                    return;
                                }
                                cardsDiv.removeChild(cardColDiv);
                                if (cardsDiv.childElementCount == 0) {
                                    showNoCharts();
                                }
                            } catch (error) {
                                showMsg('Delete failed!');
                            }
                        });
                    };
                }
                let i = document.createElement('i');
                i.classList.add('fa-solid');
                i.classList.add('fa-trash-can');
                a.appendChild(i);
            });
        } catch (error) {
            showMsg('Loading saved charts failed!');
        }
    });
}

document.body.onload = setCards;