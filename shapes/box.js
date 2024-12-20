import {
	backgroundColor,
	lineColor,
	updateTime,
	strokeSize,
} from '../config.js';
import { createLine } from './line.js';

export function createBox(
	centerX,
	centerY,
	width,
	height,
	angle = 0,
	color = lineColor
) {
	const effectiveWidth = width - strokeSize;
	const effectiveHeight = height - strokeSize;
	const radians = angle * (Math.PI / 180);

	const corners = [
		{ x: -effectiveWidth / 2, y: -effectiveHeight / 2 },
		{ x: effectiveWidth / 2, y: -effectiveHeight / 2 },
		{ x: effectiveWidth / 2, y: effectiveHeight / 2 },
		{ x: -effectiveWidth / 2, y: effectiveHeight / 2 },
	];

	const rotatedCorners = corners.map(({ x, y }) => ({
		x: Math.round(centerX + x * Math.cos(radians) - y * Math.sin(radians)),
		y: Math.round(centerY + x * Math.sin(radians) + y * Math.cos(radians)),
	}));

	createLine(
		rotatedCorners[0].x,
		rotatedCorners[0].y,
		rotatedCorners[1].x,
		rotatedCorners[1].y,
		color
	);
	createLine(
		rotatedCorners[1].x,
		rotatedCorners[1].y,
		rotatedCorners[2].x,
		rotatedCorners[2].y,
		color
	);
	createLine(
		rotatedCorners[2].x,
		rotatedCorners[2].y,
		rotatedCorners[3].x,
		rotatedCorners[3].y,
		color
	);
	createLine(
		rotatedCorners[3].x,
		rotatedCorners[3].y,
		rotatedCorners[0].x,
		rotatedCorners[0].y,
		color
	);
}

function rotateBox(cx, cy, width, height, angle, color = lineColor) {
	createBox(cx, cy, width, height, angle, color);
}

export function createRotationBox(centerX, centerY, width, height) {
	let angle = 0;

	const angleIncrement = 1;

	setInterval(() => {
		rotateBox(
			centerX,
			centerY,
			width,
			height,
			angle - angleIncrement,
			backgroundColor
		); // Clear the previous box

		rotateBox(centerX, centerY, width, height, angle);

		angle = (angle + angleIncrement) % 360;
	}, updateTime);
}
