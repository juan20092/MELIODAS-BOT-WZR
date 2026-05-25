import { fileURLToPath } from 'url'
import path from 'path'

// Configuración Básica del Bot
global.botName = "prueba"
global.packname = "prueba"
global.author = "prueba"


global.owner = [
  ["573223702049", "jid"] 
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
