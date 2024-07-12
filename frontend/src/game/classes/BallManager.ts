import { HEIGHT, WIDTH, ballRadius, obstacleRadius, sinkWidth} from "../constants";
import { Obstacle, Sink, createObstacles, createSinks } from "../objects";
import { pad, unpad } from "../padding";
import { Ball } from "./Ball";

export class BallManager {
    private balls: Ball[];
    private canvasRef: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private obstacles: Obstacle[]
    private sinks: Sink[]
    private requestId?: number;
    private onFinish?: (index: number,startX?: number) => void;
    private isAnimating: boolean;
    private animationFrame: number;
    private animationIndex?: number;
    private hitSound: HTMLAudioElement; // New property for the hit sound

    constructor(canvasRef: HTMLCanvasElement, risk:number, onFinish?: (index: number,startX?: number) => void) {
        this.balls = [];
        this.canvasRef = canvasRef;
        this.ctx = this.canvasRef.getContext("2d")!;
        this.obstacles = createObstacles();
        this.sinks = createSinks(risk);
        this.isAnimating = false;
        this.animationFrame = 0;
        this.update();
        this.onFinish = onFinish;
        this.hitSound = new Audio('frontend/src/assets/320775__rhodesmas__win-02.wav');
    }
    playHitSound() {
        this.hitSound.currentTime = 0; // Rewind sound to start
        this.hitSound.play();
    }
    addBall(startX?: number) {
        const newBall = new Ball(startX || pad(WIDTH / 2 + 13), pad(50), ballRadius, 'red', this.ctx, this.obstacles, this.sinks, (index) => {
            this.balls = this.balls.filter(ball => ball !== newBall);
            this.onFinish?.(index, startX);
            this.animateSink(index);
            this.playHitSound(); // Play sound on ball hit

        });
        this.balls.push(newBall);
    }

    drawObstacles() {
        this.ctx.fillStyle = 'white';
        this.obstacles.forEach((obstacle) => {
            this.ctx.beginPath();
            this.ctx.arc(unpad(obstacle.x), unpad(obstacle.y), obstacle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.closePath();
        });
    }
  
    getColor(index: number) {
        if (index <3 || index > this.sinks.length - 3) {
            return {background: '#ff003f', color: 'white',  fontWeight: 'bold' };
        }
        if (index < 6 || index > this.sinks.length - 6) {
            return {background: '#ff7f00', color: 'white',  fontWeight: 'bold'};
        }
        if (index < 9 || index > this.sinks.length - 9) {
            return {background: '#ffbf00', color: 'black',  fontWeight: 'bold'};
        }
        if (index < 12 || index > this.sinks.length - 12) {
            return {background: '#ffff00', color: 'black',  fontWeight: 'bold'};
        }
        if (index < 15 || index > this.sinks.length - 15) {
            return {background: '#bfff00', color: 'black',  fontWeight: 'bold'};
        }
        return {background: '#7fff00', color: 'black',  fontWeight: 'bold'};
    }
    drawSinks() {
        this.ctx.fillStyle = 'green';
        const SPACING = obstacleRadius * 2;
        for (let i = 0; i<this.sinks.length; i++)  {
            this.ctx.fillStyle = this.getColor(i).background;
            const sink = this.sinks[i];
            this.ctx.font='bold 12.5px Arial ';

            let currentHeight = sink.height;
            let currentWidth = sink.width+4
            if (this.isAnimating && this.animationIndex === i) {
                const scale = 1 + 0.2 * Math.sin(this.animationFrame / 10);
                currentHeight *= scale;
                currentWidth *= scale;
            }
            // this.ctx.fillRect(sink.x, sink.y - sink.height / 2, sink.width - SPACING, sink.height);
            // this.ctx.fillStyle = this.getColor(i).color;
            // this.ctx.fillText((sink?.multiplier)?.toString() + "x", sink.x - 15 + sinkWidth / 2, sink.y);
            
            this.ctx.fillRect(sink.x - currentWidth / 2 + 20, sink.y - currentHeight / 2, currentWidth - SPACING, currentHeight);
            this.ctx.fillStyle = this.getColor(i).color;
            this.ctx.fillText((sink?.multiplier)?.toString() + "x", sink.x -    currentWidth / 2 +22, sink.y);

        // }
        }
    }
    animateSink(index: number) {
        this.isAnimating = true;
        this.animationIndex = index;
        this.animationFrame = 0;
    }

    draw() {

        this.ctx.fillStyle = 'black'; // Set the background color to black
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT); // 
        this.drawObstacles();
        this.drawSinks();
        this.balls.forEach(ball => {
            ball.draw();
            ball.update();
        });
    }
    
    update() {
        this.draw();
        if (this.isAnimating) {
            this.animationFrame++;
            if (this.animationFrame > 60) { // Set the duration of the animation
                this.isAnimating = false;
                this.animationIndex = undefined;
            }
        }
        this.requestId = requestAnimationFrame(this.update.bind(this));
    }

    stop() {
        if (this.requestId) {
            cancelAnimationFrame(this.requestId);
        }
    }
}