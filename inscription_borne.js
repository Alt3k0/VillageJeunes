/**
 * inscription_borne.js
 * Fichier JS correspondant à inscription-complete.html.
 * Dépendances (à charger avant) : script.js (étapes, validation, soumission), form-data.js (provinces/communes), validation.js.
 * Ce module ajoute la pagination type borne : plusieurs étapes visibles par écran, bouton Suivant en bas.
 */
(function () {
    'use strict';

    var totalSteps = 8;
    var currentDisplayPage = 1;
    var stepsPerPage = 1;
    var totalDisplayPages = 1;
    var originalShowStep, originalNextStep, originalPreviousStep;
    var borneActive = false;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function numLogicalSteps() {
        return typeof isUnder18 === 'function' && isUnder18() ? 8 : 7;
    }

    function getAvailableHeight() {
        var vh = 0;
        if (typeof window !== 'undefined') {
            vh = window.visualViewport && window.visualViewport.height ? window.visualViewport.height : window.innerHeight;
        }
        if (vh <= 0) vh = 800;
        var reserved = 380;
        return Math.max(400, vh - reserved);
    }

    function measureStepHeights() {
        var n = numLogicalSteps();
        var heights = [];
        var formContainer = document.querySelector('.page-inscription .form-container');
        if (!formContainer) return heights;
        var wasHidden = formContainer.style.visibility === 'hidden';
        formContainer.style.visibility = 'hidden';
        for (var i = 1; i <= totalSteps; i++) {
            var el = document.getElementById('step' + i);
            if (!el) { heights[i] = 0; continue; }
            if (i === 8 && n === 7) { heights[i] = 0; continue; }
            for (var j = 1; j <= totalSteps; j++) {
                var s = document.getElementById('step' + j);
                if (s) s.classList.remove('active');
            }
            el.classList.add('active');
            heights[i] = el.offsetHeight || 0;
            el.classList.remove('active');
        }
        formContainer.style.visibility = wasHidden ? 'hidden' : '';
        var first = document.getElementById('step1');
        if (first) first.classList.add('active');
        return heights;
    }

    function computeStepsPerPage() {
        var available = getAvailableHeight();
        var n = numLogicalSteps();
        var heights = measureStepHeights();
        var sum = 0;
        var k = 0;
        for (var i = 1; i <= n; i++) {
            if (!heights[i]) continue;
            if (sum + heights[i] <= available) {
                sum += heights[i];
                k++;
            } else {
                break;
            }
        }
        return Math.max(1, k);
    }

    function updateDisplayPageState() {
        var n = numLogicalSteps();
        stepsPerPage = computeStepsPerPage();
        totalDisplayPages = Math.ceil(n / stepsPerPage);
        currentDisplayPage = Math.min(currentDisplayPage, totalDisplayPages);
    }

    function showStepsForDisplayPage(page) {
        var n = numLogicalSteps();
        var start = (page - 1) * stepsPerPage + 1;
        var end = Math.min(n, page * stepsPerPage);

        for (var i = 1; i <= totalSteps; i++) {
            var el = document.getElementById('step' + i);
            if (!el) continue;
            el.classList.remove('active', 'last-in-page');
            if (i >= start && i <= end) {
                el.classList.add('active');
                if (i === end) el.classList.add('last-in-page');
            }
        }

        /* Gestion étape 8 (mineurs) */
        var step8El = document.getElementById('step8');
        if (step8El && n === 7) step8El.style.display = 'none';
        if (step8El && n === 8) step8El.style.display = 'flex';

        /* Bouton étape 7 */
        if (typeof isUnder18 === 'function' && end >= 7) {
            var btn7 = document.getElementById('btn-step7-next');
            if (btn7) {
                if (!isUnder18()) {
                    btn7.textContent = 'Je valide mes informations';
                    btn7.className = 'btn-submit';
                    btn7.onclick = function () { submitForm(); };
                } else {
                    btn7.textContent = 'Suivant';
                    btn7.className = 'btn-next';
                    btn7.onclick = function () { nextStep(); };
                }
            }
        }

        /* Dots : afficher totalDisplayPages, actif = page */
        for (var d = 1; d <= totalSteps; d++) {
            var dot = document.getElementById('dot' + d);
            if (!dot) continue;
            if (d === 8 && n === 7) { dot.style.display = 'none'; continue; }
            if (d <= totalDisplayPages) {
                dot.style.display = 'inline-block';
                dot.classList.toggle('active', d === page);
            } else {
                dot.style.display = 'none';
            }
        }

        if (typeof currentStep !== 'undefined') currentStep = end;
    }

    function borneNextStep() {
        var validation = typeof getVisibleStepsValidation === 'function' ? getVisibleStepsValidation() : { valid: true };
        if (!validation.valid && typeof showValidationErrors === 'function') {
            showValidationErrors(validation);
            return;
        }
        if (currentDisplayPage < totalDisplayPages) {
            currentDisplayPage++;
            showStepsForDisplayPage(currentDisplayPage);
            var fc = document.querySelector('.form-container');
            if (fc) fc.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (typeof originalNextStep === 'function') {
            originalNextStep();
        }
    }

    function bornePreviousStep() {
        if (currentDisplayPage > 1) {
            currentDisplayPage--;
            showStepsForDisplayPage(currentDisplayPage);
            var fc = document.querySelector('.form-container');
            if (fc) fc.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (typeof originalPreviousStep === 'function') {
            originalPreviousStep();
        }
    }

    function wireButtons() {
        document.querySelectorAll('.page-inscription .btn-next, .page-inscription .btn-previous').forEach(function (btn) {
            var isNext = btn.classList.contains('btn-next');
            btn.onclick = isNext ? borneNextStep : bornePreviousStep;
        });
    }

    function borneShowStep(step) {
        if (!borneActive) return;
        var page = Math.max(1, Math.min(totalDisplayPages, Math.ceil(step / stepsPerPage)));
        currentDisplayPage = page;
        showStepsForDisplayPage(page);
    }

    function init() {
        if (!document.body.classList.contains('page-inscription')) return;

        originalShowStep = window.showStep;
        originalNextStep = window.nextStep;
        originalPreviousStep = window.previousStep;

        window.nextStep = borneNextStep;
        window.previousStep = bornePreviousStep;
        window.showStep = function (step) {
            if (borneActive) borneShowStep(step); else originalShowStep(step);
        };

        setTimeout(function () {
            borneActive = true;
            updateDisplayPageState();
            showStepsForDisplayPage(1);
            wireButtons();
        }, 100);

        window.addEventListener('resize', function () {
            if (!borneActive) return;
            updateDisplayPageState();
            showStepsForDisplayPage(currentDisplayPage);
        });
    }
})();
