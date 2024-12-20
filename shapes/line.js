import {
	backgroundColor,
	lineColor,
	updateTime,
	gridWidth,
	strokeSize,
} from '../config.js';

export function createLine(x1, y1, x2, y2, color = lineColor) {
	const cells = document.querySelectorAll('.cell');
	const dx = Math.abs(x2 - x1);
	const dy = Math.abs(y2 - y1);
	const sx = x1 < x2 ? 1 : -1;
	const sy = y1 < y2 ? 1 : -1;
	let err = dx - dy;
	let index = y1 * gridWidth + x1;

	// draw the line of size strokeSize
	for (let i = 0; i < strokeSize; i++) {
		for (let j = 0; j < strokeSize; j++) {
			const newIndex = index + i * gridWidth + j;
			if (
				x1 + i >= 0 &&
				x1 + i < gridWidth &&
				y1 + j >= 0 &&
				y1 + j < gridWidth
			) {
				cells[newIndex].style.backgroundColor = color;
			}
		}
	}

	while (true) {
		const e2 = 2 * err;
		if (x1 == x2 && y1 == y2) break;

		if (e2 > -dy) {
			err -= dy;
			x1 += sx;
		}
		if (e2 < dx) {
			err += dx;
			y1 += sy;
		}

		if (x1 >= 0 && x1 < gridWidth && y1 >= 0 && y1 < gridWidth) {
			index = y1 * gridWidth + x1;
			for (let i = 0; i < strokeSize; i++) {
				for (let j = 0; j < strokeSize; j++) {
					const newIndex = index + i * gridWidth + j;
					if (
						x1 + i >= 0 &&
						x1 + i < gridWidth &&
						y1 + j >= 0 &&
						y1 + j < gridWidth
					) {
						cells[newIndex].style.backgroundColor = color;
					}
				}
			}
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

export function createRotationLine(centerX, centerY, radius) {
	let angle = 0;

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
