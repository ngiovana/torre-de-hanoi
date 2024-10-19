let solutionMoves = [];
let isProcessing = false;
const moveQueue = [];

function addMoveToQueue() {
    moveQueue.push(processNextMove);

    if (!isProcessing) {
        processMoveQueue();
    }
}

function processMoveQueue() {
    if (moveQueue.length > 0) {
        isProcessing = true;

        const nextMoveFunction = moveQueue.shift();
        nextMoveFunction();

        setTimeout(() => {
            isProcessing = false;

            processMoveQueue();
        }, 40);
    }
}

function processNextMove() {
    if (solutionMoves.length > 0) {
        const nextMove = solutionMoves.shift();
        const fromTower = document.getElementById('tower' + nextMove.from);
        const toTower = document.getElementById('tower' + nextMove.to);

        const diskToMove = fromTower.querySelector('.disk:last-child');

        diskToMove.classList.add('animated-disk');

        setTimeout(() => {
            toTower.appendChild(diskToMove);

            diskToMove.classList.remove('animated-disk');
        }, 10);
    }
}

function hanoiSolver(numDisks, from, to, aux) {
    if (numDisks === 0) {
        solutionMoves.push({ disk: numDisks, from, to });
        return;
    }
    hanoiSolver(numDisks - 1, from, aux, to);
    solutionMoves.push({ disk: numDisks, from, to });
    hanoiSolver(numDisks - 1, aux, to, from);
}

export { hanoiSolver, addMoveToQueue, solutionMoves };