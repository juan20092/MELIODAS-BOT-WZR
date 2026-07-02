import { muteUser, isMuted } from '../lib/mute.js'

let handler = async (m) => {
  let user = m.mentionedJid[0] || m.quoted?.sender
  if (!user) return m.reply('⚠️ Etiqueta o responde al usuario.')

  if (isMuted(user)) return m.reply('❌ Ese usuario ya está muteado.')

  muteUser(user)

  m.reply(`✅ @${user.split('@')[0]} ha sido muteado.`, null, {
    mentions: [user]
  })
}

handler.help = ['mute @usuario']
handler.tags = ['group']
handler.command = ['mute']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler