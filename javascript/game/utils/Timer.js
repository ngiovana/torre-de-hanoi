class Timer {

    #intervalId
    #seconds

    constructor() {
        this.#seconds = 0;
        this.resume();
    }

    stop = () => {
        if (!this.#intervalId) return;

        clearInterval(this.#intervalId);
        this.#intervalId = null;
    }

    resume = () => {
        if (this.#intervalId) return;

        this.#intervalId = setInterval(() => {
            this.#seconds++;
        }, 1000);
    }

    getSeconds = () => {
        return this.#seconds;
    }

}

export {Timer}