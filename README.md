# Moon Extension for Microbit

This extension provides calculations related to the Moon: Azimuth, Height, and Phase.

## Blocks

### SetMoon
Sets the Moon calculation parameters.

- **GPSx**: Latitude of the observer.
- **GPSy**: Longitude of the observer.
- **Year**: Year.
- **Month**: Month.
- **Day**: Day.
- **Hour**: Hour.
- **Minute**: Minute.
- **Second**: Second.

### Azimuth
Returns the Azimuth of the Moon in degrees (-180 to 180).

### Height
Returns the Height of the Moon in degrees (-90 to 90).

### Phase
Returns the Phase of the Moon in percentage (0 to 100%).

## Usage
1. Use the `SetMoon` block to set the input parameters.
2. Use the `Azimuth`, `Height`, and `Phase` blocks to retrieve the respective values.
