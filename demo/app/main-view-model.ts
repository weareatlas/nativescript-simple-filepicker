import {Observable} from 'tns-core-modules/data/observable';
import {openFilePicker} from 'nativescript-simple-filepicker';
import {ObservableProperty} from './observable-decorator';

export class ViewModel extends Observable {

    @ObservableProperty()
    public message: string;

    constructor() {
        super();
    }

    public onTap() {
        openFilePicker({
            multipleSelection: true
        }).then((res: { files: string[] }) => {
            let message: string = '';
            res.files.forEach(file => message += file + ', ');
            this.updateMessage(message);
        });
    }

    private updateMessage(message: string) {
        console.log(message);
        this.message = message;
    }
}
