# Image Annotation Tool
A Simple Image Annotator. Period.

![A Screenshot of the annotator tool in action!](/examples/screenshots/demo.png)

# Demo
[Image Annotate](https://elvistony.dev/image-annotate)

## Features
- Import images of various formats (`png`,`jpg`,`svg`,`tiff`,`gif`)
- Uses client computation for the whole processing.
- Runs on your favorite browsers (`chrome`,`firefox`,`edge`)
- Uses a project style architecture with a custom file format `.limg` (Labelled Image)
- Keyboard shortcuts!  
    - `Ctrl+S` to Save
    - `Ctrl+Z` to Undo and `Ctrl+Y` to Redo

## Why?
An app for this, an app for that, this is a webpage that can open up in your browser that can annotate images of various formats (see docs). 

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


