import { getInput, setFailed } from "@actions/core"
import download from "./download"

export async function run() {
  const version = getInput("multiwerf-version") || "1.4.7"

  await download(version)
}

run()
  .then()
  .catch((error) => {
    setFailed(error.message)
  })
