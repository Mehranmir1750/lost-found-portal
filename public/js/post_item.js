 /* TYPE SELECTOR */
        function selectType(type) {
            document.getElementById('postType').value = type === 'lost' ? 'Lost' : 'Found';
            document.getElementById('lostCard').classList.toggle('active', type === 'lost');
            document.getElementById('foundCard').classList.toggle('active', type === 'found');
        }

        /* CHAR COUNTER */
        function updateCharCount() {
            const len = document.getElementById('description').value.length;
            const el  = document.getElementById('charCount');
            el.textContent = `${len} / 500`;
            el.classList.toggle('warn', len > 450);
        }

        /* FILE UPLOAD */
        let selectedFile = null;

        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
                alert('File is too large. Maximum size is 5 MB.');
                return;
            }
            selectedFile = file;
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('uploadInner').innerHTML = `
                    <img src="${e.target.result}" alt="Preview"
                         style="max-height:160px;border-radius:8px;object-fit:contain;pointer-events:none;">
                    <div class="upload-hint" style="margin-top:.5rem;">${file.name}</div>
                `;
                document.getElementById('imagePreview').innerHTML = `
                    <button type="button" class="remove-img" onclick="removeImage()">✕ Remove image</button>
                `;
            };
            reader.readAsDataURL(file);
        }

        function removeImage() {
            selectedFile = null;
            document.getElementById('fileInput').value = '';
            document.getElementById('uploadInner').innerHTML = `
                <div class="upload-icon">📸</div>
                <div class="upload-text">Click to upload or drag &amp; drop</div>
                <div class="upload-hint">JPG or PNG · Max 5 MB</div>
            `;
            document.getElementById('imagePreview').innerHTML = '';
        }

        /* DRAG & DROP */
        const area = document.getElementById('uploadArea');

        area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('dragover'); });
        area.addEventListener('dragleave', () => area.classList.remove('dragover'));
        area.addEventListener('drop', e => {
            e.preventDefault();
            area.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const dt = new DataTransfer();
                dt.items.add(file);
                const fi = document.getElementById('fileInput');
                fi.files = dt.files;
                handleFileSelect({ target: fi });
            }
        });

        /* MAX DATE = TODAY */
        document.getElementById('date').max = new Date().toISOString().split('T')[0];