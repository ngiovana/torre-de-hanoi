class Utils {

    static UUID_PATTERN = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

    static generateUUID = () => {
        const hexadecimalValue = 16;

        return Utils.UUID_PATTERN.replace(/[xy]/g, function(letter) {
            const randomNumber = Math.random() * hexadecimalValue | 0;
            const positionValue = letter === 'x' ? randomNumber : (randomNumber & 0x3 | 0x8);
            return positionValue.toString(hexadecimalValue);
        });
    }

}

export {Utils}