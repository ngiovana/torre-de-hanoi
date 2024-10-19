import { addMoveToQueue, hanoiSolver, solutionMoves } from './solver.js';

const maxDisks = 8
const towerList = document.querySelectorAll('.tower');

let draggedDisk = null;
let minMoves = 0;
let moveCount = 0;
let numDisks = 4;
let finished = false;

document.getElementById('start').addEventListener('click', startGame);

function startGame() {
    finished = false;
    numDisks = Math.min(document.getElementById('disk-count').value, maxDisks);
    moveCount = 0;
    updateMoveCount();
    updateMinMoves();
    createDisks(numDisks);

    solutionMoves.length = 0;
    hanoiSolver(numDisks, 1, 3, 2);
}

function createDisks(number) {
    towerList.forEach(tower => tower.innerHTML = '');

    for (let i = number; i > 0; i--) {
        const disk = document.createElement('div');
        disk.classList.add('disk');
        disk.id = `disk${i}`;
        disk.setAttribute('data-size', i);
        disk.draggable = true;
        disk.addEventListener('dragstart', dragStart);
        disk.addEventListener('dragend', dragEnd);
        document.getElementById('tower1').appendChild(disk);
    }
}

document.querySelectorAll('.disk').forEach(disk => {
    disk.addEventListener('dragstart', dragStart);
    disk.addEventListener('dragend', dragEnd);
});

towerList.forEach(tower => {
    tower.addEventListener('dragover', dragOver);
    tower.addEventListener('drop', drop);
});

document.getElementById('hint').addEventListener('click', () => {
    if (finished) {
        return;
    }

    addMoveToQueue();

    moveCount++;
    updateMoveCount();
    setTimeout(() => checkWin(), 100);
});


function dragStart(event) {
    const disk = event.target;
    const tower = disk.parentElement;
    const disksInTower = tower.querySelectorAll('.disk');
    const isTopDisk = disk === disksInTower[disksInTower.length - 1];

    if (isTopDisk) {
        draggedDisk = disk;
    } else {
        event.preventDefault();
    }
}

function dragEnd(event) {
    draggedDisk = null;
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    const tower = event.target;
    if (tower.classList.contains('tower')) {
        const topDisk = tower.querySelector('.disk:last-child');

        // Verifica se o disco sendo movido é menor que o disco no topo da torre de destino
        if (!topDisk || draggedDisk.dataset.size < topDisk.dataset.size) {
            tower.appendChild(draggedDisk);
            moveCount++;
            updateMoveCount();
            checkWin();
        }
    }
}

function updateMoveCount() {
    const moveLabel = moveCount == 1 ? "movimento" : "movimentos";
    const actionLabel = moveCount == 1 ? "feito" : "feitos";
    document.getElementById('moves').innerHTML = `<strong class='red'>${moveCount}</strong> ${moveLabel} ${actionLabel}`;
}

function updateMinMoves() {
    minMoves = Math.pow(2, numDisks) - 1;
    document.getElementById('message').innerHTML = `Mínimo de movimentos necessários: <strong class='red'>${minMoves}</strong>`;
}

function checkWin() {
    const tower2 = document.getElementById('tower2');
    const tower3 = document.getElementById('tower3');

    if (tower2.childElementCount == numDisks || tower3.childElementCount == numDisks) {
        document.querySelectorAll('.disk').forEach(disk => {
            disk.draggable = false;
        });

        finished = true;
        const message = document.getElementById('message');

        if (moveCount === minMoves) {
            message.textContent = "😲";
            setTimeout(() => {
                alert("Parabéns! Você completou o jogo com o mínimo de movimentos possíveis!\nImpressionante!");
            }, 100);

            return;
        }

        message.textContent = "Parabéns! Você completou o jogo em " + moveCount + " movimentos!";
        document.getElementById('moves').textContent = '';
    }
}

startGame();
