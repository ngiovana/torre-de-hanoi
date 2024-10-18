const towers = document.querySelectorAll('.tower');
let draggedDisk = null;
let moveCount = 0;
let numDisks = 4;

document.getElementById('start').addEventListener('click', startGame);

function startGame() {
    numDisks = document.getElementById('disk-count').value;
    moveCount = 0;
    updateMoveCount();
    updateMinMoves();
    createDisks(numDisks);
}

function createDisks(number) {
    towers.forEach(tower => tower.innerHTML = '');

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

towers.forEach(tower => {
    tower.addEventListener('dragover', dragOver);
    tower.addEventListener('drop', drop);
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
    document.getElementById('moves').textContent = `${moveCount} movimentos`;
}

function updateMinMoves() {
    const minMoves = Math.pow(2, numDisks) - 1;
    document.getElementById('message').textContent = `Mínimo de movimentos necessários: ${minMoves}`;
}

function checkWin() {
    const tower2 = document.getElementById('tower2');
    const tower3 = document.getElementById('tower3');

    if (tower2.childElementCount == numDisks || tower3.childElementCount == numDisks) {
        document.querySelectorAll('.disk').forEach(disk => {
            disk.draggable = false;
        });

        const message = document.getElementById('message');

        if (moveCount === Math.pow(2, numDisks) - 1) {
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
