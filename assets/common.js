const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});


function showDocs() {
    Swal.fire('Pixel Pointers', `This is an open source project, Visit <a href="https://github.com/elvistony/image-annotate/" target="_blank">Docs<a> to know more about the software`, '')
}

// Sidebars
function toggleSidebar(side) {
    const body = document.body.classList;
    if (side === 'left') {
        body.toggle('hidden-left');
    } else if (side === 'right') {
        body.toggle('hidden-right');
        document.getElementsByClassName('sidebar-right')[0].classList.toggle('d-sm-show')
    }
}

function loadEmbeddedData(jsonStr,embeddedImage){
    const data = JSON.parse(jsonStr);

    currentImageFileName = data.image.filename;
    annotations = data.labels;
    annotationCounter = annotations.length + 1;

    drawImageOnCanvas(embeddedImage);
}
