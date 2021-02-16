import * as core from '@actions/core'
import * as lib from './lib'

async function main() {
  try {
    let env: Record<string, string> = {}
    lib.settingKeys.forEach((key) => {
      let value = core.getInput(key)
      if (value != '') {
        env[key] = value
      }
    })
    let settings = lib.parseSettings(env)
    let pr = await lib.main(settings)
    if (pr != null) {
      core.setOutput('pr', pr.id)
      core.setOutput('pr_url', pr.url)
    }
  } catch (e) {
    console.log(e)
    core.setFailed(e.message)
  }
}

main()
