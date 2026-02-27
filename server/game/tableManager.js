import BlackjackTable from "./blackjack.js";
import PokerTable from "./poker.js";
import crypto from "crypto";

const tables = new Map();
const userSockets = new Map(); // userId -> socket
const socketUsers = new Map(); // socket.id -> { userId, username, tableId }

function generateTableId() {
  return crypto.randomBytes(4).toString("hex");
}

export function getTablesListForClient() {
  const list = [];
  for (const [id, table] of tables) {
    list.push({
      id,
      gameType: table.gameType,
      playerCount: table.players.size,
      maxPlayers: table.maxPlayers,
      state: table.state,
      players: table.playerOrder.map((pid) => {
        const p = table.players.get(pid);
        return p ? p.username : "Unknown";
      }),
    });
  }
  return list;
}

function broadcastTableState(table) {
  for (const pid of table.playerOrder) {
    const sock = userSockets.get(pid);
    if (sock) {
      sock.emit("table-state", table.getStateForPlayer(pid));
    }
  }
}

function broadcastTablesList(io) {
  io.emit("tables-list", getTablesListForClient());
}

export function setupSocketHandlers(io, getUserById, updateBalance) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("authenticate", async ({ userId }) => {
      if (!userId) {
        socket.emit("error", { message: "Missing userId" });
        return;
      }
      const user = await getUserById(userId);
      if (!user) {
        socket.emit("error", { message: "Invalid user" });
        return;
      }
      userSockets.set(userId, socket);
      socketUsers.set(socket.id, {
        userId,
        username: user.username,
        tableId: null,
      });
      socket.emit("authenticated", {
        userId,
        username: user.username,
        balance: parseInt(user.balance),
      });
      socket.emit("tables-list", getTablesListForClient());
    });

    socket.on("get-tables", () => {
      socket.emit("tables-list", getTablesListForClient());
    });

    socket.on("create-table", ({ gameType, maxPlayers }) => {
      const info = socketUsers.get(socket.id);
      if (!info) return socket.emit("error", { message: "Not authenticated" });

      // Leave existing table first
      if (info.tableId) {
        leaveTable(socket, io);
      }

      const tableId = generateTableId();
      let table;
      if (gameType === "poker") {
        table = new PokerTable(tableId, maxPlayers || 6, 10);
      } else {
        table = new BlackjackTable(tableId, maxPlayers || 5);
      }

      tables.set(tableId, table);
      table.addPlayer(info.userId, info.username);
      info.tableId = tableId;
      socket.join(tableId);

      broadcastTableState(table);
      broadcastTablesList(io);
    });

    socket.on("join-table", ({ tableId }) => {
      const info = socketUsers.get(socket.id);
      if (!info) return socket.emit("error", { message: "Not authenticated" });

      if (info.tableId) {
        leaveTable(socket, io);
      }

      const table = tables.get(tableId);
      if (!table) return socket.emit("error", { message: "Table not found" });

      if (!table.addPlayer(info.userId, info.username)) {
        return socket.emit("error", { message: "Table is full" });
      }

      info.tableId = tableId;
      socket.join(tableId);

      broadcastTableState(table);
      broadcastTablesList(io);
    });

    socket.on("leave-table", () => {
      leaveTable(socket, io);
    });

    // --- Blackjack Actions ---

    socket.on("bj-bet", async ({ amount }) => {
      const { table, info } = getTableForSocket(socket);
      if (!table || table.gameType !== "blackjack") return;

      const user = await getUserById(info.userId);
      if (!user || parseInt(user.balance) < amount) {
        return socket.emit("error", { message: "Insufficient balance" });
      }

      if (table.placeBet(info.userId, amount)) {
        await updateBalance(info.userId, parseInt(user.balance) - amount);
        broadcastTableState(table);
      }
    });

    socket.on("bj-hit", () => {
      const { table, info } = getTableForSocket(socket);
      if (!table || table.gameType !== "blackjack") return;

      if (table.hit(info.userId)) {
        if (table.state === "results") {
          settleBlackjack(table, updateBalance);
        }
        broadcastTableState(table);
      }
    });

    socket.on("bj-stand", () => {
      const { table, info } = getTableForSocket(socket);
      if (!table || table.gameType !== "blackjack") return;

      if (table.stand(info.userId)) {
        if (table.state === "results") {
          settleBlackjack(table, updateBalance);
        }
        broadcastTableState(table);
      }
    });

    socket.on("bj-new-round", () => {
      const { table, info } = getTableForSocket(socket);
      if (!table || table.gameType !== "blackjack") return;

      table.newRound(info.userId);
      broadcastTableState(table);
    });

    // --- Poker Actions ---

    socket.on("poker-call", () => {
      const { table, info } = getTableForSocket(socket);
      if (!table || table.gameType !== "poker") return;

      if (table.call(info.userId)) {
        if (table.state === "showdown") {
          settlePoker(table, updateBalance);
        }
        broadcastTableState(table);
      }
    });

    socket.on("poker-raise", async ({ amount }) => {
      const { table, info } = getTableForSocket(socket);
      if (!table || table.gameType !== "poker") return;

      const user = await getUserById(info.userId);
      const player = table.players.get(info.userId);
      if (!user || !player) return;

      const toAdd = amount - player.currentBet;
      if (parseInt(user.balance) < toAdd) {
        return socket.emit("error", { message: "Insufficient balance" });
      }

      if (table.raise(info.userId, amount)) {
        await updateBalance(info.userId, parseInt(user.balance) - toAdd);
        if (table.state === "showdown") {
          settlePoker(table, updateBalance);
        }
        broadcastTableState(table);
      }
    });

    socket.on("poker-check", () => {
      const { table, info } = getTableForSocket(socket);
      if (!table || table.gameType !== "poker") return;

      if (table.check(info.userId)) {
        if (table.state === "showdown") {
          settlePoker(table, updateBalance);
        }
        broadcastTableState(table);
      }
    });

    socket.on("poker-fold", () => {
      const { table, info } = getTableForSocket(socket);
      if (!table || table.gameType !== "poker") return;

      if (table.fold(info.userId)) {
        if (table.state === "showdown") {
          settlePoker(table, updateBalance);
        }
        broadcastTableState(table);
      }
    });

    socket.on("poker-call-amount", async () => {
      const { table, info } = getTableForSocket(socket);
      if (!table || table.gameType !== "poker") return;

      const user = await getUserById(info.userId);
      const player = table.players.get(info.userId);
      if (!user || !player) return;

      const toCall = table.currentBet - player.currentBet;
      if (parseInt(user.balance) < toCall) {
        return socket.emit("error", { message: "Insufficient balance" });
      }

      if (table.call(info.userId)) {
        await updateBalance(info.userId, parseInt(user.balance) - toCall);
        if (table.state === "showdown") {
          settlePoker(table, updateBalance);
        }
        broadcastTableState(table);
      }
    });

    socket.on("poker-new-hand", () => {
      const { table } = getTableForSocket(socket);
      if (!table || table.gameType !== "poker") return;

      // Deduct blinds from balances when new hand starts
      table.newHand();
      if (table.state !== "waiting") {
        deductPokerBlinds(table, updateBalance);
      }
      broadcastTableState(table);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      leaveTable(socket, io);
      const info = socketUsers.get(socket.id);
      if (info) {
        userSockets.delete(info.userId);
        socketUsers.delete(socket.id);
      }
    });
  });
}

function getTableForSocket(socket) {
  const info = socketUsers.get(socket.id);
  if (!info || !info.tableId) return { table: null, info: null };
  const table = tables.get(info.tableId);
  return { table, info };
}

function leaveTable(socket, io) {
  const info = socketUsers.get(socket.id);
  if (!info || !info.tableId) return;

  const table = tables.get(info.tableId);
  if (table) {
    table.removePlayer(info.userId);
    socket.leave(info.tableId);

    if (table.players.size === 0) {
      tables.delete(info.tableId);
    } else {
      if (table.state === "results" || table.state === "showdown") {
        // Settle remaining if needed
      }
      broadcastTableState(table);
    }
  }

  info.tableId = null;
  socket.emit("left-table");
  broadcastTablesList(io);
}

async function settleBlackjack(table, updateBalance) {
  for (const pid of table.playerOrder) {
    const p = table.players.get(pid);
    if (p && p.payout > 0) {
      const user = await updateBalance(pid, null); // get current
      if (user) {
        await updateBalance(pid, parseInt(user.balance) + p.payout);
      }
    }
  }
}

async function settlePoker(table, updateBalance) {
  if (table.winners.length === 0) return;
  const share = Math.floor(table.pot / table.winners.length);
  for (const winnerId of table.winners) {
    const user = await updateBalance(winnerId, null);
    if (user) {
      await updateBalance(winnerId, parseInt(user.balance) + share);
    }
  }
}

async function deductPokerBlinds(table, updateBalance) {
  for (const pid of table.playerOrder) {
    const p = table.players.get(pid);
    if (p && p.totalBet > 0) {
      const user = await updateBalance(pid, null);
      if (user) {
        await updateBalance(
          pid,
          Math.max(0, parseInt(user.balance) - p.totalBet)
        );
      }
    }
  }
}
