import { getInput, setFailed } from "@actions/core"
import download from "./download"

const DEFAULT_VERSION = "1.4.7"

export async function run(): Promise<void> {
  const version = getInput("multiwerf-version") || DEFAULT_VERSION

  await download(version)
}

run()
  .then()
  .catch((error) => {
    setFailed(error.message)
  })
