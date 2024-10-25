import {MoveCommand} from "./MoveCommand.js";
import { TowerName } from "./TowerName.js";
import { HanoiTowerService } from "./HanoiTowerService.js";

class HanoiTowerSolver {

    /**
     * @type {Array<MoveCommand>}
     */
    #solutionMoves = [];
    towers = [];
    moveTracker = [];
    needStop = false;

    constructor(diskDifficult, firstTowerName, middleTowerName, lastTowerName) {
        this.#buildSolutionMoves(diskDifficult, firstTowerName, lastTowerName, middleTowerName);
        this.determineNextMove(this.towers, 3, 0, 2, 1);
    }

    hasMoveCommands = () => {
        return this.#solutionMoves.length > 0;
    }

    getNextMoveCommand = () => {
        return this.#solutionMoves.shift();
    }

    #buildSolutionMoves = (diskValue, fromTower, toTower, swapTower) => {
        if (diskValue === 0 || true) return;

        this.#buildSolutionMoves(diskValue - 1, fromTower, swapTower, toTower);

        this.#solutionMoves.push(new MoveCommand(
            diskValue,
            fromTower,
            toTower
        ));

        this.#buildSolutionMoves(diskValue - 1, swapTower, toTower, fromTower);
    }

    canMove = (towers, from, to) => {
        const fromTopDisk = towers[from][towers[from].length - 1];
        const toTopDisk = towers[to][towers[to].length - 1];
    
        // Se a torre de destino estiver vazia ou o disco no topo da torre de destino for maior
        return !toTopDisk || (fromTopDisk && fromTopDisk.value < toTopDisk.value);
    }
    
    // Função para realizar um movimento e atualizar o estado
    moveDisk = (towers, from, to) => {
        const disk = towers[from].pop(); // Remove o disco da torre de origem
        towers[to].push(disk); // Coloca o disco na torre de destino
        console.log(`Move disk ${disk.value} from tower ${from} to tower ${to}`);
    
        // Adiciona o movimento ao solutionMoves (caso precise armazenar os movimentos)
        this.#solutionMoves.push({
            diskValue: disk.value,
            fromTower: from,
            toTower: to
        });
    }
    
    // Função para determinar o próximo movimento com base na posição atual das torres
    determineNextMove = (towers, n, from, to, aux) => {
        if (n === 0) return;
    
        // Verifica onde o maior disco (n) está atualmente
        let currentFrom = null;
        for (let i = 0; i < towers.length; i++) {
            if (towers[i].forEach(element => {
                currentFrom = element.value === n ? i : currentFrom
            }));
        }
    
        if (currentFrom === null) {
            console.log(`Disk ${n} not found!`);
            return;
        }
    
        // Se o maior disco já estiver na torre correta, movemos os menores
        if (currentFrom === to) {
            this.determineNextMove(towers, n - 1, from, to, aux);
            return;
        }
    
        // Caso contrário, precisamos mover os discos menores para liberar o disco maior
        this.determineNextMove(towers, n - 1, currentFrom, aux, to);
    
        // Mover o maior disco para a torre de destino
        if (this.canMove(towers, currentFrom, to)) {
            this.moveDisk(towers, currentFrom, to);
        }
    
        // Mover os discos menores para a torre de destino
        this.determineNextMove(towers, n - 1, aux, to, from);
    }

    // Estado inicial das torres (revisado)
    towers = [
        [  ],  // Torre A (origem)
        [ {value: 2}, {value: 1} ],              // Torre B (auxiliar)
        [ {value: 3} ]   // Torre C (destino)
    ];

    validateMoveCommand = ( fromTower, toTower) => {
        const disk = this.towers[fromTower][this.towers[fromTower].length - 1];

        if (fromTower === toTower) return false;

        const currentTopDisk = this.towers[toTower][this.towers[toTower].length - 1];
        if (!currentTopDisk) return true;

        return currentTopDisk.value > disk.value;
    }

    setTowers = (towers) => {
        this.towers = JSON.parse(JSON.stringify(towers));
    }

    buildNextSolutionMove = (towers, n, fromTower, toTower, auxTower) => {
        if (n === 0) return;

        if (towers[toTower][n - 1] && towers[toTower][n - 1].value === n) {
            this.buildNextSolutionMove(towers, n - 1, fromTower, toTower, auxTower);
            return;
        }

        this.buildNextSolutionMove(towers, n - 1, fromTower, auxTower, toTower);

        const diskToMove = towers[fromTower][towers[fromTower].length - 1];

        if (!diskToMove) return;

        if (this.hasMoveCommands()) return;

        const moveCommand = new MoveCommand(diskToMove.value, Object.values(TowerName)[fromTower], Object.values(TowerName)[toTower]);
        if (this.validateMoveCommand(fromTower, toTower)) {
            this.#solutionMoves.push(moveCommand);
        }

        towers[toTower].push(towers[fromTower].pop());

        // if (this.#solutionMoves.length === 1) {
        //     const moveCommand = this.#solutionMoves.shift();
        //     if (new HanoiTowerService().validateMoveCommand(moveCommand)) {
        //         this.#solutionMoves.push(moveCommand);
        //     } else {
        //         this.buildNextSolutionMove(towers, n, auxTower, toTower, fromTower);
        //     }
        // }

        this.buildNextSolutionMove(towers, n - 1, auxTower, toTower, fromTower);
    }
}

export {HanoiTowerSolver}