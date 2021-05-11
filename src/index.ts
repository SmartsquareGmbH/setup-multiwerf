import { addPath, getInput, setFailed, info } from "@actions/core"
import { cacheFile, downloadTool, find } from "@actions/tool-cache"
import { promises as fs } from "fs"

const DOWNLOAD_URL = "https://storage.yandexcloud.net/multiwerf/targets/releases"

async function run() {
  const version = getInput("multiwerf-version") || "1.4.7"
  const multiwerfPath = await downloadOrGetFromCache(version)

  switch (process.platform) {
    case "linux":
    case "darwin":
      await fs.chmod(multiwerfPath, 0o755)
      break
  }

  const cachedPath = await cacheFile(
    multiwerfPath,
    process.platform === "win32" ? "multiwerf.exe" : "multiwerf",
    "multiwerf",
    version
  )

  addPath(cachedPath)
}

async function downloadOrGetFromCache(version: string): Promise<string> {
  const existingPath = find("multiwerf", version)

  if (existingPath) {
    info(`multiwerf ${version} found in cache.`)

    return existingPath
  }

  const link = getDownloadLink(version)

  info(`Downloading multiwerf ${version} from ${link}...`)

  return await downloadTool(link)
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

run()
  .then()
  .catch((error) => {
    setFailed(error.message)
  })
