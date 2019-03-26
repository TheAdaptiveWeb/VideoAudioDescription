import { AdapterContext } from 'adaptiveweb';
import Preferences from './src/Preferences';
import AdapterManager from './src/AdapterManager';
declare const aw: AdapterContext;
declare const window: Window;

aw.getPreferences().then((preferences: Preferences) => {
    new AdapterManager(aw, window, preferences);
});