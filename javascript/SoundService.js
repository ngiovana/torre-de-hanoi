class SoundService {

    playStarGameSound = () => {
        const audio = new Audio(`assets/audios/start.wav`);
        audio.play();
    }

    playInvalidMoveSound = () => {
        const audio = new Audio(`assets/audios/invalid.wav`);
        audio.play();
    }

    playDragSound = () => {
        const audio = new Audio(`assets/audios/drag.wav`);
        audio.play();
    }

    playMoveSound = () => {
        const audioNumber = Math.floor(Math.random() * 3) + 1;
        const audio = new Audio(`assets/audios/move${ audioNumber }.wav`);

        audio.play();
    }

    playWinSound = (isBestWin) => {
        if (isBestWin) {
            const bestWinAudio = new Audio(`assets/audios/best-win.mp3`);
            bestWinAudio.volume = .09;
            bestWinAudio.play();
        }

        const winAudio = new Audio(`assets/audios/win.mp3`);
        winAudio.volume = .09;
        winAudio.play();
    }

}

export {SoundService}
