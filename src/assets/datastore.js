import Datastore from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs'
import { remote, app } from 'electron'

const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData')
const EURO_PATH = path.join(APP.getPath('documents'), '/Euro Truck Simulator 2')

if (process.type !== 'renderer') {
  if (!fs.existsSync(STORE_PATH)) {
    fs.mkdirSync(STORE_PATH)
  }
}

const adapter = new FileSync(path.join(STORE_PATH, '/data.json'))

const db = Datastore(adapter)

if (!db.has('pathType').value() || !db.has('path').value()) {
  db.set('pathType', 'documents').write()
  db.set('path', EURO_PATH).write()
} else if (db.get('pathType').value() === 'documents' && db.get('path').value() !== EURO_PATH) {
  db.update('path', n => 'EURO_PATH').write()
} else if (db.get('pathType').value() !== 'documents' && db.get('path').value() === EURO_PATH) {
  db.update('pathType', n => 'documents').write()
}

export default db
