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
import { AdapterContext } from 'adaptiveweb';
import Preferences from './src/Preferences';
import AdapterManager from './src/AdapterManager';
declare const aw: AdapterContext;
declare const window: Window;

aw.getPreferences().then((preferences: Preferences) => {
    new AdapterManager(aw, window, preferences);
});