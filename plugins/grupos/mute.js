import { muteUser, isMuted } from '../../lib/mute.js'

let handler = async (m, { conn }) => {
  let user = m.mentionedJid?.[0] || m.quoted?.sender

  if (!user) {
    return m.reply('⚠️ Etiqueta o responde al usuario que deseas mutear.')
  }

  if (isMuted(user)) {
    return m.reply('❌ Ese usuario ya está muteado.')
  }

  muteUser(user)

  await conn.sendMessage(
    m.chat,
    {
      text: `✅ @${user.split('@')[0]} ha sido muteado.`,
      mentions: [user]
    },
    { quoted: m }
  )
}

handler.help = ['mute @usuario']
handler.tags = ['group']
handler.command = ['mute']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler