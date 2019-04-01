import { Preferences } from './Preferences';
import { AdapterContext, AWCard, AWText, AWButton } from 'adaptiveweb';

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
 * The overlay added to a video
 */
export default class VideoOverlayElement {

    card: AWCard;
    text: AWText;
    button: AWButton;

    running: boolean;
    preferences: Preferences;
    aw: AdapterContext;

    constructor(aw: AdapterContext, parent: Element, preferences: Preferences, onBtnClick: Function) {
        this.aw = aw;
        this.running = false;
        this.preferences = preferences;
    
        this.button = aw.ui.button('Stop Audio Description', () => {
            this.switchState();
            onBtnClick(this.running);
        }, 'default', {
            marginLeft: '20px'
        });

        this.text = aw.ui.text('Testing', undefined, {
            flexGrow: '1',
            paddingLeft: '10px'
        });

        this.card = aw.ui.card([this.text, this.button], {
            maxWidth: '500px', 
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            margin: '20px'
        });

        if (!preferences.overlayEnabled) {
            // Hide from sighted users
            this.card.setSightedVisibility(false);
        }

        parent.appendChild(this.card.element);
    }

    /**
     * Update with a new audio description
     * @param str the text to update
     */
    update(str = '') {
        this.text.setText(str);
        this.text.element.setAttribute('aria-live', str);
        this.text.element.focus();
    }

    /**
     * Switch the state between audio description running
     */
    switchState() {
        this.running = !this.running;

        if (this.running) {
            this.text.element.innerHTML = '<i>Audio descriptions will appear here</i>';
            this.button.setText('Stop Audio Description');
        } else {
            this.button.setText('Start Audio Description');
        }
    }

    /**
     * Sets the state
     * @param newState the state to set
     */
    setState(newState: boolean) {
        if (newState !== this.running) this.switchState();
    }

}