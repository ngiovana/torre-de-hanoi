class AnimationController {

    #documentStyle

    constructor() {
        const style  = document.createElement('style');
        document.head.appendChild(style);

        this.#documentStyle = style.sheet;
    }

    playConfettiFall = () => {
        const confettiColors = ['#ff4757', '#1e90ff', '#2ed573', '#ff6348', '#ffa502', '#2f3542'];
        const maxConfettiQuantity = 100;

        for (let counter = 0; counter < maxConfettiQuantity; counter++) {
            const confetti = document.createElement('div');

            const size = `${Math.random() * 6 + 4}px`;
            const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
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
        document.querySelectorAll('.confetti').forEach(confettiElement => {
            confettiElement.remove();
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

    executeMoveDiskToTowerAnimation = (diskElement, toTowerElement, callback) => {
        const diskNumber = diskElement.dataset.number;
        const cssRuleIndex = this.#documentStyle.cssRules.length;
        const animationName = `disk-${diskNumber}-move-animation-${cssRuleIndex}`

        const animationRule = this.#createDiskToTowerAnimation(diskElement, toTowerElement, animationName);
        this.#documentStyle.insertRule(animationRule, cssRuleIndex);

        diskElement.style.animation = '';
        diskElement.style.animation = `${ animationName } .5s forwards`;

        setTimeout(() => {
            diskElement.style.animation = '';
            this.#documentStyle.deleteRule(cssRuleIndex);

            if (callback) callback();
        }, 500);
    }

    #createDiskToTowerAnimation = (diskElement, toTowerElement, animationName) => {
        const towerRect = toTowerElement.getBoundingClientRect();
        const diskRect = diskElement.getBoundingClientRect();

        const towerTop = towerRect.top - diskElement.offsetHeight;
        const towerXCenter = towerRect.left + toTowerElement.offsetWidth / 2;

        const topTowerOffset = 20;
        const diskYOffsetToTowerTop = towerTop - diskRect.top - topTowerOffset;
        const diskXOffsetToTowerMiddle = towerXCenter - (diskRect.left + diskElement.offsetWidth / 2);

        const towerDisksCount = toTowerElement.querySelectorAll('.disk').length;
        const diskStackHeight = diskElement.offsetHeight * towerDisksCount;
        const towerBaseHeight = 24;
        const finalDiskTop = towerRect.bottom - diskStackHeight - towerBaseHeight;

        const diskYOffsetToDiskStackTop = finalDiskTop - diskRect.bottom;

        return `
            @keyframes ${ animationName } {
                 50% { transform: translateY(${ diskYOffsetToTowerTop }px)     translateX(${ diskXOffsetToTowerMiddle }px); }
                100% { transform: translateY(${ diskYOffsetToDiskStackTop }px) translateX(${ diskXOffsetToTowerMiddle }px); }
            }
        `;
    }
}

export {AnimationController}
