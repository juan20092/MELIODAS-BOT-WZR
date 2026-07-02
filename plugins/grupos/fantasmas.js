let handler = async (m, { conn, text, participants }) => {
  let member = participants.map(u => u.id)
  let sum = !text ? member.length : Math.min(Number(text), member.length)

  let total = 0
  let sider = []

  for (let i = 0; i < sum; i++) {
    let users = participants.find(u => u.id === member[i]) || {}

    // Saltarse a los administradores
    if (users.isAdmin || users.isSuperAdmin) continue

    // Verificar de forma segura si el usuario existe en la base de datos
    let user = global.db?.data?.users?.[member[i]]

    // Si el usuario no existe en la BD o su contador de chat es 0
    if (!user || !user.chat || user.chat === 0) {
      // Validar que no esté en la lista blanca (whitelist)
      if (!user || user.whitelist !== true) {
        total++
        sider.push(member[i])
      }
    }
  }

  // Si después del bucle el array de fantasmas está vacío
  if (total === 0 || sider.length === 0) {
    return conn.reply(
      m.chat,
      '*[❗ INFO ❗]* ¡ESTE GRUPO NO TIENE FANTASMAS! Todos los miembros están activos. 😎',
      m
    )
  }

  let teks = `[ ⚠ REVISIÓN INACTIVA ⚠ ]

👥 *GRUPO:* ${await conn.getName(m.chat)}
👤 *MIEMBROS:* ${participants.length}

[ 👻 LISTA DE FANTASMAS 👻 ]

${sider.map(v => `👻 @${v.split('@')[0]}`).join('\n')}

*Total:* ${total} usuario(s).

*NOTA:* La lista se basa en los usuarios que no tienen registro de mensajes en el bot.`

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
