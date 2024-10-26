class AnimationService {

    #colors = ['#ff4757', '#1e90ff', '#2ed573', '#ff6348', '#ffa502', '#2f3542'];

    #maxConfettiNumber = 100;

    #documentStyle

    constructor() {
        const style  = document.createElement('style');
        document.head.appendChild(style);

        this.#documentStyle = style.sheet;
    }

    playConfettiFall = () => {
        for (let counter = 0; counter < this.#maxConfettiNumber; counter++) {
            const confetti = document.createElement('div');

            const size = `${Math.random() * 6 + 4}px`;
            const color = this.#colors[Math.floor(Math.random() * this.#colors.length)];
            const top = `${Math.random() * -300}px`;
            const left = `${Math.random() * 100}vw`;
            const animationDuration = `${Math.random() * 3 + 2}s`;

            confetti.classList.add('confetti');
            confetti.style.top = top;
            confetti.style.left = left;
            confetti.style.animationDuration = animationDuration;
            confetti.style.backgroundColor = color;
            confetti.style.width = size;
            confetti.style.height = size;

            document.body.appendChild(confetti);
        }
    }

    stopConfettiFall = () => {
        document.querySelectorAll('.confetti').forEach(confetti => {
            confetti.remove();
        });
    }

    executeMoveDiskToTowerAnimation = (disk, fromTower, toTower, callback) => {
        const diskValue = disk.dataset.value;
        const ruleIndex = this.#documentStyle.cssRules.length;
        const animationName = `disk-${diskValue}-move-animation-${ruleIndex}`

        const keyframes = this.#createDiskToTowerAnimation(disk, toTower, animationName);
        this.#documentStyle.insertRule(keyframes, ruleIndex);

        disk.style.animation = '';
        disk.style.animation = `${ animationName } .5s forwards`;

        setTimeout(() => {
            disk.style.animation = '';
            this.#documentStyle.deleteRule(ruleIndex);

            if (callback) callback();
        }, 500);
    }

    #createDiskToTowerAnimation = (disk, toTower, animationName) => {
        const towerRect = toTower.getBoundingClientRect();
        const diskRect = disk.getBoundingClientRect();

        const towerTop = towerRect.top - disk.offsetHeight;
        const towerMiddle = towerRect.left + toTower.offsetWidth / 2;

        const topTowerOffset = 20;
        const diskYOffsetToTowerTop = towerTop - diskRect.top - topTowerOffset;
        const diskXOffsetToTowerMiddle = towerMiddle - (diskRect.left + disk.offsetWidth / 2);

        const towerDisksCount = toTower.querySelectorAll('.disk').length;
        const disksHeightOffset = disk.offsetHeight * towerDisksCount;
        const towerBaseHeight = 24;
        const finalDiskTop = towerRect.bottom - disksHeightOffset - towerBaseHeight;

        const diskYOffsetToDiskTop = finalDiskTop - diskRect.bottom;

        return `
            @keyframes ${ animationName } {
                50% { transform: translateY(${diskYOffsetToTowerTop}px) translateX(${diskXOffsetToTowerMiddle}px); }
                100% { transform: translateY(${diskYOffsetToDiskTop}px) translateX(${diskXOffsetToTowerMiddle}px); }
            }
        `;

    }
}

export {AnimationService}
