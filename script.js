const gridSize = 32 * 32;
const lineColor = 'black';
const backgroundColor = 'rgb(255, 223, 223)';

main();

function generateGrid() {
	const grid = document.querySelector('.grid');
	for (let i = 0; i < gridSize; i++) {
		const cell = document.createElement('div');
		cell.classList.add('cell');

		// toggle color on click
		cell.addEventListener('click', () => {
			cell.style.backgroundColor =
				cell.style.backgroundColor === lineColor
					? backgroundColor
					: lineColor;

			console.log(`x: ${Math.floor(i % 32)}, y: ${Math.floor(i / 32)}`);
		});

		grid.appendChild(cell);
	}
}

function clearGrid() {
	const cells = document.querySelectorAll('.cell');

	for (let i = 0; i < gridSize; i++) {
		cells[i].style.backgroundColor = backgroundColor;
	}
}

function createLine(x1, y1, x2, y2, color = lineColor) {
	const cells = document.querySelectorAll('.cell');
	const dx = Math.abs(x2 - x1);
	const dy = Math.abs(y2 - y1);
	const sx = x1 < x2 ? 1 : -1;
	const sy = y1 < y2 ? 1 : -1;
	let err = dx - dy;
	let index = y1 * 32 + x1;

	while (true) {
		const e2 = 2 * err;
		if (x1 == x2 && y1 == y2) break;

		if (x1 >= 0 && x1 < 32 && y1 >= 0 && y1 < 32) {
			cells[index].style.backgroundColor = color;
		}

		if (e2 > -dy) {
			err -= dy;
			x1 += sx;
			index += sx;
		}
		if (e2 < dx) {
			err += dx;
			y1 += sy;
			index += sy * 32;
		}
	}
}

function rotateLine(centerX, centerY, radius, angle, color = lineColor) {
	const radians = angle * (Math.PI / 180);
	const x1 = Math.round(centerX + radius * Math.cos(radians));
	const y1 = Math.round(centerY + radius * Math.sin(radians));
	const x2 = Math.round(centerX - radius * Math.cos(radians));
	const y2 = Math.round(centerY - radius * Math.sin(radians));
	createLine(x1, y1, x2, y2, color);
}

function createRotationCirle(centerX, centerY, radius) {
	let angle = 0;

	const updateTime = 500;
	const angleIncrement = 16;

	setInterval(() => {
		rotateLine(
			centerX,
			centerY,
			radius,
			angle - angleIncrement,
			backgroundColor
		); // Clear the previous line

		rotateLine(centerX, centerY, radius, angle);

		angle = (angle + angleIncrement) % 360;
	}, updateTime);
}

function main() {
	generateGrid();
	document.querySelector('#clear-grid').addEventListener('click', clearGrid);

	/* createRotationCirle(14, 14, 6);
	createRotationCirle(10, 10, 8); */

	document.querySelector('#draw-line').addEventListener('click', () => {
		const x1 = Number(document.querySelector('#x1').value);
		const y1 = Number(document.querySelector('#y1').value);
		const x2 = Number(document.querySelector('#x2').value);
		const y2 = Number(document.querySelector('#y2').value);

		createLine(x1, y1, x2, y2);
	});
}
