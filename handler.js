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
      console.log(`✅ Plugin cargado → ${file}`)
    } catch (e) {
      console.log(`❌ Error plugin → ${file}`)
      console.log(e)
    }
  }
}

await loadPlugins()

fs.watch(pluginFolder, async (_, file) => {
  if (!file?.endsWith(".js")) return
  try {
    console.log(`♻️ Plugin actualizado → ${file}`)
    delete global.plugins[file]
    const mod = await import(`./plugins/${file}?update=${Date.now()}`)
    global.plugins[file] = mod.default || mod
  } catch (e) {
    console.log(`❌ Error recargando → ${file}`)
    console.log(e)
  }
})

const DIGITS = s => String(s || "").replace(/\D/g, "")

global.dfail = (type, m, conn) => {
  const msg = {
        rowner: '⚠️ 𝘈𝘤𝘤𝘦𝘴𝘰 𝘳𝘦𝘴𝘵𝘳𝘪𝘯𝘨𝘪𝘥𝘰 𝘓𝘰 𝘴𝘪𝘦𝘯𝘵𝘰',
        owner: '⚠️ 𝘊𝘰𝘮𝘢𝘯𝘥𝘰 𝘳𝘦𝘴𝘦𝘳𝘷𝘢𝘥𝘰 𝘌𝘴𝘵𝘦 𝘤𝘰𝘮𝘢𝘯𝘥𝘰 𝘦𝘴 𝘴𝘰𝘭𝘰 𝘱𝘢𝘳𝘢 𝘮𝘪 𝘱𝘳𝘰𝘱𝘪𝘦𝘵𝘢𝘳𝘪𝘰 𝘗𝘳𝘪𝘷𝘪𝘭𝘦𝘨𝘪𝘰𝘴 𝘦𝘹𝘤𝘭𝘶𝘴𝘪𝘷𝘰𝘴',
        mods: '⚠️ 𝘌𝘴𝘵𝘦 𝘤𝘰𝘮𝘢𝘯𝘥𝘰 𝘴𝘰𝘭𝘰 𝘭𝘰 𝘱𝘶𝘦𝘥𝘰 𝘶𝘴𝘢𝘳 𝘺𝘰 𝘗𝘳𝘪𝘷𝘪𝘭𝘦𝘨𝘪𝘰𝘴 𝘥𝘦 𝘮𝘰𝘥𝘦𝘳𝘢𝘥𝘰𝘳𝘦𝘴',
        premium: '⚠️ 𝘌𝘴𝘵𝘦 𝘤𝘰𝘮𝘢𝘯𝘥𝘰 𝘦𝘴 𝘴𝘰𝘭𝘰 𝘱𝘢𝘳𝘢 𝘶𝘴𝘶𝘢𝘳𝘪𝘰𝘴 𝘗𝘳𝘦𝘮𝘪𝘶𝘮 (𝘝𝘐𝘗) 𝘚𝘦𝘳 𝘝𝘐𝘗 𝘵𝘪𝘦𝘯𝘦 𝘴𝘶𝘴 𝘣𝘦𝘯𝘦𝘧𝘪𝘤𝘪𝘰𝘴',
        group: '⚠️ 𝘊𝘰𝘮𝘢𝘯𝘥𝘰 𝘱𝘢𝘳𝘢 𝘨𝘳𝘶𝘱𝘰 𝘌𝘴𝘵𝘦 𝘤𝘰𝘮𝘢𝘯𝘥𝘰 𝘴𝘰𝘭𝘰 𝘧𝘶𝘯𝘤𝘪𝘰𝘯𝘢 𝘦𝘯 𝘨𝘳𝘶𝘱𝘰𝘴.',
        private: '⚠️ 𝘊𝘰𝘮𝘢𝘯𝘥𝘰 𝘴𝘰𝘭𝘰 𝘧𝘶𝘯𝘤𝘪𝘰𝘯𝘢 𝘦𝘭 𝘱𝘳𝘪𝘷𝘢𝘥𝘰 𝘝𝘢𝘮𝘰𝘴 𝘢𝘭 𝘱𝘳𝘪𝘷𝘢𝘥𝘰, 𝘦𝘴𝘵𝘦 𝘤𝘰𝘮𝘢𝘯𝘥𝘰 𝘴𝘰𝘭𝘰 𝘧𝘶𝘯𝘤𝘪𝘰𝘯𝘢 𝘦𝘯 𝘦𝘭 𝘱𝘳𝘪𝘷𝘢𝘥𝘰 𝘥𝘦𝘭 𝘣𝘰𝘵',
        admin: '⚠️ 𝘕𝘦𝘤𝘦𝘴𝘪𝘵𝘢𝘴 𝘴𝘦𝘳 𝘢𝘥𝘮𝘪𝘯 𝘚𝘰𝘭𝘰 𝘭𝘰𝘴 𝘢𝘥𝘮𝘪𝘯𝘴 𝘱𝘶𝘦𝘥𝘦𝘯 𝘶𝘴𝘢𝘳 𝘦𝘴𝘵𝘦 𝘤𝘰𝘮𝘢𝘯𝘥𝘰. 𝘕𝘦𝘤𝘦𝘴𝘪𝘵𝘰 𝘢 𝘭𝘰𝘴 𝘫𝘦𝘧𝘦𝘴 𝘢𝘲𝘶𝘪́',
        botAdmin: '⚠️ 𝘕𝘦𝘤𝘦𝘴𝘪𝘵𝘰 𝘱𝘦𝘳𝘮𝘪𝘴𝘰𝘴 𝘱𝘳𝘪𝘮𝘦𝘳𝘰 𝘩𝘢𝘻𝘮𝘦 𝘢𝘥𝘮𝘪𝘯𝘴 𝘢𝘭 𝘉𝘰𝘵 𝘰𝘴𝘦𝘢 𝘢 𝘮𝘪 𝘱𝘢𝘳𝘢 𝘱𝘰𝘥𝘦𝘳 𝘶𝘴𝘢𝘳 𝘦𝘴𝘵𝘦 𝘤𝘰𝘮𝘢𝘯𝘥𝘰.',
        restrict: '[ 🔐 ] 𝘊𝘰𝘮𝘢𝘯𝘥𝘰 𝘥𝘦𝘴𝘢𝘤𝘵𝘪𝘷𝘢𝘥𝘰 𝘌𝘴𝘵𝘦 𝘤𝘰𝘮𝘢𝘯𝘥𝘰 𝘦𝘴𝘵𝘢 𝘥𝘦𝘴𝘢𝘤𝘵𝘪𝘷𝘢𝘥𝘰 𝘱𝘰𝘳 𝘮𝘪 𝘫𝘦𝘧𝘦'
  }[type]
  if (!msg) return
  if (msg) return conn.sendMessage(m.chat, {text: msg, contextInfo: { mentionedJid: null, forwardingScore: 1, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363419404216418@newsletter', serverMessageId: '', newsletterName: '♑︎ 𝐌𝐄𝐋𝐈𝐎𝐃𝐀𝐒 - 𝐂𝐇𝐀𝐍𝐍𝐄𝐋 𝐎𝐅𝐈𝐂𝐈𝐀𝐋 ꨄ' }, externalAdReply : {mediaUrl: null, mediaType: 1, description: null, "title": `ℹ️𝐈𝐍𝐅𝐎 ℹ️`, body: wm, previewType: 0, "thumbnail": img.getRandom(), sourceUrl: [nna, nna2, md, ig, yt, nn, tiktok].getRandom()}}}, { quoted: m })
}

export async function handler(chatUpdate) {
  try {
    let m = chatUpdate.messages?.[0]
    if (!m?.message) return
    if (m.key?.fromMe) return

    const conn = global.conn
    m = smsg(conn, m)
    if (!m.text) return

    const prefix = /^[./#!]/
    if (!prefix.test(m.text)) return

    const usedPrefix = m.text.match(prefix)[0]
    const args       = m.text.slice(usedPrefix.length).trim().split(/ +/)
    const command    = args.shift()?.toLowerCase() || ""
    const text       = args.join(" ")

    let groupMetadata = null
    let participants  = []
    let isAdmin       = false
    let isBotAdmin    = false

    if (m.isGroup) {
      let cached = global.groupMetaCache.get(m.chat)

      if (!cached || Date.now() - cached.ts > 15000) {
        groupMetadata = await conn.groupMetadata(m.chat)
        participants  = groupMetadata.participants || []

        const adminSet = new Set()
        for (const p of participants) {
          if (p.admin) adminSet.add(DIGITS(p.id))
        }

        cached = { ts: Date.now(), meta: groupMetadata, adminSet }
        global.groupMetaCache.set(m.chat, cached)
      }

      groupMetadata = cached.meta
      participants  = groupMetadata.participants

      isAdmin    = cached.adminSet.has(DIGITS(m.sender))
      isBotAdmin = cached.adminSet.has(DIGITS(conn.user.id))
    }

    const isOwner = (global.owner || [])
      .map(v => DIGITS(Array.isArray(v) ? v[0] : v))
      .includes(DIGITS(m.sender)) || m.fromMe

    for (const name in global.plugins) {
      const plugin = global.plugins[name]
      if (!plugin) continue

      let match = false

      if (plugin.customPrefix instanceof RegExp) {
        match = plugin.customPrefix.test(usedPrefix + command)
      } else if (plugin.command instanceof RegExp) {
        const src = plugin.command.source
        if (!src || src === '(?:)') continue
        const anchored = new RegExp(
          `^(?:${src})$`,
          plugin.command.flags.replace('g', '')
        )
        match = anchored.test(command)
      } else if (Array.isArray(plugin.command)) {
        match = plugin.command.map(c => String(c).toLowerCase()).includes(command)
      } else if (typeof plugin.command === "string") {
        match = plugin.command.toLowerCase() === command
      }

      if (!match) continue

      if (plugin.group    && !m.isGroup) return global.dfail("group",    m, conn)
      if (plugin.private  &&  m.isGroup) return global.dfail("private",  m, conn)
      if (plugin.owner    && !isOwner)   return global.dfail("owner",    m, conn)
      if (plugin.admin    && !isAdmin)   return global.dfail("admin",    m, conn)
      if (plugin.botAdmin && !isBotAdmin) return global.dfail("botAdmin", m, conn)

      try {
        await plugin(m, {
          conn, 
          args, 
          text, 
          command, 
          usedPrefix,
          participants, 
          groupMetadata,
          isOwner, 
          isAdmin, 
          isBotAdmin
        })
      } catch (e) {
        console.log(`❌ Error en plugin ${name}`)
        console.log(e)
      }

      return 
    }


  } catch (e) {
    console.log("❌ ERROR HANDLER GLOBAL")
    console.log(e)
  }
}
