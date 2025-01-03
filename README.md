# <img src="static/logo.svg"  width="30"/> theprototype.app

ThePrototype is an online collaborative platform for rapid prototyping. Visit [theprototype.app](https://theprototype.app)

[![video](https://img.youtube.com/vi/yR21_x4jV7g/maxresdefault.jpg)](https://www.youtube.com/watch?v=yR21_x4jV7g&list=PLBSyotD7wAZvjCW3ZSKQbNpb-9_f7Q3YM&index=2)

# Start private development server

1. Download and install [Node.js](https://nodejs.org/en/download/prebuilt-installer)
1. Install [peerjs-server](https://github.com/peers/peerjs-server) package ```npm install peer -g```
1. Generate self-signed certificates and run certutil with elevated privileges:
    ```bash
    cd certs
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout localhost.key -out localhost.crt -config req.cnf
    certutil -addstore -enterprise root localhost.crt
    ```
1. To start server open VSCode, press Ctrl+Shift+P "Tasks: Run Task" and select "Run dev server"
1. To force stop server press Ctrl+Shift+P and select Kill All Terminals
