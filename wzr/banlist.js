import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const storagePath = path.join(__dirname, '..', 'banned-chats.json')

function normalizeChat(chat) {
  return String(chat || '').trim().toLowerCase()
}

function ensureStore() {
  if (!global.__bannedChatsStore) {
    global.__bannedChatsStore = new Set()
    loadBannedChats()
  }

  return global.__bannedChatsStore
}

function loadBannedChats() {
  if (!fs.existsSync(storagePath)) return

  try {
    const raw = fs.readFileSync(storagePath, 'utf8')
    const data = JSON.parse(raw)
    const chats = Array.isArray(data) ? data : data.chats || []

    for (const chat of chats) {
      if (typeof chat === 'string' && chat.trim()) {
        ensureStore().add(normalizeChat(chat))
      }
    }
  } catch (e) {
    console.error('Error cargando chats desactivados:', e)
  }
}

function persistBannedChats() {
  try {
    const chats = [...ensureStore()].sort()
    fs.writeFileSync(storagePath, JSON.stringify(chats, null, 2))
  } catch (e) {
    console.error('Error guardando chats desactivados:', e)
  }
}

export function isChatBanned(chat) {
  return ensureStore().has(normalizeChat(chat))
}

export function addBannedChat(chat) {
  const normalized = normalizeChat(chat)
  if (!normalized) return false

  const store = ensureStore()
  const added = !store.has(normalized)
  store.add(normalized)
  persistBannedChats()
  return added
}

export function removeBannedChat(chat) {
  const normalized = normalizeChat(chat)
  if (!normalized) return false

  const removed = ensureStore().delete(normalized)
  persistBannedChats()
  return removed
}

export function getBannedChats() {
  return [...ensureStore()].sort()
}
