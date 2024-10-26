import {HanoiTowerService} from './HanoiTowerService.js';
import {MoveCommand} from './MoveCommand.js';
import {SoundService} from "./SoundService.js";
import {AnimationService} from "./AnimationService.js";

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

    constructor() {
        this.#restartButton.addEventListener('click', this.startGame);
        this.#hintButton.addEventListener('click', this.#gameService.executeHint);

        this.#diskDifficultSelect.addEventListener('change', this.startGame);

        this.startGame();
    }

    startGame = () => {
        this.#animationService.stopConfettiFall();

        const diskDifficult = this.#diskDifficultSelect.value

        this.#gameService.startGame(diskDifficult)

        this.#setMinMovesToFinish(this.#gameService.minMovesToFinish);
        this.updateMovesCount();
        this.#createDisks(diskDifficult);
        this.#updateTowerDisks();

        this.#soundService.playStarGameSound();
    }

    executeMoveCommand = (moveCommand) => {
        const toTowerElement = this.#reference.querySelector(`[data-name=${ moveCommand.toTowerName }]`)
        if (!toTowerElement) return;

        const diskElement = this.#reference.querySelector(`[data-value='${ moveCommand.diskValue }']`)
        if (!diskElement) return;

        toTowerElement.appendChild(diskElement);

        this.#soundService.playMoveSound();

        this.#updateTowerDisks();
    }

    updateMovesCount = () => {
        const moveLabel = this.#gameService.movesCount === 1 ? 'movimento' : 'movimentos';
        const actionLabel = this.#gameService.movesCount === 1 ? 'feito' : 'feitos';

        const message = `<strong class='red'>${this.#gameService.movesCount}</strong> ${moveLabel} ${actionLabel}`;
        this.#currentMovesCounterReference.innerHTML = message;
    };

    executeWin = () => {
        this.#animationService.playConfettiFall();

        this.#reference.querySelectorAll('.disk').forEach(disk => {
            disk.classList.add('invalid');
        });

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

                if (index === (diskList.length - 1)) {
                    disk.classList.remove('invalid');
                }
            })
        })
    };

    #setMinMovesToFinish = (minMovesToFinish) => {
        this.#feedbackMessage.innerHTML = `Mínimo de movimentos necessários: <strong class='red'>${minMovesToFinish}</strong>`;
    };

    #createDisks = (diskDifficult) => {
        this.#towerList.forEach(tower => tower.innerHTML = '');

        for (let counter = diskDifficult; counter > 0; counter--) {
            const diskElement = document.createElement('div');

            diskElement.classList.add('disk');
            diskElement.id = `disk${counter}`;
            diskElement.setAttribute('data-value', counter);
            diskElement.textContent = counter;
            diskElement.style.transition = '.2s ease-in-out';

            diskElement.addEventListener('mousedown', this.#startDiskMove)

            this.#firstTower.appendChild(diskElement);
        }
    }

    #startDiskMove = (event) => {
        const diskElement = event.target;
        if (diskElement.classList.contains('invalid')) {
            this.#soundService.playInvalidMoveSound();
            return;
        }

        this.#draggedDisk = diskElement;
        this.#draggedDiskTower = diskElement.parentElement;

        this.#reference.appendChild(diskElement);

        const top = event.clientY - this.#draggedDisk.offsetHeight / 2;
        const left = event.clientX - this.#draggedDisk.offsetWidth / 2;

        diskElement.style.cursor = 'grabbing';
        diskElement.style.position = 'absolute';
        diskElement.style.top  = `${ top }px`;
        diskElement.style.left = `${ left }px`;
        diskElement.style.transition = '';

        document.addEventListener('mousemove', this.#moveDisk);
        document.addEventListener('mouseup', this.#releaseDisk);

        this.#soundService.playDragSound()
    }

    #moveDisk = (event) => {
        const top = event.clientY - this.#draggedDisk.offsetHeight / 2;
        const left = event.clientX - this.#draggedDisk.offsetWidth / 2;

        this.#draggedDisk.style.top  = `${ top }px`;
        this.#draggedDisk.style.left = `${ left }px`;
    }

    #releaseDisk = (event) => {
        document.removeEventListener('mousemove', this.#moveDisk)
        document.removeEventListener('mouseup', this.#releaseDisk)

        this.#draggedDisk.style.transition = '.2s ease-in-out';
        this.#draggedDisk.style.cursor = 'grab';
        this.#draggedDisk.style.position = 'relative';
        this.#draggedDisk.style.top = '';
        this.#draggedDisk.style.left = '';

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

        const command = new MoveCommand(
            parseInt(this.#draggedDisk.dataset.value),
            this.#draggedDiskTower.dataset.name,
            toTower?.dataset?.name
        )

        if (!toTower || !this.#gameService.checkMoveCommand(command)) {
            this.#draggedDiskTower.appendChild(this.#draggedDisk);
            this.#soundService.playMoveSound();
        }

        this.#draggedDisk = null;
        this.#draggedDiskTower = null;
    }

}

let screenController = null;

document.addEventListener('DOMContentLoaded', () => {
    screenController = new HanoiTowerController();
})

export {HanoiTowerController, screenController}
