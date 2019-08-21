# NativeScript Simple FilePicker Plugin

A simple plugin for providing file picker functionality to your NativeScript app.

## Installation

```
tns plugin add nativescript-simple-filepicker
```

## Usage 

``` TypeScript
import { openFilePicker } from 'nativescript-simple-filepicker';

openFilePicker({
    extensions?: string[]; // Defaults to all
    multipleSelection?: boolean; // Defaults to false
}).then((data) => {
    console.log(data.files);
});

```

## License

MIT
