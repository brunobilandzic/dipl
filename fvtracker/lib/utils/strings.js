export function makeUrlFriendly(str) {
    str = str
        .replace(/č/g, 'c')
        .replace(/ć/g, 'c')
        .replace(/đ/g, 'd')
        .replace(/š/g, 's')
        .replace(/ž/g, 'z');
        
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export const alphanumericOnly = (str) => str.replace(/[^a-zA-Z0-9]/g, '');

export const sanitize = (str) => {
    console.log("Sanitizing string:", str);
    return alphanumericOnly(str.toLowerCase());
}

export const dimensionsString = ({width, length}) => `${width}x${length}`;

export const testCoordinates = (coordinates) => return `\`