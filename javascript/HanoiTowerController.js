import {HanoiTowerService} from './HanoiTowerService.js';
import {MoveCommand} from './MoveCommand.js';
import {SoundService} from "./SoundService.js";
import {AnimationService} from "./AnimationService.js";
import {DiskService} from "./DiskService.js";

class HanoiTowerController {
    #reference = document.querySelector('.game-page-container');

    #diskDifficultSelect = this.#reference.querySelector('.disk-difficult-select');
    #restartButton = this.#reference.querySelector('.restart-button');
    #hintButton = this.#reference.querySelector('.hint-button');

    #currentMovesCounterReference = this.#reference.querySelector('.current-moves-count');
    #feedbackMessage = this.#reference.querySelector('.minimum-moves-to-finish');

    #firstTower = this.#reference.querySelector('.first-tower');
    #middleTower = this.#reference.querySelector('.middle-tower');
    #lastTower = this.#reference.querySelector('.last-tower');

    #towerList = [this.#firstTower, this.#middleTower, this.#lastTower];

    #draggedDiskTower = null;
    #draggedDisk = null;

    #animationService = new AnimationService();
    #gameService = new HanoiTowerService(this);
    #soundService = new SoundService();
    #diskService = new DiskService();

    constructor() {
        this.#restartButton.addEventListener('click', this.startGame);
        this.#hintButton.addEventListener('click', this.#gameService.executeHint);

        this.#diskDifficultSelect.addEventListener('change', this.startGame);
    }

    startGame = () => {
        this.#restartButton.textContent = "Reiniciar";
        this.#animationService.stopConfettiFall();

        const diskDifficult = this.#diskDifficultSelect.value

        this.#gameService.startGame(diskDifficult)

        this.#setMinMovesToFinish(this.#gameService.minMovesToFinish);
        this.updateMovesCount();
        this.#createDisks(diskDifficult);

        this.#soundService.playStarGameSound();
    }

    executeMoveCommand = (moveCommand) => {
        const toTowerElement = this.#getTowerByName(moveCommand.toTowerName);
        if (!toTowerElement) return;

        const diskElement = this.#getDiskByValue(moveCommand.diskValue);
        if (!diskElement) return;

        this.#animationService.executeMoveDiskToTowerAnimation(
            diskElement,
            this.#getTowerByName(moveCommand.fromTowerName),
            toTowerElement,
            (!moveCommand.isHint),
            () => {
                this.#diskService.setDiskStaticState(diskElement)

                toTowerElement.appendChild(diskElement);
                this.#soundService.playMoveSound();
                this.#updateTowerDisks();

                this.#draggedDisk = null;
                this.#draggedDiskTower = null;
            }
        )
    }

    updateMovesCount = () => {
        const moveLabel = this.#gameService.movesCount === 1 ? 'movimento' : 'movimentos';
        const actionLabel = this.#gameService.movesCount === 1 ? 'feito' : 'feitos';

        const message = `<strong class='red'>${this.#gameService.movesCount}</strong> ${moveLabel} ${actionLabel}`;
        this.#currentMovesCounterReference.innerHTML = message;
    };

    executeWin = () => {
        document.querySelectorAll('.disk').forEach(disk => {
            disk.classList.add('invalid');
        });

        this.#animationService.playConfettiFall();

        const isBestWin = this.#gameService.isWinWithBestSolution()
        this.#soundService.playWinSound(isBestWin);

        if (isBestWin) {
            this.#feedbackMessage.textContent = '😲';

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

        this.#feedbackMessage.innerHTML = `Parabéns! Você completou o jogo em <strong class='red'>${ this.#gameService.movesCount }</strong> movimentos!`;
        this.#currentMovesCounterReference.textContent = '';
    };

    #updateTowerDisks = () => {
        this.#towerList.forEach(tower => {
            const diskList = tower.querySelectorAll('.disk');

            diskList.forEach((disk, index) => {
                disk.classList.add('invalid');
            })

            if (!this.#gameService.isFinished && diskList.length) {
                diskList[diskList.length - 1].classList.remove('invalid');
            }
        })
    };

    #setMinMovesToFinish = (minMovesToFinish) => {
        this.#feedbackMessage.innerHTML = `Mínimo de movimentos necessários: <strong class='red'>${minMovesToFinish}</strong>`;
    };

    #createDisks = (diskDifficult) => {
        this.#towerList.forEach(tower => tower.innerHTML = '');

        for (let diskValue = diskDifficult; diskValue > 0; diskValue--) {
            setTimeout(() => {
                this.#createDisk(diskValue)
            }, 200 * (diskDifficult - diskValue))
        }

        setTimeout(() => {
            this.#updateTowerDisks()
        }, 2000);
    }

    #createDisk = (diskValue) => {
        const diskElement = this.#diskService.createDiskElement(diskValue, this.#firstTower)

        diskElement.addEventListener('mousedown', this.#startDiskMove)

        document.body.appendChild(diskElement);

        this.#animationService.executeDiskFallAnimation(diskElement, () => {
            this.#diskService.setDiskStaticState(diskElement)

            this.#soundService.playDragSound();
            this.#firstTower.appendChild(diskElement);
        })
    }

    #startDiskMove = (event) => {
        if (this.#draggedDisk) return;

        const diskElement = event.target;
        if (diskElement.classList.contains('invalid')) {
            this.#soundService.playInvalidMoveSound();
            return;
        }

        this.#draggedDisk = diskElement;
        this.#draggedDiskTower = diskElement.parentElement;

        this.#reference.appendChild(diskElement);

        this.#diskService.setDiskDraggingState(diskElement)
        this.#diskService.setDraggingDiskPosition(diskElement, event)

        document.addEventListener('mousemove', this.#moveDisk);
        document.addEventListener('mouseup', this.#dropDisk);

        this.#soundService.playDragSound()
    }

    #moveDisk = (event) => {
        const top = event.clientY - this.#draggedDisk.offsetHeight / 2;
        const left = event.clientX - this.#draggedDisk.offsetWidth / 2;

        this.#draggedDisk.style.top  = `${ top }px`;
        this.#draggedDisk.style.left = `${ left }px`;
    }

    #dropDisk = (event) => {
        document.removeEventListener('mousemove', this.#moveDisk)
        document.removeEventListener('mouseup', this.#dropDisk)

        this.#draggedDisk.style.cursor = 'grab';

        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const toTower = this.#towerList.find((tower) => {
            const rect = tower.getBoundingClientRect();

            return (
                mouseX >= rect.left &&
                mouseX <= rect.right &&
                mouseY >= rect.top &&
                mouseY <= rect.bottom
            );
        });

        const moveCommand = new MoveCommand(
            parseInt(this.#draggedDisk.dataset.value),
            this.#draggedDiskTower.dataset.name,
            toTower?.dataset?.name,
            false
        )

        if (!toTower || !this.#gameService.checkMoveCommand(moveCommand)) {
            this.#animationService.executeMoveDiskToTowerAnimation(
                this.#draggedDisk,
                this.#draggedDiskTower,
                this.#draggedDiskTower,
                true,
                () => {
                    this.#diskService.setDiskStaticState(this.#draggedDisk)

                    this.#draggedDiskTower.appendChild(this.#draggedDisk);
                    this.#soundService.playMoveSound();

                    this.#draggedDisk = null;
                    this.#draggedDiskTower = null;
                }
            )
        }
    }

    #getTowerByName = (towerName) => {
        return this.#reference.querySelector(`[data-name='${ towerName }']`);
    }

    #getDiskByValue = (diskValue) => {
        return this.#reference.querySelector(`[data-value='${ diskValue }']`);
    }

}

let screenController = null;

document.addEventListener('DOMContentLoaded', () => {
    screenController = new HanoiTowerController();
})

export {HanoiTowerController, screenController}
