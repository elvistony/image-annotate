let annotationCounter = 1;
let annotations = [];
let currentImageFileName = "";
let scale = 1;
let img = new Image();
let selectedAnnotationId = null;
let viewMode = true;



function drawImageOnCanvas(img) {
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
 
        let deleteBtn;

        if(viewMode){
            deleteBtn=''
        }else{
            deleteBtn=`<button onclick="deleteAnnotation(${ann.id})" class="btn btn-danger" type="button"><i class="fa fa-trash"></i></button>`
        }

        const card = document.createElement('div');
        card.className = `annotation-card ${(selectedAnnotationId === ann.id)?"active":""}`;
        card.innerHTML = `
        <span class="label-index ${(selectedAnnotationId === ann.id)?"active":""}">${index+1}</span>
        <div class="input-group input-group-sm mb-1">
        <input type="text" class="form-control" placeholder="Title" ${(viewMode)?"readonly":""} value="${ann.title || ''}" aria-describedby="button-addon2">
        ${deleteBtn}
        
        </div>
        <textarea class="form-control sub-details" ${(viewMode)?"readonly":""} data-id="${ann.id}">${ann.desc}</textarea>
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

// document.getElementById('projectImport').addEventListener('change', async (e) => {
//       const file = e.target.files[0];
//     //   document.getElementById('intro').style.display='none';
//       if (!file || !file.name.endsWith('.limg')) return;
//       document.getElementById('project-name').value = file.name.replace('.limg','');
//       const zip = await JSZip.loadAsync(file);
//       const jsonStr = await zip.file('label.json').async('string');
//       const data = JSON.parse(jsonStr);
//       const imgBlob = await zip.file(data.image.filename).async('blob');
 
//       currentImageFileName = data.image.filename;
//       annotations = data.labels;
//       annotationCounter = annotations.length + 1;
 
//       img.onload = () => {
//         drawImageOnCanvas(img);
//       };
//       img.src = URL.createObjectURL(imgBlob);

//     });