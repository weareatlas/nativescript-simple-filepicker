import * as utils from 'tns-core-modules/utils/utils';
import {FilePickerOptions} from "./simple-filepicker.common";

const setDocumentPickerDelegate = (value: any) =>  (<any>global).documentPickerDelegate = value;

const getDocumentPickerDelegate = () =>  (<any>global).documentPickerDelegate;

class DocumentPickerDelegateImpl extends NSObject implements UIDocumentPickerDelegate {

    static new(): DocumentPickerDelegateImpl {
        return <DocumentPickerDelegateImpl>super.new();
    }

    static alloc(): DocumentPickerDelegateImpl {
        return <DocumentPickerDelegateImpl>super.alloc();
    }

    private _resolve: (value?: any | PromiseLike<any>) => void;
    private _reject: (reason?: any) => void;

    static ObjCProtocols = [UIDocumentPickerDelegate];

    constructor() {
        super();
    }

    initWithResolveReject(resolve: (value?: any | PromiseLike<any>) => void, reject: (reason?: any) => void): this {
        this.bindResolveReject(resolve, reject);
        return this;
    }

    bindResolveReject(resolve: (value?: any | PromiseLike<any>) => void, reject: (reason?: any) => void) {
        this._resolve = resolve;
        this._reject = reject;
    }

    documentPickerDidPickDocumentAtURL(controller, url) {
        const value = {
            files: [url.absoluteString]
        };
        this._resolve(value);
        setDocumentPickerDelegate(null);
    }

    documentPickerDidPickDocumentsAtURLs(controller, urls) {
        const files = [];
        for (let i = 0; i < urls.count; i++) {
            files.push(urls[i].absoluteString);
        }
        const value = {
            files
        };
        this._resolve(value);
        setDocumentPickerDelegate(null);
    }

    documentPickerWasCancelled(controller) {
        this._reject('Cancelled');
        setDocumentPickerDelegate(null);
    }
}

export const openFilePicker = (params?: FilePickerOptions) => {
    const documentTypes = params && params.extensions && utils.ios.collections.jsArrayToNSArray(params.extensions) || ['public.data'];
    const pickerMode = params && params.pickerMode || 0;
    const allowsMultipleSelection = params && !!params.multipleSelection || false;
    const app = UIApplication.sharedApplication;
    const window = app.keyWindow || (app.windows && app.windows.count > 0 && app.windows[0]);
    const controller = UIDocumentPickerViewController.alloc().initWithDocumentTypesInMode(documentTypes, pickerMode);
    controller.allowsMultipleSelection = allowsMultipleSelection;
    const visibleVC = utils.ios.getVisibleViewController(window.rootViewController);
    visibleVC.presentViewControllerAnimatedCompletion(controller, true, null);
    return new Promise((resolve, reject) =>  {
        setDocumentPickerDelegate(DocumentPickerDelegateImpl.alloc().initWithResolveReject(resolve, reject));
        controller.delegate = getDocumentPickerDelegate();
    });
};
