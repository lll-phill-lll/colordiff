
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

function isValidHex(hex) {
    return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(hex);
}

function euclideanDistance(basecolor, color1) {
    const rDiff = basecolor[0] - color1[0];
    const gDiff = basecolor[1] - color1[1];
    const bDiff = basecolor[2] - color1[2];
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

function euclideanDistanceWeighted(basecolor, color1) {
    const rDiff = basecolor[0] - color1[0];
    const gDiff = basecolor[1] - color1[1];
    const bDiff = basecolor[2] - color1[2];
    return Math.sqrt(0.3 * rDiff * rDiff + 0.59 * gDiff * gDiff + 0.11 * bDiff * bDiff);
}

function formatHex(hex) {
    hex = hex.replace(/^#/, '');
    return '#' + hex.padStart(6, 'f');
}

function getContrastYIQ(hexcolor){
    hexcolor = hexcolor.replace(/^#/, '');
    if (hexcolor.length === 3) {
        hexcolor = hexcolor.split('').map(char => char + char).join('');
    }
    const r = parseInt(hexcolor.substr(0,2),16);
    const g = parseInt(hexcolor.substr(2,2),16);
    const b = parseInt(hexcolor.substr(4,2),16);
    const yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
}

function updateColors() {
    const basecolor = formatHex(document.getElementById('basecolor').value);
    const color1 = formatHex(document.getElementById('color1').value);
    const color2 = formatHex(document.getElementById('color2').value);

    if (isValidHex(basecolor)) {
        document.getElementById('basecolor').style.backgroundColor = basecolor;
        document.getElementById('basecolor').style.color = getContrastYIQ(basecolor);
    } else {
        document.getElementById('basecolor').style.backgroundColor = '#fff';
        document.getElementById('basecolor').style.color = 'black';
    }
    if (isValidHex(color1)) {
        document.getElementById('color1').style.backgroundColor = color1;
        document.getElementById('color1').style.color = getContrastYIQ(color1);
    } else {
        document.getElementById('color1').style.backgroundColor = '#fff';
        document.getElementById('color1').style.color = 'black';
    }
    if (isValidHex(color2)) {
        document.getElementById('color2').style.backgroundColor = color2;
        document.getElementById('color2').style.color = getContrastYIQ(color2);
    } else {
        document.getElementById('color2').style.backgroundColor = '#fff';
        document.getElementById('color2').style.color = 'black';
    }

    if (isValidHex(basecolor) && isValidHex(color1) && isValidHex(color2)) {
        const rgbColor1 = hexToRgb(basecolor);
        const rgbColor2 = hexToRgb(color1);
        const rgbColor3 = hexToRgb(color2);

        const eucliddistance1to2 = euclideanDistance(rgbColor1, rgbColor2);
        const eucliddistance1to3 = euclideanDistance(rgbColor1, rgbColor3);

        document.getElementById('resultEuclid').innerText = `Euclidian base->1: ${eucliddistance1to2.toFixed(2)}\nEuclidian base->2: ${eucliddistance1to3.toFixed(2)}`;

        const eucliddistance1to2weighted = euclideanDistanceWeighted(rgbColor1, rgbColor2);
        const eucliddistance1to3weighted = euclideanDistanceWeighted(rgbColor1, rgbColor3);
        document.getElementById('resultWeightedEuclid').innerText = `Weighted euclidian base->1: ${eucliddistance1to2weighted.toFixed(2)}\nWeighted euclidian base->2: ${eucliddistance1to3weighted.toFixed(2)}`;

        document.getElementById('box1').style.backgroundColor = basecolor;
        document.getElementById('box1').style.color = getContrastYIQ(basecolor);
        document.getElementById('box2').style.backgroundColor = color1;
        document.getElementById('box2').style.color = getContrastYIQ(color1);
        document.getElementById('box3').style.backgroundColor = basecolor;
        document.getElementById('box3').style.color = getContrastYIQ(basecolor);
        document.getElementById('box4').style.backgroundColor = color2;
        document.getElementById('box4').style.color = getContrastYIQ(color2);
    } else {
        document.getElementById('result').innerText = '';
        document.getElementById('box1').style.backgroundColor = '#fff';
        document.getElementById('box1').style.color = 'black';
        document.getElementById('box2').style.backgroundColor = '#fff';
        document.getElementById('box2').style.color = 'black';
        document.getElementById('box3').style.backgroundColor = '#fff';
        document.getElementById('box3').style.color = 'black';
        document.getElementById('box4').style.backgroundColor = '#fff';
        document.getElementById('box4').style.color = 'black';
    }
}

function setPresetColors(basecolor, color1, color2) {
    document.getElementById('basecolor').value = basecolor;
    document.getElementById('color1').value = color1;
    document.getElementById('color2').value = color2;
    updateColors();
}

function getRandomColor() {
    return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

function setRandomColors() {
    document.getElementById('basecolor').value = getRandomColor();
    document.getElementById('color1').value = getRandomColor();
    document.getElementById('color2').value = getRandomColor();
    updateColors();
}

document.getElementById('colorForm').addEventListener('input', updateColors);

