
function euclid(rgb1, rgb2) {
    const rDiff = rgb1[0] - rgb2[0];
    const gDiff = rgb1[1] - rgb2[1];
    const bDiff = rgb1[2] - rgb2[2];
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

function rgbToXyz(rgb) {
    r = rgb[0] / 255;
    g = rgb[1] / 255;
    b = rgb[2] / 255;

    r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

    return [x * 100, y * 100, z * 100];
}

function xyzToLab(x, y, z) {
    const whiteX = 95.047;
    const whiteY = 100.000;
    const whiteZ = 108.883;

    x = x / whiteX;
    y = y / whiteY;
    z = z / whiteZ;

    x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
    y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
    z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

    const L = (116 * y) - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);

    return [L, a, b];
}

function rgbToLab(rgb) {
    const xyz = rgbToXyz(rgb);
    return xyzToLab(xyz[0], xyz[1], xyz[2]);
}

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

function ciede2000(lab1, lab2) {
    const [L1, a1, b1] = lab1;
    const [L2, a2, b2] = lab2;

    const avg_L = (L1 + L2) / 2;
    const C1 = Math.sqrt(a1 * a1 + b1 * b1);
    const C2 = Math.sqrt(a2 * a2 + b2 * b2);
    const avg_C = (C1 + C2) / 2;

    const G = 0.5 * (1 - Math.sqrt(Math.pow(avg_C, 7) / (Math.pow(avg_C, 7) + Math.pow(25, 7))));
    const a1_prime = a1 * (1 + G);
    const a2_prime = a2 * (1 + G);

    const C1_prime = Math.sqrt(a1_prime * a1_prime + b1 * b1);
    const C2_prime = Math.sqrt(a2_prime * a2_prime + b2 * b2);

    const avg_C_prime = (C1_prime + C2_prime) / 2;

    let h1_prime = Math.atan2(b1, a1_prime);
    let h2_prime = Math.atan2(b2, a2_prime);

    h1_prime = h1_prime >= 0 ? h1_prime : h1_prime + 2 * Math.PI;
    h2_prime = h2_prime >= 0 ? h2_prime : h2_prime + 2 * Math.PI;

    const avg_h_prime = Math.abs(h1_prime - h2_prime) > Math.PI
        ? (h1_prime + h2_prime + 2 * Math.PI) / 2
        : (h1_prime + h2_prime) / 2;

    const T = 1
        - 0.17 * Math.cos(avg_h_prime - Math.PI / 6)
        + 0.24 * Math.cos(2 * avg_h_prime)
        + 0.32 * Math.cos(3 * avg_h_prime + Math.PI / 30)
        - 0.2 * Math.cos(4 * avg_h_prime - 63 * Math.PI / 180);

    const delta_h_prime = h2_prime - h1_prime;

    const delta_L_prime = L2 - L1;
    const delta_C_prime = C2_prime - C1_prime;

    const delta_H_prime = 2 * Math.sqrt(C1_prime * C2_prime) * Math.sin(delta_h_prime / 2);

    const S_L = 1 + (0.015 * Math.pow(avg_L - 50, 2)) / Math.sqrt(20 + Math.pow(avg_L - 50, 2));
    const S_C = 1 + 0.045 * avg_C_prime;
    const S_H = 1 + 0.015 * avg_C_prime * T;

    const delta_theta = 30 * Math.exp(-Math.pow((avg_h_prime - Math.PI * 5 / 6) / (Math.PI / 30), 2));
    const R_C = 2 * Math.sqrt(Math.pow(avg_C_prime, 7) / (Math.pow(avg_C_prime, 7) + Math.pow(25, 7)));
    const R_T = -R_C * Math.sin(2 * delta_theta);

    const delta_E = Math.sqrt(
        Math.pow(delta_L_prime / S_L, 2) +
        Math.pow(delta_C_prime / S_C, 2) +
        Math.pow(delta_H_prime / S_H, 2) +
        R_T * (delta_C_prime / S_C) * (delta_H_prime / S_H)
    );

    return delta_E;
}