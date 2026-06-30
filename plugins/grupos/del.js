import fetch from 'node-fetch'
import axios from 'axios'

let handler = async (m, { conn }) => {

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
    console.error('Error al crear el Fake Chat:', err)
  }

  let texto = '> ⚠️ *¡Ey! Selecciona o responde al mensaje que quieres eliminar para usar la espada Oscura* 😈🫵🏻'

  if (!m.quoted) {
    return conn.sendMessage(
      m.chat,
      {
        text: texto,
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

  try {
    let delet = m.message.extendedTextMessage.contextInfo.participant
    let bang = m.message.extendedTextMessage.contextInfo.stanzaId

    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: bang,
        participant: delet
      }
    })
  } catch {
    try {
      await conn.sendMessage(m.chat, {
        delete: m.quoted.vM.key
      })
    } catch (e) {
      return conn.sendMessage(
        m.chat,
        {
          text: '❌ *ɴᴏ sᴇ ᴘᴜᴅᴏ ᴇʟɪᴍɪɴᴀʀ ᴇʟ ᴍᴇɴsᴀᴊᴇ*',
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

  await conn.sendMessage(m.chat, {
    react: {
      text: '✅',
      key: m.key
    }
  })
}

handler.help = ['delete']
handler.tags = ['group']
handler.command = /^(eliminar|del(ete)?)$/i
handler.group = false
handler.admin = true
handler.botAdmin = true

export default handler
