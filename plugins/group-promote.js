import axios from 'axios'

let handler = async (m, { conn }) => {
  const target =
    m.mentionedJid?.[0] ||
    m.quoted?.sender ||
    m.quoted?.participant ||
    m.quoted?.key?.participant

  const labelTest = "𝐌𝐄𝐋𝐈𝐎𝐃𝐀𝐒 - 𝐁𝐎𝐓"
  const imgUrl = "https://cdn.dix.lat/me/tmp/1358c541-bb6d-4044-a798-4cb9d4f3b964.jpg"

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

  if (!target) {
    return conn.sendMessage(
      m.chat,
      {
        text: '《 *ᴍᴇɴᴄɪᴏɴᴀ ᴏ ʀᴇsᴘᴏɴᴅᴇ ᴀʟ ᴜsᴜᴀʀɪᴏ ǫᴜᴇ ᴅᴇsᴇᴀs ᴘʀᴏᴍᴏᴠᴇʀ* 》',
        contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: global.ch || '120363419404216418@newsletter',
            newsletterName: '♐︎ 𝖒𝖊𝖑𝖎𝖔𝖉𝖆𝖘 - 𝕮𝖍𝖆𝖓𝖓𝖊𝖑 ↯'
          }
        }
      },
      { quoted: fakeQuoted }
    )
  }

  await conn.groupParticipantsUpdate(
    m.chat,
    [target],
    'promote'
  )

  await conn.sendMessage(m.chat, {
    react: {
      text: '✅',
      key: m.key
    }
  })

  await conn.sendMessage(
    m.chat,
    {
      text: '👑 *ᴜsᴇʀ ᴘʀᴏᴍᴏᴠɪᴅᴏ ᴀ ᴀᴅᴍɪɴ ᴄᴏɴ ᴇxɪᴛᴏ*',
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: global.ch || '120363419404216418@newsletter',
          newsletterName: '♐︎ 𝖒𝖊𝖑𝖎𝖔𝖉𝖆𝖘 - 𝕮𝖍𝖆𝖓𝖓𝖊𝖑 ↯'
        }
      }
    },
    { quoted: fakeQuoted }
  )
}

handler.command = /^\.?promote(\s|$)/i
handler.help = ["promote"]
handler.tags = ["grupo"]
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
