import * as app from 'tns-core-modules/application';
import * as permissions from 'nativescript-perms';
import {FilePickerOptions} from "./simple-filepicker.common";

function callIntent(context, intent, pickerType) {
    return permissions.request('storage').then(function () {
        return new Promise(function (resolve, reject) {
            const onEvent = function (e) {
                console.log('startActivityForResult ', e.requestCode);
                if (e.requestCode === pickerType) {
                    resolve(e);
                    app.android.off(app.AndroidApplication.activityResultEvent, onEvent);
                }
            };
            app.android.once(app.AndroidApplication.activityResultEvent, onEvent);
            context.startActivityForResult(intent, pickerType);
        });
    });
}

export const openFilePicker = (params?: FilePickerOptions) => {
    const context = app.android.foregroundActivity || app.android.startActivity;
    const FILE_CODE = 1231;
    const intent = new android.content.Intent(android.content.Intent.ACTION_GET_CONTENT);
    intent.setType(getTypes(params.extensions));
    intent.addCategory(android.content.Intent.CATEGORY_OPENABLE);
    intent.setAction(android.content.Intent.ACTION_OPEN_DOCUMENT);
    intent.putExtra(android.content.Intent.EXTRA_ALLOW_MULTIPLE, params && !!params.multipleSelection || false);
    return callIntent(context, intent, FILE_CODE).then((result: any) => {
        if (result.resultCode === android.app.Activity.RESULT_OK) {
            if (result.intent != null) {
                const uri = result.intent.getData();
                let uris = [uri];
                if (!uri) {
                    uris  = [];
                    const clipData = result.intent.getClipData();
                    if (clipData) {
                        // multiple selection
                        for (let i = 0; i < clipData.getItemCount(); i++) {
                            const clipDataItem = clipData.getItemAt(i);
                            const fileUri = clipDataItem.getUri();
                            uris.push(fileUri);
                        }
                    }
                }

                const paths = uris.map(uri => com.nativescript.simple.FilePicker.getPath(context, uri));
                return {
                    files: paths
                };
            }
            return {
                files: []
            };
        }
        else {
            throw new Error('no_file');
        }
    });
};

const getTypes = (extensions: string[] = []) => {
    let types = '*/*';
    for (let i = 0; i < extensions.length; i++) {
        types += extensions[i];
        if (i !== extensions.length - 1) {
            types += ' | ';
        }
    }
    return types;
}
