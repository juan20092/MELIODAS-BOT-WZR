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

  // --- DISEÑO: SI FALTA EL USUARIO OBJETIVO ---
  if (!target) {
    const textFalta = `*『 ACCIÓN REQUERIDA 』* \n\n` +
      
                      `> *responde a un mensaje o menciona a un @user que desees remover del cargo de Administrador* 🛡️`

    return conn.sendMessage(
      m.chat,
      {
        text: textFalta,
        contextInfo: {
          mentionedJid: [m.sender], // Te menciona a ti indicando el error
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

  // Ejecutar la degradación
  await conn.groupParticipantsUpdate(
    m.chat,
    [target],
    'demote'
  )

  // Reacción de éxito
  await conn.sendMessage(m.chat, {
    react: {
      text: '⚡',
      key: m.key
    }
  })

  // --- DISEÑO: MENSAJE DE ÉXITO ---
  const textExito = `👑 *『 CONTROL DE ADMINISTRADORES 』* 👑\n\n` +
                    `⚠️ *Aviso:* Un administrador ha sido removido.\n` +
                    `👤 *Usuario:* @${target.split('@')[0]}\n` +
                    `📉 *Acción:* Degradado a miembro común.\n\n` +
                    `> ⚖️ _Acción ejecutada por el sistema de moderación._`

  await conn.sendMessage(
    m.chat,
    {
      text: textExito,
      contextInfo: {
        mentionedJid: [target], // Mención al usuario degradado
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

handler.command = ["demote"]
handler.help = ["demote"]
handler.tags = ["grupo"]
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
