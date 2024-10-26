class DiskStyleService {

    setDiskStaticState = (disk) => {
        disk.style.transition = '.2s ease-in-out';
        disk.style.cursor = 'grab';
        disk.style.position = 'relative';
        disk.style.top = '';
        disk.style.left = '';
    }

}

export {DiskStyleService}
