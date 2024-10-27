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

    #gameService = new HanoiTowerService();

    #animationController = new AnimationController();
    #soundController = new SoundController();
    #diskController = new DiskController();

    #canRequestHint = false;

    constructor() {
        this.#restartButtonReference.addEventListener('click', this.#startGame);
        this.#hintButtonReference.addEventListener('click', this.#requestHint);
        this.#diskDifficultSelectReference.addEventListener('change', this.#startGame);
    }

    #startGame = () => {
        this.#restartButtonReference.textContent = "Reiniciar";
        this.#animationController.stopConfettiFall();

        const diskDifficult = this.#diskDifficultSelectReference.value

        this.#gameService.startGame(diskDifficult)

        this.#setMinMovesToFinish(this.#gameService.minMovesToFinish);
        this.#updateMovesCount();
        this.#createDisks(diskDifficult);

        this.#soundController.playStarGameSound();

        this.#hintButtonReference.classList.remove('hide');
        this.#canRequestHint = true;
    }

    #requestHint = () => {
        if (!this.#canRequestHint) return;
        const moveCommand = this.#gameService.requestHint();

        if (!moveCommand) return;

        this.#executeMoveCommand(moveCommand);
    };

    #setMinMovesToFinish = (minMovesToFinish) => {
        this.#feedbackMessageReference.innerHTML = `Mínimo de movimentos necessários: <strong class='red'>${minMovesToFinish}</strong>`;
    };

    #createDisks = (diskDifficult) => {
        this.#towerElementList.forEach(tower => tower.innerHTML = '');

        for (let diskValue = diskDifficult; diskValue > 0; diskValue--) {
            setTimeout(() => {
                this.#createDisk(diskValue)
            }, 200 * (diskDifficult - diskValue))
        }

        setTimeout(() => {
            this.#updateInvalidDisks()
        }, 210 * diskDifficult);
    }

    #createDisk = (diskValue) => {
        const diskElement = this.#diskController.createDiskElement(diskValue, this.#firstTowerReference)

        diskElement.addEventListener('mousedown', this.#startDiskMove)

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

        this.#soundController.playDragSound()
    }

    #moveDisk = (event) => {
        const diskTop = event.clientY - this.#draggedDiskReference.offsetHeight / 2;
        const diskLeft = event.clientX - this.#draggedDiskReference.offsetWidth / 2;

        this.#draggedDiskReference.style.top  = `${ diskTop }px`;
        this.#draggedDiskReference.style.left = `${ diskLeft }px`;
    }

    #dropDisk = (event) => {
        document.removeEventListener('mousemove', this.#moveDisk)
        document.removeEventListener('mouseup', this.#dropDisk)

        this.#draggedDiskReference.style.cursor = 'grab';

        const toTowerElement = this.#findTowerInMousePosition(event);
        const moveCommand = new MoveCommandDTO(
            parseInt(this.#draggedDiskReference.dataset.value),
            this.#draggedDiskTowerReference.dataset.name,
            toTowerElement?.dataset?.name,
            false
        )

        if (toTowerElement && this.#gameService.checkMoveCommand(moveCommand)) {
            this.#executeMoveCommand(moveCommand);
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

    #executeMoveCommand = (moveCommand) => {
        const toTowerElement = this.#getTowerByName(moveCommand.toTowerName);
        if (!toTowerElement) return;

        const diskElement = this.#getDiskByValue(moveCommand.diskValue);
        if (!diskElement) return;

        if (moveCommand.isHint) {
            this.#canRequestHint = false;
        }

        this.#animationController.executeMoveDiskToTowerAnimation(diskElement, toTowerElement, () => {
            this.#finishDiskMove(diskElement, toTowerElement);
            this.#canRequestHint = true;

            this.#updateMovesCount();

            if (this.#gameService.isFinished) this.#executeWin();
        })
    }

    #updateMovesCount = () => {
        const moveLabel = this.#gameService.movesCount === 1 ? 'movimento' : 'movimentos';
        const actionLabel = this.#gameService.movesCount === 1 ? 'feito' : 'feitos';

        const message = `<strong class='red'>${this.#gameService.movesCount}</strong> ${moveLabel} ${actionLabel}`;
        this.#currentMovesCounterReference.innerHTML = message;
    };

    #executeWin = () => {
        document.querySelectorAll('.disk').forEach(disk => {
            disk.classList.add('invalid');
        });

        this.#animationController.playConfettiFall();

        const isBestWin = this.#gameService.isWinWithBestSolution()
        this.#soundController.playWinSound(isBestWin);

        if (isBestWin) {
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

        this.#feedbackMessageReference.innerHTML = `Parabéns! Você completou o jogo em <strong class='red'>${ this.#gameService.movesCount }</strong> movimentos!`;
        this.#currentMovesCounterReference.textContent = '';
        this.#canRequestHint = false;
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
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            if (mouseX < towerRect.left) return false
            if (mouseX > towerRect.right) return false
            if (mouseY < towerRect.top) return false
            if (mouseY > towerRect.bottom) return false

            return true
        });
    }

    #getTowerByName = (towerName) => {
        return this.#reference.querySelector(`[data-name='${ towerName }']`);
    }

    #getDiskByValue = (diskValue) => {
        return this.#reference.querySelector(`[data-value='${ diskValue }']`);
    }

}

export {HanoiTowerController}