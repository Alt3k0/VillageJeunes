/**
 * Widget profil staff - partagé entre accueil-staff, informations, validation-inscription, statistiques
 * Nom, prénom, poste : lecture seule (Visualcom/base). Email, tél : modifiables.
 */
(function() {
    'use strict';

    let profileStaffData = {
        nom: 'Martin',
        prenom: 'Marie',
        poste: 'Animatrice',
        email: 'marie.martin@vill-age.nc',
        telephone: '00 00 00'
    };

    function setupProfileStaff() {
        const profileIcon = document.getElementById('profileIconStaff');
        const profileOverlay = document.getElementById('profileOverlayStaff');
        const profileBackdrop = document.getElementById('profileOverlayBackdropStaff');
        const closeBtn = document.getElementById('closeProfileStaff');
        const saveBtn = document.getElementById('profileSaveBtnStaff');

        if (!profileOverlay) return;

        function showProfileStaff(e) {
            if (e) e.preventDefault();
            const displayName = document.getElementById('profileDisplayNameStaff');
            const posteEl = document.getElementById('profilePosteStaff');
            const emailInp = document.getElementById('profileEmailStaff');
            const telInp = document.getElementById('profileTelephoneStaff');
            if (displayName) displayName.textContent = profileStaffData.prenom + ' ' + profileStaffData.nom;
            if (posteEl) posteEl.textContent = profileStaffData.poste;
            if (emailInp) emailInp.value = profileStaffData.email || '';
            if (telInp) telInp.value = profileStaffData.telephone || '';
            if (profileBackdrop) {
                profileBackdrop.hidden = false;
                profileBackdrop.setAttribute('aria-hidden', 'false');
                profileBackdrop.classList.add('active');
            }
            profileOverlay.hidden = false;
            profileOverlay.classList.add('active');
            document.body.classList.add('profile-overlay-open');
            document.body.style.overflow = 'hidden';
        }

        function closeProfileStaff() {
            profileOverlay.classList.remove('active');
            profileOverlay.hidden = true;
            if (profileBackdrop) {
                profileBackdrop.classList.remove('active');
                profileBackdrop.hidden = true;
                profileBackdrop.setAttribute('aria-hidden', 'true');
            }
            document.body.classList.remove('profile-overlay-open');
            document.body.style.overflow = '';
        }

        function saveProfileStaff() {
            const emailInp = document.getElementById('profileEmailStaff');
            const telInp = document.getElementById('profileTelephoneStaff');
            if (emailInp) profileStaffData.email = emailInp.value.trim();
            if (telInp) profileStaffData.telephone = telInp.value.trim();
            closeProfileStaff();
        }

        if (profileIcon) {
            profileIcon.style.cursor = 'pointer';
            profileIcon.addEventListener('click', showProfileStaff);
        }
        if (closeBtn) {
            closeBtn.setAttribute('type', 'button');
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeProfileStaff();
            });
        }
        if (saveBtn) saveBtn.addEventListener('click', saveProfileStaff);
        profileOverlay.addEventListener('click', function(e) {
            if (e.target === profileOverlay) closeProfileStaff();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && profileOverlay.classList.contains('active')) closeProfileStaff();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupProfileStaff);
    } else {
        setupProfileStaff();
    }
})();
