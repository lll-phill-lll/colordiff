import("./colormath.js");


function isValidHex(hex) {
    return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(hex);
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
        const rgbBase = hexToRgb(basecolor);
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);

        const euclidBaseTo1 = euclid(rgbBase, rgb1);
        const euclidBaseTo2 = euclid(rgbBase, rgb2);

        const labbase = rgbToLab(rgbBase);
        const lab1 = rgbToLab(rgb1);
        const lab2 = rgbToLab(rgb2);

        const ciedeBaseTo1 = ciede2000(labbase, lab1);
        const ciedeBaseTo2 = ciede2000(labbase, lab2);

        const hslBase = rgbToHsl(rgbBase);
        const hsl1 = rgbToHsl(rgb1);
        const hsl2 = rgbToHsl(rgb2);

        const euclidBaseTo1HSL = euclidWeighted(hslBase, hsl1);
        const euclidBaseTo2HSL = euclidWeighted(hslBase, hsl2);

        const hsvBase = rgbToHsv(rgbBase);
        const hsv1 = rgbToHsv(rgb1);
        const hsv2 = rgbToHsv(rgb2);

        const euclidBaseTo1HSV = euclidWeighted(hsvBase, hsv1);
        const euclidBaseTo2HSV = euclidWeighted(hsvBase, hsv2);

        document.getElementById('resultEuclidBaseTo1').innerText = `${euclidBaseTo1.toFixed(2)}`;
        document.getElementById('resultEuclidBaseTo2').innerText = `${euclidBaseTo2.toFixed(2)}`;
        document.getElementById('resultEuclid').innerText = `${euclidBaseTo1 > euclidBaseTo2? 2 : 1}`;

        document.getElementById('resultCiedeBaseTo1').innerText = `${ciedeBaseTo1.toFixed(2)}`;
        document.getElementById('resultCiedeBaseTo2').innerText = `${ciedeBaseTo2.toFixed(2)}`;
        document.getElementById('resultCiede').innerText = `${ciedeBaseTo1 > ciedeBaseTo2? 2 : 1}`;

        document.getElementById('resultEuclidBaseTo1HSL').innerText = `${euclidBaseTo1HSL.toFixed(2)}`;
        document.getElementById('resultEuclidBaseTo2HSL').innerText = `${euclidBaseTo2HSL.toFixed(2)}`;
        document.getElementById('resultEuclidHSL').innerText = `${euclidBaseTo1HSL > euclidBaseTo2HSL? 2 : 1}`;

        document.getElementById('resultEuclidBaseTo1HSV').innerText = `${euclidBaseTo1HSV.toFixed(2)}`;
        document.getElementById('resultEuclidBaseTo2HSV').innerText = `${euclidBaseTo2HSV.toFixed(2)}`;
        document.getElementById('resultEuclidHSV').innerText = `${euclidBaseTo1HSV > euclidBaseTo2HSV? 2 : 1}`;
    

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

function colorToString(color) {
    return '#' + color[0].toString(16).padStart(2, '0') + color[1].toString(16).padStart(2, '0') + color[2].toString(16).padStart(2, '0');
}

function getRandomColor() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return [r, g, b];
}


function setRandomColors() {
    document.getElementById('basecolor').value = colorToString(getRandomColor());
    document.getElementById('color1').value = colorToString(getRandomColor());
    document.getElementById('color2').value = colorToString(getRandomColor());
    updateColors();
}

function findColorTriplets() {
    while(true) {
        const basecolor = getRandomColor();
        const color1 = getRandomColor();
        const color2 = getRandomColor();

        const labbase = rgbToLab(basecolor);
        const lab1 = rgbToLab(color1);
        const lab2 = rgbToLab(color2);

        const ciedeDistanceBaseTo1 = ciede2000(labbase, lab1);
        const ciedeDistanceBaseTo2 = ciede2000(labbase, lab2);
        const euclideanDistanceBaseTo1 = euclid(basecolor, color1);
        const euclideanDistanceBaseTo2 = euclid(basecolor, color2);

        if (ciedeDistanceBaseTo1 < 10 && ciedeDistanceBaseTo1 < ciedeDistanceBaseTo2 && euclideanDistanceBaseTo1 > euclideanDistanceBaseTo2) {
            return [basecolor, color1, color2]
        }
    }
}

function setCiede2000RandomColors() {
    colors = findColorTriplets()
    document.getElementById('basecolor').value = colorToString(colors[0]);
    document.getElementById('color1').value = colorToString(colors[1]);
    document.getElementById('color2').value = colorToString(colors[2]);
    updateColors();
}

document.getElementById('colorForm').addEventListener('input', updateColors);

