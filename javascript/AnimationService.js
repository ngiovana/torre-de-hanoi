class AnimationService {

    #colors = ['#ff4757', '#1e90ff', '#2ed573', '#ff6348', '#ffa502', '#2f3542'];

    #maxConfettiNumber = 100;

    #documentStyle
    #animationQueue = []

    constructor() {
        const style  = document.createElement('style');
        document.head.appendChild(style);

        this.#documentStyle = style.sheet;

        this.#consumeAnimationQueue();
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

    executeDiskFallAnimation = (diskElement, callback) => {
        const diskFallAnimationName = 'disk-fall';

        diskElement.style.animation = `${diskFallAnimationName} .2s ease-in`;

        setTimeout(() => {
            diskElement.style.animation = '';
            callback()
        }, 200)
    }

    executeMoveDiskToTowerAnimation = (diskElement, fromTowerElement, toTowerElement, bypassQueue, callback) => {
        const animation = () => {
            const diskValue = diskElement.dataset.value;
            const ruleIndex = this.#documentStyle.cssRules.length;
            const animationName = `disk-${diskValue}-move-animation-${ruleIndex}`

            const keyframes = this.#createDiskToTowerAnimation(diskElement, toTowerElement, animationName);
            this.#documentStyle.insertRule(keyframes, ruleIndex);

            diskElement.style.animation = '';
            diskElement.style.animation = `${ animationName } .5s forwards`;

            setTimeout(() => {
                diskElement.style.animation = '';
                this.#documentStyle.deleteRule(ruleIndex);

                if (callback) callback();
            }, 500);
        }

        bypassQueue ? animation() : this.#animationQueue.push(animation);
    }

    #createDiskToTowerAnimation = (diskElement, toTowerElement, animationName) => {
        const towerRect = toTowerElement.getBoundingClientRect();
        const diskRect = diskElement.getBoundingClientRect();

        const towerTop = towerRect.top - diskElement.offsetHeight;
        const towerMiddle = towerRect.left + toTowerElement.offsetWidth / 2;

        const topTowerOffset = 20;
        const diskYOffsetToTowerTop = towerTop - diskRect.top - topTowerOffset;
        const diskXOffsetToTowerMiddle = towerMiddle - (diskRect.left + diskElement.offsetWidth / 2);

        const towerDisksCount = toTowerElement.querySelectorAll('.disk').length;
        const disksHeightOffset = diskElement.offsetHeight * towerDisksCount;
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

    #consumeAnimationQueue = () => {
        this.#executeNextAnimation();

        setTimeout(() => {
            this.#consumeAnimationQueue();
        }, 510);
    }

    #executeNextAnimation = () => {
        if (!this.#animationQueue.length) return;
        const animation = this.#animationQueue.shift();
        animation();
    }
}

export {AnimationService}
