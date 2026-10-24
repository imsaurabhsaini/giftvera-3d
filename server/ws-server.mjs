import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

const PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 3001;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    return;
  }
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server });

const AVATAR_COLORS = [
  '#38bdf8', // Sky Blue
  '#f43f5e', // Rose Coral
  '#10b981', // Emerald Mint
  '#a855f7', // Purple Violet
  '#f59e0b', // Warm Amber
  '#ec4899', // Radiant Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
];

// Map of roomId -> Map of playerId -> { ws, playerState }
const rooms = new Map();

function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Map());
  }
  return rooms.get(roomId);
}

function broadcastToRoom(roomId, message, senderWs = null) {
  const room = rooms.get(roomId);
  if (!room) return;

  const data = typeof message === 'string' ? message : JSON.stringify(message);

  for (const [_, client] of room.entries()) {
    if (client.ws !== senderWs && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(data);
    }
  }
}

wss.on('connection', (ws, req) => {
  let currentRoomId = null;
  let currentPlayerId = null;

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());

      if (msg.type === 'join') {
        const { roomId, name = 'Visitor' } = msg;
        currentRoomId = roomId;
        currentPlayerId = 'peer_' + Math.random().toString(36).substring(2, 9);

        const room = getOrCreateRoom(roomId);
        const colorIndex = room.size % AVATAR_COLORS.length;
        const assignedColor = AVATAR_COLORS[colorIndex];

        const initialPlayerState = {
          id: currentPlayerId,
          name: name.substring(0, 16),
          color: assignedColor,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          action: 'idle',
          lastUpdated: Date.now(),
        };

        room.set(currentPlayerId, {
          ws,
          playerState: initialPlayerState,
        });

        // 1. Send welcome & list of existing peers in the room
        const existingPeers = [];
        for (const [pId, client] of room.entries()) {
          if (pId !== currentPlayerId) {
            existingPeers.push(client.playerState);
          }
        }

        ws.send(
          JSON.stringify({
            type: 'welcome',
            playerId: currentPlayerId,
            color: assignedColor,
            peers: existingPeers,
            totalOnline: room.size,
          })
        );

        // 2. Broadcast to other peers that a new player joined
        broadcastToRoom(
          currentRoomId,
          {
            type: 'peer_joined',
            player: initialPlayerState,
            totalOnline: room.size,
          },
          ws
        );

        console.log(`[WS] Player ${currentPlayerId} joined room "${roomId}". Room count: ${room.size}`);
      }

      if (msg.type === 'move' && currentRoomId && currentPlayerId) {
        const room = rooms.get(currentRoomId);
        if (!room) return;

        const client = room.get(currentPlayerId);
        if (client) {
          client.playerState.position = msg.position;
          client.playerState.rotation = msg.rotation;
          client.playerState.action = msg.action || 'idle';
          client.playerState.lastUpdated = Date.now();

          // Broadcast movement delta to all other peers
          broadcastToRoom(
            currentRoomId,
            {
              type: 'peer_moved',
              playerId: currentPlayerId,
              position: msg.position,
              rotation: msg.rotation,
              action: msg.action || 'idle',
            },
            ws
          );
        }
      }

      if (msg.type === 'emote' && currentRoomId && currentPlayerId) {
        // Broadcast 3D emote (hearts, confetti, wave)
        broadcastToRoom(
          currentRoomId,
          {
            type: 'peer_emote',
            playerId: currentPlayerId,
            emote: msg.emote,
            position: msg.position,
            timestamp: Date.now(),
          },
          null // Everyone receives emotes, including sender for confirmation
        );
      }
    } catch (err) {
      console.error('[WS] Message handling error:', err);
    }
  });

  ws.on('close', () => {
    if (currentRoomId && currentPlayerId) {
      const room = rooms.get(currentRoomId);
      if (room) {
        room.delete(currentPlayerId);
        const remainingCount = room.size;

        broadcastToRoom(currentRoomId, {
          type: 'peer_left',
          playerId: currentPlayerId,
          totalOnline: remainingCount,
        });

        console.log(`[WS] Player ${currentPlayerId} left room "${currentRoomId}". Remaining: ${remainingCount}`);

        if (room.size === 0) {
          rooms.delete(currentRoomId);
          console.log(`[WS] Room "${currentRoomId}" cleaned up.`);
        }
      }
    }
  });

  ws.on('error', (err) => {
    console.error(`[WS] Socket error on player ${currentPlayerId}:`, err);
  });
});

server.listen(PORT, () => {
  console.log(`✨ 100% Free Self-Hosted WebSocket Multiplayer Server running on ws://localhost:${PORT}`);
});
