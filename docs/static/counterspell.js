var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// You attempt to interrupt a creature in the process of casting a spell.
// If the creature is casting a spell of 3rd level or lower, its spell fails and
// has no effect. If it is casting a spell of 4th level or higher, make an ability
// check using your spellcasting ability. The DC equals 10 + the spell’s level. On
// a success, the creature’s spell fails and has no effect.
//
// At Higher Levels. When you cast this spell using a spell slot of 4th level or
// higher, the interrupted spell has no effect if its level is less than or equal
// to the level of the spell slot you used.
var DICE = 20;
var BASE = 10;
var FAILED = -1;
var IMPOSSIBLE = -2;
var Player = /** @class */ (function () {
    function Player(name, counterspellLevel, spellModifier) {
        this.name = name;
        this.counterspellLevel = counterspellLevel;
        this.spellModifier = spellModifier;
        this.reactionUsed = false;
    }
    Player.prototype.counterSpell = function (spell) {
        var logStr = "";
        if (this.reactionUsed) {
            throw Error("YOU HAVE BROKEN THE GAME");
        }
        this.reactionUsed = true;
        log("But wait! Player " + this.name + " is attempting to counterspell " + spell.name + " (level " + spell.level + ") at level " + this.counterspellLevel);
        if (spell.level <= this.counterspellLevel) {
            log("Player " + this.name + " countered at a higher or equal level and is about to counter the spell!");
            return { name: this.name + "'s counterspell", level: this.counterspellLevel };
        }
        var contestedRoll = Math.floor(Math.random() * DICE) + this.spellModifier;
        if (contestedRoll >= (BASE + spell.level)) {
            log("Player " + this.name + " rolled a " + contestedRoll + " is about to counter the spell!");
            return { name: this.name + "'s counterspell", level: this.counterspellLevel };
        }
        else {
            log("Player " + this.name + " rolled a " + contestedRoll + " and could not counter the spell");
            return { name: this.name + "'s counterspell", level: FAILED };
        }
    };
    return Player;
}());
var Team = /** @class */ (function () {
    function Team(name) {
        this.name = name;
        this.players = [];
        this.iter = 0;
    }
    Team.prototype.getName = function () {
        return this.name;
    };
    Team.prototype.addPlayer = function (playerData) {
        var player = new Player(playerData.name, playerData.counterspellLevel, playerData.spellModifier);
        this.players.push(player);
    };
    // initCounterspell(level: number): number {
    //   if (this.iter >= this.players.length) {
    //     log(`No more players left on team ${this.name}`);
    //     this.iter -= 1;
    //     return -2;
    //   }
    //   return this.players[this.iter++].initCounterspell(level);
    // }
    Team.prototype.maybeCounterspell = function (spell) {
        if (this.iter >= this.players.length) {
            return { name: "None", level: IMPOSSIBLE };
        }
        return this.players[this.iter++].counterSpell(spell);
    };
    return Team;
}());
var TeamTable = /** @class */ (function () {
    function TeamTable(divStr, team) {
        this.divStr = divStr;
        this.team = team;
        this.div = document.querySelector(divStr);
        this.tableRef = this.div.querySelector(".data-table");
        var results = this.tableRef.querySelectorAll("tr");
        this.lastRowRef = results[results.length - 1];
        this.setupColumnListeners();
    }
    TeamTable.prototype.setupColumnListeners = function () {
        var cols = this.lastRowRef.querySelectorAll("th");
        this.nameRef = this.addEntryHandler(cols[0]);
        this.csLevelRef = this.addEntryHandler(cols[1]);
        this.modRef = this.addEntryHandler(cols[2]);
    };
    TeamTable.prototype.addEntryHandler = function (el) {
        var _this = this;
        var input = el.querySelector("input");
        input.onkeyup = (function (e) {
            if (e.keyCode === 13) {
                _this.addEntry();
            }
        });
        return input;
    };
    TeamTable.prototype.addEntry = function () {
        var name = this.nameRef.value;
        var csLevel = parseInt(this.csLevelRef.value);
        var mod = parseInt(this.modRef.value);
        if (name == null || name === '' || isNaN(csLevel) || isNaN(mod))
            return;
        var newEntry = document.createElement("tr");
        var nameEntry = document.createElement("th");
        nameEntry.innerText = name;
        var csLevelEntry = document.createElement("th");
        csLevelEntry.innerText = "" + csLevel;
        var modEntry = document.createElement("th");
        modEntry.innerText = "" + mod;
        newEntry.appendChild(nameEntry);
        newEntry.appendChild(csLevelEntry);
        newEntry.appendChild(modEntry);
        var tableBody = this.tableRef.querySelector("tbody");
        tableBody.insertBefore(newEntry, this.lastRowRef);
        this.team.addPlayer({
            name: name,
            counterspellLevel: csLevel,
            spellModifier: mod
        });
        this.nameRef.value = '';
    };
    TeamTable.prototype.getDataRows = function () {
        var playerData = [];
        this.tableRef.querySelectorAll("tr").forEach(function (tr) {
            var inputs = tr.querySelectorAll("input");
            var name = inputs[0].value;
            var csLevel = parseInt(inputs[1].value);
            var mod = parseInt(inputs[2].value);
            playerData.push({
                name: name,
                counterspellLevel: csLevel,
                spellModifier: mod
            });
        });
        return playerData;
    };
    return TeamTable;
}());
var TEAM_DIV1 = "#team1";
var TEAM_DIV2 = "#team2";
var DELAY = 2000;
function log(txt) {
    return __awaiter(this, void 0, void 0, function () {
        var el, newEl, th;
        return __generator(this, function (_a) {
            el = document.querySelector("#output-table");
            newEl = document.createElement("tr");
            th = document.createElement("th");
            th.innerText = txt;
            newEl.appendChild(th);
            el.appendChild(newEl);
            return [2 /*return*/];
        });
    });
}
var wait = function (ms) { return new Promise(function (res) { return setTimeout(res, ms); }); };
var CounterSpellSimulator = /** @class */ (function () {
    function CounterSpellSimulator() {
        this.teamA = new Team("A");
        this.teamB = new Team("B");
        this.teamATable = new TeamTable(TEAM_DIV1, this.teamA);
        this.teamBTable = new TeamTable(TEAM_DIV2, this.teamB);
    }
    CounterSpellSimulator.prototype.startCounterspell = function () {
        return __awaiter(this, void 0, void 0, function () {
            var spell, teamRef, i, lastSpell, counterStack, ref, newLastSpell, i_1, srcSpell, dstSpell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spell = this.getSpell();
                        teamRef = [this.teamA, this.teamB];
                        log("Someone from team " + teamRef[0].getName() + " has cast " + (spell.name.length != 0 ? spell.name : 'an unknown spell') + " at level " + spell.level);
                        i = 1;
                        lastSpell = spell;
                        counterStack = [spell,];
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 5];
                        ref = teamRef[i++ % 2];
                        newLastSpell = { name: "", level: FAILED };
                        _a.label = 2;
                    case 2:
                        if (!(newLastSpell.level == FAILED)) return [3 /*break*/, 4];
                        return [4 /*yield*/, wait(DELAY)];
                    case 3:
                        _a.sent();
                        newLastSpell = ref.maybeCounterspell(lastSpell);
                        return [3 /*break*/, 2];
                    case 4:
                        if (newLastSpell.level == IMPOSSIBLE) {
                            return [3 /*break*/, 5];
                        }
                        else {
                            counterStack.push(newLastSpell);
                            lastSpell = newLastSpell;
                        }
                        return [3 /*break*/, 1];
                    case 5:
                        i_1 = counterStack.length - 1;
                        _a.label = 6;
                    case 6:
                        if (!(i_1 >= 1)) return [3 /*break*/, 9];
                        srcSpell = counterStack[i_1];
                        dstSpell = counterStack[i_1 - 1];
                        return [4 /*yield*/, wait(DELAY)];
                    case 7:
                        _a.sent();
                        log("Finally, " + srcSpell.name + " has countered " + dstSpell.name + "!");
                        _a.label = 8;
                    case 8:
                        i_1 -= 2;
                        return [3 /*break*/, 6];
                    case 9: return [4 /*yield*/, wait(DELAY)];
                    case 10:
                        _a.sent();
                        if (counterStack.length % 2 == 0) {
                            log("The original " + spell.name + " was countered!");
                        }
                        else {
                            log("The original " + spell.name + " was cast!");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CounterSpellSimulator.prototype.getSpell = function () {
        var spellNameRef = document.querySelector('#spell-name');
        var spellLevelRef = document.querySelector('#spell-level');
        return {
            name: spellNameRef.value,
            level: parseInt(spellLevelRef.value)
        };
    };
    return CounterSpellSimulator;
}());
document.addEventListener("DOMContentLoaded", function () {
    var css = new CounterSpellSimulator();
    var button = document.querySelector("#cs-button");
    button.onclick = function (_) {
        css.startCounterspell();
    };
});
