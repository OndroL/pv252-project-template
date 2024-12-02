import {
  allComponents,
  provideFluentDesignSystem,
} from "@fluentui/web-components";
import { SocketCanvasElement } from "./socket_canvas.js";
// Make everything use microsoft fluent by default.
provideFluentDesignSystem().register(allComponents);

/* 

Useful types (you don't have to use them explicitly, 
they serve as documentation for what the protocol is doing) 

*/

interface Point {
  x: number,
  y: number,
}

interface WelcomeMessage {
  // The size of the remote canvas.
  x: number,
  y: number,
  data: [number]
}

interface UpdateMessage {
  point: Point,
  value: boolean,
}

// Create a websocket connection. 
// More info at https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
const socket = new WebSocket("ws:socket.zavazadlo.unsigned-short.com");
socket.onmessage = (m) => {
  console.log(m)
}
socket.onopen = () => {
  console.log("Connected to the WebSocket server.");

};

socket.onclose = () => {
  console.log("Disconnected from the WebSocket server.");
};

let canvas = new SocketCanvasElement();
document.querySelector("#container")!.appendChild(canvas);


// Handle messages from the server
socket.onmessage = (messageEvent) => {
  const message = JSON.parse(messageEvent.data);
  console.log(message);

  if (message.x && message.data && message.data.length === 16384) {

    canvas.width = message.x;
    canvas.height = message.y;

    setTimeout(() => {
      for (let y = 0; y < message.y; y++) {
        for (let x = 0; x < message.x; x++) {
          const index = y * message.x + x;
          const value = message.data[index];
          canvas.setPixel(x, y, !!value );
        }
      }
    },100)
  }
  else if (Array.isArray(message) && message.every((item) => item.point && typeof item.value === "boolean")) {
    message.forEach((updateMessage: UpdateMessage) => {
      const { point, value } = updateMessage;
      canvas.setPixel(point.x, point.y, value);
    });
  }
};

let isErasing = false; // Track whether the Delete key is pressed

// Listen for keydown and keyup events to toggle erasing mode
document.addEventListener("keydown", (event) => {
  if (event.key === "Delete") {
    isErasing = true;
    console.log("Erasing mode activated.");
  }
});


canvas.ondraw = (x,y) => {
  console.log(`Drawing at (${x}, ${y})`);
  const point: Point = { x, y };
  const updateMessage: UpdateMessage = { 
    point, 
    value: !isErasing
  };
  socket.send(JSON.stringify(updateMessage));
}




