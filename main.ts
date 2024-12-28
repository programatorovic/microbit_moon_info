namespace Moon {
    let observerLatitude: number = 0;
    let observerLongitude: number = 0;
    let year: number = 2000;
    let month: number = 1;
    let day: number = 1;
    let hour: number = 0;
    let minute: number = 0;
    let second: number = 0;

    // Helper functions
    function julianDate(year: number, month: number, day: number, hour: number, minute: number, second: number): number {
        if (month <= 2) {
            year -= 1;
            month += 12;
        }
        const A = Math.floor(year / 100);
        const B = 2 - A + Math.floor(A / 4);
        const C = Math.floor(365.25 * (year + 4716));
        const E = Math.floor(30.6001 * (month + 1));
        const F = (hour + minute / 60 + second / 3600) / 24;
        return C + E + day + B - 1524.5 + F;
    }

    function moonPosition(jd: number): { ra: number; dec: number } {
        const T = (jd - 2451545.0) / 36525;
        const L0 = 218.316 + 13.176396 * (jd - 2451545.0);
        const M = 134.963 + 13.064993 * (jd - 2451545.0);
        const F = 93.272 + 13.229350 * (jd - 2451545.0);

        const lambda = L0 + 6.289 * Math.sin((M * Math.PI) / 180);
        const beta = 5.128 * Math.sin((F * Math.PI) / 180);

        const ra = Math.atan2(Math.sin((lambda * Math.PI) / 180) * Math.cos((23.44 * Math.PI) / 180), Math.cos((lambda * Math.PI) / 180)) * (180 / Math.PI);
        const dec = Math.asin(Math.sin((beta * Math.PI) / 180) * Math.cos((23.44 * Math.PI) / 180)) * (180 / Math.PI);

        return { ra, dec };
    }

    function localSiderealTime(jd: number, longitude: number): number {
        const T = (jd - 2451545.0) / 36525;
        const theta = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + T * T * (0.000387933 - T / 38710000.0);
        return (theta + longitude) % 360;
    }

    function calculateAzimuth(jd: number, lat: number, lon: number): number {
        const { ra, dec } = moonPosition(jd);
        const lst = localSiderealTime(jd, lon);
        const hourAngle = (lst - ra + 360) % 360;

        const haRad = (hourAngle * Math.PI) / 180;
        const decRad = (dec * Math.PI) / 180;
        const latRad = (lat * Math.PI) / 180;

        const x = Math.sin(haRad);
        const y = Math.cos(haRad) * Math.sin(latRad) - Math.tan(decRad) * Math.cos(latRad);

        return (Math.atan2(x, y) * (180 / Math.PI) + 360) % 360 - 180;
    }

    function calculateHeight(jd: number, lat: number, lon: number): number {
        const { ra, dec } = moonPosition(jd);
        const lst = localSiderealTime(jd, lon);
        const hourAngle = (lst - ra + 360) % 360;

        const haRad = (hourAngle * Math.PI) / 180;
        const decRad = (dec * Math.PI) / 180;
        const latRad = (lat * Math.PI) / 180;

        return (
            Math.asin(
                Math.sin(latRad) * Math.sin(decRad) +
                Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad)
            ) *
            (180 / Math.PI)
        );
    }

    function calculatePhase(jd: number): number {
        const D = jd - 2451545.0;
        const n = (D / 29.53) % 1;
        return Math.abs(n) * 100;
    }

    function calculateIllumination(jd: number): number {
        const D = jd - 2451545.0;
        const n = (D / 29.53) % 1;
        return Math.abs(50 - Math.abs(n * 100 - 50));
    }

    // Blocks
    // Block to set the Moon parameters
    //% block="Set Moon | GPSx $lat | GPSy $lon | Year $yr | Month $mo | Day $dy | Hour $hr | Minute $mi | Second $sec"
    //% inlineInputMode=inline
    export function setMoon(lat: number, lon: number, yr: number, mo: number, dy: number, hr: number, mi: number, sec: number): void {
        observerLatitude = lat;
        observerLongitude = lon;
        year = yr;
        month = mo;
        day = dy;
        hour = hr;
        minute = mi;
        second = sec;
    }

    // Block to calculate the Azimuth
    //% block="Azimuth"
    export function azimuth(): number {
        const jd = julianDate(year, month, day, hour, minute, second);
        return calculateAzimuth(jd, observerLatitude, observerLongitude);
    }

    // Block to calculate the Height
    //% block="Height"
    export function height(): number {
        const jd = julianDate(year, month, day, hour, minute, second);
        return calculateHeight(jd, observerLatitude, observerLongitude);
    }

    // Block to calculate the Phase
    //% block="Phase"
    export function phase(): number {
        const jd = julianDate(year, month, day, hour, minute, second);
        return calculatePhase(jd);
    }

    // Block to calculate Illumination
    //% block="Illumination"
    export function illumination(): number {
        const jd = julianDate(year, month, day, hour, minute, second);
        return calculateIllumination(jd);
    }
}
