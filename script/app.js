const serverEndPoint = "https://data.unhcr.org/population/"


const toggle = document.getElementById('toggle');
const body = document.body;

toggle.addEventListener('input', e => {
    const isChecked = e.target.checked;

    if (isChecked) {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }
});

async function getData(serverEndPoint, widget_id, population_group) {
    const response = await fetch(serverEndPoint + "?widget_id=" + widget_id + "&population_group=" + population_group + "&sv_id=54")
    const responseJson = await response.json();

	return String(responseJson["data"][0]["individuals"])
}

function CommaFormatted(amount) {
	var delimiter = "."; // replace comma if desired
	var a = amount.split('.',2)
	var d = a[1];
	var i = parseInt(a[0]);
	if(isNaN(i)) { return ''; }
	var minus = '';
	if(i < 0) { minus = '-'; }
	i = Math.abs(i);
	var n = new String(i);
	var a = [];
	while(n.length > 3) {
		var nn = n.substr(n.length-3);
		a.unshift(nn);
		n = n.substr(0,n.length-3);
	}
	if(n.length > 0) { a.unshift(n); }
	n = a.join(delimiter);
	if(d.length < 1) { amount = n; }
	else { amount = n + '.' + d; }
	amount = minus + amount;
	return amount;
}

function ShowDataWithCounter() {
	const counters = document.getElementsByClassName('js-counter');
	var count = 0;

	for(let n of counters) {
	const updateCount = () => {
		const target = + n.getAttribute('data-value');
		const speed = 300; 
		const inc = target / speed; 
		if(count < target) {
		n.innerText = "~ " + CommaFormatted(String(Math.ceil(count + inc)) + ".00");
		count = Math.ceil(count + inc)
		setTimeout(updateCount, 1);
		} else {
		n.innerHTML = "~ " + CommaFormatted(String(target) + ".00");
		}
	}
	updateCount();
}
}

function ShowDataProgressbar(registeredRefugees) {

	var progressProcent = (registeredRefugees / 12000000) * 100
	console.log(registeredRefugees)
	console.log(progressProcent)
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = '@-webkit-keyframes to30percent { from { left: 0%; } to { left:' + progressProcent + '%; }}';
	document.getElementsByTagName('head')[0].appendChild(style);

}







document.addEventListener('DOMContentLoaded', async function() {
	const responseRecordedEu = await getData(serverEndPoint, "333464", "5478");

	var elementRecordedEu = document.getElementsByClassName("js-recordedeu");
	elementRecordedEu[0].dataset.value = String(responseRecordedEu)

	const responseRegisteredEu = await getData(serverEndPoint, "333465", "5480");

	var elementRegisteredEu = document.getElementsByClassName("js-registeredeu");
	elementRegisteredEu[0].dataset.value = String(responseRegisteredEu)

	const responseBorderCrossingsFromUa = await getData(serverEndPoint, "333466", "5460");

	var elementBorderCrossingsFromUa = document.getElementsByClassName("js-bordercrossingfromua");
	elementBorderCrossingsFromUa[0].dataset.value = String(responseBorderCrossingsFromUa)

	const responseBorderCrossingsToUa = await getData(serverEndPoint, "333467", "5472");

	var elementBorderCrossingsToUa = document.getElementsByClassName("js-bordercrossingtoua");
	elementBorderCrossingsToUa[0].dataset.value = String(responseBorderCrossingsToUa)

	ShowDataWithCounter();
	ShowDataProgressbar(responseRecordedEu);
});

