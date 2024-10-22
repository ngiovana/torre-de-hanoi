import {HanoiTowerService} from "./HanoiTowerService.js";
import {MoveCommand} from "./MoveCommand.js";

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
    #draggedDisk = null
    #gameService = new HanoiTowerService(this)

    constructor() {
        this.#restartButton.addEventListener('click', this.startGame);
        this.#hintButton.addEventListener('click', this.executeHint);

        this.#towerList.forEach(tower => {
            tower.addEventListener('dragover', this.#dragOver);
            tower.addEventListener('drop', this.#drop);
        });

        this.#diskDifficultSelect.addEventListener('change', this.startGame);

        this.startGame();
    }

    startGame = () => {
        const diskDifficult = this.#diskDifficultSelect.value

        this.#gameService.startGame(diskDifficult)

        this.#setMinMovesToFinish(this.#gameService.minMovesToFinish);
        this.updateMovesCount();
        this.#createDisks(diskDifficult);
        this.#updateTowerDisks();
    }

    executeHint = () => {
        if (this.#gameService.isFinished) return;
        this.#gameService.executeHint();
    }

    executeMoveCommand = (moveCommand) => {
        const toTowerElement = this.#reference.querySelector(`[data-name=${ moveCommand.toTowerName }]`)
        if (!toTowerElement) return;

        const diskElement = this.#reference.querySelector(`[data-value='${ moveCommand.diskValue }']`)
        if (!diskElement) return;

        toTowerElement.appendChild(diskElement);
        this.#updateTowerDisks();
    }

    updateMovesCount = () => {
        const moveLabel = this.#gameService.movesCount === 1 ? 'movimento' : 'movimentos';
        const actionLabel = this.#gameService.movesCount === 1 ? 'feito' : 'feitos';

        const message = `<strong class='red'>${this.#gameService.movesCount}</strong> ${moveLabel} ${actionLabel}`;
        this.#currentMovesCounterReference.innerHTML = message;
    };

    executeWin = () => {
        this.#reference.querySelectorAll('.disk').forEach(disk => {
            disk.draggable = false;
        });

        if (this.#gameService.isWinWithBestSolution()) {
            this.#feedbackMessage.textContent = '😲';
            setTimeout(() => {
                alert('Parabéns! Você completou o jogo com o mínimo de movimentos possíveis!\nImpressionante!');
            }, 100);

            return;
        }

        this.#feedbackMessage.textContent = `Parabéns! Você completou o jogo em ${ this.#gameService.movesCount } movimentos!`;
        this.#currentMovesCounterReference.textContent = '';
    };

    #updateTowerDisks = () => {
        this.#towerList.forEach(tower => {
            const diskList = tower.querySelectorAll(".disk");

            diskList.forEach((disk, index) => {
                disk.classList.add("invalid");

                if (index === (diskList.length - 1)) {
                    disk.classList.remove("invalid");
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
            diskElement.draggable = true;
            diskElement.textContent = counter;
            diskElement.addEventListener('dragstart', this.#dragStart);

            this.#firstTower.appendChild(diskElement);
        }
    }

    #dragStart = (event) => {
        const disk = event.target;
        const tower = disk.parentElement;
        const disksInTower = tower.querySelectorAll('.disk');
        const isTopDisk = disk === disksInTower[disksInTower.length - 1];

        if (isTopDisk) {
            this.#draggedDisk = disk;
        } else {
            event.preventDefault();
        }
    };

    #dragOver = (event) => {
        event.preventDefault();
    };

    #drop = (event) => {
        if (!this.#draggedDisk) return;
        if (!this.#isTowerElement(event.target)) return;

        const toTowerElement = event.target;

        this.#gameService.checkMoveCommand(new MoveCommand(
            parseInt(this.#draggedDisk.dataset.value),
            this.#draggedDisk.parentElement.dataset.name,
            toTowerElement.dataset.name
        ));

        this.#draggedDisk = null;
    };

    #isTowerElement = (element) => {
        return element.classList.contains('tower');
    }

    #isDiskElement = (element) => {
        return element.classList.contains('disk');
    }
}

let screenController = null;

document.addEventListener("DOMContentLoaded", () => {
    screenController = new HanoiTowerController();
})

export {HanoiTowerController, screenController}
