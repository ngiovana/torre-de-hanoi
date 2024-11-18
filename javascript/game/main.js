import {HanoiTowerController} from "./controller/HanoiTowerController.js";
import {HanoiTowerService} from "./service/HanoiTowerService.js";

document.addEventListener('DOMContentLoaded', () => {
    const gameService = new HanoiTowerService()
    new HanoiTowerController(gameService);
})
