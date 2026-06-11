import { addBannedChat } from '../../wzr/banlist.js'
import axios from 'axios'

const handler = async (m, { conn }) => {
  try {
    const labelTest = "𝐌𝐄𝐋𝐈𝐎𝐃𝐀𝐒 - 𝐁𝐎𝐓"
    const imgUrl = "https://cdn.dix.lat/me/b0216efd-5f4a-4f5a-97bf-b62a81d10014.jpg"

    let fakeQuoted = m

    try {
      const response = await axios.get(imgUrl, {
        responseType: 'arraybuffer'
      }).catch(() => null)

      if (response) {
        const thumbBuffer = response.data

        fakeQuoted = {
          key: {
            participant: '0@s.whatsapp.net',
            remoteJid: 'status@broadcast',
            fromMe: false,
            id: 'KiritoTest'
          },
          message: {
            locationMessage: {
              name: labelTest,
              jpegThumbnail: thumbBuffer
            }
          },
          participant: '0@s.whatsapp.net'
        }
      }
    } catch (err) {
      console.error("Error al crear el Fake Chat:", err)
    }

    if (!m.isGroup) {
      return conn.sendMessage(
        m.chat,
        {
          text: '❇️ 𝙴𝚂𝚃𝙴 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝚂𝙾𝙻𝙾 𝙵𝚄𝙽𝙲𝙸𝙾𝙽𝙰 𝙴𝙽 𝙶𝚁𝚄𝙿𝙾𝚂',
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: global.ch || '120363419404216418@newsletter',
              newsletterName: '𝘔𝘌𝘓𝘐𝘖𝘋𝘈𝘚 𝘉𝘖𝘛 - 𝘊𝘏𝘈𝘕𝘕𝘌𝘓 𝟮𝟬𝟮𝟯'
            }
          }
        },
        { quoted: fakeQuoted }
      )
    }

    addBannedChat(m.chat)

    await conn.sendMessage(
      m.chat,
      {
        text: '❇️ 𝙴𝙻 𝙱𝙾𝚃 𝚀𝚄𝙴𝙳𝙾 𝙳𝙴𝚂𝙰𝙲𝚃𝙸𝚅𝙰𝙳𝙾 𝙴𝙽 𝙴𝚂𝚃𝙴 𝙶𝚁𝚄𝙿𝙾. 𝚄𝚂𝙰 𝚄𝙽𝙱𝙰𝙽𝙲𝙷𝙰𝚃 𝙿𝙰𝚁𝙰 𝚁𝙴𝙰𝙲𝚃𝙸𝚅𝙰𝚁𝙻𝙾',
        contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: global.ch || '120363419404216418@newsletter',
            newsletterName: '𝘔𝘌𝘓𝘐𝘖𝘋𝘈𝘚 𝘉𝘖𝘛 - 𝘊𝘏𝘈𝘕𝘕𝘌𝘓 𝟮𝟬𝟮𝟯'
          }
        }
      },
      { quoted: fakeQuoted }
    )
  } catch (e) {
    console.error('Error en banchat:', e)

    await conn.sendMessage(
      m.chat,
      {
        text: '🚫 𝙽𝙾 𝚂𝙴 𝙿𝚄𝙳𝙾 𝙳𝙴𝚂𝙰𝙲𝚃𝙸𝚅𝙰𝚁 𝙴𝙻 𝙱𝙾𝚃 𝙴𝙽 𝙴𝚂𝚃𝙴 𝙶𝚁𝚄𝙿𝙾',
        contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: global.ch || '120363419404216418@newsletter',
            newsletterName: '𝘔𝘌𝘓𝘐𝘖𝘋𝘈𝘚 𝘉𝘖𝘛 - 𝘊𝘏𝘈𝘕𝘕𝘌𝘓 𝟮𝟬𝟮𝟯'
          }
        }
      },
      { quoted: fakeQuoted }
    )
  }
}

handler.help = ['banchat']
handler.tags = ['grupo']
handler.command = ['banchat']
handler.group = true
handler.owner = true

export default handler
