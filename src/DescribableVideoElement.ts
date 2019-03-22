import FrameBuffer from './FrameBuffer';


let indexCounter = 0;

export default class DescribableVideoElement {
    
    element: HTMLVideoElement;
    id: number;
    buffer: FrameBuffer;

    constructor(videoElement: HTMLVideoElement, id: number = indexCounter++) {
        this.element = videoElement;
        this.id = id;
        this.buffer = new FrameBuffer(videoElement.width, videoElement.height);
    }



}