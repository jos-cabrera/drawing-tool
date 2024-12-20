import { gridWidth, gridSize, strokeSize, lineColor } from '../config.js';

export function createCircle(centerX, centerY, radius, color = lineColor) {
	const cells = document.querySelectorAll('.cell');
	for (let i = 0; i < gridSize; i++) {
		const x = i % gridWidth;
		const y = Math.floor(i / gridWidth);
		const dx = x - centerX;
		const dy = y - centerY;
		const distanceSquared = dx * dx + dy * dy; // Avoid floating-point errors
		const radiusSquared = radius * radius;

		// Check if the cell is close to the circle's boundary
		if (
			distanceSquared >= radiusSquared - radius * strokeSize &&
			distanceSquared <= radiusSquared + radius * strokeSize &&
			x >= 0 &&
			x < gridWidth &&
			y >= 0 &&
			y < gridWidth
		) {
			cells[i].style.backgroundColor = color;
		}
	}
}
