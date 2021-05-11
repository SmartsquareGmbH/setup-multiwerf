import * as tc from "@actions/tool-cache"
import * as core from "@actions/core"
import { promises as fs } from "fs"

const DOWNLOAD_URL = "https://storage.yandexcloud.net/multiwerf/targets/releases"

export default async function download(version: string) {
  const multiwerfPath = await downloadOrGetFromCache(version)

  switch (process.platform) {
    case "linux":
    case "darwin":
      await fs.chmod(multiwerfPath, 0o755)
      break
  }

  const cachedPath = await tc.cacheFile(
    multiwerfPath,
    process.platform === "win32" ? "multiwerf.exe" : "multiwerf",
    "multiwerf",
    version
  )

  core.addPath(cachedPath)
}

async function downloadOrGetFromCache(version: string): Promise<string> {
  const existingPath = tc.find("multiwerf", version)

  if (existingPath) {
    core.info(`multiwerf ${version} found in cache.`)

    return existingPath
  }

  const link = getDownloadLink(version)

  core.info(`Downloading multiwerf ${version} from ${link}...`)

  return await tc.downloadTool(link)
}

function getDownloadLink(version: string): string {
  if (process.platform === "win32") {
    return `${DOWNLOAD_URL}/v${version}/multiwerf-windows-amd64-v${version}.exe`
  } else if (process.platform == "darwin") {
    return `${DOWNLOAD_URL}/v${version}/multiwerf-darwin-amd64-v${version}`
  } else if (process.platform == "linux") {
    return `${DOWNLOAD_URL}/v${version}/multiwerf-linux-amd64-v${version}`
  } else {
    throw new Error(`Unsupported platform: ${process.platform}`)
  }
}
