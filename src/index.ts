import { addPath, getInput, setFailed } from "@actions/core"
import { cacheFile, downloadTool } from "@actions/tool-cache"
import * as fs from "fs"

const DOWNLOAD_URL = "https://storage.yandexcloud.net/multiwerf/targets/releases/"

async function run() {
  const version = getInput("multiwerf-version") || "1.4.7"
  const multiwerfPath = await download(version)

  switch (process.platform) {
    case "linux":
    case "darwin":
      fs.chmodSync(multiwerfPath, 0o755)
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

async function download(version: string): Promise<string> {
  if (process.platform === "win32") {
    return await downloadTool(`${DOWNLOAD_URL}/${version}/multiwerf-windows-amd64-v${version}.exe`)
  } else if (process.platform == "darwin") {
    return await downloadTool(`${DOWNLOAD_URL}/${version}/multiwerf-darwin-amd64-v${version}`)
  } else if (process.platform == "linux") {
    return await downloadTool(`${DOWNLOAD_URL}/${version}/multiwerf-linux-amd64-v${version}`)
  } else {
    throw new Error(`Unsupported platform: ${process.platform}`)
  }
}

run()
  .then()
  .catch((error) => {
    setFailed(error.message)
  })
