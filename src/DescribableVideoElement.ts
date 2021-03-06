/**
 *  Copyright 2019 The Adaptive Web. All Rights Reserved.
 * 
 *  Licensed under the Mozilla Public License 2.0 (the "License"). 
 *  You may not use this file except in compliance with the License.
 *  A copy of the License is located at
 *  
 *      https://www.mozilla.org/en-US/MPL/2.0/
 *  
 *  or in the "license" file accompanying this file. This file is distributed 
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either 
 *  express or implied. See the License for the specific language governing 
 *  permissions and limitations under the License.
 */

import FrameBuffer from './FrameBuffer';
import { AdapterContext } from 'adaptiveweb';
import { describeImage } from './ImageDescriptionAPI';
import VideoOverlayElement from './VideoOverlayElement';
import { Preferences } from './Preferences';

let indexCounter = 0;

export default class DescribableVideoElement {
    
    /**
     * The AdapterContext
     */
    aw: AdapterContext;
    /**
     * The video element
     */
    element: HTMLVideoElement;
    /**
     * The video overlay element
     */
    overlay?: VideoOverlayElement;
    /**
     * The ID of this video element
     */
    id: number;
    /**
     * Frame buffer to compare frames
     */
    buffer: FrameBuffer;
    /**
     * If true, the adapter should watch for scene changes
     */
    watching: boolean = false;
    /**
     * The watcher interval
     */
    watcher: any;
    /**
     * The threshold to detect scene changes above
     */
    threshold: number = 70;
    /**
     * Determines if the user has paused the audio description
     */
    userPaused: boolean = false;
    /**
     * The preferences of the adapter
     */
    preferences: Preferences;
    /**
     * The time at which the last description occured
     */
    lastDescriptionTime: number = 0;
    /**
     * Flag to ignore events (for use when changing playing state)
     */
    ignoreEvents: boolean = false;

    /**
     * Wrap a HTMLVideoElement into a DescribableVideoElement
     * @param aw the AdapterContext
     * @param preferences preferences of the adapter
     * @param videoElement the video element to cast
     * @param id the id of this video element
     */
    constructor(aw: AdapterContext, preferences: Preferences, videoElement: HTMLVideoElement, id: number = indexCounter++) {
        this.aw = aw;
        this.preferences = preferences;
        this.element = videoElement;
        if (this.element.parentElement !== null)
            this.overlay = new VideoOverlayElement(
                this.aw,
                this.element.parentElement, 
                this.preferences, 
                (running: boolean) => {
                    if (running) this.startWatching(true);
                    else this.stopWatching();
                });
        this.id = id;
        this.buffer = new FrameBuffer(
            videoElement.videoWidth || videoElement.width, 
            videoElement.videoHeight || videoElement.height
        );

        if (!this.element.paused) {
            if (this.overlay !== undefined) this.overlay.setState(true);
            this.startWatching();
        }

        this.element.addEventListener('play', this.startWatching.bind(this));
        this.element.addEventListener('pause', this.stopWatching.bind(this));
        this.element.addEventListener('ended', this.stopWatching.bind(this));
    }
    
    /**
     * Describe the current frame of the video
     */
    describeFrame() {
        if (Date.now() - this.lastDescriptionTime < this.preferences.cooldown + this.preferences.waitTime) return;

        let canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 168;

        let ctx = canvas.getContext('2d');
        if (ctx === null) return;
        let videoWidth = this.element.videoWidth || this.element.width;
        let videoHeight = this.element.videoHeight || this.element.height;
        ctx.drawImage(this.element, 0, 0, videoWidth, videoHeight, 0, 0, 300, 168);

        canvas.toBlob((blob: Blob | null) => {
            describeImage(this.aw, blob).then(description => {
                if (description !== undefined) {
                    if (this.overlay !== undefined) {
                        this.overlay.update(description);
                        this.ignoreEvents = true;
                        this.element.pause();
                        setTimeout(() => {
                            this.element.play();
                            this.element.focus();
                            this.ignoreEvents = false;
                        }, this.preferences.waitTime * 1000);
                        this.lastDescriptionTime = Date.now();
                    }
                }
            });
        });
    }

    /**
     * Start watching for scene changes
     */
    startWatching(userInitiated: boolean = false) {
        if (this.ignoreEvents) return;
        if (!userInitiated && !this.preferences.autoplay) return;

        console.log('[Adaptive Web][video-audio-description] started watching');
        
        this.watching = true;
        if (this.watcher !== undefined) return;

        if (this.overlay !== undefined) this.overlay.setState(true);
        
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

    /**
     * Stop watching for scene changes
     */
    stopWatching() {
        if (this.ignoreEvents) return;
        console.log('[Adaptive Web][video-audio-description] stopped watching');
        if (this.overlay !== undefined) this.overlay.setState(false);
        this.watching = false;
    }

}