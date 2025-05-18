// Annotate

    let currentTool = 'annotate';
    // let annotationCounter = 1;
    let historyStack = [];
    let redoStack = [];
    // let currentImageFileName = "";
    // let scale = 1;
    // let img = new Image();
    // let selectedAnnotationId = null;
    // let viewMode = true;
    viewMode = false;
 
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

    // function drawImageOnCanvas() {
    //   const canvas = document.getElementById('imageCanvas');
    //   const ctx = canvas.getContext('2d');
    //   const maxWidth = window.innerWidth * 0.8;
    //   const maxHeight = window.innerHeight * 0.9;
    //   scale = Math.min(maxWidth / img.width, maxHeight / img.height);
    //   canvas.width = img.width * scale;
    //   canvas.height = img.height * scale;
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    //   renderAnnotations();
    // }
 
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
          drawImageOnCanvas(img);
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
 
    // function renderAnnotations() {
    //   const overlay = document.getElementById('markerOverlay');
    //   const list = document.getElementById('annotationList');
    //   overlay.innerHTML = '';
    //   list.innerHTML = '';
    //   overlay.style.width = `${img.width * scale}px`;
    //   overlay.style.height = `${img.height * scale}px`;
 
    //   annotations.forEach((ann, index) => {
    //     const marker = document.createElement('div');
    //     marker.className = 'annotation-marker';
    //     marker.style.pointerEvents='auto';
    //     marker.style.left = `${ann.x * scale - 15}px`;
    //     marker.style.top = `${ann.y * scale - 15}px`;
    //     marker.textContent = index + 1;
    //     marker.setAttribute('data-title',ann.title || '')
    //     // marker.title = ann.desc;
    //     marker.dataset.id = ann.id;
    //     if (selectedAnnotationId === ann.id) marker.classList.add('active');
    //     marker.onclick = () => {
    //       selectedAnnotationId = ann.id;
    //       renderAnnotations();
    //     };
    //     overlay.appendChild(marker);
 
    //     const card = document.createElement('div');
    //     card.className = `annotation-card ${(selectedAnnotationId === ann.id)?"active":""}`;
    //     card.innerHTML = `
    //     <span class="label-index ${(selectedAnnotationId === ann.id)?"active":""}">${index+1}</span>
    //     <div class="input-group input-group-sm mb-1">
    //     <input type="text" class="form-control" placeholder="Title" value="${ann.title || ''}" aria-describedby="button-addon2">
    //     <button onclick="deleteAnnotation(${ann.id})" class="btn btn-danger" type="button"><i class="fa fa-trash"></i></button>
    //     </div>
    //     <textarea class="form-control sub-details" data-id="${ann.id}">${ann.desc}</textarea>
    //     `;
 
 
    //     card.onclick = () => {
    //         console.log(event.target.tagName in ['BUTTON','TEXTAREA','INPUT'])
    //     if(!['BUTTON','TEXTAREA','INPUT'].includes(event.target.tagName )){
    //         selectedAnnotationId = ann.id;
    //         renderAnnotations();
          
    //     }
         
    //     };
    //     const textarea = card.querySelector('textarea');
    //     const titleInput = card.querySelector('input');
    //     titleInput.addEventListener('focus', () => {
    //       selectedAnnotationId = ann.id;
    //     //   renderAnnotations();
    //     });
    //     textarea.addEventListener('focus', () => {
    //       selectedAnnotationId = ann.id;
    //     //   renderAnnotations();
    //     });
    //     titleInput.addEventListener('input', (e) => {
    //       ann.title = e.target.value;
    //     });
    //     textarea.addEventListener('input', (e) => {
    //       ann.desc = e.target.value;
    //     });
 
    //     list.appendChild(card);
    //   });
    // }
 
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
        drawImageOnCanvas(img);
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

async function  openDivWithCanvasInNewTab() {
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
    var res = await fetch('assets/templates/printmode.html');
    let htmlContent = await res.text();
    newTab.document.write(htmlContent);
    newTab.document.close();

    // Canvas Import
    const originalCanvas = originalContainer.querySelector('canvas');
    const clonedCanvas = originalCanvas.cloneNode(true);
    clonedCanvas.width = originalCanvas.width;
    clonedCanvas.height = originalCanvas.height;
    const originalCtx = originalCanvas.getContext('2d');
    const clonedCtx = clonedCanvas.getContext('2d');
    if (originalCtx && clonedCtx) {
        const dataURL = originalCanvas.toDataURL();
        const img = new newTab.Image(); // Create an Image object in the new tab's context
        img.onload = function() {
        clonedCtx.drawImage(img, 0, 0);
        };
        img.onerror = function() {
        console.error("Error loading canvas image data into new tab's image element.");
        }
        img.src = dataURL;
    }
    
    newTab.document.querySelector('#main-canvas').replaceWith(document.querySelector('.main-canvas').cloneNode(true));
    newTab.document.querySelector('.main-canvas').classList.remove('position-absolute')
    newTab.document.querySelector('#imageCanvas').replaceWith(clonedCanvas)
    newTab.document.querySelector('#project-name').innerHTML=document.getElementById('project-name').value;
    newTab.document.querySelector('#label-list').appendChild(document.getElementById('annotationList').cloneNode(true));
    // Label Import
    
  } else {
    console.error("Could not open a new tab. Pop-up blocker might be active.");
  }
}

// Export as WebView

async function saveProjectAsHTML() {
  try {
    const response = await fetch(img.src);
    const blob = await response.blob();
    const reader = new FileReader();
    const base64Image = await new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const labelData = {
      image: { filename: currentImageFileName },
      labels: annotations
    };
    const labelJson = JSON.stringify(labelData, null, 2);
    var res = fetch('assets/templates/savemode.html').then((res)=>{
        return res.text();
    }).then((htmlContent)=>{
        htmlContent = htmlContent.replace('{{BASE64}}',base64Image)
        htmlContent = htmlContent.replace('{{PROJECTNAME}}',projectName)
        htmlContent = htmlContent.replace('{{JSONDATA}}',labelJson)
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        const htmlObjectURL = URL.createObjectURL(htmlBlob);
        const a = document.createElement('a');
        a.href = htmlObjectURL;
        a.download = (document.getElementById('project-name').value || "project") + '.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(htmlObjectURL);
    })
  } catch (error) {
    console.error("Error saving project as HTML:", error);
  }
}

// Import WebView

function readTextFile() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt, .log, .text, .md, .js, .json, .html, .css'; // Accept only text files. Add more if needed
    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) {
        reject('No file selected.');
        return;
      }
      if (!file.type.startsWith('text/') &&
          file.type !== 'application/json' &&  // add json
          file.type !== 'application/javascript' && // add js
          file.type !== 'text/html' && // add html
          file.type !== 'text/css' // add css
         )
       {
          reject('Invalid file type. Please select a text file.');
          return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });

      reader.addEventListener('error', () => {
        reject('Error reading file.');
      });

      reader.addEventListener('abort', () => {
        reject('File reading aborted.');
      });
      reader.readAsText(file);
    });
    input.click();
  });
}

function importWebView(){
readTextFile()
  .then(textContent => {
    // console.log('File content:', htmlContent);
    let htmlContent = textContent;
    let base64Data =  htmlContent.split('visibility: hidden;" src="')[1].split('" alt="">')[0];
    let jsonData =  htmlContent.split('jsonStr = `')[1].split('`;')[0];
    // console.log(base64Image)
    console.log(jsonData)
    // let img = new Image()
    img.src = base64Data;
    img.onload = ()=>{
        loadEmbeddedData(jsonData,img);
    }
  })
  .catch(error => {
    console.log(error)
    Swal.fire('Error Processing File',"Please ensure you're imporing a PixelPointer WebView export",'warning')
  });
}