# Glue

## Deploying an app

Vercel only allows up to 3 projects per GitHub repo. This means that I have to make a new repo for each project.

1. Use the import repository feature on GitHub to make a duplicate of this repo
2. Deploy a Vercel project based on the newly duplicated repo
3. Add a new deploy script as a git alias

```bash
# manually add fork as git remote
git remote add fork-APPNAME <FORK_GITHUB_URL>
git fetch fork-APPNAME
git checkout -b fork-APPNAME-main fork-APPNAME/main

# create syncfork git alias
git config --global alias.syncfork '!f() { git checkout fork-$1-main && git rebase main && git push fork-$1 HEAD:main -f && git checkout main; }; f'

# sync fork with the git alias
git syncfork APPNAME

# manually sync fork
git checkout fork-APPNAME-main
git rebase main
git push fork-APPNAME HEAD:main
git checkout main
```

## Adding a new package

Use an existing package as a template.

1. Change the name property in package.json
2. Run `npm install` in the root of the monorepo
