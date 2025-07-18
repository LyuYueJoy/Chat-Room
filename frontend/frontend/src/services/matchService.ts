import * as signalR from "@microsoft/signalr";
import { API_BASE_URL } from "./api";

let connection: signalR.HubConnection | null = null;
let matchedCallback: ((partnerId: string) => void) | null = null;
let messageCallback: ((from: string, message: string) => void) | null = null;

export async function initMatchConnection(userId: string) {
  if (connection) return; // 防止重复创建

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/api/match`, {
      accessTokenFactory: () => userId,  // 根据后端实际验证调整
    })
    .withAutomaticReconnect()
    .build();

  connection.on("Matched", (partnerId: string) => {
    if (matchedCallback) matchedCallback(partnerId);
  });

  connection.on("ReceiveMessage", (from: string, message: string) => {
    if (messageCallback) messageCallback(from, message);
  });

  await connection.start();
}

export function onMatched(callback: (partnerId: string) => void) {
  matchedCallback = callback;
}

export function onMessageReceived(callback: (from: string, message: string) => void) {
  messageCallback = callback;
}

export async function startMatching(userId: string) {
  if (!connection) throw new Error("Connection not initialized");
  await connection.invoke("StartMatching", userId);
}

export async function sendMessage(toUserId: string, message: string) {
  if (!connection) throw new Error("Connection not initialized");
  await connection.invoke("SendMessage", toUserId, message);
}

export async function stopConnection() {
  if (connection) {
    await connection.stop();
    connection = null;
    matchedCallback = null;
    messageCallback = null;
  }
}
