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
 * The preference interface of this adapter
 */
export interface Preferences {

    /**
     * The amount of time (in seconds) the video will remain paused for while 
     * reading a description. Defaults to 3 seconds
     */
    waitTime: number;
    /**
     * Start describing a video as soon as one is detected on the page and is 
     * playing
     */
    autoplay: boolean;
    /**
     * The time (in seconds) that the adapter waits after providing a description 
     * before generating the next description. Defaults to 5 seconds
     */
    cooldown: number;
    /**
     * Enables or disables the video overlay. If set to false, you will still be 
     * able to use a screen reader to interact with the descriptions
     */
    overlayEnabled: boolean;

}

/**
 * Cast an object to the Preferences interface
 * @param obj the object to cast
 */
export function preferencesFromObject(obj: any = {}): Preferences {
    let prefs: Preferences = {
        autoplay: obj.autoplay,
        overlayEnabled: obj.overlayEnabled,
        waitTime: Number.parseFloat(obj.waitTime),
        cooldown: Number.parseFloat(obj.cooldown),
    };
    return prefs;
}