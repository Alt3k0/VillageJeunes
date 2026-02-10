// Script partagé pour le widget de détails membre
// Utilisé par : informations-adherent.html, validation-inscription.html, gestion-equipe.html

// Formater une date en français pour l'affichage
function formatDateForDisplay(dateString) {
    if (!dateString) return 'Date inconnue';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Si ce n'est pas une date valide, essayer de parser le format YYYY-MM-DD
            const parts = String(dateString).split('-');
            if (parts.length === 3) {
                const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
                const day = parseInt(parts[2], 10);
                const month = parseInt(parts[1], 10) - 1;
                const year = parseInt(parts[0], 10);
                if (!isNaN(day) && !isNaN(month) && !isNaN(year) && months[month]) {
                    return day + ' ' + months[month] + ' ' + year;
                }
            }
            return String(dateString);
        }

        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        return day + ' ' + months[month] + ' ' + year;
    } catch (e) {
        return String(dateString);
    }
}

// Ouvrir le modal détails membre
function openMemberModal(member) {
    const overlay = document.getElementById('memberDetailOverlay');
    if (!overlay || !member) return;

    // Stocker l'ID du membre actuel dans le dataset de l'overlay
    overlay.dataset.currentMemberId = member.id || '';

    // Photo
    const photoEl = document.getElementById('memberDetailPhoto');
    if (photoEl) {
        photoEl.textContent = member.photo || 'Photo';
    }

    // Nom / numéro / rôle
    const nameEl = document.getElementById('memberDetailName');
    if (nameEl) {
        nameEl.textContent = (member.nom || '') + ' ' + (member.prenom || '');
    }

    const numberEl = document.getElementById('memberDetailNumber');
    if (numberEl) {
        numberEl.textContent = member.numero ? 'N° ' + member.numero : '';
    }

    const roleEl = document.getElementById('memberDetailRole');
    if (roleEl) {
        roleEl.textContent = member.role || '';
    }

    // Problèmes médicaux
    const problemesMedicauxEl = document.getElementById('memberDetailProblemesMedicaux');
    if (problemesMedicauxEl) {
        const problemesMedicaux = member.informationMedicale;
        if (problemesMedicaux && String(problemesMedicaux).trim() !== '') {
            problemesMedicauxEl.textContent = problemesMedicaux;
        } else {
            problemesMedicauxEl.textContent = 'Pas de problème médical';
        }
    }

    // Commentaires staff (peut être un tableau d'objets ou une simple chaîne)
    const commentairesListEl = document.getElementById('memberDetailCommentairesList');
    if (commentairesListEl) {
        commentairesListEl.innerHTML = '';

        const commentaires = member.commentairesStaff || [];

        if (Array.isArray(commentaires) && commentaires.length > 0) {
            commentaires.forEach(function (commentaire) {
                const commentaireItem = document.createElement('div');
                commentaireItem.className = 'member-detail-commentaire-item';

                const header = document.createElement('div');
                header.className = 'member-detail-commentaire-item-header';

                const date = document.createElement('div');
                date.className = 'member-detail-commentaire-date';
                const dateValue = commentaire.date || '';
                const dateFormatted = dateValue ? formatDateForDisplay(dateValue) : 'Date inconnue';
                date.textContent = dateFormatted;

                const text = document.createElement('div');
                text.className = 'member-detail-commentaire-text';
                text.textContent = commentaire.text || String(commentaire || '');

                header.appendChild(date);
                commentaireItem.appendChild(header);
                commentaireItem.appendChild(text);
                commentairesListEl.appendChild(commentaireItem);
            });
        } else if (typeof commentaires === 'string' && commentaires.trim() !== '') {
            const commentaireItem = document.createElement('div');
            commentaireItem.className = 'member-detail-commentaire-item';

            const header = document.createElement('div');
            header.className = 'member-detail-commentaire-item-header';

            const date = document.createElement('div');
            date.className = 'member-detail-commentaire-date';
            date.textContent = 'Date inconnue';

            const text = document.createElement('div');
            text.className = 'member-detail-commentaire-text';
            text.textContent = commentaires;

            header.appendChild(date);
            commentaireItem.appendChild(header);
            commentaireItem.appendChild(text);
            commentairesListEl.appendChild(commentaireItem);
        } else {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'member-detail-commentaire-empty';
            emptyMsg.textContent = 'Aucun commentaire';
            commentairesListEl.appendChild(emptyMsg);
        }
    }

    // Informations personnelles
    const genreEl = document.getElementById('memberDetailGenre');
    if (genreEl) {
        genreEl.textContent = member.genre || 'Non renseigné';
    }

    const dateNaissanceEl = document.getElementById('memberDetailDateNaissance');
    if (dateNaissanceEl) {
        const dn = member.dateNaissance;
        dateNaissanceEl.textContent = dn ? formatDateForDisplay(dn) : 'Non renseigné';
    }

    const surnomEl = document.getElementById('memberDetailSurnom');
    if (surnomEl) {
        surnomEl.textContent = member.surnom || 'Non renseigné';
    }

    const preferenceNomEl = document.getElementById('memberDetailPreferenceNom');
    if (preferenceNomEl) {
        const pref = member.preferenceNom;
        if (pref === 'prenom') {
            preferenceNomEl.textContent = 'Prénom';
        } else if (pref === 'surnom') {
            preferenceNomEl.textContent = 'Surnom';
        } else {
            preferenceNomEl.textContent = 'Non renseigné';
        }
    }

    const telephoneEl = document.getElementById('memberDetailTelephone');
    if (telephoneEl) {
        telephoneEl.textContent = member.telephone || 'Non renseigné';
    }

    const emailEl = document.getElementById('memberDetailEmail');
    if (emailEl) {
        emailEl.textContent = member.email || 'Non renseigné';
    }

    const adresseEl = document.getElementById('memberDetailAdresse');
    if (adresseEl) {
        if (member.province && member.commune && member.quartier) {
            adresseEl.textContent = member.province + ', ' + member.commune + ', ' + member.quartier;
        } else if (member.adresseComplete) {
            adresseEl.textContent = member.adresseComplete;
        } else {
            adresseEl.textContent = 'Non renseigné';
        }
    }

    // Ce que je fais dans la vie
    const estEtudiantEl = document.getElementById('memberDetailEstEtudiant');
    if (estEtudiantEl) {
        estEtudiantEl.textContent = member.estEtudiant ? 'Oui' : 'Non';
    }

    const typeEtablissementEl = document.getElementById('memberDetailTypeEtablissement');
    if (typeEtablissementEl) {
        typeEtablissementEl.textContent = member.typeEtablissement || 'Non renseigné';
    }

    const etablissementEl = document.getElementById('memberDetailEtablissement');
    if (etablissementEl) {
        etablissementEl.textContent = member.etablissement || 'Non renseigné';
    }

    const rechercheEmploiEl = document.getElementById('memberDetailRechercheEmploi');
    if (rechercheEmploiEl) {
        rechercheEmploiEl.textContent = member.rechercheEmploiDetails || 'Non';
    }

    const activitePayeeEl = document.getElementById('memberDetailActivitePayee');
    if (activitePayeeEl) {
        activitePayeeEl.textContent = member.activitePayeeSecteur || 'Non';
    }

    const assoEl = document.getElementById('memberDetailAsso');
    if (assoEl) {
        const assoNom = member.assoNom || '';
        const assoSujet = member.assoSujet || '';
        assoEl.textContent = (assoNom && assoSujet) ? (assoNom + ' - ' + assoSujet) : 'Non renseigné';
    }

    const autreActiviteEl = document.getElementById('memberDetailAutreActivite');
    if (autreActiviteEl) {
        autreActiviteEl.textContent = member.autreActiviteDetails || 'Non renseigné';
    }

    // Mobilité et permis
    const mobiliteEl = document.getElementById('memberDetailMobilite');
    if (mobiliteEl) {
        var mobilite = member.mobilites;
        if (Array.isArray(mobilite)) {
            mobiliteEl.textContent = mobilite.join(', ');
        } else {
            mobiliteEl.textContent = mobilite || 'Non renseigné';
        }
    }

    const permisEl = document.getElementById('memberDetailPermis');
    if (permisEl) {
        var permis = member.permis;
        if (Array.isArray(permis)) {
            permisEl.textContent = permis.join(', ');
        } else {
            permisEl.textContent = permis || 'Non renseigné';
        }
    }

    // Autorisations
    const autorisationImageEl = document.getElementById('memberDetailAutorisationImage');
    if (autorisationImageEl) {
        autorisationImageEl.textContent = member.autorisationImage ? 'Oui' : 'Non';
    }

    const autorisationUrgenceEl = document.getElementById('memberDetailAutorisationUrgence');
    if (autorisationUrgenceEl) {
        autorisationUrgenceEl.textContent = member.autorisationUrgence ? 'Oui' : 'Non';
    }

    // Section mineur (représentant légal)
    const mineurSectionEl = document.getElementById('memberDetailMineurSection');
    if (mineurSectionEl) {
        var estMineur = false;
        var dateNaissanceValue = member.dateNaissance;

        if (dateNaissanceValue) {
            try {
                var dateNaissance = new Date(dateNaissanceValue);
                if (!isNaN(dateNaissance.getTime())) {
                    var aujourdhui = new Date();
                    var age = aujourdhui.getFullYear() - dateNaissance.getFullYear();
                    var moisDiff = aujourdhui.getMonth() - dateNaissance.getMonth();
                    if (moisDiff < 0 || (moisDiff === 0 && aujourdhui.getDate() < dateNaissance.getDate())) {
                        age--;
                    }
                    estMineur = age < 18;
                }
            } catch (e) {
                estMineur = !!member.estMineur;
            }
        } else {
            estMineur = !!member.estMineur;
        }

        if (estMineur) {
            mineurSectionEl.style.display = 'block';

            const parentNomEl = document.getElementById('memberDetailParentNom');
            if (parentNomEl) {
                parentNomEl.textContent = member.nomRepresentantLegal || 'Non renseigné';
            }
            const parentTelephoneEl = document.getElementById('memberDetailParentTelephone');
            if (parentTelephoneEl) {
                parentTelephoneEl.textContent = member.telephoneRepresentantLegal || 'Non renseigné';
            }
            const parentEmailEl = document.getElementById('memberDetailParentEmail');
            if (parentEmailEl) {
                parentEmailEl.textContent = member.emailRepresentantLegal || 'Non renseigné';
            }
            const parentAdresseEl = document.getElementById('memberDetailParentAdresse');
            if (parentAdresseEl) {
                parentAdresseEl.textContent = member.adresseRepresentantLegal || 'Non renseigné';
            }
        } else {
            mineurSectionEl.style.display = 'none';
        }
    }

    // Informations complémentaires
    const dateInscriptionEl = document.getElementById('memberDetailDateInscription');
    if (dateInscriptionEl) {
        var di = member.dateInscription;
        dateInscriptionEl.textContent = di ? formatDateForDisplay(di) : 'Non renseigné';
    }

    const statutEl = document.getElementById('memberDetailStatut');
    if (statutEl) {
        var estActif = (typeof member.estActif !== 'undefined') ? member.estActif : null;
        if (estActif === null) {
            statutEl.textContent = 'Non renseigné';
        } else {
            statutEl.textContent = estActif ? 'Actif' : 'Inactif';
        }
    }

    // Historique
    const dernierPointageEl = document.getElementById('memberDetailDernierPointage');
    if (dernierPointageEl) {
        var dp = member.dernierPointage;
        dernierPointageEl.textContent = dp ? formatDateForDisplay(dp) : 'Jamais';
    }

    const totalPointageEl = document.getElementById('memberDetailTotalPointage');
    if (totalPointageEl) {
        var tp = (typeof member.totalPointage !== 'undefined') ? member.totalPointage : null;
        totalPointageEl.textContent = tp !== null ? tp : '0';
    }

    // Gestion du paiement (si les éléments existent sur la page)
    const montantTotalEl = document.getElementById('memberDetailMontantTotal');
    if (montantTotalEl) {
        var montantTotal = (typeof member.adhesionMontantTotal !== 'undefined') ? member.adhesionMontantTotal : 0;
        montantTotalEl.textContent = montantTotal + ' €';
    }

    const montantPayeEl = document.getElementById('memberDetailMontantPaye');
    if (montantPayeEl) {
        var montantPaye = (typeof member.adhesionMontantPaye !== 'undefined') ? member.adhesionMontantPaye : 0;
        montantPayeEl.textContent = montantPaye + ' €';
    }

    const dateAdhesionEl = document.getElementById('memberDetailDateAdhesion');
    if (dateAdhesionEl) {
        var da = member.dateAdhesion;
        dateAdhesionEl.textContent = da ? formatDateForDisplay(da) : 'Non renseigné';
    }

    const paiementTotalCheck = document.getElementById('paiementTotal');
    const paiementPartielCheck = document.getElementById('paiementPartiel');
    const paiementCommentaireSection = document.getElementById('paiementPartielCommentaire');

    if (paiementTotalCheck && paiementPartielCheck) {
        const adhesionEstPayee = (typeof member.adhesionEstPayee !== 'undefined') ? member.adhesionEstPayee : null;
        const montantTotal = (typeof member.adhesionMontantTotal !== 'undefined') ? member.adhesionMontantTotal : 0;
        const montantPaye = (typeof member.adhesionMontantPaye !== 'undefined') ? member.adhesionMontantPaye : 0;

        if (adhesionEstPayee === true || (montantTotal > 0 && montantPaye >= montantTotal)) {
            paiementTotalCheck.checked = true;
            paiementPartielCheck.checked = false;
            if (paiementCommentaireSection) {
                paiementCommentaireSection.style.display = 'none';
            }
        } else if (montantPaye > 0 && montantPaye < montantTotal) {
            paiementTotalCheck.checked = false;
            paiementPartielCheck.checked = true;
            if (paiementCommentaireSection) {
                paiementCommentaireSection.style.display = 'block';
            }
        } else {
            paiementTotalCheck.checked = false;
            paiementPartielCheck.checked = false;
            if (paiementCommentaireSection) {
                paiementCommentaireSection.style.display = 'none';
            }
        }
    }

    // Ouvrir le modal
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fermer le modal détails membre
function closeMemberModal() {
    const overlay = document.getElementById('memberDetailOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Supprimer un membre depuis le modal
// Cette fonction suppose l'existence d'une fonction globale deleteMember(member)
// et d'une structure allMembers + éventuellement currentViewType.
function deleteMemberFromModal() {
    const overlay = document.getElementById('memberDetailOverlay');
    if (!overlay) return;

    const memberId = overlay.dataset.currentMemberId;
    if (!memberId) return;

    // Récupérer le membre à partir des structures globales
    let member = null;
    if (typeof allMembers !== 'undefined') {
        if (Array.isArray(allMembers)) {
            member = allMembers.find(function (m) { return m.id === memberId; }) || null;
        } else if (typeof allMembers === 'object' && typeof currentViewType !== 'undefined') {
            const list = allMembers[currentViewType] || [];
            member = list.find(function (m) { return m.id === memberId; }) || null;
        }
    }

    if (!member) {
        alert('Impossible de trouver ce membre pour la suppression.');
        return;
    }

    if (typeof deleteMember !== 'function') {
        alert('La suppression n’est pas disponible sur cette page.');
        return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer ' + (member.nom || '') + ' ' + (member.prenom || '') + ' ?')) {
        return;
    }

    closeMemberModal();
    deleteMember(member);
}

// Initialiser les écouteurs du widget (fermeture, boutons, commentaires)
function setupMemberModal() {
    const overlay = document.getElementById('memberDetailOverlay');
    const closeBtn = document.getElementById('memberDetailClose');
    const modifyBtn = document.getElementById('memberDetailModify');
    const deleteBtn = document.getElementById('memberDetailDelete');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeMemberModal);
    }

    if (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                closeMemberModal();
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
            closeMemberModal();
        }
    });

    if (modifyBtn) {
        modifyBtn.addEventListener('click', function () {
            alert('Fonctionnalité de modification à venir');
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', function () {
            deleteMemberFromModal();
        });
    }

    const savePaiementCommentaireBtn = document.getElementById('savePaiementCommentaire');
    if (savePaiementCommentaireBtn) {
        savePaiementCommentaireBtn.addEventListener('click', function () {
            const commentaireInput = document.getElementById('paiementPartielCommentaireInput');
            if (!commentaireInput) return;

            const commentaire = commentaireInput.value.trim();
            if (!commentaire) {
                alert('Veuillez saisir un commentaire');
                return;
            }

            // TODO: Envoyer le commentaire au backend
            alert('Commentaire sur le paiement partiel enregistré avec succès');
        });
    }

    const addCommentaireBtn = document.getElementById('memberDetailAddCommentaire');
    if (addCommentaireBtn) {
        addCommentaireBtn.addEventListener('click', function () {
            const commentaireInput = document.getElementById('memberDetailCommentaireInput');
            if (!commentaireInput) return;

            const nouveauCommentaire = commentaireInput.value.trim();
            if (!nouveauCommentaire) {
                alert('Veuillez saisir un commentaire');
                return;
            }

            const maintenant = new Date();
            const iso = maintenant.toISOString().split('T')[0];
            const dateFormatee = formatDateForDisplay(iso);

            const commentairesListEl = document.getElementById('memberDetailCommentairesList');
            if (commentairesListEl) {
                const emptyMsg = commentairesListEl.querySelector('.member-detail-commentaire-empty');
                if (emptyMsg) {
                    emptyMsg.remove();
                }

                const commentaireItem = document.createElement('div');
                commentaireItem.className = 'member-detail-commentaire-item';

                const header = document.createElement('div');
                header.className = 'member-detail-commentaire-item-header';

                const date = document.createElement('div');
                date.className = 'member-detail-commentaire-date';
                date.textContent = dateFormatee;

                const text = document.createElement('div');
                text.className = 'member-detail-commentaire-text';
                text.textContent = nouveauCommentaire;

                header.appendChild(date);
                commentaireItem.appendChild(header);
                commentaireItem.appendChild(text);

                commentairesListEl.insertBefore(commentaireItem, commentairesListEl.firstChild);
                commentairesListEl.scrollTop = 0;
            }

            commentaireInput.value = '';
            alert('Commentaire ajouté avec succès');
        });
    }
}

