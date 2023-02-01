let serial;
let latestData = 'waiting for data';

let timeStamp;

const columnas = ['timeStamp', 'humedad', 'temperatura', 'sonido'];

let tabla;

function setup() {
	createCanvas(windowWidth, windowHeight);
	tabla = new p5.Table();
	for (let i = 0; i < columnas.length; i++) {
		tabla.addColumn(columnas[i]);
	}

	serial = new p5.SerialPort();

	serial.list();
	serial.open('/dev/tty.usbmodem114301');

	serial.on('connected', serverConnected);

	serial.on('list', gotList);

	serial.on('data', gotData);

	serial.on('error', gotError);

	serial.on('open', gotOpen);

	serial.on('close', gotClose);
}

function serverConnected() {
	print('Connected to Server');
}

function gotList(thelist) {
	print('List of Serial Ports:');

	for (let i = 0; i < thelist.length; i++) {
		print(i + ' ' + thelist[i]);
	}
}

function gotOpen() {
	print('Serial Port is Open');
}

function gotClose() {
	print('Serial Port is Closed');
	latestData = 'Serial Port is Closed';
}

function gotError(theerror) {
	print(theerror);
}

function gotData() {
	let currentString = serial.readLine();
	trim(currentString);
	if (!currentString) return;
	// console.log(currentString);
	latestData = currentString;

	timeStamp =
		day().toString().padStart(2, '0') +
		'/' +
		month().toString().padStart(2, '0') +
		'/' +
		year().toString().padStart(2, '0') +
		' ' +
		hour().toString().padStart(2, '0') +
		':' +
		minute().toString().padStart(2, '0') +
		':' +
		second().toString().padStart(2, '0');

	const inputNumbers = currentString.split(',');
	const soundMaped = Math.abs(int(map(inputNumbers[2], 400, 600, 0, 100)));
	inputNumbers[2] = soundMaped;

	let newRow = tabla.addRow();
	newRow.setString(columnas[0], timeStamp);

	for (let i = 0; i < inputNumbers.length; i++) {
		newRow.setNum(columnas[i + 1], inputNumbers[i]);
	}
	inputNumbers;
	print(inputNumbers);
}

function draw() {
	noLoop();
}

function keyPressed() {
	if (key === 's') {
		saveTable(tabla, `HTS - ${timeStamp}.csv`);
	}
}
