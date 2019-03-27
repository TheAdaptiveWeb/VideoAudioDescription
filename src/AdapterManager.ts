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
            this.videos.push(new DescribableVideoElement(this.aw, this.preferences, el));
        }
    }

}