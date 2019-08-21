import {FilePickerOptions} from "./simple-filepicker.common";

export function openFilePicker(params?: FilePickerOptions): Promise<{ files: string[] }>;
