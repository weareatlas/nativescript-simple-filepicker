export interface FilePickerOptions {
    extensions?: string[];
    multipleSelection?: boolean;
    pickerMode?: number;
}

export function openFilePicker(params?: FilePickerOptions): Promise<{ files: string[]; ios?; android? }>;
