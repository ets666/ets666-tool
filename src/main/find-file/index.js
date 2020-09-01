'use strict'

import { ipcMain } from 'electron'
import handleFiles from '../utils/handleFiles'

ipcMain.on('request:game:path', (e, data) => {
  console.log('request:game:path', data)
  console.log(handleFiles.isExists(data.path, data.fileName))
})
