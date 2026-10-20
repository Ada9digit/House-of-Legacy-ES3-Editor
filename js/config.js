const R100 = (i) => [i, 0, 100];
const AGE = (i) => [i, 0, 120];

const FIELDS = {
  member: {
    id: [0], age: AGE(6), lit: R100(7), mar: R100(8), com: R100(9), art: R100(10),
    mood: R100(11), examTitle: [13, 0, 9], rep: R100(16), charm: R100(20),
    cunning: R100(27), stamina: R100(30), health: R100(31), skillVal: R100(33),
    school: [40, 0, 3],
  },
  spouse: {
    id: [0], portrait: [1], age: AGE(5), lit: R100(6), mar: R100(7), com: R100(8),
    art: R100(9), mood: R100(10), rep: R100(12), charm: R100(15), health: R100(16),
    cunning: R100(19), stamina: R100(20), skillVal: R100(23), infertileFlag: [24, 0, 999],
    specialTag: [27], relation: R100(31),
  },
  retainer: {
    id: [0], portrait: [1], age: AGE(3), lit: R100(4), mar: R100(5), com: R100(6),
    art: R100(7), mood: R100(8), rep: R100(11), charm: R100(13), health: R100(14),
    cunning: R100(15), pregnancy: [17], fee: [18, 0, 999999], stamina: R100(19),
    specialTag: [21],
  },
  horse: { color: [0], age: [1], lifespan: [2], power: [3], speed: [4], smart: [5], owner: [6] },
  inv: { id: [0], qty: [1] },
};

const P_BASE = { name: 0, gen: 1, talentType: 2, talentVal: 3, gender: 4, lifespan: 5, skillType: 6, luck: 7, unk: 8, hobby: 9 };
const PIPE = {
  member: { k: 4, f: P_BASE },
  spouse: { k: 2, f: { ...P_BASE, partnerId: 9, hobby: 10 } },
  retainer: { k: 2, f: P_BASE },
};
const PIPE_RANGE = { luck: [0, 100], talentVal: [0, 100] };

const KEY = { member: "Member_now", spouse: "Member_qu", retainer: "MenKe_Now", horse: "Horse_Have", inv: "Prop_have" };
const TABLE_EL = { member: "memberTbl", spouse: "spouseTbl", retainer: "retainerTbl", horse: "horseTbl", inv: "inventoryTbl" };

const GAME = {
  gold: ["CGNum", 0, "s"],
  ingot: ["CGNum", 1, "s"],
  fname: ["FamilyData", 1, "t"],
  flevel: ["FamilyData", 2, "s", 1],
  frep: ["FamilyData", 3, "s"],
  year: ["Time_now", 2, "i"],
  month: ["Time_now", 1, "i"],
  day: ["Time_now", 0, "i"],
};
const GAME_FORM = [
  ["💰 Gold", "number", "gold"], ["💎 Ingots", "number", "ingot"],
  ["🏠 Family Name", "text", "fname"], ["📈 Family Level", "number", "flevel"],
  ["⭐ Reputation", "number", "frep"], ["📅 Year", "number", "year"],
  ["🌙 Month", "number", "month"], ["☀️ Day", "number", "day"],
];

const STATS = ["lit", "mar", "com", "art", "cunning", "rep", "health", "stamina", "mood", "charm"];
const MAX_SET = {
  member: { age: "21", skillVal: "100", examTitle: "9", school: "3", luck: "100", talentVal: "100" },
  spouse: { age: "21", skillVal: "100", relation: "100", luck: "100", talentVal: "100" },
  retainer: { age: "21", fee: "0", luck: "100", talentVal: "100" },
};

const OPT = {
  talent: { 0: "None", 1: "📖 Writing", 2: "⚔️ Might", 3: "💰 Business", 4: "🎨 Art" },
  skill: { 0: "None", 1: "🔮 Sorcery", 2: "💊 Medicine", 3: "☯️ Daoism", 4: "🔮 Divination", 5: "💋 Charisma", 6: "⚙️ Technology" },
  hobby: { 0: "Rouge", 1: "Ink", 2: "Art", 3: "Antique", 4: "Tea Set", 5: "Incense", 6: "Vase", 7: "Wine", 8: "Music", 9: "Pelt" },
  exam: { 0: "None", 1: "Xiucai", 2: "Juren", 3: "Xieyuan", 4: "Gongshi", 5: "Huiyuan", 6: "Jinshi", 7: "Tanhua", 8: "Bangyan", 9: "Zhuangyuan" },
  school: { 0: "None", 1: "Mingli", 2: "Jiuyuan", 3: "Jinwen" },
  horse: { 0: "Red", 1: "Red/White", 2: "Blue", 3: "Blue/White", 4: "White", 5: "White/Brown", 6: "Gold", 7: "Gold/White", 8: "Black", 9: "Black/White" },
  gender: { 0: "Female", 1: "Male" },
};

// kind: r = read-only, t = text, n = number, otherwise key of OPT
const COLS = {
  member: [
    ["ID", "id", "r"], ["Name", "name"], ["Gender", "gender", "gender"], ["Age", "age", "n"],
    ["HP", "health", "n"], ["Mood", "mood", "n"], ["Stam", "stamina", "n"], ["Renown", "rep", "n"],
    ["Charm", "charm", "n"], ["Luck", "luck", "n"], ["Lit", "lit", "n"], ["Mar", "mar", "n"],
    ["Com", "com", "n"], ["Art", "art", "n"], ["Cun", "cunning", "n"], ["Exam", "examTitle", "exam"],
    ["School", "school", "school"], ["Talent", "talentType", "talent"], ["TalVal", "talentVal", "n"],
    ["Skill", "skillType", "skill"], ["SkVal", "skillVal", "n"], ["Hobby", "hobby", "hobby"],
  ],
  spouse: [
    ["ID", "id", "r"], ["Portrait", "portrait"], ["Name", "name"], ["Partner", "partnerId", "r"],
    ["Age", "age", "n"], ["Health", "health", "n"], ["Stamina", "stamina", "n"], ["Mood", "mood", "n"],
    ["Renown", "rep", "n"], ["Charm", "charm", "n"], ["Luck", "luck", "n"], ["Lit", "lit", "n"],
    ["Mar", "mar", "n"], ["Com", "com", "n"], ["Art", "art", "n"], ["Cunning", "cunning", "n"],
    ["SkVal", "skillVal", "n"], ["Relation", "relation", "n"], ["Infertile", "infertileFlag", "n"],
    ["Hobby", "hobby", "hobby"], ["Talent", "talentType", "talent"], ["TalVal", "talentVal", "n"],
    ["Skill", "skillType", "skill"],
  ],
  retainer: [
    ["ID", "id", "r"], ["Portrait", "portrait"], ["Name", "name"], ["Gender", "gender", "gender"],
    ["Age", "age", "n"], ["HP", "health", "n"], ["Stam", "stamina", "n"], ["Mood", "mood", "n"],
    ["Renown", "rep", "n"], ["Charm", "charm", "n"], ["Luck", "luck", "n"], ["Lit", "lit", "n"],
    ["Mar", "mar", "n"], ["Com", "com", "n"], ["Art", "art", "n"], ["Cun", "cunning", "n"],
    ["Fee", "fee", "n"], ["Talent", "talentType", "talent"], ["TalVal", "talentVal", "n"],
    ["Skill", "skillType", "skill"], ["SpecialTag", "specialTag"],
  ],
  horse: [
    ["Color", "color", "horse"], ["Age", "age", "n"], ["Lifespan", "lifespan", "n"],
    ["Power", "power", "n"], ["Speed", "speed", "n"], ["Smart", "smart", "n"], ["Owner", "owner"],
  ],
  inv: [["Item ID", "id", "n"], ["Quantity", "qty", "n"]],
};

const ITEM_REF = [
  ["🎁 Gifts", ["156 = tiger pelt (pelt)", "151 = zither (music)", "143 = amber wine (wine)", "135 = phoenix vase (vase)", "128 = golden censer (incense)", "120 = jade pot (tea set)", "96 = jade screen (antique)", "87 = eternal landscape (art)", "81 = timeless stele (ink)", "65 = belt hook (jewelry m) +8", "61 = jade necklace (jewelry f) +11", "50 = rose dew (rogue)", "28 = heavenly silk (textiles)"]],
  ["⚔️ Weapons", ["103 = repeating crossbow", "111 = Twinblades"]],
  ["💊 Other", ["285 = remove silly (medicine)", "75 = passion pill (pregnancy)", "71 = glow pill +10 charm", "167 = toad venom -100 hp", "162 = luck +20 (spell)", "15 = bear paw (snack)", "72 = eternal pill"]],
  ["📦 Misc", ["0 = offering", "1 = manure", "67 = cotton", "74 = salt"]],
];

const ASM = "mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089";
const INV_TYPE = `System.Collections.Generic.List\`1[[System.Collections.Generic.List\`1[[System.String, ${ASM}]], ${ASM}]],mscorlib`;
const NEW_RETAINER_F4 = "New Retainer|0|0|50|1|80|0|50|1|0|null";
const DEFAULT_PORTRAIT = "4|23|1|10";
const MAX_ITEM_ID = 285;
