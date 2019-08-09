import {Observable} from 'tns-core-modules/data/observable';
import {openFilePicker} from 'nativescript-simple-filepicker';
import {ObservableProperty} from './observable-decorator';

export class ViewModel extends Observable {

    @ObservableProperty()
    public message: string;

    constructor() {
        super();
        this.updateMessage('Please select a file.');
    }

    public onTap() {
        openFilePicker().then((res) => {
            this.updateMessage(res.files[0]);
        });
    }

    private updateMessage(message: string) {
        this.message = message;
    }
}
