import RGBValue from "./RGBValue";


export default class FrameBuffer {

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;

    private dataLength: number;

    private width: number;
    private height: number;
    private stepWidth: number = 50;
    private stepHeight: number = 50;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        this.dataLength = this.stepWidth * this.stepHeight * 4; // width * height * 4 channels
    }

    /**
     * Push a new image to the buffer
     * @param image the image to push
     */
    push(image: CanvasImageSource) {
        if (this.context === null) return;
        this.context.drawImage(this.canvas, 0, 0, this.stepWidth, this.stepHeight, this.stepWidth, 0, this.stepWidth, this.stepHeight);
        this.context.drawImage(image, 0, 0, this.width, this.height, 0, 0, this.stepWidth, this.stepHeight);
    }

    /**
     * Compute the distance between the current frame and the previous frame
     */
    computeDelta(): number {
        if (this.context === null) return 0;
        let diff = [];
        let prevPixels = this.context.getImageData(this.stepWidth, 0, this.stepWidth, this.stepHeight).data;
        let currPixels = this.context.getImageData(0, 0, this.stepWidth, this.stepHeight).data;
        for (let i = 0; i < this.dataLength; i++) {
            diff.push(this.rgbDistance(
                { r: prevPixels[i], g: prevPixels[i+1], b: prevPixels[i+2] },
                { r: currPixels[i], g: currPixels[i+1], b: currPixels[i+2] },
            ));
        }

        return diff.sort((a: number, b: number) => a - b)[Math.floor(diff.length / 2)];
    }

    /**
     * Calculate the Euclidean distance between two RGB values 
     * @param a the first RGB value
     * @param b the second RGB value
     */
    private rgbDistance(a: RGBValue, b: RGBValue) {
        return Math.sqrt( Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2) );
    }

}