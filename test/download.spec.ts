import fsSync, { promises as fs } from "fs"
import path from "path"
import os from "os"
import tmp, { DirectoryResult } from "tmp-promise"
import semver from "semver"
import download from "../src/download"

describe("action", () => {
  let tmpDir: DirectoryResult

  beforeEach(async () => {
    tmpDir = await tmp.dir()

    process.env["RUNNER_TEMP"] = tmpDir.path
    process.env["RUNNER_TOOL_CACHE"] = path.join(tmpDir.path, "cache")
  })

  afterEach(async () => {
    if (semver.gte(process.version, "14.14.0")) {
      await fs.rm(tmpDir.path, { recursive: true })
    } else {
      await fs.rmdir(tmpDir.path, { recursive: true })
    }
  })

  test("should download multiwerf", async () => {
    await download("1.4.7")

    const binary = os.platform() === "win32" ? "multiwerf.exe" : "multiwerf"

    const access = async () => {
      await fs.access(path.join(tmpDir.path, "cache/multiwerf/1.4.7", os.arch(), binary), fsSync.constants.X_OK)
    }

    expect(access).not.toThrow()
  })
})
