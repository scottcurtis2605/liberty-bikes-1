import { Whiteboard } from './whiteboard';

export class GameWebsocket {
  roundId: string;
  baseUri: string;
  wsUri: string;
  websocket: WebSocket;
  whiteboard: Whiteboard;
  output: HTMLElement;

  constructor(whiteboard: Whiteboard) {
    this.roundId = localStorage.getItem('roundId');
    this.baseUri = `ws://${document.location.hostname}:8080/round/ws`;
    this.wsUri = `${this.baseUri}/${this.roundId}`;
    this.websocket = new WebSocket(this.wsUri);
    this.whiteboard = whiteboard;
    this.output = document.getElementById('output');

    this.websocket.onmessage = (evt: MessageEvent): any => {
      this.onMessage(evt);
    };

    this.websocket.onerror = (evt: MessageEvent): any => {
      this.onError(evt);
    };

    this.websocket.onopen = (evt: MessageEvent): any => {
      this.onConnect(evt);
    };
  }

  sendText(json: string) {
    console.log(`sending text: ${json}`);
    this.websocket.send(json);
  }

  sendBinary(bytes: any) {
    console.log(`sending binary: ${bytes.toString()}`);
    this.websocket.send(bytes);
  }

  onMessage(evt: MessageEvent) {
    console.log(`received: ${evt.data}`);
    if (typeof evt.data === 'string') {
      const json = JSON.parse(evt.data);
      if (json.playerlist) {
        this.whiteboard.updatePlayerList(json);
      } else if (json.requeue) {
        this.roundId = json.requeue;
        localStorage.setItem('roundId', this.roundId);
        location.reload();
      } else {
        this.whiteboard.drawImageText(evt.data);
      }
    } else {
      this.whiteboard.drawImageBinary(evt.data);
    }
  }

  onError(evt: MessageEvent) {
    this.writeToScreen(`<span style="color: red;">ERROR:</span> ${evt.data}`);
  }

  onConnect(evt: MessageEvent) {
    const name = localStorage.getItem('username');
    this.sendText(JSON.stringify({'playerjoined': name}));
  }

  writeToScreen(message: string) {
    const pre = document.createElement('p');
    pre.style.wordWrap = 'break-word';
    pre.innerHTML = message;
    this.output.appendChild(pre);
  }
}