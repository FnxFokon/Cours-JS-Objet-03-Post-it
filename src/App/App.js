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
        // TODO: faire le rendu des notes
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
        // TODO: Ajouter un eventListener sur le bouton

        // Input + textarea + button dans le form
        elForm.append(this.elInputNewNoteTitle, this.elInputNewNoteContent, elButtonNewNoteAdd);


        // Div
        const elDivClear = document.createElement('div');

        // <button type="button" id="clear-all">🗑️</button>
        const elButtonClearAll = document.createElement('button');
        elButtonClearAll.type = 'button';
        elButtonClearAll.id = 'clear-all';
        elButtonClearAll.textContent = '🗑️';
        // TODO: Ajouter un eventListener sur le bouton

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

}

const app = new App();

export default app;