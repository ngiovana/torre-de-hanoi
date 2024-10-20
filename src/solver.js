let solutionMoves = [];
let isProcessing = false;
const moveQueue = [];
const movementAnimationGap = 15;
const ghostPlaceholderDiskId = 'ghost-placeholder';

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

            //moveDisk(diskToMove, toTower); ainda não está funcionando a animação
        }, 10);
    }
}

function moveDisk(disk, toTower) {
    toTower.appendChild(createGhostPlaceholderDisk(disk.offsetWidth));
    animateDiskUp(disk, toTower);
}

function animateDiskUp(disk, toTower) {
    $(disk).animate( {
        top: - movementAnimationGap - disk.offsetTop - disk.offsetHeight
    }, 1000, () => animateDiskLeftOrRight(disk, toTower));
}

function animateDiskLeftOrRight(disk, toTower) {
    const ghostPlaceholderDisk = document.getElementById(ghostPlaceholderDiskId);

    $(disk).animate( {
        left: ghostPlaceholderDisk.getBoundingClientRect().left - disk.getBoundingClientRect().left
    }, 1000, () => animateDiskDown(disk, toTower));
}

function animateDiskDown(disk, toTower) {
    const ghostPlaceholderDisk = document.getElementById(ghostPlaceholderDiskId);

    $(disk).animate( {
        top: ghostPlaceholderDisk.getBoundingClientRect().top - disk.getBoundingClientRect().top - 110
    }, 1000, function() {
        toTower.removeChild(document.getElementById(ghostPlaceholderDiskId));
        toTower.appendChild(disk);
        disk.classList.remove('animated-disk');
    });
}

function createGhostPlaceholderDisk(width) {
    const disk = document.createElement('div');
    disk.classList.add('disk');
    disk.id = ghostPlaceholderDiskId;
    disk.style.width = width + 'px';

    return disk;
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