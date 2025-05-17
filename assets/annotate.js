// const Swal = require('sweetalert2')

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

// Annotate

    let currentTool = 'annotate';
    let annotationCounter = 1;
    let annotations = [];
    let historyStack = [];
    let redoStack = [];
    let currentImageFileName = "";
    let scale = 1;
    let img = new Image();
    let selectedAnnotationId = null;
 
    function setTool(tool) {
      currentTool = tool;
      document.querySelector('.tool-button.active').classList.remove('active')
      document.querySelector('#opt-'+tool).classList.add('active')
    }
 
    function saveToHistory() {
      historyStack.push(JSON.stringify(annotations));
      redoStack = [];
    }
 
    function undo() {
      if (historyStack.length === 0) return;
      redoStack.push(JSON.stringify(annotations));
      annotations = JSON.parse(historyStack.pop());
      annotationCounter = annotations.length + 1;
      renderAnnotations();
    }
 
    function redo() {
      if (redoStack.length === 0) return;
      historyStack.push(JSON.stringify(annotations));
      annotations = JSON.parse(redoStack.pop());
      annotationCounter = annotations.length + 1;
      renderAnnotations();
    }
 
    function newProject() {
      document.getElementById('newImageInput').click();
    //   document.getElementById('intro').style.display='none';
    }
 
    // newProject()

    function drawImageOnCanvas() {
      const canvas = document.getElementById('imageCanvas');
      const ctx = canvas.getContext('2d');
      const maxWidth = window.innerWidth * 0.8;
      const maxHeight = window.innerHeight * 0.9;
      scale = Math.min(maxWidth / img.width, maxHeight / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      renderAnnotations();
    }
 
    const randomWords = ["victory","smiling","snuggle","rabbit","overload","downhill","portrayal","twine","modernist","outlet","amount","nitrate","gridlock","jovial","party","protagonist","second","degree","swallow","empire","relapse"]
    const projectName = randomWords[Math.floor(Math.random() * randomWords.length)]+'-'+randomWords[Math.floor(Math.random() * randomWords.length)]+'-'+randomWords[Math.floor(Math.random() * randomWords.length)];
    document.getElementById('project-name').value = projectName

    document.getElementById('newImageInput').addEventListener('change', (e) => {
     
      const file = e.target.files[0];
      if (!file) return;
      currentImageFileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        img.onload = () => {
          annotations = [];
          annotationCounter = 1;
          historyStack = [];
          redoStack = [];
          drawImageOnCanvas();
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
 
    function saveProject() {
      const zip = new JSZip();
      fetch(img.src)
        .then(res => res.blob())
        .then(blob => {
          zip.file(currentImageFileName, blob);
          zip.file('label.json', JSON.stringify({
            image: { filename: currentImageFileName },
            labels: annotations
          }, null, 2));
          zip.generateAsync({ type: 'blob' }).then(content => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(content);
            a.download = (document.getElementById('project-name').value || "project")+'.limg';
            a.click();
          });
        });
    }
 
    function renderAnnotations() {
      const overlay = document.getElementById('markerOverlay');
      const list = document.getElementById('annotationList');
      overlay.innerHTML = '';
      list.innerHTML = '';
      overlay.style.width = `${img.width * scale}px`;
      overlay.style.height = `${img.height * scale}px`;
 
      annotations.forEach((ann, index) => {
        const marker = document.createElement('div');
        marker.className = 'annotation-marker';
        marker.style.pointerEvents='auto';
        marker.style.left = `${ann.x * scale - 15}px`;
        marker.style.top = `${ann.y * scale - 15}px`;
        marker.textContent = index + 1;
        marker.setAttribute('data-title',ann.title || '')
        // marker.title = ann.desc;
        marker.dataset.id = ann.id;
        if (selectedAnnotationId === ann.id) marker.classList.add('active');
        marker.onclick = () => {
          selectedAnnotationId = ann.id;
          renderAnnotations();
        };
        overlay.appendChild(marker);
 
        const card = document.createElement('div');
        card.className = `annotation-card ${(selectedAnnotationId === ann.id)?"active":""}`;
        card.innerHTML = `
        <span class="label-index ${(selectedAnnotationId === ann.id)?"active":""}">${index+1}</span>
        <div class="input-group input-group-sm mb-1">
        <input type="text" class="form-control" placeholder="Title" value="${ann.title || ''}" aria-describedby="button-addon2">
        <button onclick="deleteAnnotation(${ann.id})" class="btn btn-danger" type="button"><i class="fa fa-trash"></i></button>
        </div>
        <textarea class="form-control sub-details" data-id="${ann.id}">${ann.desc}</textarea>
        `;
 
 
        card.onclick = () => {
            console.log(event.target.tagName in ['BUTTON','TEXTAREA','INPUT'])
        if(!['BUTTON','TEXTAREA','INPUT'].includes(event.target.tagName )){
            selectedAnnotationId = ann.id;
            renderAnnotations();
          
        }
         
        };
        const textarea = card.querySelector('textarea');
        const titleInput = card.querySelector('input');
        titleInput.addEventListener('focus', () => {
          selectedAnnotationId = ann.id;
        //   renderAnnotations();
        });
        textarea.addEventListener('focus', () => {
          selectedAnnotationId = ann.id;
        //   renderAnnotations();
        });
        titleInput.addEventListener('input', (e) => {
          ann.title = e.target.value;
        });
        textarea.addEventListener('input', (e) => {
          ann.desc = e.target.value;
        });
 
        list.appendChild(card);
      });
    }
 
    function deleteAnnotation(id) {

      Swal.fire({
        icon:'danger',
        title: 'Do you want to delete this Label?',
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        customClass: {
            actions: 'my-actions',
            // cancelButton: 'order-1 right-gap',
            confirmButton: 'order-2',
            denyButton: 'order-3',
        },
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Deleted!', 'You can go back by pressing Ctrl+Z to Undo', 'success')
            saveToHistory();
            annotations = annotations.filter(a => a.id !== id);
            annotationCounter = annotations.length + 1;
            selectedAnnotationId = null;
            renderAnnotations();
        }
        });
      
    }

    let imageBlob;
 
    document.getElementById('imageCanvas').addEventListener('click', (e) => {
      if (currentTool !== 'annotate') return;
      const rect = e.target.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
 
      saveToHistory();
 
      annotations.push({ id: Date.now(), x, y, desc: 'Description here' });
      annotationCounter++;
      renderAnnotations();
    });
 
    document.getElementById('projectImport').addEventListener('change', async (e) => {
      const file = e.target.files[0];
    //   document.getElementById('intro').style.display='none';
      if (!file || !file.name.endsWith('.limg')) return;
      document.getElementById('project-name').value = file.name.replace('.limg','');
      const zip = await JSZip.loadAsync(file);
      const jsonStr = await zip.file('label.json').async('string');
      const data = JSON.parse(jsonStr);
      const imgBlob = await zip.file(data.image.filename).async('blob');
 
      currentImageFileName = data.image.filename;
      annotations = data.labels;
      annotationCounter = annotations.length + 1;
 
      img.onload = () => {
        drawImageOnCanvas();
      };
      img.src = URL.createObjectURL(imgBlob);

    });
 
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        document.getElementById('projectImport').click()
      }
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        newProject()
      }
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveProject();
      }
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        printMainCanvas();
      }
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      }
      if (e.key === 'Delete' && selectedAnnotationId !== null) {
        deleteAnnotation(selectedAnnotationId);
      }
    });

// Annotate Ends

// Print Function
let NEWWINDOW;
function printMainCanvas() {
    const canvasContainer = document.getElementById('canvasContainer');
    NEWWINDOW = window.open('', '_blank');
    const doc = NEWWINDOW.document;
    doc.head.innerHTML=`
    <link rel="stylesheet" href="assets/annotate.css">
    `
    doc.body.appendChild(doc.importNode(canvasContainer,true))
    canvasContainer.toBlob((blob) => {
        canvas = canvasContainer.querySelector('canvas');
        const newImg = document.createElement("img");
        const url = URL.createObjectURL(blob);

        newImg.src = url;
        doc.body.querySelector('canvas').renderImage(url)
    });
    

//   // Create the document structure
//   const doc = NEWWINDOW.document;

//   const html = doc.createElement('html');
//   const head = doc.createElement('head');
//   const title = doc.createElement('title');
//   title.textContent = 'Print Preview';

//   const style = doc.createElement('style');
//   style.textContent = `
//     @media print {
//       @page {
//         size: A4 portrait;
//         margin: 1in;
//       }
//       body {
//         font-family: sans-serif;
//         margin: 0;
//         padding: 0;
//       }
//       .print-container {
//         padding: 1em;
//       }
//     }
//   `;

//   head.appendChild(title);
//   head.appendChild(style);
//   html.appendChild(head);

//   const body = doc.createElement('body');
//   const container = doc.createElement('div');
//   container.className = 'print-container';

//   // Clone mainCanvas content
//   const canvasClone = canvas.cloneNode(true);
//   container.appendChild(canvasClone);

//   // Create list
//   const heading = doc.createElement('h3');
//   heading.textContent = 'List Below:';
//   container.appendChild(heading);

//   const list = doc.createElement('ul');
//   ['Item A', 'Item B', 'Item C'].forEach(text => {
//     const li = doc.createElement('li');
//     li.textContent = text;
//     list.appendChild(li);
//   });
//   container.appendChild(list);

//   body.appendChild(container);
//   html.appendChild(body);
//   doc.innerHTML = html.outerHTML;

//   // Add print script after DOM is loaded
//   doc.close();
//   printWindow.onload = function () {
//     printWindow.focus();
//     printWindow.print();
//     printWindow.onafterprint = function () {
//       printWindow.close();
//     };
//   };
}

function openDivWithCanvasInNewTab() {
  const originalContainer = document.getElementById('main-body');

  if (!originalContainer) {
    console.error("Div container with ID 'CanvasContainer' not found.");
    return;
  }

  // Create a new window
  const newTab = window.open('', '_blank'); // Open a blank tab

  if (newTab) {
    // It's good practice to ensure the document in the new tab is ready
    // A minimal HTML structure can be written.
    newTab.document.open();
    newTab.document.write(`<html><head>
        <title>Print to PDF</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="assets/annotate.css">
        <link rel="stylesheet" href="assets/printmode.css">
        </head>
        <body></body></html>`);
    newTab.document.close();

    // 1. Clone the entire container's DOM structure
    const clonedContainer = originalContainer.cloneNode(true);

    // 2. Apply the original container's computed styles to the cloned container
    // const computedStyle = window.getComputedStyle(originalContainer);
    // for (const property of computedStyle) {
    //   clonedContainer.style[property] = computedStyle[property];
    // }

    // 3. Append the cloned container (with its structure) to the new tab's body
    newTab.document.body.appendChild(clonedContainer);

    // 4. Now, specifically handle the canvas elements to copy their content
    const originalCanvases = originalContainer.querySelectorAll('canvas');
    const clonedCanvases = clonedContainer.querySelectorAll('canvas'); // These are the canvases inside clonedContainer

    if (originalCanvases.length !== clonedCanvases.length) {
        console.warn("Mismatch in the number of original and cloned canvases. Content copy might be incomplete.");
    }

    originalCanvases.forEach((originalCanvas, index) => {
      if (clonedCanvases[index]) {
        const clonedCanvas = clonedCanvases[index];

        // Ensure the cloned canvas has the correct dimensions (cloneNode should handle this, but explicit is safer)
        clonedCanvas.width = originalCanvas.width;
        clonedCanvas.height = originalCanvas.height;

        // Get the 2D context of the original canvas
        const originalCtx = originalCanvas.getContext('2d');
        // Get the 2D context of the cloned canvas (in the new tab)
        const clonedCtx = clonedCanvas.getContext('2d');

        if (originalCtx && clonedCtx) {
          // Option 1: Using drawImage directly (if contexts are compatible and accessible)
          // This might have issues if the new tab is considered a different origin immediately,
          // though for blank tabs it often works.
          // clonedCtx.drawImage(originalCanvas, 0, 0);

          // Option 2: Using toDataURL() - More robust for transferring to a new window/tab
          const dataURL = originalCanvas.toDataURL();
          const img = new newTab.Image(); // Create an Image object in the new tab's context

          img.onload = function() {
            clonedCtx.drawImage(img, 0, 0);
          };
          img.onerror = function() {
            console.error("Error loading canvas image data into new tab's image element.");
          }
          img.src = dataURL;

        } else {
          console.error(`Could not get 2D context for original or cloned canvas at index ${index}.`);
        }
      } else {
        console.warn(`No corresponding cloned canvas found for original canvas at index ${index}.`);
      }
    });

  } else {
    console.error("Could not open a new tab. Pop-up blocker might be active.");
  }
}

// Example of how to attach this to a button click:
// Make sure you have a button with this ID in your HTML:
// <button id="openContainerButton">Open Container in New Tab</button>

// const openButton = document.getElementById('openContainerButton');
// if (openButton) {
//   openButton.addEventListener('click', openDivWithCanvasInNewTab);
// }

// Example of how to attach this to a button click:
// const openButton = document.getElementById('openCanvasButton');
// if (openButton) {
//   openButton.addEventListener('click', openCanvasContainerInNewTab);
// }

// You can call this function when you want to open the canvas in a new tab,
// for example, on a button click:
// const openButton = document.getElementById('openCanvasButton');
// if (openButton) {
//   openButton.addEventListener('click', openCanvasInNewTab);
// }

// Print End