import fetch from 'node-fetch'
import axios from 'axios'
import yts from 'yt-search'

const APIKEY = 'sylphy-HGFboCD'

let handler = async (m, { conn, text, args }) => {
  try {
    const query = (text || args.join(' ')).trim()

    if (!query) {
      return m.reply('🔰 *Ingresa el nombre de una canción o un enlace de YouTube*')
    }

    const labelTest = '𝐌𝐄𝐋𝐈𝐎𝐃𝐀𝐒 - 𝐁𝐎𝐓'
    const imgUrl = 'https://cdn.dix.lat/me/b0216efd-5f4a-4f5a-97bf-b62a81d10014.jpg'

    let fakeQuoted = m

    try {
      const response = await axios.get(imgUrl, {
        responseType: 'arraybuffer'
      })

      fakeQuoted = {
        key: {
          participant: '0@s.whatsapp.net',
          remoteJid: 'status@broadcast',
          fromMe: false,
          id: 'PlayAudio'
        },
        message: {
          locationMessage: {
            name: labelTest,
            jpegThumbnail: response.data
          }
        },
        participant: '0@s.whatsapp.net'
      }
    } catch (e) {
      console.log('Error creando fakeQuoted:', e)
    }

    await conn.sendMessage(m.chat, {
      react: {
        text: '⏳',
        key: m.key
      }
    })

    let video

    if (/youtu\.?be/.test(query)) {
      const search = await yts(query)

      if (!search.videos.length) {
        return m.reply('❌ No pude obtener información del video.')
      }

      video = search.videos[0]
    } else {
      const search = await yts(query)

      if (!search.videos.length) {
        return m.reply('❌ No encontré resultados.')
      }

      video = search.videos[0]
    }

    const apiUrl =
      `https://sylphyy.xyz/download/v2/ytmp3?url=${encodeURIComponent(video.url)}&api_key=${APIKEY}`

    const api = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })

    if (!api.ok) {
      throw new Error(`HTTP ${api.status}`)
    }

    const data = await api.json()

    if (!data?.status || !data?.result?.dl_url) {
      throw new Error('La API no devolvió un enlace válido.')
    }

    const info = `
━━━━━━⬣
 𐔌𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𐔋

✰ 𝐓𝐈́𝐓𝐔𝐋𝐎 : ${video.title}
✎ 𝐓𝐈𝐄𝐌𝐏𝐎 : ${video.timestamp}
⧉ 𝐂𝐀𝐍𝐀𝐋 : ${video.author?.name || 'Desconocido'}
⌬ 𝐕𝐈𝐒𝐓𝐀𝐒 : ${video.views?.toLocaleString() || '0'}
◈ 𝐅𝐄𝐂𝐇𝐀 : ${video.ago || 'Desconocido'}
▷ 𝐋𝐈𝐍𝐊 : ${video.url}
━━━━━━━━━⬣
`.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: { url: video.thumbnail },
        caption: info,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid:
              global.ch || '120363419404216418@newsletter',
            newsletterName:
              '𝘔𝘌𝘓𝘐𝘖𝘋𝘈𝘚 𝘉𝘖𝘛 - 𝘊𝘏𝘈𝘕𝘕𝘌𝘓 𝟮𝟬𝟮𝟯'
          }
        }
      },
      { quoted: fakeQuoted }
    )

    await conn.sendMessage(
      m.chat,
      {
        audio: {
          url: data.result.dl_url
        },
        mimetype: 'audio/mpeg',
        fileName: `${video.title}.mp3`,
        ptt: false,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid:
              global.ch || '120363419404216418@newsletter',
            newsletterName:
              '𝘔𝘌𝘓𝘐𝘖𝘋𝘈𝘚 𝘉𝘖𝘛 - 𝘊𝘏𝘈𝘕𝘕𝘌𝘓 𝟮𝟬𝟮𝟯'
          }
        }
      },
      { quoted: fakeQuoted }
    )

    await conn.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key
      }
    })

  } catch (e) {
    console.error(e)

    await conn.sendMessage(
      m.chat,
      {
        text: `❌ Error:\n${e.message}`
      },
      { quoted: m }
    )
  }
}

handler.help = ['play']
handler.tags = ['descargas']
handler.command = ['play']

export default handler
