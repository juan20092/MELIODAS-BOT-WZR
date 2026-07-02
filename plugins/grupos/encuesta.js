let handler = async (m, { conn, args, text, command, isAdmin, isBotAdmin }) => {
  if (!text) return m.reply(
    `✳️ 𝚄𝚜𝚊 𝚎𝚕 𝚌𝚘𝚖𝚊𝚗𝚍𝚘 𝚊𝚜𝚒́:\n\n` +
    `*.𝚎𝚗𝚌𝚞𝚎𝚜𝚝𝚊 𝙿𝚛𝚎𝚐𝚞𝚗𝚝𝚊 | 𝚘𝚙𝚌𝚒𝚘́𝚗𝟷 | 𝚘𝚙𝚌𝚒𝚘́𝚗𝟸 | 𝚘𝚙𝚌𝚒𝚘́𝚗𝟹*`
  )

  // Separar pregunta y opciones
  let parts = text.split('|').map(v => v.trim()).filter(v => v)

  if (parts.length < 3)
    return m.reply(
      `⚠️ 𝙳𝚎𝚋𝚎𝚜 𝚙𝚘𝚗𝚎𝚛 𝚖𝚒́𝚗𝚒𝚖𝚘 𝚞𝚗𝚊 𝚙𝚛𝚎𝚐𝚞𝚗𝚝𝚊 𝚢 𝟸 𝚘𝚙𝚌𝚒𝚘𝚗𝚎𝚜:\n\n` +
      `*.𝚎𝚗𝚌𝚞𝚎𝚜𝚝𝚊 ¿𝙿𝚛𝚎𝚐𝚞𝚗𝚝𝚊? | 𝚘𝚙𝚌𝚒𝚘́𝚗𝟷 | 𝚘𝚙𝚌𝚒𝚘́𝚗𝟸*`
    )

  let question = parts[0]
  let options = parts.slice(1)

  if (options.length > 12)
    return m.reply('🚫 𝙼𝚊́𝚡𝚒𝚖𝚘 𝟷𝟸 𝚘𝚙𝚌𝚒𝚘𝚗𝚎𝚜 𝚙𝚎𝚛𝚖𝚒𝚝𝚒𝚍𝚊𝚜')

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