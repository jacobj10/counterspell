# counterspell
5E Counterspell Simulator

## What?
A simple web page which allows you to set up a scenario in the 5th edition of Dungeons and Dragons such that a spell has been cast from a member of Group A onto group B, and the casters on either side dish out [counterspells](https://roll20.net/compendium/dnd5e/Counterspell#content)
## Why?
We love counterspells!

## How?
Small lightweight app written in Typescript. The only other dependence is normalize.css because I suck a design. Compiled the app using `compile.sh` which moves the final assets into the `docs/` directory. This is because gh pages doesn't let you specify custom folders besides `docs` (so much for custom) and I didn't want to add Jekyll/Ruby/bundle dependencies to what really shouldn't be a bloated app (e.g. why I am not using react/angular - even TS is a stretch).
