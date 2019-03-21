import Preferences from 'src/Preferences';


export default class AdapterManager {

    preferences: Preferences;

    constructor(preferences: Preferences) {
        this.preferences = preferences;
    }

}