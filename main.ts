//% color=#0fbc11 icon="\u1F319" block="Moon"
namespace Moon {
    let observerLatitude: number;
    let observerLongitude: number;
    let year: number;
    let month: number;
    let day: number;
    let hour: number;
    let minute: number;
    let second: number;

    export function SetMoon(lat: number, lon: number, yr: number, mo: number, d: number, h: number, min: number, sec: number): void {
        observerLatitude = lat;
        observerLongitude = lon;
        year = yr;
        month = mo;
        day = d;
        hour = h;
        minute = min;
        second = sec;
    }

    function julianDate(): number {
        const A = Math.floor((14 - month) / 12);
        const Y = year + 4800 - A;
        const M = month + 12 * A - 3;
        return day + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045
            + (hour - 12) / 24 + minute / 1440 + second / 86400;
    }

    function localSiderealTime(JD: number): number {
        const T = (JD - 2451545.0) / 36525;
        let LST = 280.46061837 + 360.98564736629 * (JD - 2451545.0) + T * T * (0.000387933 - T / 38710000);
        LST = (LST + observerLongitude) % 360;
        if (LST < 0) LST += 360;
        return LST;
    }

    function moonPosition(JD: number): { RA: number; Dec: number } {
        const T = (JD - 2451545.0) / 36525;
        const L0 = (218.316 + 13.176396 * T) % 360;
        const M = (134.963 + 13.064993 * T) % 360;
        const F = (93.272 + 13.229350 * T) % 360;
        const L = L0 + 6.289 * Math.sin(M * Math.PI / 180);
        const B = 5.128 * Math.sin(F * Math.PI / 180);
        const RA = Math.atan2(Math.sin(L * Math.PI / 180) * Math.cos(23.44 * Math.PI / 180), Math.cos(L * Math.PI / 180)) * 180 / Math.PI;
        const Dec = Math.asin(Math.sin(B * Math.PI / 180) * Math.cos(23.44 * Math.PI / 180)) * 180 / Math.PI;
        return { RA: RA % 360, Dec };
    }

    export function Azimuth(): number {
        const JD = julianDate();
        const LST = localSiderealTime(JD);
        const moon = moonPosition(JD);

        let H = (LST - moon.RA) % 360; // Updated to let
        if (H < 0) H += 360;

        const Hrad = H * Math.PI / 180;
        const latRad = observerLatitude * Math.PI / 180;
        const decRad = moon.Dec * Math.PI / 180;

        const azimuth = Math.atan2(
            Math.sin(Hrad),
            Math.cos(Hrad) * Math.sin(latRad) - Math.tan(decRad) * Math.cos(latRad)
        ) * 180 / Math.PI;

        return azimuth >= -180 && azimuth <= 180 ? azimuth : azimuth % 360;
    }

    export function Height(): number {
        const JD = julianDate();
        const LST = localSiderealTime(JD);
        const moon = moonPosition(JD);

        let H = (LST - moon.RA) % 360; // Updated to let
        if (H < 0) H += 360;

        const Hrad = H * Math.PI / 180;
        const latRad = observerLatitude * Math.PI / 180;
        const decRad = moon.Dec * Math.PI / 180;

        const height = Math.asin(
            Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(Hrad)
        ) * 180 / Math.PI;

        return height;
    }

    export function Phase(): number {
        const JD = julianDate();
        const T = (JD - 2451545.0) / 36525;
        const D = (297.85 + 445267.1115 * T) % 360;
        const M = (357.53 + 35999.05 * T) % 360;
        const Mm = (134.96 + 477198.8676 * T) % 360;

        const phase = (1 - Math.cos((Mm - D) * Math.PI / 180)) * 50;
        return phase;
    }

}
