import app from './App';

const MODE_VIEW = 'view';
const MODE_EDIT = 'edit';

class Note {

    // On déclare ses propriétés
    title;
    content;
    dateCreate;
    dateUpdate;

    // On déclare le constructeur qui récupère un objet littéral
    // et qui va hydrater notre instance de Note 

    constructor(noteLitteral) {
        this.title = noteLitteral.title;
        this.content = noteLitteral.content;
        this.dateCreate = noteLitteral.dateCreate;
        this.dateUpdate = noteLitteral.dateUpdate;
    }

    // Méthode qui construit et retourne l'élément HTML de la note
    getDom() {
        const elLi = document.createElement('li');
        elLi.classList.add('nota');
        elLi.dataset.mode = MODE_VIEW;

        // On transforme le timestamp en "vrai" date
        let dateCreate = new Date(this.dateCreate);
        let dateUpdate = new Date(this.dateUpdate);

        // header
        let innerDom = '<div class="nota-header">';
        innerDom += '<div class="nota-times">';
        innerDom += `<strong>création: </strong>${dateCreate.toLocaleString()}<br>`;
        innerDom += `<strong>màj: </strong>${dateUpdate.toLocaleString()}`;
        innerDom += '</div><div class="nota-cmd">';
        innerDom += '<div data-cmd="view">';
        innerDom += '<button type="button" data-role="edit">✏️</button>';
        innerDom += '<button type="button" data-role="delete">🗑️</button>';
        innerDom += '</div>';
        innerDom += '<div data-cmd="edit">';
        innerDom += '<button type="button" data-role="save">💾</button>';
        innerDom += '<button type="button" data-role="cancel">❌</button>';
        innerDom += '</div>';
        innerDom += '</div></div>';

        // title
        innerDom += `<div class="nota-title">${this.title}</div>`;

        // content
        innerDom += `<div class="nota-content">${this.content}</div>`;
        elLi.innerHTML = innerDom;
        elLi.addEventListener('click', this.handleClick.bind(this));

        return elLi;
    }

    // GESTIONNAIRE D'EVENEMENT
    // Méthode pour la gestion des actions des différents bouttons
    handleClick(evt) {

        const elLi = evt.currentTarget; // currentTarget est l'élément sur lequel on a posé l'écouteur
        const elBtn = evt.target; // Target est l'élement sur lequel on a cliqué
        const elTitle = elLi.querySelector('.nota-title'); // On récupère l'élément qui a la class nota-title
        const elContent = elLi.querySelector('.nota-content');  // On récupère l'élément qui a la classe nota-content
        const idxLi = Array.from(elLi.parentElement.children).indexOf(elLi); // On récupère l'index de l'élément li dans la liste des li
        const objNote = app.arrNotas[idxLi]; // TODO: récupération de arrayNote[idxLi] depuis app

        // Si le Li n'est pas cohérent avec les datas on return
        if (!app.isEditMode && elTitle.textContent !== objNote.title) return;

        // Gérer les différents évenements des boutons
        switch (elBtn.dataset.role) {
            case 'edit':
                // Si on n'est pas sensé avoir accès à edit, on sort
                if (app.isEditMode) return;

                // On passe en mode edit
                app.isEditMode = true;

                // On passe le datased.mode en edit
                elLi.dataset.mode = MODE_EDIT;

                // On passe le contenue de l'élément
                elTitle.contentEditable = elContent.contentEditable = true;

                break;

            case 'delete':
                // Si on n'est pas sensé avoir accès à delete, on sort
                if (app.isEditMode) return;

                // On supprime le nota du tableau
                app.arrNotas.splice(idxLi, 1);

                // Sauvegarde des données
                app.noteService.saveStorage(app.arrNotas);

                // On regénère les notes
                app.renderNotes();

                break;

            case 'save':
                // Si on n'est pas sensé avoir accès à cancel, on sort
                if (!app.isEditMode) return;

                // Mise à jour des donnée du tableau
                objNote.title = elTitle.textContent;
                objNote.content = elContent.textContent;
                objNote.dateUpdate = Date.now();

                // On enregistre dans le local storage
                app.noteService.saveStorage(app.arrNotas);

                // On repasse en mode view
                app.isEditMode = false;

                // On regénere un rendu de note
                app.renderNotes();

                break;

            case 'cancel':
                // Si on n'est pas sensé avoir accès à cancel, on sort
                if (!app.isEditMode) return;

                // On passe en mode view
                app.isEditMode = false;

                // On passe le dataset.mode en view
                elLi.dataset.mode = MODE_VIEW;

                // On regénere un rendu de note
                app.renderNotes();

                break;

            default:
                return;
        }

    }
}

export default Note;