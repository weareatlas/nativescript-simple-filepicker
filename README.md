# NativeScript Simple FilePicker Plugin

A simple plugin for providing file picker functionality to your NativeScript app.

## Installation

```
tns plugin add nativescript-simple-filepicker
```

## Usage 

Unlike other nativescript webview plugins the simple webview plugin exposes a `SimpleWebView` interface with a single instance method named `close()`.

``` TypeScript
import { openFilePicker } from 'nativescript-simple-filepicker';

openFilePicker();

```

## License

MIT
