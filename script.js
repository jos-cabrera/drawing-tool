import { createLine } from './shapes/line.js';
import { createBox } from './shapes/box.js';
import { createCircle } from './shapes/circle.js';
import {
	backgroundColor,
	lineColor,
	setLineColor,
	setBackgroundColor,
	gridSize,
	gridWidth,
} from './config.js';

let history = [];
let historyIndex = -1;
let isEraser = false;

function generateGrid() {
	const grid = document.querySelector('.grid');
	let isDrawing = false;

	grid.addEventListener('mousedown', () => {
		isDrawing = true;
	});

	grid.addEventListener('mouseup', () => {
		isDrawing = false;
		updateHistory(); // Don't save history every single pixel
	});

	grid.addEventListener('mouseleave', () => {
		isDrawing = false;
		updateHistory();
	});

	// Generate grid cells
	for (let i = 0; i < gridSize; i++) {
		const cell = document.createElement('div');
		cell.classList.add('cell');
		cell.style.backgroundColor = backgroundColor;

		const updateLabels = () => {
			const xLabel = document.querySelector('#x-label');
			const yLabel = document.querySelector('#y-label');

			if (xLabel && yLabel) {
				const x = i % gridWidth;
				const y = Math.floor(i / gridWidth);
				xLabel.textContent = `x: ${x}`;
				yLabel.textContent = `y: ${y}`;
			}
		};

		// This event listener prevent mousedown to save history when dragging
		cell.addEventListener('click', () => {
			cell.style.backgroundColor = lineColor;
			updateLabels();
			updateHistory();
		});

		// Paint the clicked cell
		cell.addEventListener('mousedown', () => {
			cell.style.backgroundColor = lineColor;
			updateLabels();
			//updateHistory();
		});

		// Paint while dragging
		cell.addEventListener('mouseenter', () => {
			if (isDrawing && cell.style.backgroundColor === backgroundColor) {
				cell.style.backgroundColor = lineColor;
				updateLabels();
				// updateHistory(); // Save every single pixel
			}
		});

		grid.appendChild(cell); // Add the cell to the grid
	}
}

function clearGrid() {
	const cells = document.querySelectorAll('.cell');

	for (let i = 0; i < gridSize; i++) {
		cells[i].style.backgroundColor = backgroundColor;
	}
	updateHistory(); // Update history after clearing the grid
}

function updateHistory() {
	const cells = document.querySelectorAll('.cell');
	const currentState = [];

	// Capture the current state of the grid
	for (let i = 0; i < gridSize; i++) {
		currentState.push(cells[i].style.backgroundColor);
	}

	// Avoid saving duplicate states in the history
	if (
		historyIndex === -1 ||
		!arraysAreEqual(currentState, history[historyIndex])
	) {
		// If we are not at the latest index, trim the future history
		history = history.slice(0, historyIndex + 1);
		history.push(currentState);
		historyIndex++;
	}
}

function arraysAreEqual(arr1, arr2) {
	// Helper function to compare two arrays (shallow comparison)
	if (arr1.length !== arr2.length) return false;
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}
	return true;
}

function undo() {
	window.addEventListener('keydown', (event) => {
		if (event.ctrlKey && event.key === 'z') {
			if (historyIndex > 0) {
				historyIndex--; // Move one step back in the history
				const previousState = history[historyIndex];
				const cells = document.querySelectorAll('.cell');
				for (let i = 0; i < gridSize; i++) {
					cells[i].style.backgroundColor = previousState[i];
				}
			}
		}
	});

	window.addEventListener('keydown', (event) => {
		if (event.ctrlKey && event.key === 'y') {
			// 'y' for redo
			if (historyIndex < history.length - 1) {
				historyIndex++; // Move one step forward in the history
				const nextState = history[historyIndex];
				const cells = document.querySelectorAll('.cell');
				for (let i = 0; i < gridSize; i++) {
					cells[i].style.backgroundColor = nextState[i];
				}
			}
		}
	});
}

function main() {
	generateGrid();
	undo();
	updateHistory();

	// Eraser
	document.querySelector('#eraser').addEventListener('click', () => {
		isEraser = !isEraser;
		document.querySelector('#eraser').classList.toggle('active');

		const aux = lineColor;
		setLineColor(backgroundColor);
		setBackgroundColor(aux);
		updateHistory();
	});

	// Clear the grid
	document.querySelector('#clear-grid').addEventListener('click', () => {
		clearGrid();
		updateHistory();
	});

	// Draw line
	document.querySelector('#draw-line').addEventListener('click', () => {
		const x1 = Number(document.querySelector('#x1').value);
		const y1 = Number(document.querySelector('#y1').value);
		const x2 = Number(document.querySelector('#x2').value);
		const y2 = Number(document.querySelector('#y2').value);

		createLine(x1, y1, x2, y2);
		updateHistory();
	});

	// Draw box
	document.querySelector('#draw-box').addEventListener('click', () => {
		const x1 = Number(document.querySelector('#x1-box').value);
		const y1 = Number(document.querySelector('#y1-box').value);
		const x2 = Number(document.querySelector('#x2-box').value);
		const y2 = Number(document.querySelector('#y2-box').value);

		const centerX = (x1 + x2) / 2;
		const centerY = (y1 + y2) / 2;
		const width = Math.abs(x2 - x1) + 1;
		const height = Math.abs(y2 - y1) + 1;

		createBox(centerX, centerY, width, height);
		updateHistory();
	});

	// Draw circle
	document.querySelector('#draw-circle').addEventListener('click', () => {
		const centerX = Number(document.querySelector('#x-circle').value);
		const centerY = Number(document.querySelector('#y-circle').value);
		const radius = Number(document.querySelector('#radius-circle').value);

		createCircle(centerX, centerY, radius);
		updateHistory();
	});
}

main();
