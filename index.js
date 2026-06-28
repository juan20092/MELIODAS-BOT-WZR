const { emitWarning: _ew } = process
process.emitWarning = (w, ...a) => typeof w === 'string' && w.includes('NODE_TLS_REJECT_UNAUTHORIZED') ? void 0 : _ew.call(process, w, ...a)
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

import './config.js'

import fs, { readdirSync, existsSync, mkdirSync, readFileSync, watch } from 'fs'
import path, { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { format } from 'util'
import { spawn, exec } from 'child_process'
import readline from 'readline'

import chalk from 'chalk'
import boxen from 'boxen'
import cfonts from 'cfonts'
import pino from 'pino'
import NodeCache from 'node-cache'
import syntaxerror from 'syntax-error'
import yargs from 'yargs'
import lodash from 'lodash'
import { Boom } from '@hapi/boom'

import {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser,
  Browsers,
  DisconnectReason
} from '@whiskeysockets/baileys' 

import qrcode from 'qrcode-terminal'
import { makeWASocket, smsg } from './wzr/simple.js'
import store from './wzr/store.js'
import { logMessages } from './wzr/logger.js'

const muteConsolePatterns = [/^\s*Closing session:/i, /SessionEntry\s*\{/i]
const shouldMuteConsole = (...args) => {
  const text = args
    .map(arg => {
      if (typeof arg === 'string') return arg
      try { return format(arg) } catch { return String(arg) }
    })
    .join(' ')

  return muteConsolePatterns.some(pattern => pattern.test(text))
}

const originalConsoleLog = console.log.bind(console)
const originalConsoleWarn = console.warn.bind(console)
const originalConsoleError = console.error.bind(console)
const originalConsoleInfo = console.info.bind(console)

console.log = (...args) => { if (!shouldMuteConsole(...args)) originalConsoleLog(...args) }
console.warn = (...args) => { if (!shouldMuteConsole(...args)) originalConsoleWarn(...args) }
console.error = (...args) => { if (!shouldMuteConsole(...args)) originalConsoleError(...args) }
console.info = (...args) => { if (!shouldMuteConsole(...args)) originalConsoleInfo(...args) }

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
const { chain }  = lodash
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function showBanner() {
  console.clear()

  const art = [
    '██████╗  ██████╗ ████████╗   ███╗   ███╗██████╗ ',
    '██╔══██╗██╔═══██╗╚══██╔══╝   ████╗ ████║██╔══██╗',
    '██████╔╝██║   ██║   ██║      ██╔████╔██║██║  ██║',
    '██╔══██╗██║   ██║   ██║      ██║╚██╔╝██║██║  ██║',
    '██████╔╝╚██████╔╝   ██║      ██║ ╚═╝ ██║██████╔╝',
    '╚═════╝  ╚═════╝    ╚═╝      ╚═╝     ╚═╝╚═════╝ ',
  ]

  const gradient = ['#ff00cc','#e000dd','#bb00ee','#8800ff','#5500ff','#00eaff']
  const artColored = art.map((l, i) => chalk.hex(gradient[i]).bold(l)).join('\n')

  console.log(boxen(artColored, {
    padding: { top: 1, bottom: 1, left: 4, right: 4 },
    margin: { top: 1, bottom: 0, left: 2, right: 2 },
    borderStyle: 'double',
    borderColor: 'magenta',
    backgroundColor: '#0a0a0a',
    title: chalk.hex('#ffb300').bold(' ✦ BASE BOT-MD ✦ '),
    titleAlignment: 'center',
  }))

  cfonts.say('BOT|MD', {
    font: 'chrome', align: 'center',
    colors: ['magenta', 'cyan', 'white'],
    background: 'transparent',
    letterSpacing: 2, lineHeight: 1,
    space: false,
  })

  cfonts.say('powered by JUANWZR', {
    font: 'console', align: 'center',
    colors: ['#ffb300'], background: 'transparent',
    space: false,
  })

  const sparks  = ['#ff00cc','#ff44dd','#00eaff','#ffb300','#8800ff','#00eaff']
  const symbols = ['◆','◇','✦','✧','◈','◉']
  const bar = Array.from({ length: 46 }, (_, i) =>
    chalk.hex(sparks[i % sparks.length])(symbols[i % symbols.length])
  ).join('')
  console.log('\n  ' + bar + '\n')

  const W = 44
  const sep  = chalk.hex('#333333')('─'.repeat(W))
  const col1 = (t) => chalk.hex('#888888')(t)
  const col2 = (t) => chalk.hex('#00eaff').bold(t)
  const col3 = (t) => chalk.hex('#ffb300').bold(t)

  const infoLines = [
    col1('  Versión   ') + col2('1.0.0') + '   ' + col1('Plataforma ') + col2('WhatsApp MD'),
    col1('  Autor     ') + col3('JUANWZR')  + '   ' + col1('Estado     ') + chalk.greenBright.bold('Iniciando...'),
  ]

  console.log(chalk.hex('#444444')('  ╭' + '─'.repeat(W) + '╮'))
  for (const l of infoLines) {
    console.log(chalk.hex('#444444')('  │ ') + l)
    console.log(chalk.hex('#444444')('  │ ') + sep)
  }
  console.log(chalk.hex('#444444')('  ╰' + '─'.repeat(W) + '╯') + '\n')
}

// Mostramos el banner instantáneamente
showBanner()

global.opts    = Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix  = new RegExp('^[#/!.]')
global.plugins = {}
global.conn    = null
global.groupMetaCache = new Map()

process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

const pluginFolder = join(__dirname, 'plugins')
if (!existsSync(pluginFolder)) mkdirSync(pluginFolder, { recursive: true })

const pluginFilter = f => /\.js$/.test(f)

async function filesInit() {
  const files = readdirSync(pluginFolder).filter(pluginFilter)
  if (!files.length) {
    console.log(chalk.gray('  ⚠  No se encontraron plugins en /plugins'))
    return
  }
  
  console.log(chalk.bold.blueBright('\n  ┌─ Cargando plugins ' + '─'.repeat(28)))
  
  await Promise.all(files.map(async (filename) => {
    try {
      const mod = await import(`file://${join(pluginFolder, filename)}`)
      global.plugins[filename] = mod.default || mod
      console.log(chalk.green(`  │  ✔  ${filename}`))
    } catch (e) {
      console.error(chalk.red(`  │  ✖  ${filename}`))
      console.error(chalk.gray('  │     ' + String(e).split('\n')[0]))
    }
  }))
  
  console.log(chalk.bold.blueBright('  └' + '─'.repeat(38) + '\n'))
}

await filesInit()

async function updateFromGitHub() {
  exec('git pull', async (err, stdout) => {
    if (err) return

    if (
      stdout.includes('Updating') ||
      stdout.includes('changed') ||
      stdout.includes('Fast-forward')
    ) {
      console.log(`
🔄 ACTUALIZACIÓN DESDE GITHUB

${stdout}
`)

      await filesInit()
      await global.reloadHandler()
    }
  })
}

setInterval(updateFromGitHub, 15000)

const reloadPlugin = async (_, filename) => {
  if (!filename || !pluginFilter(filename)) return
  const dir = join(pluginFolder, filename)
  if (filename in global.plugins) {
    if (existsSync(dir)) console.log(chalk.cyan(`  ♻  Plugin actualizado  › ${filename}`))
    else { console.log(chalk.yellow(`  🗑  Plugin eliminado   › ${filename}`)); return delete global.plugins[filename] }
  } else {
    console.log(chalk.green(`  ➕  Plugin nuevo       › ${filename}`))
  }
  const err = syntaxerror(readFileSync(dir), filename, { sourceType: 'module', allowAwaitOutsideFunction: true })
  if (err) { console.error(chalk.red(`  ✖  Error de sintaxis en '${filename}'`) + '\n' + chalk.gray(format(err))); return }
  try {
    const mod = await import(`file://${dir}?update=${Date.now()}`)
    global.plugins[filename] = mod.default || mod
  } catch (e) {
    console.error(chalk.red(`  ✖  Error al cargar '${filename}'`) + '\n' + chalk.gray(format(e)))
  }
  global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a],[b]) => a.localeCompare(b)))
}

const startPluginWatcher = () => {
  const onChange = (eventType, filename) => {
    if (!filename || !pluginFilter(filename)) return
    reloadPlugin(eventType, filename).catch(console.error)
  }

  try {
    return watch(pluginFolder, onChange)
  } catch (e) {
    console.warn(chalk.yellow(`⚠️ El watcher de plugins no está disponible: ${e.message}`))
    return null
  }
}

startPluginWatcher()

let handler = await import('./handler.js')

global.reloadHandler = async function (restatConn = false) {
  try {
    const H = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    if (H && Object.keys(H).length) handler = H
  } catch (e) { console.error(e) }

  if (restatConn) {
    try { global.conn.ws.close() } catch {}
    global.conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions)
    store.bind(global.conn)
  }

  if (global.conn._handler)          global.conn.ev.off('messages.upsert',   global.conn._handler)
  if (global.conn._connectionUpdate) global.conn.ev.off('connection.update', global.conn._connectionUpdate)
  if (global.conn._credsUpdate)      global.conn.ev.off('creds.update',      global.conn._credsUpdate)

  global.conn._handler = async (chatUpdate) => {
    try {
      if (handler.handler) await handler.handler.call(global.conn, chatUpdate)
    } catch (e) { console.error(e) }
  }

  global.conn._connectionUpdate = connectionUpdate.bind(global.conn)
  global.conn._credsUpdate      = saveCreds

  global.conn.ev.on('messages.upsert',   global.conn._handler)
  global.conn.ev.on('connection.update', global.conn._connectionUpdate)
  global.conn.ev.on('creds.update',      global.conn._credsUpdate)

  return true
}

const sessionsDir = global.sessions || './sessions'
const { state, saveCreds } = await useMultiFileAuthState(sessionsDir)
const { version }          = await fetchLatestBaileysVersion()
const msgRetryCounterCache = new NodeCache()

const methodCodeQR = process.argv.includes('qr')
const methodCode   = process.argv.includes('code') || !!global.botNumber

const rl       = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = t => new Promise(r => rl.question(t, r))

let opcion = '1'

if (!methodCodeQR && !methodCode && !existsSync(`${sessionsDir}/creds.json`)) {
  do {
    opcion = await question(
      chalk.bold.magenta('╭─────────────────────────────◉\n') +
      chalk.bold('│ ⚙  MÉTODO DE CONEXIÓN\n') +
      chalk.yellow('│ 1. Escanear Código QR\n') +
      chalk.green('│ 2. Código de Emparejamiento\n') +
      chalk.bold.magenta('╰─────────────────────────────◉\n') +
      chalk.bold('Elige (1 o 2): ')
    )
    if (!/^[12]$/.test(opcion)) console.log(chalk.red('✖ Solo 1 o 2.'))
  } while (!/^[12]$/.test(opcion))
} else {
  opcion = methodCode ? '2' : '1'
}

const connectionOptions = {
  logger: pino({ level: 'silent' }),
  browser: Browsers.ubuntu('Chrome'), 
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }))
  },
  markOnlineOnConnect: true,
  syncFullHistory: false, 
  generateHighQualityLinkPreview: false, 
  msgRetryCounterCache,
  version,
  getMessage: async (key) => {
    const jid = jidNormalizedUser(key.remoteJid)
    return await store.loadMessage(jid, key.id)?.message || ''
  }
}

global.conn = makeWASocket(connectionOptions)
store.bind(global.conn)
logMessages(global.conn)
    
global.conn.ev.on('messages.upsert', ({ messages }) => {
  const msg = messages?.[0]
})

await global.reloadHandler()

if (opcion === '2' && !global.conn.authState.creds.registered) {
  let phoneNumber = global.botNumber || ''

  if (!phoneNumber) {
    phoneNumber = await question(
      chalk.bold.green('╭─────────────────────────────◉\n') +
      chalk.white('│ 📞 Número con código de país\n') +
      chalk.yellow('│ Ejemplo: 573001234567\n') +
      chalk.bold.green('╰─────────────────────────────◉\n') +
      chalk.bold('Número: ')
    )
  }

  rl.close()
  phoneNumber = phoneNumber.replace(/\D/g, '')

  setTimeout(async () => {
    try {
      let code = await global.conn.requestPairingCode(phoneNumber)
      code = code?.match(/.{1,4}/g)?.join('-') || code
      console.log(chalk.bold.magenta(
        '\n╭─────────────────────────────◉\n' +
        '│ 🔑 CÓDIGO DE VINCULACIÓN\n' +
        `│ ${chalk.bold.red(code)}\n` +
        '╰─────────────────────────────◉\n'
      ))
    } catch (err) {
      console.error(chalk.red('❌ Error:'), err)
    }
  }, 1000)
} else {
  rl.close()
}

async function connectionUpdate(update) {
  const { connection, lastDisconnect, qr } = update

  if (qr && opcion === '1') {
    console.log(chalk.bold.yellow('\n  ┌─ QR ─────────────────────────────────────┐'))
    console.log(chalk.yellow('  │  ❐  Escanea el código — expira en 45 s    │'))
    console.log(chalk.bold.yellow('  └───────────────────────────────────────────┘\n'))
    qrcode.generate(qr, { small: true })
  }

  if (connection === 'open') {
    console.log(
      '\n' +
      chalk.bold.green('  ╔══════════════════════════════════════════╗\n') +
      chalk.bold.green('  ║') + chalk.bgGreen.black('        ✨  BOT CONECTADO EXITOSAMENTE  ✨      ') + chalk.bold.green('║\n') +
      chalk.bold.green('  ╚══════════════════════════════════════════╝\n')
    )
  }

  if (connection === 'close') {
    const reason = new Boom(lastDisconnect?.error)?.output?.statusCode

    const msgs = {
      [DisconnectReason.badSession]:          chalk.cyanBright('  ⚠  Sesión inválida — borra /sessions y reconecta'),
      [DisconnectReason.connectionClosed]:    chalk.magentaBright('  ⚠  Conexión cerrada — reconectando...'),
      [DisconnectReason.connectionLost]:      chalk.blueBright('  ⚠  Conexión perdida — reconectando...'),
      [DisconnectReason.connectionReplaced]:  chalk.yellowBright('  ⚠  Sesión reemplazada — cierra la sesión anterior'),
      [DisconnectReason.loggedOut]:           chalk.redBright('  ⚠  Sesión cerrada — borra /sessions y reconecta'),
      [DisconnectReason.restartRequired]:     chalk.cyanBright('  ✧  Reiniciando conexión...'),
      [DisconnectReason.timedOut]:            chalk.yellowBright('  ⧖  Tiempo agotado — reconectando...'),
    }

    const msg = msgs[reason] || chalk.red(`  ⚠  Desconexión desconocida (código ${reason})`)
    console.log('\n' + chalk.gray('  ─'.repeat(22)) + '\n' + msg + '\n' + chalk.gray('  ─'.repeat(22)) + '\n')

    if (reason === DisconnectReason.loggedOut || reason === DisconnectReason.badSession) return
    if (reason === DisconnectReason.connectionReplaced) return

    if (reason === 429) {
      console.log(chalk.red('  ⏳  Rate limit alcanzado — esperando 30 s...'))
      await sleep(30000)
    }

    await global.reloadHandler(true).catch(console.error)
  }
}

if (global.db) {
  setInterval(async () => {
    if (global.db?.data) await global.db.write().catch(console.error)
  }, 30_000)
}

async function _quickTest() {
  const bins = ['ffmpeg', 'ffprobe', 'convert', 'magick', 'gm']
  const results = await Promise.all(bins.map(bin =>
    Promise.race([
      new Promise(r => { const p = spawn(bin); p.on('close', c => r(c !== 127)); p.on('error', () => r(false)) }),
      new Promise(r => setTimeout(() => r(false), 2000))
    ])
  ))
  global.support = Object.fromEntries(bins.map((b, i) => [b, results[i]]))
  Object.freeze(global.support)
}

_quickTest().catch(console.error)
