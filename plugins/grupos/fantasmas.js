let handler = async (m, { conn, text, participants }) => {
  let member = participants.map(u => u.id)
  let sum = !text ? member.length : Math.min(Number(text), member.length)

  let total = 0
  let sider = []

  for (let i = 0; i < sum; i++) {
    let users = participants.find(u => u.id === member[i]) || {}

    if (users.isAdmin || users.isSuperAdmin) continue

    let user = global.db?.data?.users?.[member[i]]

    if (!user || (user.chat || 0) === 0) {
      if (!user || user.whitelist !== true) {
        total++
        sider.push(member[i])
      }
    }
  }

  if (!total) {
    return conn.reply(
      m.chat,
      '*[❗ INFO ❗]* ESTE GRUPO NO TIENE FANTASMAS, ¡BUEN TRABAJO!',
      m
    )
  }

  let teks = `[ ⚠ REVISIÓN INACTIVA ⚠ ]

👥 *GRUPO:* ${await conn.getName(m.chat)}
👤 *MIEMBROS:* ${participants.length}

[ 👻 LISTA DE FANTASMAS 👻 ]

${sider.map(v => `👻 @${v.split('@')[0]}`).join('\n')}

*Total:* ${total} usuario(s).

*NOTA:* La lista se basa en el contador de mensajes del bot.`

  await conn.sendMessage(
    m.chat,
    {
      text: teks,
      mentions: sider
    },
    { quoted: m }
  )
}

handler.help = ['fantasmas']
handler.tags = ['group']
handler.command = /^(verfantasmas|fantasmas|sider)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler