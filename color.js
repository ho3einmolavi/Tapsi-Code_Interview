function isLightColor(hexColor) {
    // Remove the '#' if present
    hexColor = hexColor.replace(/^#/, '');

    // Convert the hex color to RGB
    const r = parseInt(hexColor.slice(0, 2), 16);
    const g = parseInt(hexColor.slice(2, 4), 16);
    const b = parseInt(hexColor.slice(4, 6), 16);

    // Calculate the relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Check if the color is light or dark
    return luminance > 0.5; // You can adjust the threshold as needed
}

const isRandomColorLight = isLightColor('#90BEDE');

if(isRandomColorLight) {
    console.log('it is light');
} else {
    console.log('it is dark');
}
