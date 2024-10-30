document.addEventListener('DOMContentLoaded', () => {
    const termsContainer = document.getElementById('termsContainer');
    const definitionsContainer = document.getElementById('definitionsContainer');
    const feedback = document.getElementById('feedback');
    const scrambleButton = document.getElementById('scrambleButton');
    const uploadCSV = document.getElementById('uploadCSV');
    const incorrectCountEl = document.getElementById('incorrectCount');
    const elapsedTimeEl = document.getElementById('elapsedTime');
    const bestTimeEl = document.getElementById('bestTime');

    let draggedTerm = null;
    let incorrectCount = 0;
    let startTime = 0;
    let elapsedTimeInterval;
    let bestTime = null;

    function updateTracking() {
        incorrectCountEl.textContent = incorrectCount;
    }

    function startTimer() {
        startTime = Date.now();
        clearInterval(elapsedTimeInterval);
        elapsedTimeInterval = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            elapsedTimeEl.textContent = elapsedSeconds;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(elapsedTimeInterval);
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        if (!bestTime || elapsedSeconds < bestTime) {
            bestTime = elapsedSeconds;
            bestTimeEl.textContent = bestTime;
        }
    }

    function addDragListeners() {
        const terms = document.querySelectorAll('.term');
        const definitions = document.querySelectorAll('.definition');

        terms.forEach(term => {
            term.addEventListener('dragstart', (e) => {
                draggedTerm = term;
                e.dataTransfer.setData('text/plain', term.dataset.match);
                term.classList.add('dragging');
            });

            term.addEventListener('dragend', () => {
                term.classList.remove('dragging');
            });
        });

        definitions.forEach(definition => {
            definition.addEventListener('dragover', (e) => {
                e.preventDefault(); // Allow drop
                definition.classList.add('hovered');
            });

            definition.addEventListener('dragleave', () => {
                definition.classList.remove('hovered');
            });

            definition.addEventListener('drop', (e) => {
                e.preventDefault();
                const matchValue = e.dataTransfer.getData('text/plain');
                const defValue = definition.getAttribute('data-value');

                if (matchValue === defValue) {
                    feedback.textContent = 'Great job!';
                    definition.style.visibility = 'hidden'; // Hide matched definition
                    checkCompletion();
                } else {
                    feedback.textContent = 'Not quite. Try again!';
                    incorrectCount++;
                    updateTracking();
                }

                definition.classList.remove('hovered');
                draggedTerm = null;
            });
        });
    }

    function checkCompletion() {
        const visibleDefinitions = document.querySelectorAll('.definition:not([style*="visibility: hidden"])');
        if (visibleDefinitions.length === 0) {
            stopTimer();
        }
    }

    scrambleButton.addEventListener('click', () => {
        const definitions = Array.from(definitionsContainer.children);
        const shuffledDefinitions = shuffleArray(definitions);
        definitionsContainer.innerHTML = '';
        shuffledDefinitions.forEach(def => definitionsContainer.appendChild(def));
        incorrectCount = 0;
        updateTracking();
        startTimer();
    });

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    addDragListeners();
});
