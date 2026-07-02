let handler = async (m, { conn, args, text, command, isAdmin, isBotAdmin }) => {
  if (!text) return m.reply(
    `✳️ Usa el comando así:\n\n` +
    `*.encuesta Pregunta | opción1 | opción2 | opción3*`
  )

  // Separar pregunta y opciones
  let parts = text.split('|').map(v => v.trim()).filter(v => v)

  if (parts.length < 3)
    return m.reply(
      `⚠️ Debes poner mínimo una pregunta y 2 opciones:\n\n` +
      `*.encuesta ¿Pregunta? | opción1 | opción2*`
    )

  let question = parts[0]
  let options = parts.slice(1)

  if (options.length > 12)
    return m.reply('❌ Máximo 12 opciones permitidas.')

  await conn.sendMessage(m.chat, {
    poll: {
      name: question,
      values: options,
      selectableCount: 1
    }
  }, { quoted: m })
}

handler.command = /^encuesta$/i
handler.group = true

export default handler