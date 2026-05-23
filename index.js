process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

import './config.js'

import fs, { readdirSync, existsSync, mkdirSync, readFileSync, watch } from 'fs'
import path, { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { format } from 'util'
import { spawn } from 'child_process'
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
} from 'baileys'

import { makeWASocket, smsg } from './wzr/simple.js'
import store from './wzr/store.js'
import { logMessages } from './wzr/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
const { chain }  = lodash
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function showBanner() {
  const lines = [
    '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░',
    '▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄░░░░░░░░░░░░░░░░░',
    '▄▀░░░░░░░░░░░░▄░░░░░░░▀▄░░░░░░░░░░░░░░',
    '█░░▄░░░░▄░░░░░░░░░░░░░░█░░░░░░░░░░░░░░',
    '█░░░░░░░░░░░░░░░█░░░░░░░░░░░░▄█▄▄░░▄░░',
    '█░▄▄▄░░░░▄▄▄▄▄░░█░░░░░░▀░░░░▀█░░▀▄░░░',
    '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░',
  ]
  const title    = lines.map(l => chalk.hex('#ff00cc').bold(l)).join('\n')
  const aiMsg    = chalk.hex('#ffb300').bold('BASE')
  const subtitle = chalk.hex('#00eaff').bold('BASE BOT-MD')
  
  const frames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏']
    .map(f => chalk.magentaBright(`${f} Cargando módulos...`))

  console.clear()
  console.log(boxen(title + '\n' + subtitle, {
    padding: 1, margin: 1,
    borderStyle: 'double', borderColor: 'whiteBright',
    backgroundColor: 'black', title: 'BASE', titleAlignment: 'center'
  }))

  cfonts.say('BOT-MD', {
    font: 'block', align: 'center',
    colors: ['blue', 'cyan'], background: 'transparent',
    letterSpacing: 1, lineHeight: 1
  })
  cfonts.say('powered by JUANWZR', {
    font: 'console', align: 'center',
    colors: ['blue'], background: 'transparent'
  })

  console.log('\n' + aiMsg + '\n')

  for (let i = 0; i < 18; i++) {
    process.stdout.write('\r' + frames[i % frames.length])
    await sleep(70)
  }
  process.stdout.write('\r' + ' '.repeat(40) + '\r')

  console.log(chalk.bold.cyanBright(boxen(
    chalk.bold('¡Bienvenido!\n') +
    chalk.hex('#00eaff')('El bot está arrancando, por favor espera...') +
    '\n' + tips.join('\n'),
    { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'yellow' }
  )))

  const sparkles = ['#ff00cc','#00eaff','#ffb300','#00eaff','#ff00cc','#ffb300']
    .map(c => chalk.hex(c)('✦'))
  console.log('\n' + Array.from({length: 30}, (_, i) => sparkles[i % sparkles.length]).join('') + '\n')
}

await showBanner()

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
  for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const mod = await import(`file://${join(pluginFolder, filename)}`)
      global.plugins[filename] = mod.default || mod
      console.log(chalk.green(`✔ Plugin: ${filename}`))
    } catch (e) {
      console.error(chalk.red(`❌ Plugin error: ${filename}`))
      console.error(e)
    }
  }
}

await filesInit()

const reloadPlugin = async (_, filename) => {
  if (!filename || !pluginFilter(filename)) return
  const dir = join(pluginFolder, filename)
  if (filename in global.plugins) {
    if (existsSync(dir)) console.log(chalk.cyan(` ♻ updated plugin - '${filename}'`))
    else { console.log(chalk.yellow(`🗑 deleted plugin - '${filename}'`)); return delete global.plugins[filename] }
  } else {
    console.log(chalk.green(`➕ new plugin - '${filename}'`))
  }
  const err = syntaxerror(readFileSync(dir), filename, { sourceType: 'module', allowAwaitOutsideFunction: true })
  if (err) { console.error(`syntax error in '${filename}'\n${format(err)}`); return }
  try {
    const mod = await import(`file://${dir}?update=${Date.now()}`)
    global.plugins[filename] = mod.default || mod
  } catch (e) {
    console.error(`error loading plugin '${filename}'\n${format(e)}`)
  }
  global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a],[b]) => a.localeCompare(b)))
}

watch(pluginFolder, reloadPlugin)

let handler = await import('./handler.js')

global.reloadHandler = async function (restatConn = false) {
  try {
    const H = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    if (H && Object.keys(H).length) handler = H
  } catch (e) { console.error(e) }

  if (restatConn) {
    const oldChats = global.conn.chats
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
  printQRInTerminal: opcion === '1',
  browser: Browsers.macOS('Desktop'),
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }))
  },
  markOnlineOnConnect: true,
  generateHighQualityLinkPreview: true,
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

// Pairing code
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
    let code = await global.conn.requestPairingCode(phoneNumber)
    code = code?.match(/.{1,4}/g)?.join('-') || code
    console.log(chalk.bold.magenta(
      '\n╭─────────────────────────────◉\n' +
      '│ � CÓDIGO DE VINCULACIÓN\n' +
      `│ ${chalk.bold.red(code)}\n` +
      '╰─────────────────────────────◉\n'
    ))
  }, 3000)
} else {
  rl.close()
}

async function connectionUpdate(update) {
  const { connection, lastDisconnect, qr } = update

  if (qr && opcion === '1') {
    console.log(chalk.bold.yellow('\n❐ ESCANEA EL QR — expira en 45 segundos'))
  }

  if (connection === 'open') {
    console.log(chalk.bold.green('\n✨ BOT CONECTADO ✨'))
  }

  if (connection === 'close') {
    const reason = new Boom(lastDisconnect?.error)?.output?.statusCode

    const msgs = {
      [DisconnectReason.badSession]:          chalk.cyanBright(`⚠ Sesión inválida. Borra ${sessionsDir} y reconecta.`),
      [DisconnectReason.connectionClosed]:    chalk.magentaBright('⚠ Conexión cerrada, reconectando...'),
      [DisconnectReason.connectionLost]:      chalk.blueBright('⚠ Conexión perdida, reconectando...'),
      [DisconnectReason.connectionReplaced]:  chalk.yellowBright('⚠ Sesión reemplazada. Cierra la sesión anterior.'),
      [DisconnectReason.loggedOut]:           chalk.redBright(`⚠ Sesión cerrada. Borra ${sessionsDir} y reconecta.`),
      [DisconnectReason.restartRequired]:     chalk.cyanBright('✧ Reiniciando conexión...'),
      [DisconnectReason.timedOut]:            chalk.yellowBright('⧖ Tiempo agotado, reconectando...'),
    }

    console.log('\n' + (msgs[reason] || chalk.red(`⚠ Desconexión desconocida: ${reason}`)))

    if (reason === DisconnectReason.loggedOut || reason === DisconnectReason.badSession) return
    if (reason === DisconnectReason.connectionReplaced) return

    if (reason === 429) {
      console.log(chalk.red('⚠ Rate limit. Esperando 30s...'))
      await sleep(30000)
    }

    await global.reloadHandler(true).catch(console.error)
  }
}

await global.reloadHandler()

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
  console.log(chalk.gray('Support: ' + JSON.stringify(global.support)))
}

_quickTest().catch(console.error)

