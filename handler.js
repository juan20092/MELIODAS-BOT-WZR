import { smsg } from "./wzr/simple.js"
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
}
