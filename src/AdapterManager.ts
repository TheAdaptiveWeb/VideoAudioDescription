import Preferences from 'src/Preferences';
import { AdapterContext } from 'adaptiveweb';
import DescribableVideoElement from './DescribableVideoElement';

export default class AdapterManager {

    aw: AdapterContext;
    window: Window;
    preferences: Preferences;
    enabled: boolean = true;
    videos: DescribableVideoElement[] = [];

    constructor(aw: AdapterContext, window: Window, preferences: Preferences) {
        this.aw = aw;
        this.window = window;
        this.preferences = preferences;

        console.log('[Adaptive Web][video-audio-description] Initiated!');

        this.findVideoElements();

        console.log('[Adaptive Web][video-audio-description] Found ' + this.videos.length + ' videos!');
    }

    findVideoElements() {
        let videoNodes: HTMLCollectionOf<HTMLVideoElement> = window.document.getElementsByTagName('video');
        
        for (let i = 0; i < videoNodes.length; i++) {
            let el = videoNodes[i];
            this.videos.push(new DescribableVideoElement(this.aw, el));
        }
    }

}