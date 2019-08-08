import {Observable} from 'tns-core-modules/data/observable';
import {openFilePicker} from 'nativescript-simple-filepicker';

export class HelloWorldModel extends Observable {

    constructor() {
        super();
    }

    public onTap() {
        openFilePicker({
            extensions: []
        }).then(() => {

        });
    }
}
