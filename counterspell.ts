// You attempt to interrupt a creature in the process of casting a spell.
// If the creature is casting a spell of 3rd level or lower, its spell fails and
// has no effect. If it is casting a spell of 4th level or higher, make an ability
// check using your spellcasting ability. The DC equals 10 + the spell’s level. On
// a success, the creature’s spell fails and has no effect.
//
// At Higher Levels. When you cast this spell using a spell slot of 4th level or
// higher, the interrupted spell has no effect if its level is less than or equal
// to the level of the spell slot you used.

const DICE = 20;
const BASE = 10;

const FAILED = -1;
const IMPOSSIBLE = -2;

interface PlayerData {
  name: string,
  counterspellLevel: number,
  spellModifier: number
}

interface SpellData {
  name: string,
  level: number
}

class Player {
  private reactionUsed = false;

  private levelToCounter: number;

  constructor(public name: string,
    private counterspellLevel: number,
    private spellModifier: number) {
  }

  counterSpell(spell: SpellData): SpellData {
    let logStr = "";

    if (this.reactionUsed) {
      throw Error("YOU HAVE BROKEN THE GAME");
    }
    this.reactionUsed = true;
    log(`But wait! Player ${this.name} is attempting to counterspell ${spell.name} (level ${spell.level}) at level ${this.counterspellLevel}`);

    if (spell.level <= this.counterspellLevel) {
      log(`Player ${this.name} countered at a higher or equal level and is about to counter the spell!`);
      return {name: `${this.name}'s counterspell`, level: this.counterspellLevel};
    }

    const contestedRoll = Math.floor(Math.random() * DICE) + this.spellModifier;
    if (contestedRoll >= (BASE + spell.level)) {
      log(`Player ${this.name} rolled a ${contestedRoll} is about to counter the spell!`);
      return {name: `${this.name}'s counterspell`, level: this.counterspellLevel};
    } else {
      log(`Player ${this.name} rolled a ${contestedRoll} and could not counter the spell`);
      return {name: `${this.name}'s counterspell`, level: FAILED};
    }
  }
}

class Team {
   private players: Player[] = [];
   private iter = 0;

   constructor(private name: string) {}

   getName(): string {
     return this.name;
   }

   addPlayer(playerData: PlayerData) {
     const player = new Player(playerData.name,
       playerData.counterspellLevel,
       playerData.spellModifier);
     this.players.push(player);
   }

   // initCounterspell(level: number): number {
   //   if (this.iter >= this.players.length) {
   //     log(`No more players left on team ${this.name}`);
   //     this.iter -= 1;
   //     return -2;
   //   }
   //   return this.players[this.iter++].initCounterspell(level);
   // }

   maybeCounterspell(spell: SpellData): SpellData {
     if (this.iter >= this.players.length) {
       return {name: "None", level: IMPOSSIBLE};
     }
     return this.players[this.iter++].counterSpell(spell);
   }
}

class TeamTable {
  private div: HTMLDivElement;
  private tableRef: HTMLTableElement;
  private lastRowRef: HTMLTableRowElement;
  private nameRef: HTMLInputElement;
  private csLevelRef: HTMLInputElement;
  private modRef: HTMLInputElement;

  private setupColumnListeners() {
    const cols = this.lastRowRef.querySelectorAll<HTMLTableColElement>("th");
    this.nameRef = this.addEntryHandler(cols[0]);
    this.csLevelRef = this.addEntryHandler(cols[1]);
    this.modRef = this.addEntryHandler(cols[2]);
  }

  private addEntryHandler(el: HTMLTableColElement): HTMLInputElement {
    const input = el.querySelector("input");
    input.onkeyup = ((e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        this.addEntry();
      }
    })
    return input
  }

  private addEntry() {
    const name: string = this.nameRef.value;
    const csLevel: number = parseInt(this.csLevelRef.value);
    const mod: number = parseInt(this.modRef.value);

    if (name == null || name === '' || isNaN(csLevel) || isNaN(mod)) return;
    const newEntry = document.createElement("tr");
    const nameEntry = document.createElement("th");
    nameEntry.innerText = name;
    const csLevelEntry = document.createElement("th");
    csLevelEntry.innerText = `${csLevel}`;
    const modEntry = document.createElement("th");
    modEntry.innerText = `${mod}`;
    newEntry.appendChild(nameEntry);
    newEntry.appendChild(csLevelEntry);
    newEntry.appendChild(modEntry);

    this.tableRef.appendChild(newEntry);

    this.team.addPlayer({
      name: name,
      counterspellLevel: csLevel,
      spellModifier: mod
    });
    this.nameRef.value = '';
  }

  constructor(private divStr: string, private team: Team) {
    this.div = document.querySelector(divStr);
    this.tableRef = this.div.querySelector("#data-table");

    const inputTable = this.div.querySelector("#input-table");
    this.lastRowRef = inputTable.querySelector("tr");

    this.setupColumnListeners();
  }

  getDataRows(): PlayerData[] {
    const playerData: PlayerData[] = [];
    this.tableRef.querySelectorAll("tr").forEach((tr) => {
      const inputs = tr.querySelectorAll("input");
      const name: string = inputs[0].value;
      const csLevel: number = parseInt(inputs[1].value);
      const mod: number = parseInt(inputs[2].value);
      playerData.push({
        name: name,
        counterspellLevel: csLevel,
        spellModifier: mod
      })
    });
    return playerData;
  }
}
const TEAM_DIV1 = "#team1";
const TEAM_DIV2 = "#team2";

const DELAY = 2000;
async function log(txt: string) {
  const el = document.querySelector("#output-table");
  const newEl = document.createElement("tr");
  newEl.innerText = txt;
  el.appendChild(newEl);
  console.log(txt);
}
const wait = (ms) => new Promise(res => setTimeout(res, ms));

class CounterSpellSimulator {
  teamA = new Team("a");
  teamB = new Team("b");

  teamATable: TeamTable;
  teamBTable: TeamTable;

  constructor() {
    this.teamATable = new TeamTable(TEAM_DIV1, this.teamA);
    this.teamBTable = new TeamTable(TEAM_DIV2, this.teamB);
  }

  async startCounterspell() {
    const spell = this.getSpell();
    const teamRef = [this.teamA, this.teamB]
    log(`Someone from team ${teamRef[0].getName()} has cast ${spell.name} at a ${spell.level} level`);
    let i: number = 1;
    let lastSpell = spell;
    const counterStack: SpellData[] = [spell,];

    while (true) {
      await wait(DELAY);
      const ref = teamRef[i++ % 2];
      let newLastSpell = {name: "", level: FAILED};
      while (newLastSpell.level == FAILED) {
        newLastSpell = ref.maybeCounterspell(lastSpell);
      }
      if (newLastSpell.level == IMPOSSIBLE) {
        break;
      } else {
        counterStack.push(newLastSpell)
        lastSpell = newLastSpell;
      }
    }
    for (let i = counterStack.length - 1; i >= 1; i-= 2) {
      const srcSpell = counterStack[i];
      const dstSpell = counterStack[i - 1];
      log(`But alas, ${srcSpell.name} has countered ${dstSpell.name}`);
    }
    if (counterStack.length % 2 == 0) {
      log("THE OG SPELL WAS COUNTERED!");
    } else {
      log("THE OG SPELL SUCCEEDED!");
    }
  }

  getSpell(): SpellData {
    const spellNameRef = document.querySelector<HTMLInputElement>('#spell-name');
    const spellLevelRef = document.querySelector<HTMLInputElement>('#spell-level');
    return {
      name: spellNameRef.value,
      level: parseInt(spellLevelRef.value)
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const css = new CounterSpellSimulator();

  const button = document.querySelector<HTMLButtonElement>("#cs-button");
  button.onclick = (_) => {
    css.startCounterspell();
  }
});
