# Self-update action

### Motivation:

There are many "automatic update" tools with deep integration into a particular package manager. They are big and complex and work well if you have that exact need.

This is the opposite tool: it has no knowledge of your tooling, so you'll have to write the update logic yourself. But if you can do that, this tool provides all the surrounding github machinery to apply updates and turn them into Pull Requests.

## Sample use case:

There's some test workflows in [.github/workflows/test.yml](https://github.com/timbertson/self-update-action/blob/main/.github/workflows/test.yml), which create pull requests like [this one](https://github.com/timbertson/self-update-action/pull/6).

A common use case is periodically attempting to update, this will run an update script every day and submit a PR if it results in a diff:


```yml
name: Self-update
on:
  schedule:
    - cron: "0 2 * * *" # every day at 2am
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: timbertson/self-update-action@v1
      with:
        GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
        updateScript: "./update.sh"
```


## Workflow:

1. evaluate the `updateScript` setting (a bash string)
2. If the `preDetectChangeScript` setting is provided (default `git add .`):
   - Execute it to stage changes that should be used by the detect
     changes step to determine if there are changes. if you only track
     files in `vendor` then a script like `git add vendor` would work.
3. If there are no staged git changes or errors, the action terminates successfully (nothing to do)
4. If the `postDetectChangeScript` setting is provided (default `git add .`):
   - Execute this to add all remaining changes that might have been
     deliberately ignored in the pre step.
5. commit to the branch specified in `branchName` setting, and **force push** to `origin`
6. Search for open PRs for this branch
   - If none are found, create one (against the `baseBranch` setting, defaulting to the original checked-out branch)
7. Update the PR description based on the template, appending any errors that were encountered

## Caveats:

### Use of force-push on every run:

The action force-pushes a single branch and updates a PR description each time it runs (instead of, say, creating a new PR / branch / comment each time). This is partly to reduce noise, and partly just because it makes the implementation reasonably simple :shrug:

This does make manual edits a little awkward. If you're doing a quick fix you can probably just push your own commits to the branch, but be aware the next time the action runs it will overwrite your commits. So keep a copy of your branch locally, and if you want to have your modifications last longer than the self-update frequency, you should make your own PR branched off the automated one.

### Default GITHUB_TOKEN will not cause any actions to run on created PRs:

As mentioned in the [Github docs](https://docs.github.com/en/free-pro-team@latest/actions/reference/authentication-in-a-workflow), you will need to pass in a [Personal Access Token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) if you want the Pull Requests created by this action to trigger any workflows.

If you're doing that, _make sure you don't trigger this action from a PR or branch push_, since that would leave you the proud owner of one Infinite Recursion. That's why the default behaviour is not to trigger further actions.
