# Pixel Pointer v0.3-alpha
A ~Simple~ Image Annotator. Period.

![A Screenshot of the annotator tool in action!](/examples/screenshots/demo_v2.png)

# Demo
Click for a Live Demo!: [Pixel Pointer](https://elvistony.dev/image-annotate)

![A Screenshot of the annotator tool in action!](/examples/screenshots/close-up.png)
## Features
- Import images of various formats (`png`,`jpg`,`svg`,`tiff`,`gif`)
- Uses client computation for the whole processing.
- Runs on your favorite browsers (`chrome`,`firefox`,`edge`)
- Uses a project style architecture with a custom file format `.limg` (Labelled Image)
- A Menu Bar (sorta) layout. ![](/examples/screenshots/menu_file.png)
- Keyboard shortcuts!
    - `Ctrl+I` to Import a new Image
    - `Ctrl+O` to Open a `.limg` project
    - `Ctrl+S` to Save
    - `Ctrl+Z` to Undo and `Ctrl+Y` to Redo
- Export as WebView! (A single html file that has everything you need to view it interactively!)

## Upcoming (Under Development)
- Export as PDF document
- Export as PNG (maybe?)
- Export as (something cool)


## Why?
An app for this, an app for that, this is a webpage that can open up in your browser that can annotate images of various formats (see docs). when working in organizations with strict policies around software, it's often pretty hard to get permissions to use software. With this project, I'm hoping that anyone who needs this can run this off their browser with all the processing performed on your machine!

## Supporting Libraries
- [JSZip](https://github.com/Stuk/jszip) A Javascript based Zip file handler (pretty neat!) [MIT Licensed]
- [Sweetalert2](https://github.com/sweetalert2/sweetalert2) An alert and popup dialog library (easy and stylish) [MIT Licensed]
- [Bootstrap 5.3](https://github.com/twbs/bootstrap/tree/main) One of the best UI Libraries (still learning but pretty cool!) [MIT Licensed]

## Getting Started
- clone this repository `@elvistony/image-annotate`
- open up the index.html
- voila!

## `.limg` ... what's that?
Its a 'made up' file extension for Labelled Images. It's effectively a zip file that contains the image and a json file.

```
sample.limg
            /image.png
            /label.json
```
You can rename the `<yourproject>.limg` project file to `<yourproject>.zip` and open the `.zip` file in a viewer of your choice.

## Examples
- Open `index.html` and click `IMPORT`
- Select `examples/twine-overload-party.limg` 


