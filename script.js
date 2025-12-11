document.addEventListener('DOMContentLoaded', () => {
    
    const creationForm = document.getElementById('creation-form');
    if (creationForm) {
        let accordionData = [];
        const btnAdd = document.getElementById('btn-add');
        const btnSave = document.getElementById('btn-save');
        const previewList = document.getElementById('preview-list');

        btnAdd.addEventListener('click', () => {
            const titleInput = document.getElementById('acc-title');
            const contentInput = document.getElementById('acc-content');
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();

            if (title && content) {
                accordionData.push({ title: title, content: content });
                renderPreview();
                titleInput.value = '';
                contentInput.value = '';
            } else {
                alert('Empty fields');
            }
        });

        btnSave.addEventListener('click', () => {
            if (accordionData.length === 0) {
                alert('List is empty');
                return;
            }
            fetch('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(accordionData)
            })
            .then(r => r.json())
            .then(d => alert(d.message))
            .catch(e => console.error(e));
        });

        function renderPreview() {
            previewList.innerHTML = '';
            accordionData.forEach((item, index) => {
                previewList.innerHTML += `
                    <div class="item-preview">
                        <strong>${index + 1}. ${item.title}</strong><br>
                        ${item.content}
                    </div>
                `;
            });
        }
    }

    const accordionContainer = document.getElementById('accordion-container');
    if (accordionContainer) {
        let lastDataHash = '';

        function loadData() {
            fetch('api.php')
                .then(r => r.json())
                .then(data => {
                    const str = JSON.stringify(data);
                    if (str !== lastDataHash) {
                        renderAccordion(data);
                        lastDataHash = str;
                    }
                })
                .catch(e => console.error(e));
        }

        function renderAccordion(data) {
            accordionContainer.innerHTML = '';
            if (!Array.isArray(data) || data.length === 0) {
                accordionContainer.innerHTML = '<p>No data</p>';
                return;
            }

            data.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'accordion-item';

                const header = document.createElement('div');
                header.className = 'accordion-header';
                header.innerHTML = `<span>${item.title}</span> <span class="icon">+</span>`;

                const content = document.createElement('div');
                content.className = 'accordion-content';
                content.innerHTML = `<p>${item.content}</p>`;

                header.addEventListener('click', () => {
                    const isActive = content.classList.contains('active');
                    const icon = header.querySelector('.icon');

                    if (isActive) {
                        content.classList.remove('active');
                        content.style.maxHeight = null;
                        icon.innerText = '+';
                    } else {
                        content.classList.add('active');
                        content.style.maxHeight = content.scrollHeight + "px";
                        icon.innerText = '-';
                    }
                });

                itemDiv.appendChild(header);
                itemDiv.appendChild(content);
                accordionContainer.appendChild(itemDiv);
            });
        }

        loadData();
        setInterval(loadData, 3000);
    }
});