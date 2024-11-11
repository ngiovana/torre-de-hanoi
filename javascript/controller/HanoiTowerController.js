import {HanoiTowerService} from '../service/HanoiTowerService.js';
import {MoveCommandDTO} from '../dto/MoveCommandDTO.js';
import {SoundController} from "./SoundController.js";
import {AnimationController} from "./AnimationController.js";
import {DiskController} from "./DiskController.js";

class HanoiTowerController {
    #reference = document.querySelector('.game-page-container');

    #diskDifficultSelectReference = this.#reference.querySelector('.disk-difficult-select');
    #restartButtonReference = this.#reference.querySelector('.restart-button');
    #hintButtonReference = this.#reference.querySelector('.hint-button');

    #currentMovesCounterReference = this.#reference.querySelector('.current-moves-count');
    #feedbackMessageReference = this.#reference.querySelector('.minimum-moves-to-finish');

    #firstTowerReference = this.#reference.querySelector('.first-tower');
    #middleTowerReference = this.#reference.querySelector('.middle-tower');
    #lastTowerReference = this.#reference.querySelector('.last-tower');

    #towerElementList = [this.#firstTowerReference, this.#middleTowerReference, this.#lastTowerReference];

    #draggedDiskTowerReference = null;
    #draggedDiskReference = null;

    #gameId;
    #gameService;

    #animationController = new AnimationController();
    #soundController = new SoundController();
    #diskController = new DiskController();

    #canRequestHint = false;
    #lastHintMoveCommand;
    #phantomDisk;

    constructor(gameService) {
        this.#gameService = gameService;

        this.#restartButtonReference.addEventListener('click', this.#startGame);
        this.#hintButtonReference.addEventListener('click', this.#requestHint);
        this.#diskDifficultSelectReference.addEventListener('change', this.#startGame);
    }

    #startGame = () => {
        this.#restartButtonReference.textContent = "Reiniciar";
        this.#animationController.stopConfettiFall();

        const diskDifficult = parseInt(this.#diskDifficultSelectReference.value);
        const gameData = this.#gameService.startGame('player-1', diskDifficult)

        this.#gameId = gameData.id;

        this.#setMinMovesToFinish(gameData.minMoves);
        this.#updateMovesCount(gameData.state.movesCount);
        this.#createDisks(gameData.difficultLevel);

        this.#soundController.playStarGameSound();

        this.#hintButtonReference.classList.remove('hide');
        this.#canRequestHint = true;
    }

    #requestHint = () => {
        if (!this.#canRequestHint) return;

        if (!this.#lastHintMoveCommand) {
            this.#lastHintMoveCommand = this.#gameService.requestHint(this.#gameId);
            if (!this.#lastHintMoveCommand) return;
        }

        if (this.#phantomDisk) {
            this.#phantomDisk.remove();
            this.#phantomDisk = null;
        }

        this.#executeMoveCommand(null, this.#lastHintMoveCommand);
    };

    #setMinMovesToFinish = (minMovesToFinish) => {
        this.#feedbackMessageReference.innerHTML = `Mínimo de movimentos necessários: <strong class='red'>${minMovesToFinish}</strong>`;
    };

    #createDisks = (diskDifficult) => {
        document.querySelectorAll('.disk').forEach(diskElement => diskElement.remove())

        for (let diskNumber = diskDifficult; diskNumber > 0; diskNumber--) {
            setTimeout(() => {
                this.#createDisk(diskNumber)
            }, 200 * (diskDifficult - diskNumber))
        }

        setTimeout(() => {
            this.#updateInvalidDisks()
        }, 210 * diskDifficult);
    }

    #createDisk = (diskNumber) => {
        const diskElement = this.#diskController.createDiskElement(diskNumber, this.#firstTowerReference)

        diskElement.addEventListener('mousedown', this.#startDiskMove)
        diskElement.addEventListener('touchstart', this.#startDiskMove)

        document.body.appendChild(diskElement);

        this.#animationController.executeDiskFallAnimation(diskElement, () => {
            this.#diskController.setDiskStaticState(diskElement)

            this.#soundController.playDragSound();
            this.#firstTowerReference.appendChild(diskElement);
        })
    }

    #startDiskMove = (event) => {
        if (this.#draggedDiskReference) return;

        const diskElement = event.target;
        if (diskElement.classList.contains('invalid')) {
            this.#soundController.playInvalidMoveSound();
            return;
        }

        this.#draggedDiskReference = diskElement;
        this.#draggedDiskTowerReference = diskElement.parentElement;

        this.#reference.appendChild(diskElement);

        this.#diskController.setDiskDraggingState(diskElement)
        this.#diskController.setDraggingDiskPosition(diskElement, event)

        document.addEventListener('mousemove', this.#moveDisk);
        document.addEventListener('mouseup', this.#dropDisk);
        document.addEventListener('touchmove', this.#moveDisk)
        document.addEventListener('touchend', this.#dropDisk)

        this.#soundController.playDragSound()
    }

    #moveDisk = (event) => {
        const clientY = event.clientY || event.touches[0].clientY;
        const clientX = event.clientX || event.touches[0].clientX;

        const diskTop = clientY - this.#draggedDiskReference.offsetHeight / 2;
        const diskLeft = clientX - this.#draggedDiskReference.offsetWidth / 2;

        this.#draggedDiskReference.style.top  = `${ diskTop }px`;
        this.#draggedDiskReference.style.left = `${ diskLeft }px`;
    }

    #dropDisk = (event) => {
        document.removeEventListener('mousemove', this.#moveDisk)
        document.removeEventListener('mouseup', this.#dropDisk)
        document.removeEventListener('touchmove', this.#moveDisk)
        document.removeEventListener('touchend', this.#dropDisk)

        this.#draggedDiskReference.style.cursor = 'grab';

        const toTowerElement = this.#findTowerInMousePosition(event);
        const moveCommand = new MoveCommandDTO(
            this.#gameId,
            parseInt(this.#draggedDiskReference.dataset.number),
            this.#draggedDiskTowerReference.dataset.name,
            toTowerElement?.dataset?.name,
        )

        const gameState = this.#gameService.checkMoveCommand(moveCommand);
        if (gameState) {
            this.#executeMoveCommand(gameState, moveCommand);
            return;
        }

        this.#animationController.executeMoveDiskToTowerAnimation(this.#draggedDiskReference, this.#draggedDiskTowerReference, () => {
            this.#finishDiskMove(this.#draggedDiskReference, this.#draggedDiskTowerReference);
        })
    }

    #finishDiskMove = (diskElement, toTowerElement) => {
        this.#diskController.setDiskStaticState(diskElement)

        toTowerElement.appendChild(diskElement);
        this.#soundController.playMoveSound();

        if (this.#draggedDiskTowerReference !== toTowerElement) {
            this.#updateInvalidDisks();
        }

        this.#draggedDiskReference = null;
        this.#draggedDiskTowerReference = null;
    }

    #executeMoveCommand = (gameState, moveCommand) => {
        const toTowerElement = this.#getTowerByName(moveCommand.toTowerName);
        if (!toTowerElement) return;

        let diskElement;
        if (moveCommand.isHint) {
            this.#canRequestHint = false;

            const fromTower = this.#getTowerByName(moveCommand.fromTowerName);
            this.#phantomDisk = this.#diskController.createDiskElement(moveCommand.diskNumber, fromTower);
            this.#finishDiskMove(this.#phantomDisk, fromTower);

            this.#phantomDisk.data = '';
            this.#phantomDisk.style.top = '';
            this.#phantomDisk.style.left = '';
            this.#phantomDisk.removeAttribute('data-number');

            this.#phantomDisk.classList.add('phantom');

            diskElement = this.#phantomDisk;
        } else {
            diskElement = this.#getDiskByNumber(moveCommand.diskNumber);
            if (!diskElement) return;
        }

        const moveDiskCallback = () => {
            this.#finishDiskMove(diskElement, toTowerElement);
            this.#canRequestHint = true;

            if (!gameState) return;

            this.#updateMovesCount(gameState.movesCount);

            if (gameState.isFinished) {
                this.#executeWin(gameState);
            }
        }

        if (moveCommand.isHint) {
            this.#animationController.executeMoveDiskToTowerAnimation(diskElement, toTowerElement, moveDiskCallback)
        } else {
            if (this.#phantomDisk) {
                this.#phantomDisk.remove();
                this.#phantomDisk = null;
            }

            this.#lastHintMoveCommand = null;
            moveDiskCallback();
        }
    }

    #updateMovesCount = (movesCount) => {
        const moveLabel = movesCount === 1 ? 'movimento' : 'movimentos';
        const actionLabel = movesCount === 1 ? 'feito' : 'feitos';

        this.#currentMovesCounterReference.innerHTML =
            `<strong class='red'>${ movesCount }</strong> ${ moveLabel } ${ actionLabel }`;
    };

    #executeWin = (gameState) => {
        document.querySelectorAll('.disk').forEach(diskElement => {
            diskElement.classList.add('invalid');
        });

        this.#animationController.playConfettiFall();

        this.#soundController.playWinSound(gameState.isBestSolution);

        if (gameState.isBestSolution) {
            this.#feedbackMessageReference.textContent = '😲';

            setTimeout(() => {
                Swal.fire({
                    title: "Parabéns!",
                    text: "Você completou o jogo com o mínimo de movimentos possíveis! Impressionante!",
                    icon: "success",
                    confirmButtonColor: "#3085d6"
                });
            }, 100);
            return;
        }

        this.#currentMovesCounterReference.textContent = '';
        this.#canRequestHint = false;

        this.#feedbackMessageReference.innerHTML =
            `Parabéns! Você completou o jogo em <strong class='red'>${ gameState.movesCount }</strong> movimentos!`;
    };

    #updateInvalidDisks = () => {
        this.#towerElementList.forEach(tower => {
            const diskList = tower.querySelectorAll('.disk');

            diskList.forEach((disk, index) => {
                disk.classList.add('invalid');
            })

            if (!this.#gameService.isFinished && diskList.length) {
                diskList[diskList.length - 1].classList.remove('invalid');
            }
        })
    };

    #findTowerInMousePosition = (event) => {
        return this.#towerElementList.find((tower) => {
            const towerRect = tower.getBoundingClientRect();

            const clientX = event.clientX || event.changedTouches[0].clientX;
            const clientY = event.clientY  || event.changedTouches[0].clientY;

            if (clientX < towerRect.left) return false
            if (clientX > towerRect.right) return false
            if (clientY < towerRect.top) return false
            if (clientY > towerRect.bottom) return false

            return true
        });
    }

    #getTowerByName = (towerName) => {
        return this.#reference.querySelector(`[data-name='${ towerName }']`);
    }

    #getDiskByNumber = (diskNumber) => {
        return this.#reference.querySelector(`[data-number='${ diskNumber }']`);
    }

}

export {HanoiTowerController}
