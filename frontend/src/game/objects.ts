import { HEIGHT, NUM_SINKS, WIDTH, obstacleRadius, sinkWidth } from "./constants";
import { pad } from "./padding";

export interface Obstacle {
    x: number;
    y: number;
    radius: number;
}

export interface Sink {
    x: number;
    y: number;
    width: number;
    height: number;
    multiplier?: number;
}

const MULTIPLIERS_LOW: {[ key: number ]: number} = {
    0: 16,
    1: 9,
    2: 2,
    3: 1.4,
    4: 1.2,
    5: 1.1,
    6: 1,
    7: 0.8,
    8: 0.5,
    9: 0.8,
    10: 1,
    11: 1.1,
    12: 1.2,
    13: 1.4,
    14: 2,
    15: 9,
    16: 16
}
const MULTIPLIERS_MEDIUM: {[ key: number ]: number} = {
    0: 110,
    1: 41,
    2: 10,
    3: 5,
    4: 3,
    5: 1.5,
    6: 1,
    7: 0.5,
    8: 0.2,
    9: 0.5,
    10: 1,
    11: 1.5,
    12: 3,
    13: 5,
    14: 10,
    15: 41,
    16: 110
}
const MULTIPLIERS_HIGH: {[ key: number ]: number} = {
    0: 1000,
    1: 130,
    2: 26,
    3: 9,
    4: 4,
    5: 2,
    6: 0.2,
    7: 0.2,
    8: 0.2,
    9: 0.2,
    10: 0.2,
    11: 2,
    12: 4,
    13: 9,
    14: 26,
    15: 130,
    16: 1000
}


export const createObstacles = (): Obstacle[] => {
    const obstacles: Obstacle[] = [];
    const rows = 18;
    for (let row = 2; row < rows; row++) {
        const numObstacles = row + 1;
        const y = 0 + row * 35;
        const spacing = 36;
        for (let col = 0; col < numObstacles; col++) {
            const x = WIDTH / 2 - spacing * (row / 2 - col);
            obstacles.push({x: pad(x), y: pad(y), radius: obstacleRadius });
        }   
    }
    return obstacles;
}

export const createSinks = (risk:number): Sink[] => {
    const sinks = [];
    const SPACING = obstacleRadius * 2;

    for (let i = 0; i < NUM_SINKS; i++) {
      const x = WIDTH / 2 + sinkWidth * (i - Math.floor(NUM_SINKS/2)) - SPACING * 1.5;
      const y = HEIGHT - 170;
      const width = sinkWidth;
      const height = width;
      if(risk == 1)
        sinks.push({ x, y, width, height, multiplier: MULTIPLIERS_LOW[i] });
      else if(risk==2)
        sinks.push({ x, y, width, height, multiplier: MULTIPLIERS_MEDIUM[i] });
      else
        sinks.push({ x, y, width, height, multiplier: MULTIPLIERS_HIGH[i] });

    }

    return sinks;
}
