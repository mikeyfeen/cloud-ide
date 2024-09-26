import pkg from 'node-pty';
const {IPty, spawn} = pkg; 

export default class TermController {
    sessions = {};
    
    constructor() {
        this.sessions = {};
    }
    
    create(id, filesID, onData) {

        const terminal = spawn('bash', [], {
            name: 'xterm',
            cols: 100,
            cwd: '/sessions',
        });

        terminal.onData(data => {
            process.stdout.write(data);
        }
        );

        this.sessions[id] = {terminal, filesID};

        return terminal;
    }

    write(id, data) {
        this.sessions[id].terminal.write(data, 'utf8');
    }

    clear(id) {
        this.sessions[id].terminal.clear();
        delete this.sessions[id];
    }
    }