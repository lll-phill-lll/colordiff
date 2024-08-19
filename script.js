
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

function euclideanDistance(color1, color2) {
    const rDiff = color1[0] - color2[0];
    const gDiff = color1[1] - color2[1];
    const bDiff = color1[2] - color2[2];
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

function formatHex(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    return '#' + hex.padStart(6, '0');
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
    const color1 = formatHex(document.getElementById('color1').value);
    const color2 = formatHex(document.getElementById('color2').value);
    const color3 = formatHex(document.getElementById('color3').value);

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
    if (isValidHex(color3)) {
        document.getElementById('color3').style.backgroundColor = color3;
        document.getElementById('color3').style.color = getContrastYIQ(color3);
    } else {
        document.getElementById('color3').style.backgroundColor = '#fff';
        document.getElementById('color3').style.color = 'black';
    }

    if (isValidHex(color1) && isValidHex(color2) && isValidHex(color3)) {
        const rgbColor1 = hexToRgb(color1);
        const rgbColor2 = hexToRgb(color2);
        const rgbColor3 = hexToRgb(color3);

        const distance1to2 = euclideanDistance(rgbColor1, rgbColor2);
        const distance1to3 = euclideanDistance(rgbColor1, rgbColor3);

        document.getElementById('result').innerText = `Distance between color 1 and color 2: ${distance1to2.toFixed(2)}\nDistance between color 1 and color 3: ${distance1to3.toFixed(2)}`;

        document.getElementById('box1').style.backgroundColor = color1;
        document.getElementById('box1').style.color = getContrastYIQ(color1);
        document.getElementById('box2').style.backgroundColor = color2;
        document.getElementById('box2').style.color = getContrastYIQ(color2);
        document.getElementById('box3').style.backgroundColor = color1;
        document.getElementById('box3').style.color = getContrastYIQ(color1);
        document.getElementById('box4').style.backgroundColor = color3;
        document.getElementById('box4').style.color = getContrastYIQ(color3);
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

function setPresetColors(color1, color2, color3) {
    document.getElementById('color1').value = color1;
    document.getElementById('color2').value = color2;
    document.getElementById('color3').value = color3;
    updateColors();
}

document.getElementById('colorForm').addEventListener('input', updateColors);

