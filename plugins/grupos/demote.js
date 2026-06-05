import axios from 'axios'

let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  if (!isAdmin) return global.dfail("admin", m, conn)
  if (!isBotAdmin) return global.dfail("botAdmin", m, conn)

  const target =
    m.mentionedJid?.[0] ||
    m.quoted?.sender ||
    m.quoted?.participant ||
    m.quoted?.key?.participant

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

  if (!target) {
    return conn.sendMessage(
      m.chat,
      {
        text: '🔰 *ᴍᴇɴᴄɪᴏɴᴀ ᴏ ʀᴇsᴘᴏɴᴅᴇ ᴀʟ ᴀᴅᴍɪɴ ǫᴜᴇ ᴅᴇsᴇᴀs ᴅᴇɢʀᴀᴅᴀʀ*',
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
    'demote'
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
      text: '📉 *ᴜsᴇʀ ᴅᴇɢʀᴀᴅᴀᴅᴏ ᴅᴇ ᴀᴅᴍɪɴ ᴄᴏɴ ᴇxɪᴛᴏ*',
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

handler.command = ["demote"]
handler.help = ["demote"]
handler.tags = ["grupo"]
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
