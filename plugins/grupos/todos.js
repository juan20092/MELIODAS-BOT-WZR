import axios from 'axios'

let handler = async (m, { isOwner, isAdmin, conn, participants, args }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }

  await m.react('✅')

  let pesan = args.join(' ')

  let teks = `
╭━━━━━━━━━━━━━━━━━━━━━━⬣
│          ⚡ 𝗜𝗡𝗩𝗢𝗖𝗔𝗖𝗜𝗢𝗡 ⚡
╰━━━━━━━━━━━━━━━━━━━━━━⬣

⎔ 𝗚𝗿𝘂𝗽𝗼      : ${await conn.getName(m.chat)}
⎔ 𝗔𝗱𝗺𝗶𝗻      : @${m.sender.split('@')[0]}
⎔ 𝗠𝗶𝗲𝗺𝗯𝗿𝗼𝘀  : ${participants.length}
⎔ 𝗛𝗼𝗿𝗮       : ${new Date().toLocaleTimeString('es-CO', { timeZone: 'America/Bogota' })}

╭───────────────⬣
│ 💬 𝗠𝗘𝗡𝗦𝗔𝗝𝗘
╰───────────────⬣

${pesan || 'Sin mensaje.'}

╭───────────────⬣
│ 📢 𝗠𝗜𝗘𝗠𝗕𝗥𝗢𝗦
╰───────────────⬣

`

  for (const user of participants) {
    teks += `◈ @${user.id.split('@')[0]}\n`
  }

  teks += `
╰━━━━━━━━━━━━━━━━━━━━━━⬣
> ⚡ 𝗠𝗘𝗟𝗜𝗢𝗗𝗔𝗦 𝗕𝗢𝗧 • 𝗚𝗥𝗢𝗨𝗣 𝗦𝗬𝗦𝗧𝗘𝗠
`

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

  await conn.sendMessage(
    m.chat,
    {
      text: teks,
      mentions: participants.map(v => v.id),
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: global.ch || '120363419404216418@newsletter',
          newsletterName: '↯ 𝘔𝘌𝘓𝘐𝘖𝘋𝘈𝘚 𝘉𝘖𝘛 - 𝘊𝘏𝘈𝘕𝘕𝘌𝘓 𝟮𝟬𝟮𝟯'
        }
      }
    },
    {
      quoted: fakeQuoted
    }
  )
}

handler.command = /^(tagall|invocar|invocacion|todos|invocación)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler
