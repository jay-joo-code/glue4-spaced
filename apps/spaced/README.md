# Spaced

Spaced is a flashcard app that supports spaced repetition, code blocks, keyboard shortcuts.

It's a tool specifically designed to help me retain information.

Feel free to dig around, but you will have a bad user experience, because it's specifically designed for me.

## Extend Glue root

1. Import this repo to clone it (click on the + sign at the top right side of the page)
2. Add glue remote

```bash
git remote add glue https://github.com/jay-joo-code/glue3-root.git
git fetch --all
git switch -c glue-main glue/main
```

## Gmail

The email account for this project is cornellsentiment@gmail.com

## Add branch protection rules

Add branch protection rules in the repo settings to force users to create a PR + get approval to commit changes to main.

Refer to RideHub repo settings.

## Scripts

**Pushing specific commits to Glue root**

```bash
$ git checkout glue-main
$ git cherry-pick <commit-hash>
$ git push
```

**Setting upstream to glue/main**

```bash
$ git branch -u glue/main
```

**Push to glue/main**

```bash
git push glue glue-main:main
```

## Backend

The entire backend is handled by Supbase.

## Sentry

Update `sentry.properties` file with project name (ex. glue3-referhub)
