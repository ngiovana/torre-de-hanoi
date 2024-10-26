class AnimationService {

    #colors = ['#ff4757', '#1e90ff', '#2ed573', '#ff6348', '#ffa502', '#2f3542'];

    #maxConfettiNumber = 100;

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

}

export {AnimationService}
