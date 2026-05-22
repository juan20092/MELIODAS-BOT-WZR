process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

import './config.js'

import fs, { readdirSync, existsSync, readFileSync, watch } from 'fs'
import path, { join } from 'path'
import chalk from 'chalk'
import pino from 'pino'
import yargs from 'yargs'
import syntaxerror from 'syntax-error'
import NodeCache from 'node-cache'
import readline from 'readline'

import { Boom } from '@hapi/boom'

import {
makeWASocket,
useMultiFileAuthState,
fetchLatestBaileysVersion,
makeCacheableSignalKeyStore,
jidNormalizedUser,
Browsers,
DisconnectReason
} from '@whiskeysockets/baileys'

import store from './lib/store.js'
import { handler } from './handler.js'


global.conn = null
global.plugins = {}


process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)


async function startBot() {

const usePairing = process.argv.includes('code')

const { state, saveCreds } =
await useMultiFileAuthState('./sessions')

const { version } =
await fetchLatestBaileysVersion()

const msgRetryCounterCache = new NodeCache()

global.conn = makeWASocket({

logger: pino({ level: 'silent' }),

printQRInTerminal: !usePairing,

browser: Browsers.macOS('Desktop'),

auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(
state.keys,
pino({ level: 'fatal' })
)
},

markOnlineOnConnect: true,
msgRetryCounterCache,
version,

getMessage: async (key) => {
let jid = jidNormalizedUser(key.remoteJid)
return await store.loadMessage(jid, key.id)?.message || ''
}

})

store.bind(global.conn.ev)

global.conn.ev.on('messages.upsert', async (m) => {
try {
await handler(m, { conn: global.conn })
} catch (e) {
console.error('❌ Handler error:\n', e)
}
})

global.conn.ev.on('creds.update', saveCreds)

if (usePairing && !global.conn.authState.creds.registered) {

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
})

const question = (t) =>
new Promise(r => rl.question(t, r))

let number = await question('📲 Ingresa tu número con código país: ')

number = number.replace(/[^0-9]/g, '')

if (!number) {
console.log('❌ Número inválido')
return
}

let code = await global.conn.requestPairingCode(number)

code = code?.match(/.{1,4}/g)?.join('-')

console.log('\n🔑 CÓDIGO DE VINCULACIÓN:\n')
console.log(code + '\n')

rl.close()
}

global.conn.ev.on('connection.update', (update) => {

const { connection, lastDisconnect, qr } = update

if (qr && !usePairing) {
console.log(chalk.yellow('\n📲 Escanea el QR\n'))
}

if (connection === 'open') {
console.log(chalk.green('\n✅ BOT CONECTADO\n'))
}

if (connection === 'close') {

const reason = new Boom(lastDisconnect?.error)?.output?.statusCode

console.log(chalk.red('\n❌ CONEXIÓN CERRADA:', reason))

if (reason !== DisconnectReason.loggedOut) {
startBot()
} else {
console.log('⚠️ Sesión cerrada, borra /sessions')
}

}

})

}

const pluginFolder = join(process.cwd(), 'plugins')

async function loadPlugins() {

if (!existsSync(pluginFolder)) return

for (const file of readdirSync(pluginFolder)) {

if (!file.endsWith('.js')) continue

try {

const mod = await import(`file://${join(pluginFolder, file)}?update=${Date.now()}`)

global.plugins[file] = mod.default || mod

console.log(chalk.green('✔ Plugin:', file))

} catch (e) {

console.log(chalk.red('❌ Plugin error:', file))
console.error(e)

}

}

}

await loadPlugins()

watch(pluginFolder, async (_, file) => {

if (!file || !file.endsWith('.js')) return

try {

delete global.plugins[file]

const mod = await import(`file://${join(pluginFolder, file)}?update=${Date.now()}`)

global.plugins[file] = mod.default || mod

console.log(chalk.cyan('♻ Plugin actualizado:', file))

} catch (e) {
console.error(e)
}

})

startBot()

