let handler = async (m, { conn }) => {

  const target =
    m.mentionedJid?.[0] ||
    m.quoted?.sender

  if (!target) {
    return conn.sendMessage(m.chat, {
      text: `
┏━━━━━━━━━┓
                𝐊𝐈𝐂𝐊
┗━━━━━━━━━┛

➥ 𝙈𝙚𝙣𝙘𝙞𝙤𝙣𝙖 ο 𝙧𝙚𝙨𝙥𝙤𝙣𝙙𝙚
➥ 𝙖𝙡 𝙪𝙨𝙪𝙖𝙧𝙞𝙤 𝙦𝙪𝙚
➥ 𝙙𝙚𝙨𝙚𝙖𝙨 𝙚𝙭𝙪𝙡𝙨𝙖𝙧
      `.trim(),
      // Usamos global.rcanal completo como querías
      ...global.rcanal
    }, { quoted: m })
  }

  try {

    await conn.groupParticipantsUpdate(
      m.chat,
      [target],
      "remove"
    )

    let username = target.split("@")[0]

    await conn.sendMessage(m.chat, {
      text: `
┏━━━━━━━━━┓
                𝐊𝐈𝐂𝐊
┗━━━━━━━━━┛

➥ @${username}

> ⟢ 𝙁𝙪𝙚 𝙚𝙭𝙪𝙡𝙨𝙖𝙙ο 𝙙𝙚𝙡 𝙜𝙧𝙪𝙥ο
      `.trim(),
      mentions: [target],
      // 🚀 Fusionamos tu global.rcanal pero inyectando el target en las menciones para que funcione el enlace azul
      contextInfo: {
        ...(global.rcanal?.contextInfo || {}),
        mentionedJid: [target]
      }
    }, { quoted: m })

  } catch (e) {
    console.log(e)

    return conn.sendMessage(m.chat, {
      text: `
┏━━━━━━━━━┓
                𝐊𝐈𝐂𝐊
┗━━━━━━━━━┛

> ➥ 𝙀𝙡 𝙗ο𝙩 𝙣ο 𝙚𝙨 𝙖𝙙𝙢𝙞𝙣
> ➥ 𝙊 𝙚𝙡 𝙪𝙨𝙪𝙖𝙧𝙞ο 𝙮𝙖 𝙣ο 𝙚𝙨𝙩𝙖
      `.trim(),
      ...global.rcanal
    }, { quoted: m })
  }
}

handler.help = ["kick"]
handler.tags = ["grupos"]
handler.command = /^kick$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
