import * as app from 'tns-core-modules/application';
import * as permissions from 'nativescript-perms';
import {FilePickerOptions} from "./index";

function callIntent(context, intent, pickerType) {
    return permissions.request('storage').then(function () {
        return new Promise(function (resolve, reject) {
            const onEvent = function (e) {
                console.log(' startActivityForResult ', e.requestCode);
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
    let extensions: any;
    if (!params) {
        params = {};
    }
    if (!params.extensions) {
        params.extensions = [];
    }
    if (params && params.extensions && params.extensions.length > 0) {
        extensions = Array.create(java.lang.String, params.extensions.length);
        for (let i = 0; i < params.extensions.length; i++) {
            extensions[i] = params.extensions[i];
        }
    }
    const context = app.android.foregroundActivity || app.android.startActivity;
    const FILE_CODE = 1231;
    const intent = new android.content.Intent(android.content.Intent.ACTION_GET_CONTENT);
    intent.setType(params.extensions ? params.extensions.join(' | ') : '*/*');
    intent.addCategory(android.content.Intent.CATEGORY_OPENABLE);
    intent.setAction(android.content.Intent.ACTION_OPEN_DOCUMENT);
    intent.putExtra(android.content.Intent.EXTRA_ALLOW_MULTIPLE, !!params.multipleSelection);
    return callIntent(context, intent, FILE_CODE).then((result: any) => {
        if (result.resultCode === android.app.Activity.RESULT_OK) {
            if (result.intent != null) {
                const uri = result.intent.getData();
                return {
                    files: [com.nativescript.documentpicker.FilePath.getPath(context, uri)],
                    android: uri
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
