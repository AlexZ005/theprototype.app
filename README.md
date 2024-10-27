# theprototype.io

The Prototype IO is an online collaborative platform for rapid prototyping.

# Start private development server

1. Download and install [Node.js](https://nodejs.org/en/download/prebuilt-installer)
1. Install [peerjs-server](https://github.com/peers/peerjs-server) package ```npm install peer -g```
1. Generate self-signed certificates:
    ```bash
    cd certs
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout localhost.key -out localhost.crt -config req.cnf
    ```
1. To start server open VSCode, press Ctrl+Shift+P "Tasks: Run Task" and select "Run dev server"
1. To force stop server press Ctrl+Shift+P and select Kill All Terminals