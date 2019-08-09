import * as utils from 'tns-core-modules/utils/utils';
import {FilePickerOptions} from "./index";

class DocumentPickerDelegateImpl extends NSObject implements UIDocumentPickerDelegate {

    private _resolve: any;
    private _reject: any;

    static ObjCProtocols = [UIDocumentPickerDelegate];

    constructor() {
        super();
    }

    public static initWithResolveReject = function (resolve, reject) {
        const delegate = <DocumentPickerDelegateImpl>DocumentPickerDelegateImpl.new();
        delegate._resolve = resolve;
        delegate._reject = reject;
        return delegate;
    };

    cleanup(controller) {
        this._resolve = null;
        this._reject = null;
        controller.delegate = null;
    }

    documentPickerDidPickDocumentAtURL(controller, url) {
        this._resolve({
            files: [url.absoluteString],
            ios: url
        });
        this.cleanup(controller);
    }

    documentPickerDidPickDocumentsAtURLs(controller, urls) {
        const output = [];
        for (let i = 0; i < urls.count; i++) {
            output.push(urls[i].absoluteString);
        }
        this._resolve({
            files: output,
            ios: urls
        });
        this.cleanup(controller);
    }

    documentPickerWasCancelled(controller) {
        this._reject('cancelled');
        this.cleanup(controller);
    }
}

export const openFilePicker = (params?: FilePickerOptions) => {
    let documentTypes: any;
    if (!params) {
        params = {};
    }
    if (!params.extensions) {
        params.extensions = ['public.data'];
    }
    if (params.extensions && params.extensions.length > 0) {
        documentTypes = utils.ios.collections.jsArrayToNSArray(params.extensions);
    }
    return new Promise(function (resolve, reject) {
        const delegate = DocumentPickerDelegateImpl.initWithResolveReject(resolve, reject);
        const controller = UIDocumentPickerViewController.alloc().initWithDocumentTypesInMode(documentTypes, params.pickerMode !== undefined ? params.pickerMode : 0);
        controller.allowsMultipleSelection = !!params.multipleSelection;
        if (delegate) {
            controller.delegate = delegate;
            const app = UIApplication.sharedApplication;
            const window = app.keyWindow || (app.windows.count > 0 && app.windows[0]);
            const visibleVC = utils.ios.getVisibleViewController(window.rootViewController);
            visibleVC.presentViewControllerAnimatedCompletion(controller, true, null);
        }
    });
};
