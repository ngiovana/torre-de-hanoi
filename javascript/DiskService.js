class DiskService {

    static DISK_HEIGHT = 40;
    static CALCULATE_DISK_WIDTH = (diskValue) => 50 + 30 * diskValue;

    createDiskElement = (diskValue, towerElement) => {
        const diskElement = document.createElement('div');
        const diskWidth = DiskService.CALCULATE_DISK_WIDTH(diskValue);

        diskElement.setAttribute('data-value', diskValue);
        diskElement.classList.add(`disk`);
        diskElement.classList.add(`disk-${ diskValue }`);
        diskElement.classList.add('invalid');
        diskElement.textContent = diskValue;
        diskElement.style.position = 'absolute';
        diskElement.style.width = `${ diskWidth }px`;
        diskElement.style.height = `${ DiskService.DISK_HEIGHT }px`;

        const towerRect = towerElement.getBoundingClientRect()
        const towerMiddle = towerRect.left + towerElement.offsetWidth / 2;
        const diskMiddle = towerMiddle - (diskWidth / 2);
        const diskTopOffset = 100;
        const diskTop = -(diskTopOffset + DiskService.DISK_HEIGHT * diskValue);

        diskElement.style.left = `${ diskMiddle }px`;
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
        const top = event.clientY - diskElement.offsetHeight / 2;
        const left = event.clientX - diskElement.offsetWidth / 2;

        diskElement.style.top  = `${ top }px`;
        diskElement.style.left = `${ left }px`;
    }

}

export {DiskService}
