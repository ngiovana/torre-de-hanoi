import {addMoveToQueue, hanoiSolver, solutionMoves} from './solver.js';

function HanoiTowerGameController() {

    const MAX_DISK_DIFFICULT = 8

    this.reference = document.querySelector('.game-page-container');

    const dickDifficultSelect = this.reference.querySelector('.disk-difficult-select');
    const restartButton = this.reference.querySelector('.restart-button');
    const hintButton = this.reference.querySelector('.hint-button');

    const currentMovesCounterReference = this.reference.querySelector('.current-moves-count');
    const feedbackMessage = this.reference.querySelector('.minimum-moves-to-finish');

    const firstTower = this.reference.querySelector('.first-tower');
    const middleTower = this.reference.querySelector('.middle-tower');
    const lastTower = this.reference.querySelector('.last-tower');

    const towerList = [firstTower, middleTower, lastTower];

    const _this = this;

    const gameState = {}

    let draggedDisk = null;
    let minMoves = 0;
    let moveCount = 0;
    let numDisks = 4;
    let finished = false;

    function init() {
        restartButton.addEventListener('click', restartGame);
        hintButton.addEventListener('click', executeHint);

        towerList.forEach(tower => {
            tower.addEventListener('dragover', dragOver);
            tower.addEventListener('drop', drop);
        });

        restartGame();
    }

    // "Re" Criação do status do jogo

    function restartGame() {
        finished = false;
        numDisks = Math.min(dickDifficultSelect.value, MAX_DISK_DIFFICULT);
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
            disk.textContent = i;
            disk.addEventListener('dragstart', dragStart);
            disk.addEventListener('dragend', dragEnd);

            firstTower.appendChild(disk);
        }
    }

    function executeHint() {
        if (finished) return;

        addMoveToQueue();

        moveCount++;
        updateMoveCount();
        setTimeout(() => checkWin(), 100);
    }

    // atualização de feedback

    function updateMoveCount() {
        const moveLabel = moveCount == 1 ? 'movimento' : 'movimentos';
        const actionLabel = moveCount == 1 ? 'feito' : 'feitos';

        currentMovesCounterReference.innerHTML = `<strong class='red'>${moveCount}</strong> ${moveLabel} ${actionLabel}`;
    }

    function updateMinMoves() {
        minMoves = Math.pow(2, numDisks) - 1;
        feedbackMessage.innerHTML = `Mínimo de movimentos necessários: <strong class='red'>${minMoves}</strong>`;
    }

    // Validações de jogo

    function checkWin() {
        if (middleTower.childElementCount !== numDisks && lastTower.childElementCount !== numDisks) {
            return;
        }

        _this.reference.querySelectorAll('.disk').forEach(disk => {
            disk.draggable = false;
        });

        _this.finished = true;

        if (moveCount === minMoves) {
            feedbackMessage.textContent = '😲';
            setTimeout(() => {
                alert('Parabéns! Você completou o jogo com o mínimo de movimentos possíveis!\nImpressionante!');
            }, 100);

            return;
        }

        feedbackMessage.textContent = 'Parabéns! Você completou o jogo em ' + moveCount + ' movimentos!';
        currentMovesCounterReference.textContent = '';
    }

    // Regras de movimentação das peças

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

    function dragEnd() {
        draggedDisk = null;
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function drop(event) {
        const currentTower = event.target;
        if (!currentTower.classList.contains('tower')) {
            return;
        }

        const topDisk = currentTower.querySelector('.disk:last-child');

        if (!topDisk || draggedDisk.dataset.size < topDisk.dataset.size) {
            currentTower.appendChild(draggedDisk);
            moveCount++;
            updateMoveCount();
            checkWin();
        }
    }

    init();
}

const hanoiTowerGameController = new HanoiTowerGameController();
