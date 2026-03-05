/**
 * inscription_borne.js – Pagination dynamique pour inscription_borne.html (Test_fond)
 * Dépendances : script.js (showStep, nextStep, previousStep, isUnder18, getVisibleStepsValidation, showValidationErrors, submitForm)
 * Affiche plusieurs étapes par écran selon la hauteur, bouton Suivant en bas.
 */
(function () {
    'use strict';

    const totalSteps = 8;
    let currentDisplayPage = 1;
    let stepsPerPage = 1;
    let totalDisplayPages = 1;
    let originalShowStep, originalNextStep, originalPreviousStep;
    let borneActive = false;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function numLogicalSteps() {
        return typeof isUnder18 === 'function' && isUnder18() ? 8 : 7;
    }

    function getAvailableHeight() {
        let vh = typeof window !== 'undefined' && window.visualViewport && window.visualViewport.height
            ? window.visualViewport.height
            : (typeof window !== 'undefined' ? window.innerHeight : 800);
        if (vh <= 0) vh = 800;
        const reserved = 380;
        return Math.max(400, vh - reserved);
    }

    function measureStepHeights() {
        const n = numLogicalSteps();
        const heights = [];
        const formContainer = document.querySelector('.page-inscription .form-container');
        if (!formContainer) return heights;
        const wasHidden = formContainer.style.visibility === 'hidden';
        formContainer.style.visibility = 'hidden';
        for (let i = 1; i <= totalSteps; i++) {
            const el = document.getElementById('step' + i);
            if (!el) { heights[i] = 0; continue; }
            if (i === 8 && n === 7) { heights[i] = 0; continue; }
            for (let j = 1; j <= totalSteps; j++) {
                const s = document.getElementById('step' + j);
                if (s) s.classList.remove('active');
            }
            el.classList.add('active');
            heights[i] = el.offsetHeight || 0;
            el.classList.remove('active');
        }
        formContainer.style.visibility = wasHidden ? 'hidden' : '';
        const first = document.getElementById('step1');
        if (first) first.classList.add('active');
        return heights;
    }

    function computeStepsPerPage() {
        const available = getAvailableHeight();
        const n = numLogicalSteps();
        const heights = measureStepHeights();
        let sum = 0;
        let k = 0;
        for (let i = 1; i <= n; i++) {
            if (!heights[i]) continue;
            if (sum + heights[i] <= available) {
                sum += heights[i];
                k++;
            } else break;
        }
        return Math.max(1, k);
    }

    function updateDisplayPageState() {
        const n = numLogicalSteps();
        stepsPerPage = computeStepsPerPage();
        totalDisplayPages = Math.ceil(n / stepsPerPage);
        currentDisplayPage = Math.min(currentDisplayPage, totalDisplayPages);
    }

    function showStepsForDisplayPage(page) {
        const n = numLogicalSteps();
        const start = (page - 1) * stepsPerPage + 1;
        const end = Math.min(n, page * stepsPerPage);

        for (let i = 1; i <= totalSteps; i++) {
            const el = document.getElementById('step' + i);
            if (!el) continue;
            el.classList.remove('active', 'last-in-page');
            if (i >= start && i <= end) {
                el.classList.add('active');
                if (i === end) el.classList.add('last-in-page');
            }
        }

        const step8El = document.getElementById('step8');
        if (step8El && n === 7) step8El.style.display = 'none';
        if (step8El && n === 8) step8El.style.display = 'flex';

        if (typeof isUnder18 === 'function' && end >= 7) {
            const btn7 = document.getElementById('btn-step7-next');
            if (btn7) {
                if (!isUnder18()) {
                    btn7.textContent = 'Je valide mes informations';
                    btn7.className = 'btn-submit';
                    btn7.onclick = () => submitForm();
                } else {
                    btn7.textContent = 'Suivant';
                    btn7.className = 'btn-next';
                    btn7.onclick = () => nextStep();
                }
            }
        }

        for (let d = 1; d <= totalSteps; d++) {
            const dot = document.getElementById('dot' + d);
            if (!dot) continue;
            if (d === 8 && n === 7) { dot.style.display = 'none'; continue; }
            if (d <= totalDisplayPages) {
                dot.style.display = 'inline-block';
                dot.classList.toggle('active', d === page);
            } else dot.style.display = 'none';
        }

        if (typeof currentStep !== 'undefined') window.currentStep = end;
    }

    function borneNextStep() {
        const validation = typeof getVisibleStepsValidation === 'function' ? getVisibleStepsValidation() : { valid: true };
        if (!validation.valid && typeof showValidationErrors === 'function') {
            showValidationErrors(validation);
            return;
        }
        if (currentDisplayPage < totalDisplayPages) {
            currentDisplayPage++;
            showStepsForDisplayPage(currentDisplayPage);
            document.querySelector('.form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (typeof originalNextStep === 'function') {
            originalNextStep();
        }
    }

    function bornePreviousStep() {
        if (currentDisplayPage > 1) {
            currentDisplayPage--;
            showStepsForDisplayPage(currentDisplayPage);
            document.querySelector('.form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (typeof originalPreviousStep === 'function') {
            originalPreviousStep();
        }
    }

    function wireButtons() {
        document.querySelectorAll('.page-inscription .btn-next, .page-inscription .btn-previous').forEach(btn => {
            btn.onclick = btn.classList.contains('btn-next') ? borneNextStep : bornePreviousStep;
        });
    }

    function init() {
        if (!document.body.classList.contains('page-inscription')) return;

        originalShowStep = window.showStep;
        originalNextStep = window.nextStep;
        originalPreviousStep = window.previousStep;

        window.nextStep = borneNextStep;
        window.previousStep = bornePreviousStep;
        window.showStep = function (step) {
            if (borneActive) {
                const page = Math.max(1, Math.min(totalDisplayPages, Math.ceil(step / stepsPerPage)));
                currentDisplayPage = page;
                showStepsForDisplayPage(page);
            } else originalShowStep(step);
        };

        setTimeout(() => {
            borneActive = true;
            updateDisplayPageState();
            showStepsForDisplayPage(1);
            wireButtons();
        }, 100);

        window.addEventListener('resize', () => {
            if (!borneActive) return;
            updateDisplayPageState();
            showStepsForDisplayPage(currentDisplayPage);
        });
    }
})();
