import { PAGE_TEXT } from '../lang/messages/en/user.js';

class Page {
    constructor() {
        this.currentPage = window.location.pathname;
        this.texts = PAGE_TEXT[this.currentPage] || {};
        this.render();
        // WebStorage.clearNote();
    }

    render() {
        document.addEventListener("DOMContentLoaded", () => {
            if (this.texts.title) {
                document.getElementById("title").textContent = this.texts.title;
            }

            if (this.texts.timestamp_msg && document.getElementById("timestamp_msg")) {
                document.getElementById("timestamp_msg").textContent = this.texts.timestamp_msg;
            }

            if (this.texts.buttons) {
                for (let name in this.texts.buttons) {
                    const btn = document.getElementById(name);
                    if (btn) {
                        btn.textContent = this.texts.buttons[name];
                    }
                }
            }

            if (this.currentPage.includes("writer.html")) {
                new Writer();
            }

            if (this.currentPage.includes("reader.html")) {
                new Reader();
            }
        });
    }
}

class WebStorage {
    static clearNote() {
        localStorage.clear();
    }

    static saveNote(note, index) {
        localStorage.setItem(index, note);
        WebStorage.update_timestamp("/writer.html");
    }

    static removeNote(index) {
        localStorage.removeItem(index);
        WebStorage.update_timestamp("/writer.html");
    }

    static loadNotes() {
        const allNotes = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            allNotes[key] = localStorage.getItem(key);
        }
        return allNotes;
    }

    static update_timestamp(currentPage, currentTime=new Date()) {
        const timestamp = currentTime.toLocaleTimeString();
        const timestampMsg = document.getElementById("timestamp_msg");
        if (timestampMsg) {
            timestampMsg.textContent =
                PAGE_TEXT[currentPage].timestamp_msg + timestamp;
        }
    }
}

class Note {
    constructor(text, hash = Math.random().toString(36).substring(2, 10)) {
        this.text = text;
        this.hash = hash;
        this.wrapper = document.createElement("div");
        this.textarea = document.createElement("textarea");
        this.removeBtn = document.createElement("button");
    }

    render(container, addCallBack, removeCallBack) {
        this.textarea.value = this.text;
        this.textarea.addEventListener("input", () => {
            this.text = this.textarea.value;
            addCallBack();
        });
        this.removeBtn.textContent = PAGE_TEXT["/writer.html"].buttons.remove;
        this.removeBtn.addEventListener("click", () => {
            this.wrapper.remove();
            removeCallBack();
        });

        this.wrapper.appendChild(this.textarea);
        this.wrapper.appendChild(this.removeBtn);
        container.appendChild(this.wrapper);
    }

    getText() {
        return this.text;
    }

    getIndex() {
        return this.hash;
    }
}

class Writer {
    constructor() {
        this.container = document.getElementById("writeNoteContainer");
        const existingNotes = WebStorage.loadNotes();
        this.notes = Object.entries(existingNotes).map(([index, text]) => new Note(text, index));
        this.renderNotes();
        this.initButtons();
    }

    renderNotes() {
        this.container.innerHTML = "";
        this.notes.forEach(note => note.render(this.container, this.saveNote.bind(this, note), this.removeNote.bind(this, note)));
    }

    initButtons() {
        const addBtn = document.getElementById("add");
        if (addBtn) addBtn.onclick = () => this.addNote();

        const backBtn = document.getElementById("back");
        if (backBtn) backBtn.onclick = () => (window.location.href = "index.html");
    }

    addNote() {
        const note = new Note("");
        this.notes.push(note);
        note.render(this.container, this.saveNote.bind(this, note), this.removeNote.bind(this, note));
    }

    saveNote(note) {
        WebStorage.saveNote(note.getText(), note.getIndex());
    }

    removeNote(note) {
        this.notes = this.notes.filter(n => n !== note);
        console.log(note);
        WebStorage.removeNote(note.getIndex());
        console.log(note);
    }
}

class Reader {
    constructor() {
        this.container = document.getElementById("readNoteContainer");
        this.renderNotes();
        this.initButtons();
        this.initStorageListener();
    }

    renderNotes() {
        const notes = WebStorage.loadNotes();
        this.container.innerHTML = "";
        Object.values(notes).forEach(noteText => {
            const p = document.createElement("p");
            p.textContent = noteText;
            this.container.appendChild(p);
        });
        WebStorage.update_timestamp("/reader.html");
    }

    initButtons() {
        const backBtn = document.getElementById("back");
        if (backBtn) backBtn.onclick = () => (window.location.href = "index.html");
    }

    initStorageListener() {
        window.addEventListener("storage", (event) => {
            this.renderNotes();
        });
    }
}

new Page();