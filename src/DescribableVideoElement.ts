import FrameBuffer from './FrameBuffer';
import { AdapterContext } from 'adaptiveweb';
import { describeImage } from './ImageDescriptionAPI';

let indexCounter = 0;

export default class DescribableVideoElement {
    
    aw: AdapterContext;
    element: HTMLVideoElement;
    id: number;
    buffer: FrameBuffer;
    watching: boolean = false;
    watcher: any;
    threshold: number = 70;
    userPaused: boolean = false;

    constructor(aw: AdapterContext, videoElement: HTMLVideoElement, id: number = indexCounter++) {
        this.aw = aw;
        this.element = videoElement;
        this.id = id;
        this.buffer = new FrameBuffer(
            videoElement.videoWidth || videoElement.width, 
            videoElement.videoHeight || videoElement.height
        );

        if (!this.element.paused) {
            this.startWatching();
        }

        this.element.addEventListener('play', this.startWatching.bind(this));
        this.element.addEventListener('pause', this.stopWatching.bind(this));
        this.element.addEventListener('ended', this.stopWatching.bind(this));
    }
    
    describeFrame(): Promise<string> {
        let canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 168;

        let ctx = canvas.getContext('2d');
        if (ctx === null) return Promise.reject<string>('Could not initiate canvas');
        let videoWidth = this.element.videoWidth || this.element.width;
        let videoHeight = this.element.videoHeight || this.element.height;
        ctx.drawImage(this.element, 0, 0, videoWidth, videoHeight, 0, 0, 300, 168);

        return new Promise<string>((resolve, reject) => {
            canvas.toBlob((blob: Blob | null) => {
                describeImage(this.aw, blob).then(description => {
                    if (description !== undefined) {
                        this.readText(description);
                    }
                });
            });
        });
        
    }

    readText(text: string) {
        console.log(text);
    }

    startWatching() {
        console.log('[Adaptive Web][video-audio-description] started watching');
        
        this.watching = true;
        if (this.watcher !== undefined) return;

        this.watcher = setInterval(() => {
            if (!this.watching) { 
                clearInterval(this.watcher); 
                this.watcher = undefined; 
                return; 
            };

            this.buffer.push(this.element);
            let delta = this.buffer.computeDelta();
            if (delta > this.threshold) {
                this.describeFrame();
            }
        }, 1000);
    }

    stopWatching() {
        console.log('[Adaptive Web][video-audio-description] stopped watching');
        this.watching = false;
    }

}