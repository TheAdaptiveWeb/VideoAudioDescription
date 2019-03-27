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

/**
 * Inner div styles
 */
const inner =
`<div style="background-color: #fff; color: #000; font-size: 18px; box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.5); margin: 20px; border-radius: 3px; padding: 10px 10px; font-family: 'Nunito', sans-serif; max-width: 500px; display: flex; align-items: center;">
    <div style="flex-grow: 1; padding-left: 10px;"></div>
    <button style="background-color: #62A8E8; color: #fff; box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.5); border-radius: 3px; text-transform: uppercase; font-family: 'Nunito', sans-serif; display: inline-block; font-size: 14px; border: none; padding: 8px 20px; margin-left: 20px;">Start Audio Description</button>
</div>`

/**
 * The overlay added to a video
 */
export default class VideoOverlayElement {

    el: HTMLDivElement;
    adEl: HTMLDivElement;
    btnEl: HTMLDivElement;
    running: boolean;

    constructor(parent: Element, running = false) {
        this.running = false;
        this.el = document.createElement('div');
        this.el.style.position = 'relative';
        this.el.innerHTML = inner;
        this.adEl = (<any>this.el).children[0].children[0];
        this.btnEl = (<any>this.el).children[0].children[1];

        if (running) this.switchState();

        parent.appendChild(this.el);
    }

    /**
     * Update with a new audio description
     * @param str the text to update
     */
    update(str = '') {
        this.adEl.innerHTML = str;
        // this.adEl.setAttribute('aria-label', str);
        this.adEl.setAttribute('aria-live', str);
        this.adEl.focus();
    }

    /**
     * Switch the state between audio description running
     */
    switchState() {
        this.running = !this.running;

        if (this.running) {
            this.adEl.innerHTML = '<i>Audio descriptions will appear here</i>';
            this.btnEl.innerHTML = 'Stop Audio Description';
        } else {
            this.btnEl.innerHTML = 'Start Audio Description';
        }
    }

}