import { fileURLToPath } from 'url'
import path from 'path'

// Configuración Básica del Bot
global.botName = "🐲 𝐌𝐄𝐋𝐈𝐎𝐃𝐀𝐒 𝐁𝐎𝐓 🐉"
global.packname = "©️ 𝖏𝖚𝖆𝖓-𝖜𝖟 | 𝟤𝟢𝟤𝟧"
global.author = "©️ 𝖏𝖚𝖆𝖓-𝖜𝖟 | 𝟤𝟢𝟤𝟧"


global.owner = [
  ["165043362652249", "jid"] 
]

global.mods = [] 
global.prems = [] 

// Configuración de Conexión y Carpetas
global.prefix = /^[./#!]/
global.sessions = "./sessions"


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

global.dir = {
  root: __dirname,
  plugins: path.join(__dirname, 'plugins'),
  tmp: path.join(__dirname, 'tmp')
}

global.opts = {
  self: false,    
  noprefix: false 
}

