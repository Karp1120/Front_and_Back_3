const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const PORT = 4000;
const server = new WebSocket.Server({ port: PORT });

const clients = new Set();
const logPath = path.join(__dirname, 'chat-log.json');


let chatHistory = [];
if (fs.existsSync(logPath)) {
  try {
    const raw = fs.readFileSync(logPath, 'utf-8');
    chatHistory = JSON.parse(raw);
  } catch (e) {
    console.error('⚠️ Ошибка чтения истории чата:', e);
  }
}
function saveHistory() {
  fs.writeFileSync(logPath, JSON.stringify(chatHistory.slice(-100), null, 2));
}

server.on('connection', socket => {
  clients.add(socket);
  console.log('🔌 Новый клиент подключён');


  chatHistory.forEach(msg => {
    socket.send(msg);
  });

  socket.on('message', msg => {
    const message = msg.toString();
    console.log('📨', message);

    chatHistory.push(message);
    saveHistory();

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  socket.on('close', () => {
    clients.delete(socket);
    console.log('❌ Клиент отключён');
  });
});

console.log(`💬 WebSocket сервер запущен на ws://localhost:${PORT}`);
