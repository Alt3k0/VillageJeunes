/**
 * Module de validation des entrées utilisateur
 * Bonnes pratiques : type, longueur, format. Pas d'injection, pas de dépassement mémoire.
 */
(function (global) {
    'use strict';

    const VALIDATION = Object.freeze({
        MAX_LENGTH_SHORT: 250,
        MAX_LENGTH_TEXT: 1000,
        MAX_LENGTH_SIGNATURE: 500000,
        MAX_ARRAY_ITEMS: 50,
        PASSWORD_MIN: 8,
        PASSWORD_MAX: 128,
        MEMBER_ROLES: Object.freeze(['Adhérent', 'Bénévole', 'Partenaire']),
    });

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

    function validatePassword(value, required) {
        const str = value != null ? String(value).trim() : '';
        if (required && str.length === 0) {
            throw new Error('Le mot de passe est obligatoire.');
        }
        if (str.length > 0 && str.length < VALIDATION.PASSWORD_MIN) {
            throw new Error(`Le mot de passe doit contenir au moins ${VALIDATION.PASSWORD_MIN} caractères.`);
        }
        if (str.length > VALIDATION.PASSWORD_MAX) {
            throw new Error(`Le mot de passe ne doit pas dépasser ${VALIDATION.PASSWORD_MAX} caractères.`);
        }
        return str;
    }

    function validateSearchTerm(value) {
        const str = value != null ? String(value).trim() : '';
        if (str.length > VALIDATION.MAX_LENGTH_SHORT) {
            throw new Error('La recherche ne doit pas dépasser ' + VALIDATION.MAX_LENGTH_SHORT + ' caractères.');
        }
        return str;
    }

    function validateMemberRole(value) {
        const str = value != null ? String(value).trim() : '';
        if (str.length === 0) return VALIDATION.MEMBER_ROLES[0];
        if (!VALIDATION.MEMBER_ROLES.includes(str)) {
            throw new Error('Rôle invalide. Valeurs attendues : ' + VALIDATION.MEMBER_ROLES.join(', ') + '.');
        }
        return str;
    }

    /**
     * Tronque une chaîne à maxLength (pour affichage/stockage sans lever d'erreur).
     */
    function safeTruncate(value, maxLength) {
        const str = value != null ? String(value).trim() : '';
        if (str.length <= maxLength) return str;
        return str.slice(0, maxLength);
    }

    /**
     * Attache un compteur de caractères (X / max) sous un input/textarea.
     * Préviens l'utilisateur avant troncature. Option : warnThreshold (0-1) pour ajouter une classe "warn" au-delà.
     */
    function attachCharCounter(inputOrSelector, maxLength, options) {
        if (maxLength == null || maxLength <= 0) return;
        const input = typeof inputOrSelector === 'string'
            ? document.querySelector(inputOrSelector)
            : inputOrSelector;
        if (!input || !input.nodeName) return;
        const opts = options || {};
        const warnThreshold = opts.warnThreshold != null ? opts.warnThreshold : 0.9;
        const counterClass = opts.counterClass || 'char-counter';

        let counterEl = input.parentNode.querySelector('.' + counterClass);
        if (!counterEl) {
            counterEl = document.createElement('span');
            counterEl.className = counterClass;
            counterEl.setAttribute('aria-live', 'polite');
            input.parentNode.appendChild(counterEl);
        }

        function update() {
            const len = (input.value || '').length;
            counterEl.textContent = len + ' / ' + maxLength;
            if (len >= warnThreshold * maxLength) {
                counterEl.classList.add(counterClass + '--warn');
            } else {
                counterEl.classList.remove(counterClass + '--warn');
            }
        }

        input.addEventListener('input', update);
        input.addEventListener('change', update);
        update();
    }

    /**
     * Affiche un message d'aide sous un champ (ex. "Chiffres uniquement").
     */
    function setInputHint(inputOrSelector, hintText) {
        const input = typeof inputOrSelector === 'string'
            ? document.querySelector(inputOrSelector)
            : inputOrSelector;
        if (!input || !input.nodeName || !hintText) return;
        const hintClass = 'input-hint';
        let hintEl = input.parentNode.querySelector('.' + hintClass);
        if (!hintEl) {
            hintEl = document.createElement('span');
            hintEl.className = hintClass;
            input.parentNode.appendChild(hintEl);
        }
        hintEl.textContent = hintText;
    }

    (function injectCharCounterStyles() {
        if (document.getElementById('validation-ux-styles')) return;
        const style = document.createElement('style');
        style.id = 'validation-ux-styles';
        style.textContent = '.char-counter{display:block;font-size:0.8rem;color:#6e6f75;margin-top:0.25rem;}.char-counter--warn{color:#c0392b;}.input-hint{display:block;font-size:0.8rem;color:#6e6f75;margin-top:0.25rem;}';
        document.head.appendChild(style);
    })();

    global.VALIDATION = VALIDATION;
    global.getFormValue = getFormValue;
    global.validateString = validateString;
    global.validateOptionalString = validateOptionalString;
    global.validateEmail = validateEmail;
    global.validateStringArray = validateStringArray;
    global.validateDateString = validateDateString;
    global.validateSignature = validateSignature;
    global.validatePassword = validatePassword;
    global.validateSearchTerm = validateSearchTerm;
    global.validateMemberRole = validateMemberRole;
    global.safeTruncate = safeTruncate;
    global.attachCharCounter = attachCharCounter;
    global.setInputHint = setInputHint;

})(typeof window !== 'undefined' ? window : this);
