# Glue

## Deploying an app

Vercel only allows up to 3 projects per GitHub repo. This means that I have to make a new repo for each project.

1. Use the import repository feature on GitHub to make a duplicate of this repo
2. Deploy a Vercel project based on the newly duplicated repo
3. Add a new deploy script as a git alias

```bash
# add fork as git remote
git remote add fork-APPNAME <FORK_GITHUB_URL>
git fetch fork-APPNAME
git checkout -b fork-APPNAME-main fork-APPNAME/main

# pull changes from glue4 root to fork
git checkout fork-APPNAME-main
git rebase main
git push fork-spaced HEAD:main
git checkout main
```
