import {
  ArchiverService,
  archiverService as defaultArchiverService,
  ClientService,
  clientService as defaultClientService
} from '../../services'
import { major } from 'semver'
import { RuntimeError } from 'web-runtime/src/container/error'

interface TriggerDownloadAsArchiveOptions {
  fileIds: string[]
  token: string // TODO: solve download from a) public link b) public link with password
  archiverService?: ArchiverService
  clientService?: ClientService
}

export const triggerDownloadAsArchive = async (
  options: TriggerDownloadAsArchiveOptions
): Promise<void> => {
  const archiverService = options.archiverService || defaultArchiverService
  const clientService = options.clientService || defaultClientService
  if (!isDownloadAsArchiveAvailable(archiverService)) {
    throw new RuntimeError('no archiver capability available')
  }
  if (options.fileIds.length === 0) {
    throw new RuntimeError('requested archive with empty list of resources')
  }
  const majorVersion = major(archiverService.capability.version)
  if (majorVersion === 2) {
    // trigger the download into memory
    const queryParams = [...options.fileIds.map(id => `id=${id}`)]
    const archiverUrl = archiverService.url + '?' + queryParams.join('&')
    const response = await clientService.httpAuthenticated(options.token).get(archiverUrl)

    // check response status
    if (response.status !== 200) {
      throw new RuntimeError('download failed')
    }
    const fileName = extractFileNameFromContentDisposition(
      response.headers['content-disposition']
    )
    if (!fileName) {
      throw new RuntimeError('received archive has no file name')
    }

    // download the file with a data url
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(new Blob([response.data]))
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const isDownloadAsArchiveAvailable = (
  service: ArchiverService = defaultArchiverService
): boolean => {
  return service.available
}

export const extractFileNameFromContentDisposition = (contentDisposition: string): string => {
  if (contentDisposition?.indexOf('attachment') === -1) {
    return ''
  }
  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
  const matches = filenameRegex.exec(contentDisposition)
  if (matches && matches[1]) {
    return matches[1].replace(/['"]/g, '')
  }
  return ''
}
