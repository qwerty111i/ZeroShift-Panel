const express = require('express');
const http = require('http');
const { exec, spawn } = require('child_process');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const PORT = 3001;

const CONTAINER_NAME = 'zeroshift';
//const IMAGE_NAME = 'discord-bot';

app.use(cors());

app.post('/start', (req, res) => {
    const command = `cd AI-Discord-Bot/ && ./deploy.sh`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Exec Error: ${error.message}`);
            return res.status(500).send({ message: 'Failed to start container', error: stderr });
        }

        res.send({ message: 'Container started successfully', output: stdout });
    });
});

app.post('/stop', (req, res) => {
    const command = `docker stop ${CONTAINER_NAME}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Exec error: ${error}`);
            return res.status(500).send({ message: 'Failed to stop container', error: stderr });
        }
        res.send({ message: 'Container stopped successfully', output: stdout });
    });
});

app.get('/status', (req, res) => {
    const command = `docker ps -f name=${CONTAINER_NAME}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send({ status: 'Error', error: stderr });
        }
        
        if (stdout.split('\n').length > 2) {
            res.send({ status: 'Online' });
        } else {
            res.send({ status: 'Offline' });
        }
    });
});

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    // Spawn creates long-running process to stream logs
    const dockerLogStream = spawn('docker', ['logs', '-f', CONTAINER_NAME]);

    // Sends log data from the container to the client
    dockerLogStream.stdout.on('data', (data) => {
        socket.emit('log', data.toString());
    });
 
    // Sends log errors from the container to the client
    dockerLogStream.stderr.on('data', (data) => {
        socket.emit('log', `ERROR: ${data.toString()}`);
    });

    socket.on('disconnect', () => {
        dockerLogStream.kill();
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});