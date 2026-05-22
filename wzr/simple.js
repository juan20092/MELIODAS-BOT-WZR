import path from 'path'
import fs from 'fs'
import fetch from 'node-fetch'
import PhoneNumber from 'awesome-phonenumber'
import { fileTypeFromBuffer } from 'file-type'
import { fileURLToPath } from 'url'
import { format } from 'util'
import chalk from 'chalk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const {
  default: _makeWaSocket,
  proto,
  jidDecode,
  areJidsSameUser,
  downloadContentFromMessage,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  extractMessageContent,
  prepareWAMessageMedia
} = (await import('@whiskeysockets/baileys')).default


String.prototype.decodeJid = function () {
  if (/:\d+@/gi.test(this)) {
    const d = jidDecode(this) || {}
    return (d.user && d.server ? `${d.user}@${d.server}` : this).trim()
  }
  return this.trim()
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}


async function getMediaType(src) {
  if (/^https?:\/\//i.test(src)) {
    const res = await fetch(src, { method: 'HEAD' })
    return res.headers.get('content-type') || ''
  }
  const { mime } = await fileTypeFromBuffer(fs.readFileSync(src)).catch(() => ({ mime: '' }))
  return mime
}


export function makeWASocket(opts = {}) {
  const conn = _makeWaSocket(opts)

  // Logger compacto
  conn.logger = {
    info:  (...a) => console.log(chalk.green('[INFO]'),  format(...a)),
    error: (...a) => console.log(chalk.red('[ERROR]'),   format(...a)),
    warn:  (...a) => console.log(chalk.yellow('[WARN]'), format(...a)),
    trace: (...a) => {},
    debug: (...a) => {}
  }

  if (conn.user?.id) conn.user.jid = conn.user.id.decodeJid()


  conn.decodeJid = (jid) => {
    if (!jid || typeof jid !== 'string') return null
    return jid.decodeJid()
  }

  conn.parseMention = (text = '') =>
    [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')

  conn.getName = async (jid = '') => {
    jid = conn.decodeJid(jid)
    if (jid.endsWith('@g.us')) {
      const meta = await conn.groupMetadata(jid).catch(() => ({}))
      return meta.subject || jid
    }
    return conn.contacts?.[jid]?.name || jid.split('@')[0]
  }


  conn.getFile = async (src, save = false) => {
    let data, filename, res
    if (Buffer.isBuffer(src)) {
      data = src
    } else if (/^data:.*?;base64,/i.test(src)) {
      data = Buffer.from(src.split(',')[1], 'base64')
    } else if (/^https?:\/\//i.test(src)) {
      res = await fetch(src)
      data = await res.buffer()
    } else if (fs.existsSync(src)) {
      filename = src
      data = fs.readFileSync(src)
    } else {
      data = Buffer.from(src)
    }
    if (!Buffer.isBuffer(data)) throw new TypeError('Not a buffer')
    const type = await fileTypeFromBuffer(data) || { mime: 'application/octet-stream', ext: 'bin' }
    if (save && !filename) {
      filename = path.join(__dirname, `../../tmp/${Date.now()}.${type.ext}`)
      await fs.promises.mkdir(path.dirname(filename), { recursive: true })
      await fs.promises.writeFile(filename, data)
    }
    return { res, filename, data, ...type, deleteFile: () => filename && fs.promises.unlink(filename) }
  }


  conn.reply = (jid, text, quoted, opts = {}) =>
    conn.sendMessage(jid, { text: String(text), ...opts }, { quoted, ...opts })


  conn.sendFile = async (jid, src, filename = '', caption = '', quoted, ptt = false, opts = {}) => {
    const { data, filename: fp, mime } = await conn.getFile(src, true)
    let mtype = 'document'
    if (/image/.test(mime)) mtype = opts.asSticker ? 'sticker' : 'image'
    else if (/video/.test(mime)) mtype = 'video'
    else if (/audio/.test(mime)) mtype = 'audio'
    if (opts.asDocument) mtype = 'document'
    const mimetype = mtype === 'audio' ? 'audio/ogg; codecs=opus' : mime
    return conn.sendMessage(jid, { [mtype]: { url: fp }, caption, ptt, mimetype, fileName: filename || path.basename(fp), ...opts }, { quoted })
  }


  conn.downloadM = async (m, type, save = false) => {
    if (!m?.url && !m?.directPath) return Buffer.alloc(0)
    const stream = await downloadContentFromMessage(m, type)
    let buf = Buffer.from([])
    for await (const chunk of stream) buf = Buffer.concat([buf, chunk])
    if (save) {
      const { filename } = await conn.getFile(buf, true)
      return filename
    }
    return buf
  }


  conn.sendButton2 = async (jid, text, footer, buffer, buttons, copy, urls, quoted, opts = {}) => {
    let img, video
    if (buffer) {
      try {
        const mime = await getMediaType(buffer)
        if (/image/i.test(mime)) img = await prepareWAMessageMedia({ image: { url: buffer } }, { upload: conn.waUploadToServer })
        else if (/video/i.test(mime)) video = await prepareWAMessageMedia({ video: { url: buffer } }, { upload: conn.waUploadToServer })
      } catch (e) { console.error(e) }
    }
    const btns = buttons.map(b => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: b[0], id: b[1] }) }))
    if (copy) btns.push({ name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: 'Copy', copy_code: copy }) })
    if (urls) urls.forEach(u => btns.push({ name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: u[0], url: u[1], merchant_url: u[1] }) }))
    const msg = generateWAMessageFromContent(jid, {
      viewOnceMessage: { message: { interactiveMessage: {
        body: { text }, footer: { text: footer },
        header: { hasMediaAttachment: false, imageMessage: img?.imageMessage || null, videoMessage: video?.videoMessage || null },
        nativeFlowMessage: { buttons: btns, messageParamsJson: '' }
      }}}
    }, { userJid: conn.user.jid, quoted })
    return conn.relayMessage(jid, msg.message, { messageId: msg.key.id, ...opts })
  }


  conn.sendList = async (jid, title, text, buttonText, buffer, sections, quoted, opts = {}) => {
    let img, video
    if (buffer) {
      try {
        const mime = await getMediaType(buffer)
        if (/image/i.test(mime)) img = await prepareWAMessageMedia({ image: { url: buffer } }, { upload: conn.waUploadToServer })
        else if (/video/i.test(mime)) video = await prepareWAMessageMedia({ video: { url: buffer } }, { upload: conn.waUploadToServer })
      } catch (e) { console.error(e) }
    }
    const msg = generateWAMessageFromContent(jid, {
      viewOnceMessage: { message: { interactiveMessage: {
        header: { title, hasMediaAttachment: false, imageMessage: img?.imageMessage || null, videoMessage: video?.videoMessage || null },
        body: { text },
        nativeFlowMessage: { buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: buttonText, sections }) }], messageParamsJson: '' }
      }}}
    }, { userJid: conn.user.jid, quoted })
    return conn.relayMessage(jid, msg.message, { messageId: msg.key.id, ...opts })
  }


  conn.sendPoll = (jid, name, values, selectableCount = 1) =>
    conn.sendMessage(jid, { poll: { name, values, selectableCount } })


  conn.copyNForward = async (jid, message, score = true, opts = {}) => {
    let m = generateForwardMessageContent(message, !!score)
    const ctype = Object.keys(m)[0]
    const mtype = Object.keys(message.message)[0]
    m[ctype].contextInfo = { ...(message.message[mtype]?.contextInfo || {}), ...(m[ctype].contextInfo || {}) }
    m = generateWAMessageFromContent(jid, m, { ...opts, userJid: conn.user.jid })
    await conn.relayMessage(jid, m.message, { messageId: m.key.id })
    return m
  }

  return conn
}
