const express = require('express');
const { exec } = require('child_process'); // Allows running shell commands
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

const CONTAINER_NAME = 'zeroshift';
const IMAGE_NAME = 'something?';

app.post('/start', (req, res) => {
    const command = `docker run -d --name ${CONTAINER_NAME} ${IMAGE_NAME}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Exec Error: ${error.message}`);
            return res.status(500).send({ message: 'Failed to start container', error: stderr });
        }

        res.send({ message: 'Container started successfully', output: stdout });
    });
});

app.post('/stop', (req, res) => {
    const command = `docker stop ${CONTAINER_NAME} && docker rm ${CONTAINER_NAME}`;

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

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});