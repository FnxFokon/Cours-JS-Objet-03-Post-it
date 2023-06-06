import '../assets/style.css';
import NoteService from './Services/NoteService';
import Note from './Note';

class App {

    // ELEMENT DU DOM
    elInputNewNoteTitle;
    elInputNewNoteContent;
    elOlNoteList;

    // PROPRIETE DE FONCTIONNEMENT
    // services de donnees
    noteService;
    // Tableau de note
    arrNotas = [];
    // Indictation de l'activation du mode edit
    isEditMode = false;

    start() {
        console.log('App démarrée...');

        // On instancie le service de données
        this.noteService = new NoteService();

        // Chargement de l'interface utilisateur
        this.loadDom();

        // On récupère les anciennes données stockés dans le localStorage
        const arrNoteLitterals = this.noteService.readStorage();

        // Si le storage est vide on ne fait rien
        // if (!arrNoteLitterals) return; ou
        if (arrNoteLitterals.length <= 0) return;

        // Si on a des éléments dans le tableau, On remplie notre propriétés arrNotas
        for (let noteLitteral of arrNoteLitterals) {
            console.log('noteLitteral', noteLitteral);
            this.arrNotas.push(new Note(noteLitteral));
        }
        console.log('arrNotas', this.arrNotas);
        // On lance le rendu des notes
        this.renderNotes();
    }

    // Méthode pour créer l'interface graphique
    loadDom() {

        const elHeader = document.createElement('header');
        elHeader.innerHTML = ' <h1>NotaBene</h1>';
        // FORM NOVALIDATE
        const elForm = document.createElement('form');
        elForm.noValidate = true;

        // <input type="text" id="new-nota-title" placeholder="Titre">
        this.elInputNewNoteTitle = document.createElement('input');
        // this.elInputNewNoteTitle.setAttribute('type', 'text'); ou
        this.elInputNewNoteTitle.type = 'text';
        this.elInputNewNoteTitle.id = 'new-nota-title';
        this.elInputNewNoteTitle.placeholder = 'Titre';

        //  <textarea id="new-nota-content" placeholder="Contenu"></textarea>
        this.elInputNewNoteContent = document.createElement('textarea');
        this.elInputNewNoteContent.id = 'new-nota-content';
        this.elInputNewNoteContent.placeholder = 'Contenu';

        // <button type="button" id="new-nota-add">➕</button>
        const elButtonNewNoteAdd = document.createElement('button');
        elButtonNewNoteAdd.type = 'button';
        elButtonNewNoteAdd.id = 'new-note-add';
        elButtonNewNoteAdd.textContent = '➕';
        // Ajouter un eventListener sur le bouton
        elButtonNewNoteAdd.addEventListener('click', this.handleNewNoteAdd.bind(this));

        // Input + textarea + button dans le form
        elForm.append(this.elInputNewNoteTitle, this.elInputNewNoteContent, elButtonNewNoteAdd);


        // Div
        const elDivClear = document.createElement('div');

        // <button type="button" id="clear-all">🗑️</button>
        const elButtonClearAll = document.createElement('button');
        elButtonClearAll.type = 'button';
        elButtonClearAll.id = 'clear-all';
        elButtonClearAll.textContent = '🗑️';

        // Ajouter un eventListener sur le bouton
        elButtonClearAll.addEventListener('click', this.handlerClearAll.bind(this));

        // button dans la div
        elDivClear.append(elButtonClearAll);

        // Form+div dans le header
        elHeader.append(elForm, elDivClear);

        //<main>
        const elMain = document.createElement('main');

        // <ol id="nota-list"></ol>
        this.elOlNoteList = document.createElement('ol');
        this.elOlNoteList.id = 'nota-list';

        //ol dans le main
        elMain.append(this.elOlNoteList);

        // header + main dans le body
        document.body.append(elHeader, elMain);

    }

    handlerClearAll = _ => {
        // Vidage du tableau de travail
        this.arrNotas = [];

        // Suppression des données stockées
        this.noteService.saveStorage(this.arrNotas);

        // On vide la liste à l'affichage
        this.renderNotes(); // Si on a pas fais le traitement il aurait fallu faire : this.elOlNoteList.innerHTML = '';
    };

    // Méthodes pour ajouter une note
    handleNewNoteAdd() {
        // On crée nos constantes pour récupérer les valeurs des inputs
        const newTitle = this.elInputNewNoteTitle.value.trim();
        const newContent = this.elInputNewNoteContent.value.trim();
        const now = Date.now();

        // On check si les champs sont vides
        if (newTitle == '' && newContent == '') { // on peux aussi écrire if (!title || !content){}
            alert('Veuillez remplir au moins un champs');

        } else {
            // On crée une nouvelle note
            // On doit reconstruire un objet litéral
            const newNoteLiteral = {
                title: newTitle == "" ? "Note sans titre" : newTitle,
                content: newContent == "" ? "Note sans contenue" : newContent,
                dateCreate: now,
                dateUpdate: now
            };
            // On rajoute l'objet literal dans le tableau de notes
            this.arrNotas.push(new Note(newNoteLiteral));

            // Sauvegarde des données dans le local Storage
            this.noteService.saveStorage(this.arrNotas);

            // On vide le formulaire
            this.elInputNewNoteTitle.value = this.elInputNewNoteContent.value = '';

            // On met le focus sur le premier champs
            this.elInputNewNoteTitle.focus();

            // On regénère les notes
            this.renderNotes();
        }
    }

    //     if (newTitle == '' && newContent == '') { // on peux aussi écrire if (!title || !content){}
    //         alert('Veuillez remplir au moins un champs');

    //     } else if (newTitle == '') {
    //         this.elInputNewNoteTitle.value = 'Note sans Titre';

    //     } else if (newContent == '') {
    //         this.elInputNewNoteContent.value = 'Note sans contenue';

    //     } else {
    //         // On crée une nouvelle note
    //         // On doit reconstruire un objet litéral
    //         const newNoteLiteral = {
    //             title: newTitle,
    //             content: newContent,
    //             dateCreate: now,
    //             dateUpdate: now
    //         };
    //         // On rajoute l'objet literal dans le tableau de notes
    //         this.arrNotas.push(new Note(newNoteLiteral));

    //         // Sauvegarde des données dans le local Storage
    //         this.noteService.saveStorage(this.arrNotas);

    //         // On vide le formulaire
    //         this.elInputNewNoteTitle.value = this.elInputNewNoteContent.value = '';

    //         // On met le focus sur le premier champs
    //         this.elInputNewNoteTitle.focus();

    //         // On regénère les notes
    //         this.renderNotes();
    //     }
    // }

    // Méthode pour afficher les notes
    renderNotes() {
        // On vide le <ol>
        this.elOlNoteList.innerHTML = '';

        // On retrie par date de mise à jour
        this.arrNotas.sort((a, b) => {
            return b.dateUpdate - a.dateUpdate;
        });

        // On boucle sur le tableau de notes
        for (let note of this.arrNotas) {
            // On ajoute la note dans le <ol>
            this.elOlNoteList.append(note.getDom()); // On récupère l'élément HTML de la note
        }


    }
}

const app = new App();

export default app;