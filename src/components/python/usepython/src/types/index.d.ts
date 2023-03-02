export {};

declare global {
    interface Window {
        showDirectoryPicker: Function; // 👈️ turn off type checking
        showSaveFilePicker: Function; // 👈️ turn off type checking
        showOpenFilePicker: Function; // 👈️ turn off type checking
    }
}