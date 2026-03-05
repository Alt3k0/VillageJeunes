/**
 * Module de validation des entrées utilisateur
 * Bonnes pratiques : type, longueur, format. Prévention injection SQL, XSS, surcharge mémoire.
 */
(function (global) {
    'use strict';

    const VALIDATION = Object.freeze({
        MAX_LENGTH_SHORT: 250,
        MAX_LENGTH_TEXT: 1000,
        MAX_LENGTH_SIGNATURE: 500,
        MAX_LENGTH_ADDRESS: 1000,
        MAX_TOTAL_FORM_CHARS: 30000,
        MAX_ARRAY_ITEMS: 50,
        PASSWORD_MIN: 8,
        PASSWORD_MAX: 128,
        TELEPHONE_MAX: 20,
        MEMBER_ROLES: Object.freeze(['Adhérent', 'Bénévole', 'Partenaire']),
    });

    const REGEX_SAFE_TEXT = /^[\p{L}\p{N}\p{M}\s'\-.,!?():/]*$/u;
    const REGEX_SAFE_TEXT_MULTILINE = /^[\p{L}\p{N}\p{M}\s'\-.,!?():/\n\r]*$/u;
    const REGEX_TELEPHONE = /^[0-9\s]*$/;

    function getFormValue(selector) {
        try {
            const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
            if (!el) return '';
            const value = el.value ?? el.textContent ?? '';
            return String(value).trim();
        } catch {
            return '';
        }
    }

    function validateSafeText(value, label, maxLength, required, options) {
        const opts = options || {};
        const allowMultiline = !!opts.allowMultiline;
        const max = maxLength ?? VALIDATION.MAX_LENGTH_SHORT;
        const str = value != null ? String(value).trim() : '';
        if (required && str.length === 0) {
            throw new Error('Le champ "' + label + '" est obligatoire.');
        }
        if (str.length > max) {
            throw new Error('Le champ "' + label + '" ne doit pas dépasser ' + max + ' caractères.');
        }
        if (str.length > 0) {
            const re = allowMultiline ? REGEX_SAFE_TEXT_MULTILINE : REGEX_SAFE_TEXT;
            if (!re.test(str)) {
                throw new Error('Le champ "' + label + '" contient des caractères non autorisés. Utilisez uniquement lettres, chiffres, espaces et ponctuation courante (pas de < > " \\ ; =).');
            }
        }
        return str;
    }

    function validateTelephone(value, label, required) {
        const str = value != null ? String(value).trim() : '';
        if (required && str.length === 0) {
            throw new Error('Le champ "' + label + '" est obligatoire.');
        }
        if (str.length > VALIDATION.TELEPHONE_MAX) {
            throw new Error('Le champ "' + label + '" ne doit pas dépasser ' + VALIDATION.TELEPHONE_MAX + ' caractères.');
        }
        if (str.length > 0 && !REGEX_TELEPHONE.test(str)) {
            throw new Error('Le champ "' + label + '" doit contenir uniquement des chiffres et des espaces.');
        }
        return str;
    }

    function getTotalFormTextLength(formSelector) {
        const form = typeof formSelector === 'string' ? document.querySelector(formSelector) : formSelector;
        if (!form) return 0;
        let total = 0;
        form.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), textarea, select').forEach(function (el) {
            const v = el.value;
            if (v != null) total += String(v).length;
        });
        return total;
    }

    function validateString(value, label, maxLength, required) {
        const max = maxLength ?? VALIDATION.MAX_LENGTH_SHORT;
        const str = value != null ? String(value).trim() : '';
        if (required && str.length === 0) {
            throw new Error(`Le champ "${label}" est obligatoire.`);
        }
        if (str.length > max) {
            throw new Error(`Le champ "${label}" ne doit pas dépasser ${max} caractères.`);
        }
        return str;
    }

    function validateOptionalString(value, maxLength) {
        const max = maxLength ?? VALIDATION.MAX_LENGTH_SHORT;
        const str = value != null ? String(value).trim() : '';
        if (str.length > max) {
            throw new Error(`Ce champ ne doit pas dépasser ${max} caractères.`);
        }
        return str;
    }

    function validateEmail(value, required) {
        const str = value != null ? String(value).trim() : '';
        if (required && str.length === 0) {
            throw new Error('L\'adresse email est obligatoire.');
        }
        if (str.length > VALIDATION.MAX_LENGTH_SHORT) {
            throw new Error('L\'adresse email ne doit pas dépasser ' + VALIDATION.MAX_LENGTH_SHORT + ' caractères.');
        }
        if (str.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
            throw new Error('L\'adresse email n\'est pas valide.');
        }
        return str;
    }

    function validateStringArray(elements, label, maxItems) {
        try {
            const arr = Array.isArray(elements) ? elements : Array.from(elements || []);
            const values = arr.map((el) => (el && el.value != null ? String(el.value).trim() : '')).filter(Boolean);
            const max = maxItems ?? VALIDATION.MAX_ARRAY_ITEMS;
            if (values.length > max) {
                throw new Error(`Le champ "${label}" ne peut pas contenir plus de ${max} éléments.`);
            }
            values.forEach((v) => {
                if (v.length > VALIDATION.MAX_LENGTH_SHORT) {
                    throw new Error(`Un élément du champ "${label}" dépasse la longueur autorisée.`);
                }
            });
            return values;
        } catch (e) {
            if (e instanceof Error) throw e;
            throw new Error(`Le champ "${label}" contient des données invalides.`);
        }
    }

    function validateDateString(value, label, required) {
        const str = value != null ? String(value).trim() : '';
        if (required && str.length === 0) {
            throw new Error(`Le champ "${label}" est obligatoire.`);
        }
        if (str.length === 0) return str;
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
        if (!match) {
            throw new Error(`Le champ "${label}" doit être une date au format JJ/MM/AAAA.`);
        }
        const [, year, month, day] = match;
        const y = parseInt(year, 10);
        const m = parseInt(month, 10);
        const d = parseInt(day, 10);
        if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > new Date().getFullYear()) {
            throw new Error(`Le champ "${label}" contient une date invalide.`);
        }
        return str;
    }

    function validateSignature(value, required) {
        const str = value != null ? String(value).trim() : '';
        if (required && str.length === 0) {
            throw new Error('La signature est obligatoire.');
        }
        if (str.length > VALIDATION.MAX_LENGTH_SIGNATURE) {
            throw new Error('La signature est trop volumineuse.');
        }
        return str;
    }

    global.VALIDATION = VALIDATION;
    global.getFormValue = getFormValue;
    global.validateSafeText = validateSafeText;
    global.validateTelephone = validateTelephone;
    global.getTotalFormTextLength = getTotalFormTextLength;
    global.validateString = validateString;
    global.validateOptionalString = validateOptionalString;
    global.validateEmail = validateEmail;
    global.validateStringArray = validateStringArray;
    global.validateDateString = validateDateString;
    global.validateSignature = validateSignature;

    function attachCharCounter(inputOrSelector, maxLength) {
        if (maxLength == null || maxLength <= 0) return;
        const input = typeof inputOrSelector === 'string' ? document.querySelector(inputOrSelector) : inputOrSelector;
        if (!input || !input.parentNode) return;
        let counterEl = input.parentNode.querySelector('.char-counter');
        if (!counterEl) {
            counterEl = document.createElement('span');
            counterEl.className = 'char-counter';
            counterEl.setAttribute('aria-live', 'polite');
            input.parentNode.appendChild(counterEl);
        }
        function update() {
            counterEl.textContent = (input.value || '').length + ' / ' + maxLength;
        }
        input.addEventListener('input', update);
        input.addEventListener('change', update);
        update();
    }
    global.attachCharCounter = attachCharCounter;

})(typeof window !== 'undefined' ? window : this);
