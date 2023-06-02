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

        // TODO: Charger l'interface utilisateur

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
    }

}

const app = new App();

export default app;