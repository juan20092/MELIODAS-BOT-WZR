let handler = async (m, { conn }) => {

  const target =
    m.mentionedJid?.[0] ||
    m.quoted?.sender

  if (!target) {
    return conn.sendMessage(m.chat, {
      text: `
╭═⧉⧉⧉═⌬═⧉⧉⧉═╮

              ⟠ 𝙆𝙄𝘾𝙆 ⟠

╰═⧉⧉⧉═⌬═⧉⧉⧉═╯

> ⌬ 𝙈𝙚𝙣𝙘𝙞𝙤𝙣𝙖 𝙤 𝙧𝙚𝙨𝙥𝙤𝙣𝙙𝙚 𝙖𝙡 𝙪𝙨𝙪𝙖𝙧𝙞𝙤 𝙦𝙪𝙚 𝙙𝙚𝙨𝙚𝙖𝙨 𝙚𝙭𝙪𝙡𝙨𝙖𝙧
      `.trim()
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
╭═⧉⧉⧉═⌬═⧉⧉⧉═╮

    ⟠ *𝙆𝙄𝘾𝙆* ⟠

╰═⧉⧉⧉═⌬═⧉⧉⧉═╯

⌬ @${username}

> ⟢ 𝙁𝙪𝙚 𝙚𝙭𝙪𝙡𝙨𝙖𝙙𝙤 𝙙𝙚𝙡 𝙜𝙧𝙪𝙥𝙤
      `.trim(),
      mentions: [target]
    }, { quoted: m })

  } catch (e) {

    console.log(e)

    return conn.sendMessage(m.chat, {
      text: `
╭═⧉⧉⧉═⌬═⧉⧉⧉═╮

     ⟠ 𝙀𝙍𝙍𝙊𝙍 ⟠

╰═⧉⧉⧉═⌬═⧉⧉⧉═╯

> ⌬ 𝙀𝙡 𝙗𝙤𝙩 𝙣𝙤 𝙚𝙨 𝙖𝙙𝙢𝙞𝙣
> ⌬ 𝙊 𝙚𝙡 𝙪𝙨𝙪𝙖𝙧𝙞𝙤 𝙮𝙖 𝙣𝙤 𝙚𝙨𝙩𝙖
      `.trim()
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
