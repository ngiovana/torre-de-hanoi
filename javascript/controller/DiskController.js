class DiskController {

    static DISK_HEIGHT = () => {
        if (DiskController.isPortraitMobile()) {
            return 25;
        }

        if (DiskController.isLandscapeMobile()) {
            return 28
        }

        return 40;
    };

    static CALCULATE_DISK_WIDTH = (diskNumber) => {
        if (DiskController.isPortraitMobile()) {
            return 5 + 3 * diskNumber
        }

        return 2 + 2.2 * diskNumber
    };

    static isPortraitMobile = () => {
        return window.innerWidth <= 767;
    }

    static isLandscapeMobile = () => {
        return window.innerHeight <= 560;
    }

    createDiskElement = (diskNumber, towerElement) => {
        const diskElement = document.createElement('div');
        const diskWidth = DiskController.CALCULATE_DISK_WIDTH(diskNumber);

        const sizeMetrics = DiskController.isPortraitMobile() || DiskController.isLandscapeMobile
            ? "vw" : "px"

        diskElement.setAttribute('data-number', diskNumber);
        diskElement.classList.add(`disk`);
        diskElement.classList.add(`disk-${ diskNumber }`);
        diskElement.classList.add('invalid');
        diskElement.textContent = diskNumber;
        diskElement.style.position = 'absolute';
        diskElement.style.width = `${ diskWidth }${ sizeMetrics }`;
        diskElement.style.height = `${ DiskController.DISK_HEIGHT() }px`;

        const towerRect = towerElement.getBoundingClientRect()
        const towerXCenter = towerRect.left + towerElement.offsetWidth / 2;
        const diskLeft = towerXCenter - (diskWidth / 2);

        const diskTopOffset = 100;
        const diskTop = -(diskTopOffset + DiskController.DISK_HEIGHT() * diskNumber);

        diskElement.style.left = `${ diskLeft }px`;
        diskElement.style.top = `${ diskTop }px`;

        return diskElement;
    }

    setDiskStaticState = (diskElement) => {
        diskElement.style.transition = '.2s ease-in-out';
        diskElement.style.cursor = 'grab';
        diskElement.style.position = 'relative';
        diskElement.style.top = '';
        diskElement.style.left = '';
    }

    setDiskDraggingState = (diskElement) => {
        diskElement.style.cursor = 'grabbing';
        diskElement.style.position = 'absolute';
        diskElement.style.transition = '';
    }

    setDraggingDiskPosition = (diskElement, event) => {
        const diskTop = (event.clientY || event.touches[0].clientY) - diskElement.offsetHeight / 2;
        const diskLeft = (event.clientX || event.touches[0].clientX) - diskElement.offsetWidth / 2;

        diskElement.style.top  = `${ diskTop }px`;
        diskElement.style.left = `${ diskLeft }px`;
    }

}

export {DiskController}
