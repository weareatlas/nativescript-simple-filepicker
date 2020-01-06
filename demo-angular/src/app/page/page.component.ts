import { Component, OnInit } from '@angular/core';
import {openFilePicker} from 'nativescript-simple-filepicker';

@Component({
    selector: 'ns-page',
    moduleId: module.id,
    templateUrl: './page.component.html'
})
export class PageComponent implements OnInit {

    filePath: string = 'Please select a file';

    constructor() {}

    ngOnInit(): void {
    }

    onItemTap(event) {
        openFilePicker({
            multipleSelection: true
        }).then((res) => {
            //this.filePath = res.files[0];
            this.filePath = '';
            res.files.forEach(file => this.filePath += file +  ", ");
        })
    }
}
