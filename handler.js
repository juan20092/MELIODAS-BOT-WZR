/*import { smsg } from "./wzr/simple.js"
import fs from "fs"

global.plugins = {}
global.groupMetaCache ||= new Map() 

const pluginFolder = "./plugins"

async function loadPlugins() {
  for (const file of fs.readdirSync(pluginFolder)) {
    if (!file.endsWith(".js")) continue
    try {
      const mod = await import(`./plugins/${file}?update=${Date.now()}`)
      global.plugins[file] = mod.default || mod
    } catch (e) {
      console.error(`❌ Error plugin → ${file}`, e)
    }
  }
  console.log(`✅ ${Object.keys(global.plugins).length} Plugins cargados correctamente.`)
}
await loadPlugins()

fs.watch(pluginFolder, async (_, file) => {
  if (!file?.endsWith(".js")) return
  try {
    delete global.plugins[file]
    const mod = await import(`./plugins/${file}?update=${Date.now()}`)
    global.plugins[file] = mod.default || mod
  } catch (e) {
    console.error(`❌ Error recargando → ${file}`, e)
  }
})

global.dfail = (type, m, conn) => {
  const msg = {
    rowner: `*⚠️ 𝘌𝘴𝘵𝘦 𝘊𝘰𝘮𝘢𝘯𝘥𝘰 𝘚𝘰𝘭𝘰 𝘗𝘶𝘦𝘥𝘦 𝘚𝘦𝘳 𝘜𝘴𝘢𝘥𝘰 𝘗𝘰𝘳 𝘔𝘪 𝘊𝘳𝘦𝘢𝘥𝘰𝘳*`,

    owner: `*⚠️ 𝘌𝘴𝘵𝘦 𝘊𝘰𝘮𝘢𝘥𝘰 𝘚𝘰𝘭𝘰 𝘗𝘶𝘦𝘥𝘦 𝘚𝘦𝘳 𝘜𝘵𝘪𝘭𝘪𝘻𝘢𝘥𝘰 𝘗𝘰𝘳 𝘔𝘪 𝘊𝘳𝘦𝘢𝘥𝘰𝘳*`,

    mods: `*⚠️ 𝘌𝘴𝘵𝘦 𝘊𝘰𝘮𝘢𝘯𝘥𝘰 𝘚𝘰𝘭𝘰 𝘗𝘶𝘦𝘥𝘦 𝘚𝘦𝘳 𝘜𝘵𝘪𝘭𝘪𝘻𝘢𝘥𝘰 𝘗𝘰𝘳 𝘥𝘦𝘴𝘢𝘳𝘳𝘰𝘭𝘭𝘢𝘥𝘰𝘳𝘦𝘴 𝘖𝘧𝘪𝘤𝘪𝘢𝘭𝘦𝘴*`,

    premium: `*⚠️ 𝘌𝘴𝘵𝘦 𝘊𝘰𝘮𝘢𝘯𝘥𝘰 𝘚𝘰𝘭𝘰 𝘓𝘰 𝘗𝘶𝘦𝘥𝘦𝘯 𝘜𝘵𝘪𝘭𝘪𝘻𝘢𝘳 𝘜𝘴𝘶𝘢𝘳𝘪𝘰𝘴 𝘗𝘳𝘦𝘮𝘪𝘶𝘮*`,

    group: `*⚠️ 𝘌𝘴𝘵𝘦 𝘊𝘰𝘮𝘢𝘯𝘥𝘰 𝘚𝘰𝘭𝘰 𝘍𝘶𝘯𝘤𝘪𝘰𝘯𝘢 𝘌𝘯 𝘎𝘳𝘶𝘱𝘰𝘴*`,

    private: `*⚠️ 𝘌𝘴𝘵𝘦 𝘊𝘰𝘮𝘢𝘯𝘥𝘰 𝘚𝘰𝘭𝘰 𝘚𝘦 𝘗𝘶𝘦𝘥𝘦 𝘖𝘤𝘶𝘱𝘢𝘳 𝘌𝘯 𝘌𝘭 𝘗𝘳𝘪𝘷𝘢𝘥𝘰 𝘋𝘦𝘭 𝘉𝘰𝘵*`,

    admin: `*⚠️ 𝘌𝘴𝘵𝘦 𝘊𝘰𝘮𝘢𝘯𝘥𝘰 𝘚𝘰𝘭𝘰 𝘗𝘶𝘦𝘥𝘦 𝘚𝘦𝘳 𝘜𝘴𝘢𝘥𝘰 𝘗𝘰𝘳 𝘈𝘥𝘮𝘪𝘯𝘪𝘴𝘵𝘳𝘢𝘥𝘰𝘳𝘦𝘴*`,

    botAdmin: `*⚠️ 𝘕𝘦𝘤𝘦𝘴𝘪𝘵𝘰 𝘴𝘦𝘳 𝘈𝘥𝘮𝘪𝘯 𝘗𝘢𝘳𝘢 𝘜𝘴𝘢𝘳 𝘌𝘴𝘵𝘦 𝘊𝘰𝘮𝘢𝘯𝘥𝘰*`,

    restrict: `*⚠️ 𝘌𝘴𝘵𝘦 𝘊𝘰𝘮𝘢𝘯𝘥𝘰 𝘈𝘩 𝘚𝘪𝘥𝘰 𝘋𝘦𝘴𝘢𝘣𝘪𝘭𝘪𝘵𝘢𝘥𝘰 𝘗𝘰𝘳 𝘔𝘪 𝘊𝘳𝘦𝘢𝘥𝘰𝘳*`
  }[type]

  if (!msg) return
  return conn.sendMessage(m.chat, { text: msg, contextInfo: global.fake?.contextInfo || null }, { quoted: m })
}

export async function handler(chatUpdate) {
  try {
    let m = chatUpdate.messages?.[0]
    if (!m?.message || m.key?.fromMe || m.isBaileys) return

    const conn = global.conn
    m = smsg(conn, m)
    if (!m.text) return

    let _user = global.db?.data?.users?.[m.sender] || {}

    
    const botJid = conn.decodeJid(conn.user.id)
    const isROwner = [botJid, ...(global.owner || []).map(v => v[0].replace(/\D/g, '') + (v[1] === 'jid' ? '@s.whatsapp.net' : '@lid'))].includes(m.sender)
    const isOwner = isROwner || m.fromMe
    const isMods = isOwner || (global.mods || []).map(v => v.replace(/\D/g, '') + '@s.whatsapp.net').includes(m.sender)
    const isPrems = isROwner || _user.prem === true || (global.prems || []).map(v => v.replace(/\D/g, '') + '@s.whatsapp.net').includes(m.sender)

    
    const allPromises = Object.values(global.plugins)
      .filter(p => typeof p?.all === 'function')
      .map(p => p.all.call(conn, m).catch(e => console.error(`❌ Error en .all:`, e)))
    
    
    m.exp = (m.exp || 0) + Math.ceil(Math.random() * 10)

    const prefix = /^[./#!]/
    if (!prefix.test(m.text)) {
      await Promise.all(allPromises)
      return
    }

    let usedPrefix = m.text.match(prefix)?.[0]
    const args = m.text.slice(usedPrefix.length).trim().split(/ +/)
    const command = args.shift()?.toLowerCase() || ""
    const text = args.join(" ")

    let groupMetadata = {}
    if (m.isGroup) {
      
      if (global.groupMetaCache.has(m.chat)) {
        groupMetadata = global.groupMetaCache.get(m.chat)
      } else {
        try {
          groupMetadata = await conn.groupMetadata(m.chat)
          global.groupMetaCache.set(m.chat, groupMetadata)
          
          
          setTimeout(() => global.groupMetaCache.delete(m.chat), 10 * 60 * 1000)
        } catch {
          groupMetadata = {}
        }
      }
    }

    const participants = m.isGroup ? groupMetadata.participants || [] : []
    const user = m.isGroup ? participants.find(u => conn.decodeJid(u.id) === m.sender) || {} : {}
    const bot = m.isGroup ? participants.find(u => [botJid, conn.decodeJid(conn.user?.lid || '')].includes(conn.decodeJid(u.id))) || {} : {}

    const isRAdmin = user?.admin === 'superadmin'
    const isAdmin = isRAdmin || user?.admin === 'admin'
    const isBotAdmin = ['admin', 'superadmin'].includes(bot?.admin)

   
    await Promise.all(allPromises)

    for (const name in global.plugins) {
      const plugin = global.plugins[name]
      if (!plugin) continue

      let match = false

      
      if (plugin.customPrefix instanceof RegExp) {
        match = plugin.customPrefix.test(usedPrefix + command)
      } else if (plugin.command instanceof RegExp) {
        match = plugin.command.test(command)
      } else if (Array.isArray(plugin.command)) {
        match = plugin.command.some(c => String(c).toLowerCase() === command)
      } else if (typeof plugin.command === "string") {
        match = plugin.command.toLowerCase() === command
      }

      if (!match) continue

      
      if (plugin.group && !m.isGroup) return global.dfail("group", m, conn)
      if (plugin.private && m.isGroup) return global.dfail("private", m, conn)
      if (plugin.owner && !isOwner) return global.dfail("owner", m, conn)
      if (plugin.admin && !isAdmin) return global.dfail("admin", m, conn)
      if (plugin.botAdmin && !isBotAdmin) return global.dfail("botAdmin", m, conn)

      try {
        await plugin(m, {
          conn, args, text, command, usedPrefix, participants, groupMetadata,
          isOwner, isROwner, isMods, isPrems, isAdmin, isBotAdmin
        })
      } catch (e) {
        console.error(`❌ Error en plugin ${name}:`, e)
      }
      return
    }
  } catch (e) {
    console.error("❌ ERROR HANDLER GLOBAL:", e)
  }
}*/


// prueba 



import { smsg } from "./wzr/simple.js"
import fs from "fs"
import path from "path"
import { fileURLToPath, pathToFileURL } from "url"
import axios from "axios"
import { isChatBanned } from "./wzr/banlist.js"
import { isMuted } from './wzr/mute.js'

global.plugins ||= {}
global.groupMetaCache ||= new Map()

const pluginFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), "plugins")

async function loadPluginsFallback() {
  if (global.__pluginsManagedByEntryPoint) return

  if (!fs.existsSync(pluginFolder)) {
    fs.mkdirSync(pluginFolder, { recursive: true })
    return
  }

  global.plugins = {}

  const walk = async (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.isFile() && entry.name.endsWith(".js")) {
        const relativePath = path.relative(pluginFolder, fullPath).replace(/\\/g, "/")
        try {
          const mod = await import(`${pathToFileURL(fullPath).href}?update=${Date.now()}`)
          global.plugins[relativePath] = mod.default || mod
        } catch (e) {
          console.error(`❌ Error cargando plugin → ${relativePath}`)
          console.error(e?.stack || e)
        }
      }
    }
  }

  await walk(pluginFolder)
}

await loadPluginsFallback()

function normalizeJid(jid, conn) {
  if (!jid) return ''
  const value = String(jid).trim()
  if (!value) return ''
  const decoded = conn?.decodeJid?.(value) || value
  const cleaned = String(decoded).trim()
  if (!cleaned) return ''

  return cleaned
    .replace(/:.*$/, '')
    .replace(/@lid$/i, '@s.whatsapp.net')
    .replace(/@s\.whatsapp\.net$/i, '@s.whatsapp.net')
    .toLowerCase()
}

function findParticipant(participants, targetJid, conn) {
  const target = normalizeJid(targetJid, conn)
  if (!target) return null

  const targetVariants = [
    target,
    target.replace(/@s\.whatsapp\.net$/i, '@lid'),
    target.replace(/@lid$/i, '@s.whatsapp.net')
  ].filter(Boolean)

  return participants.find((participant) => {
    const ids = [
      normalizeJid(participant?.id, conn),
      normalizeJid(participant?.user, conn),
      normalizeJid(participant?.jid, conn),
      normalizeJid(participant?.userJid, conn),
      normalizeJid(participant?.participant, conn)
    ].filter(Boolean)

    return ids.some((id) => targetVariants.includes(id))
  }) || null
}

function getAdminStatus(participants, senderJid, botJid, conn) {
  const userParticipant = findParticipant(participants, senderJid, conn)
  const botParticipant = findParticipant(participants, botJid, conn)

  const userAdmin = String(
    userParticipant?.admin || userParticipant?.isAdmin || userParticipant?.rank || userParticipant?.type || ''
  ).toLowerCase()
  const botAdmin = String(
    botParticipant?.admin || botParticipant?.isAdmin || botParticipant?.rank || botParticipant?.type || ''
  ).toLowerCase()

  const isUserAdmin = ['admin', 'superadmin', 'owner'].includes(userAdmin) || userParticipant?.isAdmin === true || userParticipant?.isSuperAdmin === true
  const isBotAdmin = ['admin', 'superadmin', 'owner'].includes(botAdmin) || botParticipant?.isAdmin === true || botParticipant?.isSuperAdmin === true

  return {
    isAdmin: isUserAdmin,
    isBotAdmin
  }
}

function getFilesRecursively(dir) {
  if (!fs.existsSync(dir)) return []

  let files = []
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...getFilesRecursively(fullPath))
    } else if (file.endsWith(".js")) {
      files.push(fullPath)
    }
  }
  return files
}

async function loadPlugins() {
  if (!fs.existsSync(pluginFolder)) {
    fs.mkdirSync(pluginFolder, { recursive: true })
  }

  global.plugins = {}
  const files = getFilesRecursively(pluginFolder)

  for (const file of files) {
    const relativePath = path.relative(pluginFolder, file).replace(/\\/g, "/")
    try {
      const mod = await import(`${pathToFileURL(file).href}?update=${Date.now()}`)
      global.plugins[relativePath] = mod.default || mod
      console.log(`✅ Plugin cargado → ${relativePath}`)
    } catch (e) {
      console.error(`❌ Error cargando plugin → ${relativePath}`)
      console.error(e?.stack || e)
    }
  }
  console.log(`✅ ${Object.keys(global.plugins).length} plugins cargados correctamente.`)
}

await loadPlugins()

const watchPlugins = () => {
  const onChange = async (_, file) => {
    try {
      if (!file || !file.endsWith(".js")) return
      const fullPath = path.join(pluginFolder, file)
      const relativePath = path.relative(pluginFolder, fullPath).replace(/\\/g, "/")
      delete global.plugins[relativePath]

      const mod = await import(`${pathToFileURL(fullPath).href}?update=${Date.now()}`)
      global.plugins[relativePath] = mod.default || mod
      console.log(`♻️ Plugin recargado → ${relativePath}`)
    } catch (e) {
      console.error(`❌ Error recargando → ${file}`)
      console.error(e?.stack || e)
    }
  }

  try {
    return fs.watch(pluginFolder, { recursive: true }, onChange)
  } catch (e) {
    console.warn(`⚠️ El watcher recursivo de plugins no está disponible: ${e.message}`)
    return fs.watch(pluginFolder, onChange)
  }
}

watchPlugins()

let cachedThumbBuffer = null
const imgUrl = "https://cdn.dix.lat/me/b0216efd-5f4a-4f5a-97bf-b62a81d10014.jpg"

global.dfail = async (type, m, conn, command = "", usedPrefix = ".", user2 = "usuario") => {
  const msg = {
    rowner: "> ╰➤ |𝐀𝐯𝐢𝐬𝐨| `𝐋𝐨 𝐬𝐢𝐞𝐧𝐭𝐨 𝐞𝐬𝐭𝐞 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐬𝐨𝐥𝐨 𝐞𝐬 𝐩𝐚𝐫𝐚 𝐦𝐢 𝐜𝐫𝐞𝐚𝐝𝐨𝐫`🚫",
    owner: "> ╰➤ _ |𝐀𝐯𝐢𝐬𝐨| *` 𝙋𝙚𝙧𝙙𝙤𝙣 𝙨𝙤𝙡ο 𝙢𝙞𝙨 𝙘𝙧𝙚𝙖𝙙𝙤𝙧𝙚𝙨 𝙥𝙪𝙚𝙙𝙚𝙣 𝙪𝙨𝙖𝙧𝙡ο 😴.`*_",
    mods: "> ╰➤ _*|𝐀𝐯𝐢𝐬𝐨| `𝐄𝐡 𝐥𝐨 𝐬𝐢𝐞𝐧𝐭𝐨 𝐞𝐬𝐭𝐨 𝐬𝐨𝐥𝐨 𝐞𝐬 𝐩𝐚𝐫𝐚 𝐥𝐨𝐬 𝐦𝐨𝐝𝐬 ⚡`*_",
    premium: "> ╰➤ |𝐀𝐯𝐢𝐬𝐨| *`🔑 𝐍𝐎 𝐄𝐑𝐄𝐒 𝐔𝐒𝐔𝐀𝐑𝐈𝐎 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐇𝐀𝐁𝐋𝐀 𝐂𝐎𝐍 𝐌𝐈 𝐂𝐑𝐄𝐀𝐃𝐎𝐑`*_",
    group: "> ╰➤ |𝐀𝐯𝐢𝐬𝐨|  _*`↘️ 𝐄𝐒𝐓𝐄 𝐂𝐎𝐌𝐀𝐍𝐃𝐎́ 𝐒𝐎𝐋𝐎 𝐅𝐔𝐍𝐂𝐈𝐎𝐍𝐀 𝐄𝐍 𝐆𝐑𝐔𝐏𝐎𝐒`*_",
    private: "> ╰➤ |𝐀𝐯𝐢𝐬𝐨|  _*`💬 𝐔𝐒𝐀 𝐄𝐋 𝐂𝐇𝐀𝐓 𝐏𝐑𝐈𝐕𝐀𝐃𝐎 𝐏𝐀𝐑𝐀 𝐄𝐒𝐓𝐄 𝐂𝐎𝐌𝐀𝐍𝐃𝐎`*_",
    admin: "> ╰➤ |𝐀𝐯𝐢𝐬𝐨| _*`𝐓𝐔 𝐍𝐎 𝐄𝐑𝐄𝐒 𝐀𝐃𝐌𝐈𝐍 😝`*_",
    botAdmin: "> ╰➤ |𝐀𝐯𝐢𝐬𝐨| _*`⚠️ 𝐍𝐄𝐂𝐄𝐒𝐈𝐓𝐎 𝐒𝐄𝐑 𝐀𝐃𝐌𝐈𝐍 𝐏𝐀𝐑𝐀 𝐔𝐒𝐀𝐑 𝐋𝐀𝐒 𝐅𝐔𝐍𝐂𝐈𝐎𝐍𝐄𝐒`*_",
    restrict: "> _*`𝐂𝐎𝐌𝐀𝐍𝐃𝐎 𝐀𝐏𝐀𝐆𝐀𝐃𝐎 𝐏𝐎𝐑 𝐌𝐈 𝐃𝐔𝐄Ñ𝐎`*_"
  }[type]

  if (!msg) return

  const labelTest = "𝐌𝐄𝐋𝐈𝐎𝐃𝐀𝐒 - 𝐁𝐎𝐓"
  let fakeQuoted = m

  try {
    if (!cachedThumbBuffer) {
      const response = await axios.get(imgUrl, { responseType: "arraybuffer" }).catch(() => null)
      if (response) cachedThumbBuffer = response.data
    }

    if (cachedThumbBuffer) {
      fakeQuoted = {
        key: {
          participant: "0@s.whatsapp.net",
          remoteJid: "status@broadcast",
          fromMe: false,
          id: "KiritoTest"
        },
        message: {
          locationMessage: {
            name: labelTest,
            jpegThumbnail: cachedThumbBuffer
          }
        },
        participant: "0@s.whatsapp.net"
      }
    }
  } catch { }

  await conn.sendMessage(
    m.chat,
    {
      text: msg + "\n\n> © 𝖏𝖚𝖆𝖓-𝖜𝖟 | 𝟤𝟢𝟤𝟧",
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: global.ch || "120363419404216418@newsletter",
          newsletterName: "𝘔𝘌𝘓𝘐𝘖𝘋𝘈𝘚 𝘉𝘖𝘛 - 𝘊𝘏𝘈𝘕𝘕𝘌𝘓 𝟮𝟬𝟮𝟯"
        }
      }
    },
    { quoted: fakeQuoted }
  )

  await m.react("🏜️")
}

export async function handler(chatUpdate) {
  try {
    let m = chatUpdate.messages?.[0]
    if (!m?.message) return

    const conn = global.conn
    m = smsg(conn, m)
    
    const _user = global.db?.data?.users?.[m.sender] || {}
    const sendNum = (m?.sender || '').replace(/[^0-9]/g, '')
    
    if (!global.db.data.users[m.sender])
  global.db.data.users[m.sender] = {}

  if (typeof global.db.data.users[m.sender].chat !== 'number')
  global.db.data.users[m.sender].chat = 0

global.db.data.users[m.sender].chat++
}
    
    const ownersList = Array.isArray(global.owner) 
      ? global.owner.map(v => (Array.isArray(v) ? v[0] : v)) 
      : []
    const modsList = Array.isArray(global.mods) 
      ? global.mods.map(v => (Array.isArray(v) ? v[0] : v)) 
      : []
    const premsList = Array.isArray(global.prems) 
      ? global.prems.map(v => (Array.isArray(v) ? v[0] : v)) 
      : []

    const botJidDecoded = conn?.user?.id ? conn.decodeJid(conn.user.id) : ''
    const isROwner = [botJidDecoded, ...ownersList].map(v => String(v || '').replace(/[^0-9]/g, '')).includes(sendNum)
    
    const isOwner = isROwner || m.fromMe
    const isMods = isOwner || modsList.map(v => String(v || '').replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
    const isPrems = isROwner || premsList.map(v => String(v || '').replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || _user.prem == true

    if (global.opts && global.opts['queque'] && m.text && !(isMods || isPrems)) {
      let queque = this.msgqueque || []
      let time = 1000 * 5
      const previousID = queque[queque.length - 1]
      queque.push(m.id || m.key.id)
      setInterval(async function () {
        if (queque.indexOf(previousID) === -1) clearInterval(this)
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
        await delay(time)
      }, time)
    }

    if (m.isBaileys) return
    if (m.key?.fromMe) return
    if (m.isGroup && isMuted(m.sender)) {
  try {
    await conn.sendMessage(m.chat, {
      delete: m.key
    })
  } catch {}

  return
}

if (!m.text) return

    m.exp = (m.exp || 0) + Math.ceil(Math.random() * 10)

    const prefix = /^[./#!]/

    let usedPrefix = ""
    let body = m.text.trim()

    if (prefix.test(body)) {
      usedPrefix = body.match(prefix)?.[0] || ""
      body = body.slice(usedPrefix.length).trim()
    }

    const args = body.split(/ +/)
    const command = args.shift()?.toLowerCase() || ""
    const text = args.join(" ")

    const isBannedChat = m.isGroup && isChatBanned(m.chat)
    if (isBannedChat && command !== "unbanchat") {
      return
    }

    for (const plugin of Object.values(global.plugins)) {
      if (typeof plugin?.all === "function") {
        try {
          await plugin.all.call(conn, m)
        } catch (e) {
          console.error("❌ Error en plugin.all")
          console.error(e.stack || e)
        }
      }
    }
    
    if (m.isGroup && isMuted(m.sender)) {

  try {

    await conn.sendMessage(m.chat, {

      delete: m.key

    })

  } catch {}

  return

}

    let groupMetadata = {}
    let participants = []
    if (m.isGroup) {
      try {
        groupMetadata = (conn.chats?.[m.chat]?.metadata || await conn.groupMetadata(m.chat).catch(() => null)) || {}
        participants = groupMetadata.participants || []
      } catch (e) {
        groupMetadata = {}
        participants = []
        console.error('❌ Error obteniendo metadata del grupo:', e?.message || e)
      }
    }

    const normalizeNumber = (jid) => String(jid || '').replace(/[^0-9]/g, '')
    const cleanJid = (jid) => String(jid || '').split(':')[0] || ''
    const senderNum = normalizeNumber(m.sender)
    const botNums = [conn.user?.jid, conn.user?.lid].map((jid) => normalizeNumber(cleanJid(jid))).filter(Boolean)
    const user = m.isGroup ? participants.find((u) => normalizeNumber(u.id) === senderNum) || {} : {}
    const bot = m.isGroup ? participants.find((u) => botNums.includes(normalizeNumber(u.id))) || {} : {}
    const isRAdmin = user?.admin === 'superadmin'
    const isAdmin = isRAdmin || user?.admin === 'admin'
    const isBotAdmin = !!bot?.admin || bot?.admin === 'admin'

    for (const name in global.plugins) {
      const plugin = global.plugins[name]
      if (!plugin) continue

      let match = false

      if (plugin.customPrefix instanceof RegExp) {
        match = plugin.customPrefix.test(m.text)
      } else if (plugin.command instanceof RegExp) {
        match = plugin.command.test(command)
      } else if (Array.isArray(plugin.command)) {
        match = plugin.command.some(cmd => String(cmd).toLowerCase() === command)
      } else if (typeof plugin.command === "string") {
        match = plugin.command.toLowerCase() === command
      }

      if (!match) continue

      if (plugin.group && !m.isGroup) return global.dfail("group", m, conn)
      if (plugin.private && m.isGroup) return global.dfail("private", m, conn)
      if (plugin.owner && !isOwner) return global.dfail("owner", m, conn)
      if (plugin.admin && !isAdmin) return global.dfail("admin", m, conn)
      if (plugin.botAdmin && !isBotAdmin) return global.dfail("botAdmin", m, conn)

      try {
        const run = plugin.handler || plugin.default || plugin
        if (typeof run === "function") {
          await run.call(conn, m, {
            conn,
            args,
            text,
            command,
            usedPrefix,
            participants,
            groupMetadata,
            isOwner,
            isROwner,
            isMods,
            isPrems,
            isAdmin,
            isBotAdmin
          })
        }
      } catch (e) {
        console.error("\n══════════════════════")
        console.error("❌ ERROR EN COMANDO")
        console.error(`📁 Plugin: ${name}`)
        console.error(`📝 Mensaje: ${m.text}`)
        console.error("══════════════════════")
        console.error(e.stack || e)
        console.error("══════════════════════\n")
      }
      return
    }
  } catch (e) {
    console.error("❌ ERROR HANDLER GLOBAL")
    console.error(e.stack || e)
  }
}
