"use strict";

/* =========================================================
   モケイ・マイスター 30DAYS
   ゲームデータは先頭にまとめ、後から追加しやすくしています
   ========================================================= */

const SAVE_KEY = "model-meister-career-v2";
const APP_VERSION = "0.10.0";
const GAME_VERSION = 9;
const MONTHLY_ALLOWANCE = 10000;
const MAX_MODELER_LEVEL = 10;

/* 工具は4つの装備枠に分かれ、装備中の能力だけが制作力へ加算されます */
const TOOL_SLOTS = {
  cutting: "切り出し工具",
  shaping: "加工工具",
  support: "補助工具",
  painting: "塗装工具"
};

const CONTESTS = [
  {
    id: "local",
    name: "模型店コンテスト",
    subtitle: "地元モデラーの登竜門",
    days: 30,
    thresholdShift: 0
  },
  {
    id: "regional",
    name: "地区モデラーズカップ",
    subtitle: "強豪が集まる地区大会",
    days: 30,
    thresholdShift: 13
  },
  {
    id: "national",
    name: "全国模型選手権",
    subtitle: "目指せ、日本一のモデラー",
    days: 30,
    thresholdShift: 25
  }
];

/* 大会ごとの部門。車両だけで参加できる部門と、情景必須の部門を分けます */
const CONTEST_CATEGORIES = [
  { id: "general", name: "総合部門", short: "車両・改造・情景を総合評価", minLevel: 1 },
  { id: "straight", name: "素組み部門", short: "追加工作なしで基本技術を競う", minLevel: 1 },
  { id: "diorama", name: "情景ジオラマ部門", short: "完成した情景が出品条件", minLevel: 2 }
];

/* ジオラマは車両とは別の工数と品質を持つ、独立した作品として扱います */
const DIORAMA_TYPES = [
  { id: "vignette", name: "小型ヴィネット", minLevel: 2, workMax: 800, qualityMax: 1200 },
  { id: "woodland", name: "野外情景ベース", minLevel: 3, workMax: 1600, qualityMax: 2800 },
  { id: "urban", name: "市街地ジオラマ", minLevel: 5, workMax: 3000, qualityMax: 5500 }
];

/* 架空メーカーの個性をデータとして分離し、後から追加しやすくします */
const MAKERS = {
  seiga: {
    name: "星河模型製作所",
    english: "SEIGA MODEL WORKS",
    trait: "組みやすさと素直な部品構成が持ち味"
  },
  grayhawk: {
    name: "灰鷹スケールラボ",
    english: "GRAYHAWK SCALE LAB",
    trait: "精密な表面表現と豊富な選択式パーツが評判"
  },
  nocturna: {
    name: "ノクターナ・モールド",
    english: "NOCTURNA MOULD",
    trait: "部品数の多い玄人向けキットを得意とする"
  },
  workshop: {
    name: "工房ジャンクヤード",
    english: "WORKSHOP JUNKYARD",
    trait: "余った部品から生まれた一点もの"
  }
};

const KITS = [
  {
    id: "light",
    makerId: "seiga",
    name: "LT-7 リトルリンクス偵察戦車",
    productCode: "SG-35-007",
    scale: "1/35",
    parts: 86,
    price: 1800,
    difficulty: 0.9,
    paintDifficulty: 0.9,
    baseScore: 20,
    workMax: 800,
    paintMax: 600,
    qualityMax: 1200,
    fragile: 1,
    unlockAt: 0,
    sprite: "light",
    color: "#8da56e",
    accent: "#d3c27e",
    difficultyLabel: "★☆☆☆☆",
    scoreLabel: "★☆☆☆☆",
    description: "部品が少ない小型車両。工程の練習に向くが、基礎点は控えめ。"
  },
  {
    id: "beginner",
    makerId: "seiga",
    name: "M-12 アルデオン中戦車",
    productCode: "SG-35-012",
    scale: "1/35",
    parts: 112,
    price: 2200,
    difficulty: 1,
    paintDifficulty: 1,
    baseScore: 28,
    workMax: 1100,
    paintMax: 850,
    qualityMax: 1800,
    fragile: 2,
    unlockAt: 0,
    sprite: "medium",
    color: "#a89b64",
    accent: "#d9bd68",
    difficultyLabel: "★☆☆☆☆",
    scoreLabel: "★★☆☆☆",
    description: "素直な部品構成の入門キット。基本工作を覚えながら完成を狙える。"
  },
  {
    id: "standard",
    makerId: "grayhawk",
    name: "M-35 バスティオン Mk.II",
    productCode: "GH-35-035",
    scale: "1/35",
    parts: 184,
    price: 4000,
    difficulty: 1.15,
    paintDifficulty: 1.08,
    baseScore: 43,
    workMax: 1800,
    paintMax: 1300,
    qualityMax: 3000,
    fragile: 4,
    unlockAt: 0,
    sprite: "medium",
    color: "#668778",
    accent: "#c1a65c",
    difficultyLabel: "★★☆☆☆",
    scoreLabel: "★★★☆☆",
    description: "パーツ数と得点のバランスが良い定番。30日の計画性が問われる。"
  },
  {
    id: "destroyer",
    makerId: "grayhawk",
    name: "TD-44 ロングバイト駆逐戦車",
    productCode: "GH-35-044",
    scale: "1/35",
    parts: 226,
    price: 5200,
    difficulty: 1.28,
    paintDifficulty: 1.12,
    baseScore: 51,
    workMax: 2300,
    paintMax: 1600,
    qualityMax: 3800,
    fragile: 5,
    unlockAt: 0,
    sprite: "destroyer",
    color: "#917b59",
    accent: "#c9b272",
    difficultyLabel: "★★★☆☆",
    scoreLabel: "★★★☆☆",
    description: "長い砲身と低い車体が特徴。合わせ目処理に手間がかかる。"
  },
  {
    id: "heavy",
    makerId: "grayhawk",
    name: "HT-9 グランヴァルト重戦車",
    productCode: "GH-35-109",
    scale: "1/35",
    parts: 318,
    price: 6500,
    difficulty: 1.42,
    paintDifficulty: 1.25,
    baseScore: 61,
    workMax: 3200,
    paintMax: 2200,
    qualityMax: 5200,
    fragile: 5,
    unlockAt: 1,
    sprite: "heavy",
    color: "#69755b",
    accent: "#b8a369",
    difficultyLabel: "★★★☆☆",
    scoreLabel: "★★★★☆",
    description: "大型パーツと多数の転輪を持つ重量級。完成時の存在感は抜群。"
  },
  {
    id: "modern",
    makerId: "nocturna",
    name: "MBT-21 ケストレル主力戦車",
    productCode: "NM-35-021",
    scale: "1/35",
    parts: 364,
    price: 7600,
    difficulty: 1.5,
    paintDifficulty: 1.45,
    baseScore: 70,
    workMax: 3600,
    paintMax: 2800,
    qualityMax: 6500,
    fragile: 6,
    unlockAt: 1,
    sprite: "modern",
    color: "#748a6c",
    accent: "#bcae75",
    difficultyLabel: "★★★★☆",
    scoreLabel: "★★★★☆",
    description: "複雑な複合装甲と迷彩が難所。高い工作・塗装技術が必要。"
  },
  {
    id: "openTop",
    makerId: "nocturna",
    name: "SPG-8 カノープス自走砲",
    productCode: "NM-35-208",
    scale: "1/35",
    parts: 428,
    price: 8200,
    difficulty: 1.62,
    paintDifficulty: 1.52,
    baseScore: 78,
    workMax: 4500,
    paintMax: 3300,
    qualityMax: 8000,
    fragile: 7,
    unlockAt: 2,
    sprite: "open",
    color: "#8e8060",
    accent: "#d0b875",
    difficultyLabel: "★★★★☆",
    scoreLabel: "★★★★★",
    description: "車内まで見える超精密キット。ピンセットと丁寧な細部塗装が鍵。"
  },
  {
    id: "interior",
    makerId: "nocturna",
    name: "HTX-99 アイゼンノート重戦車",
    productCode: "NM-35-999",
    scale: "1/35",
    parts: 612,
    price: 9800,
    difficulty: 1.78,
    paintDifficulty: 1.66,
    baseScore: 90,
    workMax: 6000,
    paintMax: 4500,
    qualityMax: 11000,
    fragile: 8,
    unlockAt: 2,
    sprite: "heavy",
    color: "#576d61",
    accent: "#d6925c",
    difficultyLabel: "★★★★★",
    scoreLabel: "★★★★★",
    description: "内部構造まで再現した最高難度モデル。全国大会優勝を狙える一台。"
  }
];

const SALVAGE_KIT = {
  id: "salvage",
  makerId: "workshop",
  name: "JX-01 パッチワーク号",
  productCode: "JW-00-001",
  scale: "NON SCALE",
  parts: 73,
  price: 0,
  difficulty: 0.92,
  paintDifficulty: 0.95,
  baseScore: 12,
  workMax: 750,
  paintMax: 620,
  qualityMax: 1000,
  fragile: 2,
  unlockAt: 0,
  sprite: "salvage",
  color: "#8b7661",
  accent: "#b96c55",
  difficultyLabel: "★☆☆☆☆",
  scoreLabel: "★☆☆☆☆",
  description: "ジャンク部品を組み合わせた緊急用キット。無料だが基礎点は低い。"
};

const ITEMS = [
  {
    id: "cutter",
    name: "模型用カッター",
    short: "CUT",
    price: 500,
    type: "durable",
    category: "切り出し",
    description: "安価で万能。速度と安全性はニッパーに劣る。",
    speed: 1.2,
    quality: -0.2,
    risk: 3,
    requiredLevel: 1,
    slot: "cutting",
    buildBonus: 0.6
  },
  {
    id: "normalNipper",
    name: "普通のニッパー",
    short: "NIP",
    price: 1200,
    type: "durable",
    category: "切り出し",
    description: "パーツ切り出しの基本工具。速度と精度が安定する。",
    speed: 3,
    quality: 1,
    risk: 0,
    requiredLevel: 1,
    slot: "cutting",
    buildBonus: 1.2
  },
  {
    id: "singleBladeNipper",
    name: "片刃精密ニッパー",
    short: "1-NIP",
    price: 2400,
    type: "durable",
    category: "薄刃切り出し",
    description: "細いゲートを白化させにくい品質型。厚い部品の切断は遅い。",
    speed: 2.6,
    quality: 2.8,
    risk: 1,
    requiredLevel: 3,
    slot: "cutting",
    buildBonus: 1.7,
    specialty: "細いゲート"
  },
  {
    id: "premiumNipper",
    name: "高級ニッパー",
    short: "NIP+",
    price: 3400,
    type: "durable",
    category: "切り出し",
    description: "鋭い片刃で白化を抑え、速く美しく切り出せる。",
    speed: 4.7,
    quality: 2.2,
    risk: -2,
    requiredLevel: 5,
    slot: "cutting",
    buildBonus: 2.8
  },
  {
    id: "designKnife",
    name: "デザインナイフ",
    short: "KNF",
    price: 1600,
    type: "durable",
    category: "精密加工",
    description: "ゲート処理、部品自作、細部加工に対応する精密工具。",
    speed: 2.7,
    quality: 2.2,
    risk: 0,
    requiredLevel: 3,
    slot: "shaping",
    buildBonus: 1.8
  },
  {
    id: "file",
    name: "模型用ヤスリ",
    short: "FILE",
    price: 1200,
    type: "durable",
    category: "表面処理",
    description: "合わせ目を素早く削れる。仕上げには紙やすりが必要。",
    speed: 4,
    quality: 0.7,
    risk: 1,
    requiredLevel: 1,
    slot: "shaping",
    buildBonus: 1.1
  },
  {
    id: "sandingStick",
    name: "当て木ヤスリ",
    short: "STICK",
    price: 1500,
    type: "durable",
    category: "平面仕上げ",
    description: "平面を崩さず均一に削る。装甲板や箱組み車体の面出しに強い。",
    speed: 3.2,
    quality: 1.9,
    risk: 0,
    requiredLevel: 2,
    slot: "shaping",
    buildBonus: 1.5,
    specialty: "平面"
  },
  {
    id: "ceramicScraper",
    name: "セラミックカンナ",
    short: "CRMC",
    price: 2600,
    type: "durable",
    category: "パーティング処理",
    description: "細い段差やパーティングラインを安全にさらう精度型工具。",
    speed: 2.3,
    quality: 3.2,
    risk: -2,
    requiredLevel: 4,
    slot: "shaping",
    buildBonus: 2.2,
    specialty: "細い段差"
  },
  {
    id: "tweezers",
    name: "精密ピンセット",
    short: "TWZ",
    price: 900,
    type: "durable",
    category: "補助工具",
    description: "細かな部品の紛失と破損を防ぎ、品質を少し高める。",
    speed: 0.4,
    quality: 0.8,
    risk: -2,
    requiredLevel: 2,
    slot: "support",
    buildBonus: 0.8,
    paintBonus: 0.4
  },
  {
    id: "partsHolder",
    name: "パーツ保持スタンド",
    short: "HOLD",
    price: 1800,
    type: "durable",
    category: "保持・安全",
    description: "小部品を固定し、作業時のパーツ状態消費と事故リスクを抑える。",
    speed: 0.2,
    quality: 0.7,
    risk: -3,
    requiredLevel: 3,
    slot: "support",
    buildBonus: 0.5,
    paintBonus: 0.5,
    conditionSave: 3,
    specialty: "状態温存"
  },
  {
    id: "magnifier",
    name: "LED拡大鏡",
    short: "LENS",
    price: 3200,
    type: "durable",
    category: "精密作業補助",
    description: "細部を見やすくし、制作セッションの集中力上限を増やす。",
    speed: 0,
    quality: 1.6,
    risk: -1,
    requiredLevel: 4,
    slot: "support",
    buildBonus: 1,
    paintBonus: 1,
    focusBonus: 10,
    specialty: "集中力+10"
  },
  {
    id: "normalBrush",
    name: "普通の筆",
    short: "BR",
    price: 900,
    type: "durable",
    category: "筆塗り",
    description: "安価で天候に強い。塗装速度は遅め。",
    speed: 3,
    quality: 1,
    risk: 1,
    requiredLevel: 1,
    slot: "painting",
    paintBonus: 1
  },
  {
    id: "premiumBrush",
    name: "高級筆",
    short: "BR+",
    price: 2700,
    type: "durable",
    category: "筆塗り",
    description: "穂先が整い、筆ムラを抑えて細部まで塗り分けられる。",
    speed: 4.5,
    quality: 2.3,
    risk: 0,
    requiredLevel: 4,
    slot: "painting",
    paintBonus: 2.2
  },
  {
    id: "detailBrush",
    name: "面相筆",
    short: "FINE",
    price: 1900,
    type: "durable",
    category: "細部筆塗り",
    description: "速度より細部の塗り分けを重視。薄塗りと細部修正に強い。",
    speed: 1.8,
    quality: 3,
    risk: -1,
    requiredLevel: 2,
    slot: "painting",
    paintBonus: 1.8,
    specialty: "細部"
  },
  {
    id: "singleActionAirbrush",
    name: "シングルアクション・エアブラシ",
    short: "S-AIR",
    price: 4500,
    type: "durable",
    category: "広面吹き付け",
    description: "操作が簡単で広い面を速く塗れる。繊細なグラデーションは苦手。",
    speed: 5.8,
    quality: 1.9,
    risk: 1,
    requiredLevel: 5,
    slot: "painting",
    paintBonus: 2.7,
    specialty: "広い面"
  },
  {
    id: "airbrush",
    name: "エアブラシセット",
    short: "AIR",
    price: 6500,
    type: "durable",
    category: "吹き付け",
    description: "高速かつ高品質。高湿度では性能が落ち、詰まりやすい。",
    speed: 6.3,
    quality: 3,
    risk: 1,
    requiredLevel: 6,
    slot: "painting",
    paintBonus: 3.6
  },
  {
    id: "spongeSander",
    name: "スポンジヤスリ",
    short: "SPNG",
    price: 2200,
    type: "durable",
    category: "曲面仕上げ",
    description: "曲面へ追従し、削り傷を抑えて滑らかに仕上げる。",
    speed: 3.1,
    quality: 2.8,
    risk: -1,
    requiredLevel: 4,
    slot: "shaping",
    buildBonus: 2.3
  },
  {
    id: "hobbySaw",
    name: "精密ノコギリ",
    short: "SAW",
    price: 2800,
    type: "durable",
    category: "改造工具",
    description: "部品の切断や後はめ加工に使う。大きな改造の第一歩。",
    speed: 3.5,
    quality: 2,
    risk: 1,
    requiredLevel: 5,
    slot: "cutting",
    buildBonus: 2.5
  },
  {
    id: "pinVise",
    name: "精密ピンバイス",
    short: "DRILL",
    price: 3200,
    type: "durable",
    category: "改造工具",
    description: "開口、配線、金属線加工に使う上級者向け工具。",
    speed: 2.4,
    quality: 3.3,
    risk: 0,
    requiredLevel: 6,
    slot: "support",
    buildBonus: 2.6
  },
  {
    id: "rotaryTool",
    name: "低速リューター",
    short: "ROTA",
    price: 4800,
    type: "durable",
    category: "重加工",
    description: "大きな削り込みと改造を高速化するが、通常仕上げでは傷のリスクがある。",
    speed: 6.2,
    quality: 0.8,
    risk: 4,
    requiredLevel: 7,
    slot: "shaping",
    buildBonus: 3,
    specialty: "大きな削り込み"
  },
  {
    id: "sprayBooth",
    name: "卓上塗装ブース",
    short: "BOOTH",
    price: 7200,
    type: "durable",
    category: "塗装環境",
    description: "湿度や風の影響を弱め、吹き付け塗装の事故リスクを抑える。",
    speed: 0.2,
    quality: 0.8,
    risk: -2,
    requiredLevel: 7,
    slot: "support",
    paintBonus: 1.4,
    weatherGuard: 0.55,
    specialty: "悪天候対策"
  },
  {
    id: "cement",
    name: "模型用接着剤",
    short: "GLUE",
    price: 700,
    type: "supply",
    category: "組み立て",
    supplyKey: "cement",
    amount: 6,
    description: "組み立て工程に必須。1本で6回分。"
  },
  {
    id: "thinCement",
    name: "流し込み接着剤",
    short: "THIN",
    price: 950,
    type: "supply",
    category: "組み立て",
    supplyKey: "thinCement",
    amount: 7,
    requiredLevel: 3,
    description: "毛細管現象で隙間へ流れ込み、速くきれいに接着できる。"
  },
  {
    id: "instantCement",
    name: "模型用瞬間接着剤",
    short: "CA",
    price: 1200,
    type: "supply",
    category: "組み立て",
    supplyKey: "instantCement",
    amount: 5,
    requiredLevel: 5,
    description: "金属や異素材も素早く固定。速いが位置調整の失敗に注意。"
  },
  {
    id: "sandpaper",
    name: "紙やすりセット",
    short: "PAPR",
    price: 600,
    type: "supply",
    category: "表面処理",
    supplyKey: "sandpaper",
    amount: 6,
    description: "合わせ目処理と最終表面仕上げに使える。6枚入りの消耗品。"
  },
  {
    id: "basicPaint",
    name: "基本塗料セット",
    short: "PNT",
    price: 1200,
    type: "supply",
    category: "塗料",
    supplyKey: "basicPaint",
    amount: 8,
    description: "筆とエアブラシで使える基本色。8回分。",
    speed: 1,
    quality: 0.6
  },
  {
    id: "premiumPaint",
    name: "高級塗料セット",
    short: "PNT+",
    price: 2900,
    type: "supply",
    category: "塗料",
    supplyKey: "premiumPaint",
    amount: 10,
    description: "発色と隠ぺい力に優れた高級色。10回分。",
    speed: 1.8,
    quality: 2
  },
  {
    id: "waterAcrylic",
    name: "AQUA ARMOR 水性戦車色",
    maker: "MIKAGE COLOR WORKS",
    short: "AQUA",
    price: 1500,
    type: "supply",
    category: "水性塗料",
    supplyKey: "waterAcrylic",
    amount: 8,
    description: "筆塗りに強く、悪天候でも安定。乾燥は少し遅い。",
    speed: 0.7,
    quality: 1.4,
    risk: -2,
    methods: ["brush"],
    paintTrait: "筆塗り安定"
  },
  {
    id: "lacquerColor",
    name: "RAPID LACQUER 速乾戦車色",
    maker: "MIKAGE COLOR WORKS",
    short: "LACQ",
    price: 1900,
    type: "supply",
    category: "ラッカー塗料",
    supplyKey: "lacquerColor",
    amount: 8,
    requiredLevel: 3,
    description: "吹き付けで速く発色する。湿度が高い日はリスクが増える。",
    speed: 2.6,
    quality: 1.6,
    risk: 2,
    methods: ["airbrush"],
    paintTrait: "速乾・高進行"
  },
  {
    id: "enamelColor",
    name: "DETAIL ENAMEL 細部色",
    maker: "LUMEN PAINT LAB",
    short: "ENML",
    price: 1700,
    type: "supply",
    category: "エナメル塗料",
    supplyKey: "enamelColor",
    amount: 7,
    requiredLevel: 3,
    description: "細部塗装と陰影表現に強い。広い面を塗る速度は遅い。",
    speed: 0.1,
    quality: 2.8,
    risk: 1,
    methods: ["brush"],
    paintTrait: "細部品質"
  },
  {
    id: "highCoveragePaint",
    name: "HIGH COVER 高隠ぺい色",
    maker: "LUMEN PAINT LAB",
    short: "COVER",
    price: 2100,
    type: "supply",
    category: "高隠ぺい塗料",
    supplyKey: "highCoveragePaint",
    amount: 7,
    requiredLevel: 4,
    description: "少ない手数で下地を隠す進行型。繊細な濃淡表現は控えめ。",
    speed: 3,
    quality: 0.7,
    risk: 1,
    methods: ["brush", "airbrush"],
    paintTrait: "工数重視"
  },
  {
    id: "camouflagePaint",
    name: "FIELD CAMO 迷彩調色セット",
    maker: "MIKAGE COLOR WORKS",
    short: "CAMO",
    price: 2600,
    type: "supply",
    category: "迷彩塗料",
    supplyKey: "camouflagePaint",
    amount: 6,
    requiredLevel: 4,
    description: "マスキング塗装で大きく品質を伸ばす、迷彩専用の調色セット。",
    speed: 1,
    quality: 2.5,
    risk: 0,
    methods: ["brush", "airbrush"],
    maskingBonus: 1.25,
    paintTrait: "迷彩・塗り分け"
  },
  {
    id: "metallicPaint",
    name: "METAL TONE 金属色セット",
    maker: "LUMEN PAINT LAB",
    short: "MET-P",
    price: 2300,
    type: "supply",
    category: "金属色",
    supplyKey: "metallicPaint",
    amount: 6,
    requiredLevel: 5,
    description: "履帯や排気管の金属感を高める品質型。ムラのリスクがある。",
    speed: 0.8,
    quality: 3,
    risk: 2,
    methods: ["brush", "airbrush"],
    paintTrait: "金属表現"
  },
  {
    id: "sprayCan",
    name: "缶スプレー",
    short: "SPR",
    price: 1100,
    type: "supply",
    category: "吹き付け",
    supplyKey: "sprayCan",
    amount: 3,
    description: "3回分。速いが雨や強風の日は使用できない。"
  },
  {
    id: "maskingTape",
    name: "精密マスキングテープ",
    short: "MASK",
    price: 750,
    type: "supply",
    category: "特殊塗装",
    supplyKey: "maskingTape",
    amount: 4,
    requiredLevel: 4,
    description: "迷彩や塗り分けをくっきり仕上げる技法用素材。"
  },
  {
    id: "weatheringSet",
    name: "ウェザリング塗料セット",
    short: "WTHR",
    price: 1800,
    type: "supply",
    category: "特殊塗装",
    supplyKey: "weatheringSet",
    amount: 4,
    requiredLevel: 4,
    description: "泥、錆、埃を重ね、車両に使い込まれた物語を加える。"
  },
  {
    id: "plasticPlate",
    name: "プラ板・棒材",
    short: "PLATE",
    price: 600,
    type: "supply",
    category: "補修素材",
    supplyKey: "plasticPlate",
    amount: 3,
    description: "破損パーツの自作に使用。3回分。"
  },
  {
    id: "detailParts",
    name: "市販ディテールアップパーツ",
    short: "D-UP",
    price: 1700,
    type: "supply",
    category: "改造素材",
    supplyKey: "detailParts",
    amount: 2,
    requiredLevel: 3,
    description: "手すりや金網を精密化し、作品の情報量を増やす。"
  },
  {
    id: "brassWire",
    name: "真鍮線・金属メッシュ",
    short: "METAL",
    price: 1300,
    type: "supply",
    category: "改造素材",
    supplyKey: "brassWire",
    amount: 3,
    requiredLevel: 6,
    description: "配線や金属部品を自作する上級改造素材。"
  },
  {
    id: "dollarMaterials",
    name: "100円ショップ素材袋",
    short: "100Y",
    price: 300,
    type: "supply",
    category: "汎用素材",
    supplyKey: "dollarMaterials",
    amount: 3,
    requiredLevel: 2,
    description: "綿、砂、小物などの安価な素材。高レベルほど化ける。"
  },
  {
    id: "dioramaBase",
    name: "木製ジオラマベース",
    short: "BASE",
    price: 1400,
    type: "supply",
    category: "情景素材",
    supplyKey: "dioramaBase",
    amount: 2,
    requiredLevel: 2,
    description: "地面づくりの土台。素組み作品を情景として見せられる。"
  },
  {
    id: "scenicSet",
    name: "高級情景素材セット",
    short: "SCENE",
    price: 2800,
    type: "supply",
    category: "情景素材",
    supplyKey: "scenicSet",
    amount: 2,
    requiredLevel: 5,
    description: "草、瓦礫、顔料をまとめた本格的なジオラマ素材。"
  },
  {
    id: "junkBox",
    name: "ジャンクパーツ箱",
    short: "JUNK",
    price: 800,
    type: "supply",
    category: "補修素材",
    supplyKey: "junkParts",
    amount: 2,
    description: "破損時の代替部品。互換性の都合で品質は少し下がる。"
  },
  {
    id: "magazine",
    name: "模型雑誌",
    short: "BOOK",
    price: 800,
    type: "supply",
    category: "学習",
    supplyKey: "magazine",
    amount: 1,
    description: "工作特集か塗装特集を選んで読める。"
  }
];

const PAINT_ITEM_IDS = ["basicPaint", "premiumPaint", "waterAcrylic", "lacquerColor", "enamelColor", "highCoveragePaint", "camouflagePaint", "metallicPaint", "sprayCan"];
const PAINT_SUPPLY_KEYS = PAINT_ITEM_IDS.map((id) => getItem(id)?.supplyKey).filter(Boolean);

const WEATHER = {
  clear: { id: "clear", name: "晴れ", icon: "☀", note: "塗装日和", speed: 1, quality: 0.4, risk: 0, dryPenalty: 0 },
  cloudy: { id: "cloudy", name: "くもり", icon: "☁", note: "影響なし", speed: 1, quality: 0, risk: 0, dryPenalty: 0 },
  humid: { id: "humid", name: "高湿度", icon: "≋", note: "乾燥が遅い", speed: 0.83, quality: -1.2, risk: 3, dryPenalty: 1 },
  rain: { id: "rain", name: "雨", icon: "☂", note: "吹付注意", speed: 0.72, quality: -1.7, risk: 5, dryPenalty: 1 },
  windy: { id: "windy", name: "強風", icon: "彡", note: "スプレー不可", speed: 0.9, quality: -0.5, risk: 2, dryPenalty: 0 },
  cold: { id: "cold", name: "低温", icon: "❄", note: "乾燥が遅い", speed: 0.9, quality: -0.5, risk: 1, dryPenalty: 1 }
};

const WORK_STAGES = [
  { id: "cutting", until: 25, name: "パーツ切り出し", required: "ニッパーまたはカッター" },
  { id: "assembly", until: 55, name: "接着・組み立て", required: "模型用接着剤" },
  { id: "shaping", until: 80, name: "合わせ目・ゲート処理", required: "紙やすり・模型用ヤスリ・デザインナイフ" },
  { id: "finish", until: 100, name: "表面仕上げ", required: "紙やすり" }
];

/* 制作セッション中に変化する「手応え」。品質系の行動に強く影響します */
const CRAFT_CONDITIONS = {
  normal: { id: "normal", name: "ふつう", quality: 1, className: "normal" },
  good: { id: "good", name: "好調", quality: 1.5, className: "good" },
  excellent: { id: "excellent", name: "絶好調", quality: 2, className: "excellent" },
  poor: { id: "poor", name: "不調", quality: 0.6, className: "poor" }
};

/* モデラーレベルで解禁される制作技法です */
const TECHNIQUES = [
  { id: "basicWork", level: 1, type: "工作", name: "基本工作", note: "組み進める・一気に組む" },
  { id: "inspect", level: 2, type: "共通", name: "仮組み・試し塗り", note: "次の一手を強化" },
  { id: "precise", level: 3, type: "共通", name: "精密加工・薄塗り", note: "進行より品質を優先" },
  { id: "afterFit", level: 4, type: "工作", name: "後はめ加工", note: "塗装しやすさと品質を向上" },
  { id: "masking", level: 4, type: "塗装", name: "マスキング塗装", note: "塗り分け精度を向上" },
  { id: "weathering", level: 4, type: "塗装", name: "ウェザリング", note: "汚れと物語性を追加" },
  { id: "scratchBuild", level: 5, type: "改造", name: "スクラッチ工作", note: "プラ板から部品を自作" },
  { id: "metalWork", level: 6, type: "改造", name: "金属ディテール加工", note: "真鍮線とメッシュを加工" },
  { id: "materialAlchemy", level: 7, type: "情景", name: "素材の見立て", note: "100円素材を市販品級に活用" },
  { id: "masterFinish", level: 9, type: "仕上げ", name: "マスター仕上げ", note: "品質上限付近でも伸ばしやすい" }
];

const SESSION_TURNS = 4;

const PRIZES = {
  "優勝": 50000,
  "2位": 30000,
  "3位": 20000,
  "入選": 5000,
  "落選": 0,
  "未完成": 0
};

/* =========================================================
   現在の状態
   playerは大会をまたいで残り、contestとprojectだけを更新します
   ========================================================= */

let game = createEmptyGame();
let shopCart = new Set();
let shopFilter = "all";
let modalCanClose = true;

let sfxEnabled = true;
let bgmEnabled = true;
let musicUnlocked = false;
let audioContext = null;
let bgmTimer = null;
let bgmStep = 0;
let currentTrack = "title";

function createPlayer() {
  return {
    money: 0,
    month: 0,
    totalAllowance: 0,
    level: 1,
    experience: 0,
    buildSkill: 1,
    paintSkill: 1,
    // 技法はレベル条件を満たしたあと、専門誌か動画で習得します
    learnedTechniques: ["basicWork"],
    // 専門誌を読んだ分野は、次の制作セッションを準備済みで始められます
    studyPrep: { build: 0, paint: 0 },
    bookshelf: [],
    // 動画は有効な学習手段ですが、同じ月に見続けると伸びが鈍くなります
    videoStudy: { month: 0, build: 0, paint: 0 },
    tools: [],
    equipment: {
      cutting: null,
      shaping: null,
      support: null,
      painting: null
    },
    supplies: {
      cement: 0,
      thinCement: 0,
      instantCement: 0,
      sandpaper: 0,
      basicPaint: 0,
      premiumPaint: 0,
      waterAcrylic: 0,
      lacquerColor: 0,
      enamelColor: 0,
      highCoveragePaint: 0,
      camouflagePaint: 0,
      metallicPaint: 0,
      sprayCan: 0,
      maskingTape: 0,
      weatheringSet: 0,
      plasticPlate: 0,
      detailParts: 0,
      brassWire: 0,
      dollarMaterials: 0,
      dioramaBase: 0,
      scenicSet: 0,
      junkParts: 0,
      magazine: 0
    },
    contestIndex: 0,
    championships: 0
  };
}

function createEmptyGame() {
  return {
    version: GAME_VERSION,
    screen: "title",
    player: createPlayer(),
    contest: null,
    messages: [],
    replacingKit: false,
    lastResult: null,
    ended: false
  };
}

function createContest(index) {
  const data = CONTESTS[index];
  return {
    index,
    totalDays: data.days,
    daysLeft: data.days,
    energy: 100,
    categoryId: "general",
    project: null,
    session: null,
    weatherSchedule: generateWeatherSchedule(data.days),
    majorAccidents: 0
  };
}

function createProject(kit) {
  const maxPartCondition = clamp(66 - kit.fragile * 2, 46, 64);
  return {
    kit,
    workProgress: 0,
    paintProgress: 0,
    // キット自体の価値は基礎点で採点するため、作品品質は0から育てます
    quality: 0,
    maxPartCondition,
    partCondition: maxPartCondition,
    maxPaintCondition: 50,
    paintCondition: 50,
    dryReadyAt: 0,
    partsReadyAt: 0,
    pendingAccident: null,
    repairs: 0,
    quickActions: 0,
    modification: 0,
    weathering: 0,
    dioramaTypeId: null,
    dioramaProgress: 0,
    dioramaQuality: 0,
    afterFitBonus: 0,
    // 落選した完成作品には、審査員から具体的な再仕上げ課題が付きます
    reviewTasks: [],
    refinementCount: 0,
    hasBeenJudged: false,
    paintShortageWarned: false,
    studyMode: false,
    // 期限切れ後に同じ作品を継続した回数です
    carryovers: 0
  };
}

/* =========================================================
   便利な共通関数
   ========================================================= */

const screens = document.querySelectorAll(".screen");
const actionButtons = document.querySelectorAll("[data-action]");
const kitList = document.querySelector("#kit-list");
const shopList = document.querySelector("#shop-list");
const modal = document.querySelector("#choice-modal");
const modalOptions = document.querySelector("#modal-options");
const equipmentModal = document.querySelector("#equipment-modal");
let selectedEquipmentSlot = "cutting";

function yen(value) {
  return `¥${Math.max(0, Math.round(value)).toLocaleString("ja-JP")}`;
}

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function neat(value) {
  return Math.round(value * 10) / 10;
}

function getProjectMaximum(kind, project = game.contest?.project) {
  const defaults = { work: 1000, paint: 800, quality: 1600 };
  return project?.kit?.[`${kind}Max`] || defaults[kind] || 100;
}

function getProjectRate(kind, project = game.contest?.project) {
  if (!project) return 0;
  const key = kind === "work" ? "workProgress" : kind === "paint" ? "paintProgress" : "quality";
  return clamp((Number(project[key]) || 0) / getProjectMaximum(kind, project) * 100);
}

function rateToAmount(rate, kind, project = game.contest?.project) {
  return rate / 100 * getProjectMaximum(kind, project);
}

function getQualityComfortRate(level = game.player.level) {
  return [0, 30, 40, 50, 60, 68, 76, 84, 90, 96, 100][clamp(level, 1, MAX_MODELER_LEVEL)];
}

function getQualityGainMultiplier(project, rawRateGain) {
  if (rawRateGain <= 0) return 1;
  const currentRate = getProjectRate("quality", project);
  const comfort = getQualityComfortRate();
  return currentRate < comfort ? 1
    : currentRate < comfort + 10 ? (hasTechnique("masterFinish") ? 0.62 : 0.42)
      : (hasTechnique("masterFinish") ? 0.3 : 0.16);
}

/* ボタンに出す予測値。実際の品質を変更せず、現在の伸びにくさも反映します */
function estimateQualityGain(project, rawRateGain) {
  const maximum = getProjectMaximum("quality", project);
  const amount = rateToAmount(rawRateGain * getQualityGainMultiplier(project, rawRateGain), "quality", project);
  return clamp(project.quality + amount, 0, maximum) - project.quality;
}

function showQualityChange(amount) {
  if (!Number.isFinite(amount) || Math.abs(amount) < 0.5) return;
  const pop = document.querySelector("#quality-change-pop");
  const meter = document.querySelector(".quality-meter");
  if (!pop || !meter) return;
  const positive = amount > 0;
  pop.textContent = `品質 ${positive ? "+" : ""}${Math.round(amount)}`;
  pop.className = "quality-change-pop";
  void pop.offsetWidth;
  pop.classList.add(positive ? "gain" : "loss");
  meter.classList.remove("flash-gain", "flash-loss");
  void meter.offsetWidth;
  meter.classList.add(positive ? "flash-gain" : "flash-loss");
  window.setTimeout(() => {
    pop.classList.add("fade");
    meter.classList.remove("flash-gain", "flash-loss");
  }, 850);
}

function updateMeter(barId, rate, warnByRemaining = false) {
  const bar = document.querySelector(`#${barId}`);
  if (!bar) return;
  const value = clamp(Number(rate) || 0);
  bar.style.width = `${value}%`;
  const meter = bar.closest(".pixel-meter");
  if (!meter) return;
  const previous = Number(bar.dataset.lastRate);
  if (bar.dataset.lastRate !== undefined && Math.abs(previous - value) >= 0.2) {
    meter.classList.remove("meter-changed");
    void meter.offsetWidth;
    meter.classList.add("meter-changed");
    window.setTimeout(() => meter.classList.remove("meter-changed"), 650);
  }
  bar.dataset.lastRate = String(value);
  meter.dataset.state = warnByRemaining
    ? value <= 24 ? "danger" : value <= 49 ? "caution" : "normal"
    : "normal";
}

/* レベル相応の範囲までは伸びやすく、そこから先は少しずつ難しくなります */
function applyQualityGain(project, rawRateGain) {
  const maximum = getProjectMaximum("quality", project);
  if (rawRateGain <= 0) {
    const loss = rateToAmount(rawRateGain, "quality", project);
    const before = project.quality;
    project.quality = clamp(project.quality + loss, 0, maximum);
    const actualLoss = project.quality - before;
    showQualityChange(actualLoss);
    return actualLoss;
  }
  const multiplier = getQualityGainMultiplier(project, rawRateGain);
  const amount = rateToAmount(rawRateGain * multiplier, "quality", project);
  const before = project.quality;
  project.quality = clamp(project.quality + amount, 0, maximum);
  const actualGain = project.quality - before;
  showQualityChange(actualGain);
  return actualGain;
}

function getDioramaType(project = game.contest?.project) {
  return DIORAMA_TYPES.find((entry) => entry.id === project?.dioramaTypeId) || null;
}

function getDioramaRate(kind, project = game.contest?.project) {
  const type = getDioramaType(project);
  if (!project || !type) return 0;
  const value = kind === "quality" ? project.dioramaQuality : project.dioramaProgress;
  const maximum = kind === "quality" ? type.qualityMax : type.workMax;
  return clamp(value / maximum * 100);
}

function isDioramaComplete(project = game.contest?.project) {
  const type = getDioramaType(project);
  return Boolean(type && project.dioramaProgress >= type.workMax);
}

function getContestCategory() {
  return CONTEST_CATEGORIES.find((entry) => entry.id === game.contest?.categoryId) || CONTEST_CATEGORIES[0];
}

function getItem(id) {
  return ITEMS.find((item) => item.id === id);
}

function getMaker(kit) {
  return MAKERS[kit?.makerId] || MAKERS.workshop;
}

function owns(id) {
  return game.player.tools.includes(id);
}

function getRequiredLevel(item) {
  return item?.requiredLevel || 1;
}

function canUseTool(id) {
  const item = getItem(id);
  return Boolean(item && owns(id) && game.player.level >= getRequiredLevel(item));
}

function isEquippedTool(id) {
  const item = getItem(id);
  return Boolean(item && canUseTool(id) && game.player.equipment?.[item.slot] === id);
}

function isEquipped(id) {
  return Object.values(game.player.equipment || {}).includes(id);
}

function getEquippedItems() {
  return Object.values(game.player.equipment || {})
    .map(getItem)
    .filter(Boolean);
}

function getGearBonus(type) {
  const key = type === "paint" ? "paintBonus" : "buildBonus";
  return getEquippedItems().reduce((total, item) => total + (item[key] || 0), 0);
}

function getEffectiveSkill(type) {
  const base = type === "paint" ? game.player.paintSkill : game.player.buildSkill;
  return base + getGearBonus(type);
}

/* 事故率の細かな数字は隠し、装備と成長を反映した段階表示だけを見せます */
function getRiskLabel(rawRisk) {
  const adjusted = getAdjustedRisk(rawRisk);
  if (adjusted <= 3) return "低";
  if (adjusted <= 8) return "中";
  return "高";
}

function getAdjustedRisk(rawRisk) {
  return Math.max(0.5, rawRisk - (game.player.level - 1) * 0.45);
}

function getItemGearScore(item) {
  return (item?.buildBonus || 0) + (item?.paintBonus || 0);
}

function autoEquip(item) {
  if (!item?.slot || item.type !== "durable" || game.player.level < getRequiredLevel(item)) return false;
  const current = getItem(game.player.equipment[item.slot]);
  if (!current || getItemGearScore(item) > getItemGearScore(current)) {
    game.player.equipment[item.slot] = item.id;
    return true;
  }
  return false;
}

function getExperienceNeeded(level = game.player.level) {
  return 45 + level * 25;
}

function gainExperience(amount, reason = "制作経験") {
  if (game.player.level >= MAX_MODELER_LEVEL) return;
  game.player.experience += amount;
  let leveled = false;

  while (game.player.level < MAX_MODELER_LEVEL && game.player.experience >= getExperienceNeeded()) {
    game.player.experience -= getExperienceNeeded();
    game.player.level += 1;
    leveled = true;
  }

  if (leveled) {
    game.player.tools.map(getItem).filter(Boolean).forEach(autoEquip);
    const availableToLearn = TECHNIQUES.filter((technique) =>
      technique.level <= game.player.level && !game.player.learnedTechniques.includes(technique.id)
    )
      .map((technique) => technique.name);
    addMessage(`モデラーLv.${game.player.level}にアップ！${availableToLearn.length ? " 専門誌か動画で新しい技法を学べる。" : " 装備能力が向上した。"}`);
    showLevelUpToast(game.player.level, availableToLearn);
    playEffect("levelUp");
  } else if (amount >= 10) {
    addMessage(`${reason}を${amount}EXP獲得した。`);
  }
}

function hasTechnique(id) {
  const technique = TECHNIQUES.find((entry) => entry.id === id);
  return Boolean(
    technique &&
    game.player.level >= technique.level &&
    game.player.learnedTechniques?.includes(id)
  );
}

function getMatchingTechniqueTypes(skillType) {
  return skillType === "build"
    ? ["工作", "共通", "改造", "情景", "仕上げ"]
    : ["塗装", "共通", "情景", "仕上げ"];
}

/* 学習内容に合う、現在習得可能な技法を1つ返します */
function getLearnableTechnique(skillType) {
  const matchingTypes = getMatchingTechniqueTypes(skillType);
  return TECHNIQUES.find((technique) =>
    technique.level <= game.player.level &&
    matchingTypes.includes(technique.type) &&
    !game.player.learnedTechniques.includes(technique.id)
  );
}

function getLearnableTechniques(skillType) {
  const matchingTypes = getMatchingTechniqueTypes(skillType);
  return TECHNIQUES.filter((technique) =>
    technique.level <= game.player.level &&
    matchingTypes.includes(technique.type) &&
    !game.player.learnedTechniques.includes(technique.id)
  );
}

/* 専門誌・動画を使った日に、条件を満たす技法を1つ習得します */
function learnTechniqueFromStudy(skillType, source) {
  const technique = getLearnableTechnique(skillType);
  if (!technique) {
    const matchingTypes = getMatchingTechniqueTypes(skillType);
    const next = TECHNIQUES.find((entry) => matchingTypes.includes(entry.type) && !game.player.learnedTechniques.includes(entry.id));
    addMessage(`${source}で基礎を復習した。今回は新しい技法の習得条件を満たしていない。`);
    showStudyToast(source, null, next);
    return null;
  }
  game.player.learnedTechniques.push(technique.id);
  addMessage(`${source}で「${technique.name}」を習得した！ 行動メニューに新しい選択肢が追加された。`);
  showStudyToast(source, technique);
  playEffect("levelUp");
  return technique;
}

function showStudyToast(source, technique, nextTechnique = null) {
  const toast = document.querySelector("#level-up-toast");
  if (!toast) return;
  document.querySelector("#level-up-toast-kicker").textContent = technique ? "NEW TECHNIQUE" : "STUDY RESULT";
  document.querySelector("#level-up-toast-title").textContent = technique ? technique.name : `${source}で基礎力UP`;
  document.querySelector("#level-up-toast-detail").textContent = technique
    ? `${technique.note}｜使える行動が増えました`
    : nextTechnique ? `次の技法「${nextTechnique.name}」はLv.${nextTechnique.level}から習得可能` : "習得できる技法はすべて身につけています";
  showNoticeToast(toast);
}

function showNoticeToast(toast) {
  toast.hidden = false;
  toast.classList.remove("show");
  window.requestAnimationFrame(() => toast.classList.add("show"));
  window.clearTimeout(showLevelUpToast.timer);
  showLevelUpToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
    window.setTimeout(() => { toast.hidden = true; }, 220);
  }, 5000);
}

/* レベルアップ通知は操作を邪魔しないトースト表示にします */
function showLevelUpToast(level, techniques) {
  const toast = document.querySelector("#level-up-toast");
  if (!toast) return;
  document.querySelector("#level-up-toast-kicker").textContent = "MODELER LEVEL UP";
  document.querySelector("#level-up-toast-title").textContent = `Lv.${level}`;
  document.querySelector("#level-up-toast-detail").textContent = techniques.length
    ? `専門誌か動画で「${techniques.join("・")}」を習得可能`
    : "装備能力が向上しました";
  showNoticeToast(toast);
}

function getOptionalCap(type) {
  const level = game.player.level;
  if (type === "diorama") return clamp(level * 14 - 8, 20, 100);
  return clamp(level * 15 - 10, 35, 100);
}

function supply(key) {
  return game.player.supplies[key] || 0;
}

function useSupply(key, amount = 1) {
  game.player.supplies[key] = Math.max(0, supply(key) - amount);
}

function hasPaintStock() {
  return PAINT_SUPPLY_KEYS.some((key) => supply(key) > 0);
}

function isPaintStockBlocked(project = game.contest?.project) {
  return Boolean(
    project &&
    getProjectRate("work", project) >= 60 &&
    getProjectRate("paint", project) < 100 &&
    !hasPaintStock()
  );
}

function openPaintShortageModal(force = false) {
  const project = game.contest?.project;
  if (!isPaintStockBlocked(project) || game.contest.session) return false;
  if (project.paintShortageWarned && !force) return false;

  project.paintShortageWarned = true;
  saveGame();
  const cheapest = Math.min(...PAINT_ITEM_IDS.map((id) => getItem(id)?.price || Infinity));
  openModal({
    kicker: "PAINT STOCK EMPTY / 塗料切れ",
    title: "塗料が底をつき、これ以上進められない！",
    description: `現在の塗装工数は${Math.round(project.paintProgress).toLocaleString("ja-JP")} / ${getProjectMaximum("paint", project).toLocaleString("ja-JP")}。塗料を買うか、残りの日を学習に使って次月へ持ち越そう。`,
    critical: true,
    options: [
      {
        label: "模型店で塗料を確認する",
        meta: game.player.money >= cheapest ? `最安 ${yen(cheapest)} / 日数は会計時に消費` : `所持金不足 / 最安 ${yen(cheapest)}`,
        detail: game.player.money >= cheapest ? "塗料・塗装材カテゴリーを開きます。" : "現在の所持金では塗料を購入できません。",
        disabled: game.player.money < cheapest,
        action: () => { closeModal(true); openShop("paint"); }
      },
      {
        label: "塗装動画を見て次月に備える",
        meta: "無料 / 1日消費 / 塗装スキルUP",
        detail: "同じ月に4回以上見ると、スキルの伸びは少しずつ低下します。",
        action: () => { closeModal(true); watchVideo("paint"); }
      },
      {
        label: "今月は学習中心に切り替える",
        meta: "日数消費なし / 警告を閉じる",
        detail: "動画や専門誌を選びながら、期限後に作品を持ち越せます。",
        action: () => {
          project.studyMode = true;
          addMessage("塗料切れのため、今月は学習を優先して次月へ備えることにした。");
          closeModal(true);
          renderGame();
          saveGame();
        }
      }
    ]
  });
  playEffect("paintTrouble");
  return true;
}

function getElapsedDays() {
  if (!game.contest) return 0;
  return game.contest.totalDays - game.contest.daysLeft;
}

function isProjectComplete() {
  const project = game.contest?.project;
  return Boolean(project && getProjectRate("work", project) >= 100 && getProjectRate("paint", project) >= 100);
}

function isPaintDry(project = game.contest?.project) {
  return Boolean(project && getElapsedDays() >= (project.dryReadyAt || 0));
}

function isContestEntryComplete() {
  return isProjectComplete() && isPaintDry() && (getContestCategory().id !== "diorama" || isDioramaComplete());
}

function getContestData() {
  return CONTESTS[game.player.contestIndex] || CONTESTS[0];
}

/* =========================================================
   セーブとロード
   ========================================================= */

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(game));
  } catch {
    // 保存できない環境でも、現在のプレイは続行できます
  }
  updateContinueButton();
}

/* 過去のセーブも読み込み、成長・装備・再仕上げ用の値を補います */
function normalizeSavedGame(saved) {
  if (![2, 3, 4, 5, 6, 7, 8, GAME_VERSION].includes(saved?.version) || !saved.player) return null;

  const previousVersion = saved.version;
  saved.version = GAME_VERSION;
  saved.player.month = saved.player.month || Math.max(1, (saved.player.contestIndex || 0) + 1);
  saved.player.totalAllowance = saved.player.totalAllowance || saved.player.month * MONTHLY_ALLOWANCE;
  saved.player.level ||= clamp(Math.floor(((saved.player.buildSkill || 1) + (saved.player.paintSkill || 1)) / 2), 1, MAX_MODELER_LEVEL);
  saved.player.experience ||= 0;
  // 旧セーブでは、これまでレベルで解禁済みだった技法をそのまま維持します
  saved.player.learnedTechniques ||= TECHNIQUES
    .filter((technique) => technique.level <= saved.player.level)
    .map((technique) => technique.id);
  saved.player.studyPrep ||= { build: 0, paint: 0 };
  saved.player.bookshelf = Array.isArray(saved.player.bookshelf) ? saved.player.bookshelf : [];
  saved.player.videoStudy ||= { month: saved.player.month || 0, build: 0, paint: 0 };
  saved.player.tools ||= [];
  saved.player.equipment ||= { cutting: null, shaping: null, support: null, painting: null };
  Object.keys(TOOL_SLOTS).forEach((slot) => {
    saved.player.equipment[slot] ||= null;
  });

  const supplyDefaults = createPlayer().supplies;
  saved.player.supplies ||= {};
  Object.keys(supplyDefaults).forEach((key) => {
    saved.player.supplies[key] ||= 0;
  });
  saved.contest ||= createContest(saved.player.contestIndex || 0);
  saved.contest.session ||= null;
  saved.contest.categoryId ||= "general";

  const project = saved.contest.project;
  if (project?.kit?.id) {
    const currentKit = [...KITS, SALVAGE_KIT].find((kit) => kit.id === project.kit.id);
    if (currentKit) project.kit = currentKit;
    // v4までは0〜100の割合でした。見た目の進み具合を保って新しい最大値へ換算します
    if (previousVersion < 5) {
      project.workProgress = clamp(Number(project.workProgress) || 0) / 100 * getProjectMaximum("work", project);
      project.paintProgress = clamp(Number(project.paintProgress) || 0) / 100 * getProjectMaximum("paint", project);
      project.quality = clamp(Number(project.quality) || 0) / 100 * getProjectMaximum("quality", project);
      const oldDiorama = clamp(Number(project.diorama) || 0);
      project.dioramaTypeId = oldDiorama > 0 ? "vignette" : null;
      project.dioramaProgress = oldDiorama / 100 * DIORAMA_TYPES[0].workMax;
      project.dioramaQuality = oldDiorama / 100 * DIORAMA_TYPES[0].qualityMax;
    }
    project.maxPartCondition ||= clamp(66 - project.kit.fragile * 2, 46, 64);
    project.partCondition = Number.isFinite(project.partCondition)
      ? project.partCondition
      : project.maxPartCondition;
    project.maxPaintCondition ||= 50;
    project.paintCondition = Number.isFinite(project.paintCondition)
      ? project.paintCondition
      : project.maxPaintCondition;
    project.modification ||= 0;
    project.weathering ||= 0;
    project.dioramaTypeId ||= null;
    project.dioramaProgress ||= 0;
    project.dioramaQuality ||= 0;
    delete project.diorama;
    project.afterFitBonus ||= 0;
    project.reviewTasks = Array.isArray(project.reviewTasks) ? project.reviewTasks : [];
    project.refinementCount ||= 0;
    project.hasBeenJudged = Boolean(project.hasBeenJudged || project.reviewTasks.length);
    project.carryovers ||= 0;
    project.paintShortageWarned = Boolean(project.paintShortageWarned);
    project.studyMode = Boolean(project.studyMode);
  }

  // 旧セーブは所持品のうち、現在レベルで使える最良品を自動装備します
  Object.entries(TOOL_SLOTS).forEach(([slot]) => {
    const equipped = getItem(saved.player.equipment[slot]);
    const valid = equipped && saved.player.tools.includes(equipped.id) && saved.player.level >= getRequiredLevel(equipped);
    if (valid) return;
    const best = saved.player.tools.map(getItem).filter((item) =>
      item?.slot === slot && saved.player.level >= getRequiredLevel(item)
    ).sort((a, b) => getItemGearScore(b) - getItemGearScore(a))[0];
    saved.player.equipment[slot] = best?.id || null;
  });

  return saved;
}

function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    const normalized = normalizeSavedGame(saved);
    if (!normalized) return false;
    game = normalized;
    return true;
  } catch {
    return false;
  }
}

function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // 保存領域が使えない場合は何もしません
  }
}

function updateContinueButton() {
  let hasSave = false;
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    hasSave = [2, 3, 4, 5, 6, 7, 8, GAME_VERSION].includes(saved?.version) && Boolean(saved?.contest);
  } catch {
    hasSave = false;
  }
  document.querySelector("#continue-button").hidden = !hasSave;
}

/* =========================================================
   画面切り替えと音
   ========================================================= */

function showScreen(screenName) {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === `${screenName}-screen`);
  });
  game.screen = screenName;
  setBgmTrack(screenName);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function ensureAudio() {
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
    musicUnlocked = true;
    startBgm();
  } catch {
    // 音声機能がないブラウザでもゲーム本体は動作します
  }
}

function playTone(frequency = 440, duration = 0.07, type = "square", volume = 0.035) {
  if (!sfxEnabled || !musicUnlocked || !audioContext) return;
  try {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch {
    // 効果音の失敗はゲーム進行に影響させません
  }
}

/* 短い電子音とノイズを組み合わせ、工具ごとの手触りを作ります */
function playNoise(duration = 0.08, volume = 0.018, frequency = 1200, filterType = "bandpass") {
  if (!sfxEnabled || !musicUnlocked || !audioContext) return;
  try {
    const length = Math.max(1, Math.floor(audioContext.sampleRate * duration));
    const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < length; index += 1) data[index] = Math.random() * 2 - 1;
    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();
    filter.type = filterType;
    filter.frequency.value = frequency;
    filter.Q.value = filterType === "bandpass" ? 1.4 : 0.8;
    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    source.start();
  } catch {
    // 効果音が使えない環境でもゲームは続行します
  }
}

function playEffect(name) {
  if (name === "nipper" || name === "cut") {
    // 刃が閉じる硬い音と、ランナーが切れる小さな破裂音です
    playTone(980, 0.025, "square", 0.026);
    playNoise(0.025, 0.02, 2600, "highpass");
    window.setTimeout(() => playTone(310, 0.04, "square", 0.022), 34);
  } else if (name === "knife") {
    playNoise(0.09, 0.018, 2300, "highpass");
    window.setTimeout(() => playNoise(0.055, 0.012, 1500, "bandpass"), 58);
  } else if (name === "saw") {
    [0, 55, 110].forEach((delay) => window.setTimeout(() => playNoise(0.075, 0.018, 1050, "bandpass"), delay));
  } else if (name === "sandpaper" || name === "sand") {
    playNoise(0.22, 0.021, 760, "bandpass");
    window.setTimeout(() => playNoise(0.16, 0.014, 1150, "bandpass"), 125);
  } else if (name === "file") {
    playNoise(0.15, 0.023, 520, "bandpass");
    window.setTimeout(() => playNoise(0.12, 0.016, 680, "bandpass"), 120);
  } else if (name === "cement") {
    playTone(540, 0.025, "square", 0.018);
    window.setTimeout(() => playTone(145, 0.09, "sine", 0.018), 55);
  } else if (name === "brush") {
    playNoise(0.14, 0.012, 1250, "bandpass");
    window.setTimeout(() => playNoise(0.12, 0.01, 950, "bandpass"), 110);
  } else if (name === "spray" || name === "paint") {
    playNoise(0.34, 0.02, 2100, "highpass");
  } else if (name === "airbrush") {
    playNoise(0.38, 0.017, 2850, "bandpass");
    playTone(92, 0.34, "sine", 0.008);
  } else if (name === "snap") {
    playNoise(0.045, 0.035, 3200, "highpass");
    playTone(210, 0.08, "square", 0.03);
  } else if (name === "paintTrouble") {
    playNoise(0.18, 0.024, 430, "lowpass");
    window.setTimeout(() => playTone(190, 0.16, "sawtooth", 0.018), 90);
  } else if (name === "repair") {
    playNoise(0.1, 0.014, 720, "bandpass");
    window.setTimeout(() => playTone(640, 0.045, "square", 0.022), 105);
  } else if (name === "inspect") {
    playTone(620, 0.045, "sine", 0.018);
    window.setTimeout(() => playTone(780, 0.045, "sine", 0.016), 60);
  } else if (name === "page") {
    playNoise(0.12, 0.012, 1900, "highpass");
    window.setTimeout(() => playNoise(0.09, 0.008, 1300, "highpass"), 75);
  } else if (name === "video") {
    playTone(440, 0.055, "square", 0.02);
    window.setTimeout(() => playTone(660, 0.075, "triangle", 0.018), 62);
  } else if (name === "rest") {
    [523, 440, 392].forEach((note, index) => window.setTimeout(() => playTone(note, 0.13, "sine", 0.018), index * 95));
  } else if (name === "carry") {
    [330, 440, 554].forEach((note, index) => window.setTimeout(() => playTone(note, 0.11, "triangle", 0.028), index * 85));
  } else if (name === "buy") {
    playTone(1180, 0.035, "square", 0.025);
    window.setTimeout(() => playNoise(0.04, 0.022, 2400, "highpass"), 45);
    [660, 880].forEach((note, index) => window.setTimeout(() => playTone(note, 0.07, "square", 0.027), 95 + index * 70));
  } else if (name === "upgrade") {
    [392, 494, 659].forEach((note, index) => window.setTimeout(() => playTone(note, 0.09, "triangle", 0.035), index * 75));
  } else if (name === "levelUp") {
    [523, 659, 784, 1047].forEach((note, index) => window.setTimeout(() => playTone(note, 0.12, "square", 0.045), index * 95));
  } else if (name === "diorama") {
    playNoise(0.13, 0.017, 520);
    window.setTimeout(() => playTone(330, 0.1, "triangle", 0.03), 90);
  }
}

/* 選んだ工具と工程から、その場面に合う工作音を鳴らします */
function playWorkEffect(tool, stageId, actionId = "standard") {
  if (actionId === "inspect") return playEffect("inspect");
  if (actionId === "repair") return playEffect("repair");
  if (stageId === "assembly" || tool?.supplyKey?.toLowerCase().includes("cement")) return playEffect("cement");
  if (["premiumNipper", "normalNipper"].includes(tool?.id)) return playEffect("nipper");
  if (tool?.id === "hobbySaw") return playEffect("saw");
  if (["designKnife", "cutter"].includes(tool?.id)) return playEffect("knife");
  if (tool?.id === "file") return playEffect("file");
  return playEffect("sandpaper");
}

/* 筆・缶スプレー・エアブラシを別々の音にします */
function playPaintEffect(method, actionId = "standard") {
  if (actionId === "inspect") return playEffect("inspect");
  if (actionId === "repair") return playEffect("repair");
  return playEffect({ brush: "brush", spray: "spray", airbrush: "airbrush" }[method] || "paint");
}

const BGM_TRACKS = {
  title: [262, 330, 392, 330, 294, 349, 440, 349],
  kit: [220, 277, 330, 277, 247, 294, 370, 294],
  game: [196, 247, 294, 247, 220, 262, 330, 262, 185, 220, 294, 220],
  shop: [330, 392, 494, 392, 349, 440, 523, 440],
  result: [262, 392, 523, 392, 330, 494, 659, 494]
};

function setBgmTrack(screenName) {
  currentTrack = BGM_TRACKS[screenName] ? screenName : "game";
  bgmStep = 0;
}

function startBgm() {
  if (bgmTimer) return;
  bgmTimer = window.setInterval(() => {
    if (!bgmEnabled || !musicUnlocked || !audioContext || document.hidden) return;
    const notes = BGM_TRACKS[currentTrack] || BGM_TRACKS.game;
    const note = notes[bgmStep % notes.length];
    bgmStep += 1;
    try {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = bgmStep % 4 === 0 ? "triangle" : "square";
      oscillator.frequency.value = note;
      gain.gain.setValueAtTime(0.012, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.21);
    } catch {
      // BGMが鳴らせなくても表示と操作は続行します
    }
  }, 285);
}

function playResultJingle(rank) {
  const notes = ["未完成", "落選"].includes(rank)
    ? [280, 230, 180]
    : [392, 523, 659, 784];
  notes.forEach((note, index) => {
    window.setTimeout(() => playTone(note, 0.15, "square", 0.045), index * 130);
  });
}

/* =========================================================
   天候
   実際の天気ではなく、ゲーム内で30日分を生成します
   ========================================================= */

function generateWeatherSchedule(days) {
  const weighted = [
    ["clear", 42],
    ["cloudy", 24],
    ["humid", 14],
    ["rain", 9],
    ["windy", 6],
    ["cold", 5]
  ];

  return Array.from({ length: days }, () => {
    const roll = Math.random() * 100;
    let cursor = 0;
    for (const [id, weight] of weighted) {
      cursor += weight;
      if (roll <= cursor) return id;
    }
    return "clear";
  });
}

function getWeather(offset = 0) {
  if (!game.contest) return WEATHER.clear;
  const index = Math.min(game.contest.totalDays - 1, getElapsedDays() + offset);
  return WEATHER[game.contest.weatherSchedule[index]] || WEATHER.clear;
}

function renderWeather() {
  const forecast = document.querySelector("#weather-forecast");
  if (!game.contest) {
    forecast.innerHTML = "";
    return;
  }

  // 上部をコンパクトに保つため、判断に必要な今日と明日だけを表示します
  const labels = ["今日", "明日"];
  forecast.innerHTML = labels.map((label, index) => {
    const weather = getWeather(index);
    return `
      <div class="weather-day ${index === 0 ? "current" : ""}">
        <span class="weather-icon">${weather.icon}</span>
        <div><strong>${label}・${weather.name}</strong><small>${weather.note}</small></div>
      </div>
    `;
  }).join("");
}

/* =========================================================
   キャリア開始、次の大会、キット選択
   ========================================================= */

function grantMonthlyAllowance() {
  game.player.month += 1;
  game.player.videoStudy = { month: game.player.month, build: 0, paint: 0 };
  game.player.money += MONTHLY_ALLOWANCE;
  game.player.totalAllowance += MONTHLY_ALLOWANCE;
  game.contest.month = game.player.month;
  addMessage(`${game.player.month}か月目のおこづかい${yen(MONTHLY_ALLOWANCE)}を受け取った。`);
}

function startNewCareer() {
  ensureAudio();
  clearSave();
  game = createEmptyGame();
  game.contest = createContest(0);
  game.messages = [];
  grantMonthlyAllowance();
  addMessage("模型店コンテストへの挑戦が始まった。まずはキットを選ぼう。");
  renderKitChoices();
  renderToolbelt();
  showScreen("kit");
  saveGame();
  playTone(520);
}

function continueCareer() {
  ensureAudio();
  if (!loadGame()) {
    startNewCareer();
    return;
  }

  renderToolbelt();
  if (game.lastResult && game.ended) {
    renderResult(game.lastResult);
    showScreen("result");
    return;
  }

  if (!game.contest?.project) {
    renderKitChoices();
    showScreen("kit");
    return;
  }

  showScreen("game");
  refreshTimedStates();
  renderGame();
  if (game.contest.project.pendingAccident) {
    window.setTimeout(openAccidentModal, 150);
  } else if (game.contest.session?.type === "work") {
    window.setTimeout(renderWorkSession, 150);
  } else if (game.contest.session?.type === "paint") {
    window.setTimeout(renderPaintSession, 150);
  } else if (game.contest.session?.type === "refine") {
    window.setTimeout(renderRefinementSession, 150);
  } else if (isPaintStockBlocked() && !game.contest.project.paintShortageWarned) {
    window.setTimeout(() => openPaintShortageModal(), 180);
  }
}

function prepareContest(index) {
  game.player.contestIndex = index;
  game.contest = createContest(index);
  game.messages = [];
  game.replacingKit = false;
  game.lastResult = null;
  game.ended = false;
  grantMonthlyAllowance();
  addMessage(`${CONTESTS[index].name}が開幕。30日で最高の一作を仕上げよう。`);
  renderKitChoices();
  renderToolbelt();
  showScreen("kit");
  saveGame();
}

function renderKitChoices() {
  const contestIndex = game.player.contestIndex;
  const contest = CONTESTS[contestIndex];
  document.querySelector("#kit-money").textContent = yen(game.player.money);
  document.querySelector("#kit-heading").textContent = game.replacingKit
    ? "代わりのキットを選ぼう"
    : `${contest.name}に出す一台は？`;
  document.querySelector("#kit-step-label").textContent = game.replacingKit
    ? "ACCIDENT RECOVERY / 残り日数はそのまま"
    : `MONTH ${String(game.player.month).padStart(2, "0")} / ${contest.subtitle}`;
  renderContestCategories();

  const available = KITS.filter((kit) => kit.unlockAt <= contestIndex);
  if (game.replacingKit) available.push(SALVAGE_KIT);

  kitList.innerHTML = available.map((kit, index) => {
    const maker = getMaker(kit);
    const canBuy = game.player.money >= kit.price;
    const remaining = game.player.money - kit.price;
    const budgetWarning = remaining < 5100 && kit.id !== "salvage"
      ? `<span class="warning-text">購入後の工具予算に注意</span>`
      : "工具・塗料の予算も残そう";

    return `
      <article class="kit-card ${index === 1 && !game.replacingKit ? "recommended" : ""}">
        <div class="kit-art" style="--kit-color:${kit.color}" aria-hidden="true">
          <canvas class="kit-canvas" width="384" height="256" data-kit-id="${kit.id}"></canvas>
          <span class="kit-box-logo">${maker.english}</span>
          <span class="kit-box-badge">${kit.scale}<b>NEW TOOL</b></span>
        </div>
        <div class="kit-brand-row">
          <span class="kit-maker"><b>${maker.english}</b><small>${maker.name}</small></span>
          <span class="kit-number">${kit.productCode}</span>
        </div>
        <h3>${kit.name}</h3>
        <p class="kit-maker-copy">${maker.name} / ${kit.scale} / ${kit.parts} PARTS</p>
        <p>${kit.description}</p>
        <dl class="kit-specs">
          <div><dt>制作難度</dt><dd>${kit.difficultyLabel}</dd></div>
          <div><dt>基礎点</dt><dd>${kit.scoreLabel} <small>${kit.baseScore} PTS</small></dd></div>
        </dl>
        <small>${budgetWarning}</small>
        <button class="pixel-button primary" type="button" data-kit-id="${kit.id}" ${canBuy ? "" : "disabled"}>
          ${kit.price === 0 ? "ジャンクから制作" : `${yen(kit.price)}で購入`}
        </button>
      </article>
    `;
  }).join("");

  kitList.querySelectorAll("[data-kit-id]").forEach((button) => {
    button.addEventListener("click", () => chooseKit(button.dataset.kitId));
  });

  window.requestAnimationFrame(() => {
    document.querySelectorAll(".kit-canvas").forEach((canvas) => {
      const kit = [...KITS, SALVAGE_KIT].find((entry) => entry.id === canvas.dataset.kitId);
      if (kit) drawTank(canvas, kit, 100, 100);
    });
  });
}

function renderContestCategories() {
  const list = document.querySelector("#contest-category-list");
  if (!list) return;
  const selected = getContestCategory().id;
  list.innerHTML = CONTEST_CATEGORIES.map((category) => {
    const locked = game.player.level < category.minLevel;
    return `<button class="category-option ${selected === category.id ? "selected" : ""}" type="button" data-category-id="${category.id}" ${locked || game.replacingKit ? "disabled" : ""}>
      <strong>${category.name}</strong><small>${locked ? `Lv.${category.minLevel}で解禁` : category.short}</small>
    </button>`;
  }).join("");
  list.querySelectorAll("[data-category-id]").forEach((button) => {
    button.addEventListener("click", () => {
      game.contest.categoryId = button.dataset.categoryId;
      renderContestCategories();
      saveGame();
      playTone(560);
    });
  });
}

function chooseKit(kitId) {
  const kit = [...KITS, SALVAGE_KIT].find((entry) => entry.id === kitId);
  if (!kit || game.player.money < kit.price) return;

  const wasReplacing = game.replacingKit;
  game.player.money -= kit.price;
  game.contest.project = createProject(kit);
  game.replacingKit = false;
  addMessage(`${getMaker(kit).name}の${kit.name}を${yen(kit.price)}で用意した。制作開始！`);
  showScreen("game");

  if (wasReplacing) {
    finishDay();
  } else {
    renderGame();
    saveGame();
  }
  playTone(660);
}

/* =========================================================
   工程と工具
   ========================================================= */

function getWorkStage() {
  const progress = getProjectRate("work");
  return WORK_STAGES.find((stage) => progress < stage.until) || WORK_STAGES[3];
}

/* 装備中の主工具と、所持している補助消耗品から当日の作業構成を自動で作ります */
function getWorkSetup(stage = getWorkStage()) {
  if (stage.id === "assembly") {
    const hasNormal = supply("cement") > 0;
    const hasThin = supply("thinCement") > 0 && game.player.level >= 3;
    const hasInstant = supply("instantCement") > 0 && game.player.level >= 5;
    if (!hasNormal && !hasThin && !hasInstant) return null;

    if (hasNormal && hasThin) {
      return {
        tool: { id: "cementCombo", name: "模型用接着剤＋流し込み接着剤", speed: 4.2, quality: 2.8, risk: -1 },
        supports: ["接着剤併用ボーナス"],
        consume: ["cement", "thinCement"],
        instantReady: hasInstant
      };
    }
    const tool = hasThin
      ? { id: "thinCement", name: "流し込み接着剤", speed: 3.8, quality: 2.2, risk: -1 }
      : hasNormal
        ? { id: "cement", name: "模型用接着剤", speed: 2, quality: 1, risk: 0 }
        : { id: "instantCement", name: "模型用瞬間接着剤", speed: 5.2, quality: 1.1, risk: 3 };
    return { tool, supports: [], consume: [tool.id], instantReady: hasInstant && tool.id !== "instantCement" };
  }

  const slot = stage.id === "cutting" ? "cutting" : "shaping";
  const tool = getItem(game.player.equipment?.[slot]);
  if (!tool || !owns(tool.id) || game.player.level < getRequiredLevel(tool)) return null;

  const useSandpaper = ["shaping", "finish"].includes(stage.id) && supply("sandpaper") > 0;
  return {
    tool: {
      ...tool,
      speed: tool.speed + (useSandpaper ? 0.7 : 0),
      quality: tool.quality + (useSandpaper ? 1.2 : 0),
      risk: tool.risk + (useSandpaper ? -1 : 0)
    },
    supports: useSandpaper ? ["紙やすり×1"] : [],
    consume: useSandpaper ? ["sandpaper"] : [],
    instantReady: false
  };
}

function getWorkTools(stage) {
  const setup = getWorkSetup(stage);
  return setup ? [setup.tool] : [];
}

function getBestWorkTool(stage) {
  return getWorkSetup(stage)?.tool || null;
}

function getSessionFocus(skill) {
  const focusBonus = getEquippedItems().reduce((total, item) => total + (item.focusBonus || 0), 0);
  return Math.round(clamp(58 + skill * 4 + focusBonus, 60, 110));
}

function rollCraftCondition(previousId, type = "work") {
  if (previousId === "excellent") return "poor";

  let excellentChance = 5;
  let goodChance = 16;
  let poorChance = 10;
  if (type === "paint" && ["humid", "rain", "windy"].includes(getWeather().id)) {
    excellentChance = 2;
    goodChance = 10;
    poorChance = 19;
  }

  const roll = Math.random() * 100;
  if (roll < excellentChance) return "excellent";
  if (roll < excellentChance + goodChance) return "good";
  if (roll < excellentChance + goodChance + poorChance) return "poor";
  return "normal";
}

function openWorkModal() {
  const project = game.contest.project;
  const stage = getWorkStage();
  const setup = getWorkSetup(stage);

  if (game.contest.session?.type === "work") {
    renderWorkSession();
    return;
  }

  if (getElapsedDays() < project.partsReadyAt) {
    addMessage(`交換パーツ到着まで、あと${project.partsReadyAt - getElapsedDays()}日。`);
    renderGame();
    return;
  }

  if (!setup) {
    openModal({
      kicker: "TOOL REQUIRED",
      title: `${stage.name}に必要な道具がない`,
      description: `必要：${stage.required}。主工具は装備し、接着剤などの消耗品は所持しておこう。`,
      options: [{
        label: "模型店へ行く",
        meta: "買い物画面を開く",
        detail: "複数商品をまとめて購入できます。",
        action: () => {
          closeModal();
          openShop();
        }
      }, {
        label: "装備を変更する",
        meta: "日数消費なし",
        detail: "所持している主工具を装備します。",
        action: () => { closeModal(); openEquipmentModal(stage.id === "cutting" ? "cutting" : "shaping"); }
      }]
    });
    return;
  }
  startWorkSession(setup);
}

function startWorkSession(setup) {
  const project = game.contest.project;
  const stage = getWorkStage();
  const tool = setup?.tool;
  if (!tool || game.contest.energy < 17) return;
  if ((setup.consume || []).some((key) => supply(key) <= 0)) return;

  (setup.consume || []).forEach((key) => useSupply(key));
  game.contest.energy -= 17;
  const maxFocus = getSessionFocus(getEffectiveSkill("build"));
  game.contest.session = {
    type: "work",
    stageId: stage.id,
    tool: { ...tool },
    supports: [...(setup.supports || [])],
    instantReady: Boolean(setup.instantReady),
    instantUsed: false,
    turnsLeft: SESSION_TURNS,
    turnsTaken: 0,
    focus: maxFocus,
    maxFocus,
    condition: rollCraftCondition(null, "work"),
    prepared: Boolean(game.player.studyPrep?.build)
  };
  if (game.player.studyPrep?.build) game.player.studyPrep.build = Math.max(0, game.player.studyPrep.build - 1);
  const supportText = setup.supports?.length ? `（補助：${setup.supports.join("・")}）` : "";
  addMessage(`${tool.name}${supportText}で${stage.name}を開始。残り${SESSION_TURNS}手。`);
  playWorkEffect(tool, stage.id);
  saveGame();
  renderWorkSession();
}

function getWorkTurnPreview(actionId) {
  const session = game.contest.session;
  const project = game.contest.project;
  const condition = CRAFT_CONDITIONS[session.condition];
  const tweezers = isEquippedTool("tweezers") ? getItem("tweezers") : { speed: 0, quality: 0 };
  const preparedBoost = session.prepared ? 1.2 : 1;
  const effectiveSkill = getEffectiveSkill("build");
  const baseProgress = (3 + effectiveSkill * 0.25 + session.tool.speed * 0.3 + tweezers.speed * 0.15) / project.kit.difficulty;
  const baseQuality = 0.55 + effectiveSkill * 0.12 + session.tool.quality * 0.25 + tweezers.quality * 0.1;
  const instantBoost = actionId === "rush" && session.instantReady && !session.instantUsed ? 1.25 : 1;
  const patterns = {
    standard: [baseProgress * preparedBoost, baseQuality * 0.65 * condition.quality * preparedBoost],
    precise: [baseProgress * 0.32 * preparedBoost, baseQuality * 2.25 * condition.quality * preparedBoost],
    afterFit: [baseProgress * 0.48 * preparedBoost, baseQuality * 1.75 * condition.quality * preparedBoost],
    rush: [baseProgress * 1.85 * instantBoost, -0.35]
  };
  const [progressRate, qualityRate] = patterns[actionId] || [0, 0];
  const progress = rateToAmount(progressRate, "work", project);
  const quality = estimateQualityGain(project, qualityRate);
  const success = actionId === "rush"
    ? Math.round(clamp(0.55 + effectiveSkill * 0.025 + (session.prepared ? 0.18 : 0) + (instantBoost > 1 ? 0.12 : 0), 0.55, 0.95) * 100)
    : null;
  const tweezersRisk = isEquippedTool("tweezers") ? getItem("tweezers").risk : 0;
  const rawRisk = project.kit.fragile + session.tool.risk + tweezersRisk + (actionId === "rush" ? 7 : 0);
  return { progress: Math.round(progress), quality: Math.round(quality), success, risk: getRiskLabel(rawRisk) };
}

function formatTurnPreview(preview, extra = "") {
  const qualityText = preview.quality === 0 ? "品質変化なし" : `品質 ${preview.quality > 0 ? "+" : ""}${preview.quality}`;
  return `工数 +${preview.progress} / ${qualityText}${preview.risk ? ` / リスク ${preview.risk}` : ""}${extra ? ` / ${extra}` : ""}`;
}

function renderWorkSession() {
  const session = game.contest.session;
  const project = game.contest.project;
  if (!session || session.type !== "work") return;
  const stage = WORK_STAGES.find((entry) => entry.id === session.stageId) || getWorkStage();

  openModal({
    kicker: `WORK TURN ${session.turnsTaken + 1} / ${SESSION_TURNS}`,
    title: stage.name,
    description: `${session.tool.name}を使用中${session.supports?.length ? `（補助：${session.supports.join("・")}）` : ""}。${session.prepared ? "仮組み確認済み：次の実作業は効果が20%上がります。" : "工程を完成させる前に、どこまで品質へ手数を回すかが勝負です。"}`,
    closable: false,
    session: {
      turns: session.turnsLeft,
      focus: session.focus,
      maxFocus: session.maxFocus,
      integrity: project.partCondition,
      maxIntegrity: project.maxPartCondition,
      condition: CRAFT_CONDITIONS[session.condition],
      prepared: session.prepared,
      preparedText: "仮組み補正 +20%"
    },
    options: [
      {
        label: "組み進める",
        meta: formatTurnPreview(getWorkTurnPreview("standard"), "パーツ状態 -10"),
        detail: "集中力を使わず、着実に工程を進める基本作業。",
        action: () => performWorkTurn("standard")
      },
      {
        label: "精密加工する",
        meta: hasTechnique("precise") ? formatTurnPreview(getWorkTurnPreview("precise"), "集中力 -18 / 状態 -10") : "モデラーLv.3で解禁",
        detail: "進行を抑え、現在の手応えを活かして品質を伸ばす。",
        visible: hasTechnique("precise"),
        disabled: !hasTechnique("precise") || session.focus < 18,
        action: () => performWorkTurn("precise")
      },
      {
        label: "後はめ加工する",
        meta: hasTechnique("afterFit") ? formatTurnPreview(getWorkTurnPreview("afterFit"), "集中力 -24") : "モデラーLv.4で解禁",
        detail: "塗装後に組めるよう部品を加工し、塗装の品質も高める。接着・表面処理工程で使用可能。",
        visible: hasTechnique("afterFit"),
        disabled: !hasTechnique("afterFit") || !["assembly", "shaping"].includes(stage.id) || session.focus < 24,
        action: () => performWorkTurn("afterFit")
      },
      {
        label: "一気に組む",
        meta: formatTurnPreview(getWorkTurnPreview("rush"), `${session.instantReady && !session.instantUsed ? "瞬間接着剤×1で強化 / " : ""}失敗時は品質低下 / 状態 -15`),
        detail: session.instantReady && !session.instantUsed ? "瞬間接着剤をここでだけ消費し、進行と成功率を上げる締切向けの大技。" : "締切向けの大技。失敗とパーツ破損の危険が高い。",
        action: () => performWorkTurn("rush")
      },
      {
        label: "仮組み確認",
        meta: hasTechnique("inspect") ? "工数 +0 / 品質変化なし / 集中力 -6 / 次の一手 ×1.2" : "モデラーLv.2で解禁",
        detail: "進行させず、次の作業の成功率・効果を高める。",
        visible: hasTechnique("inspect"),
        disabled: !hasTechnique("inspect") || session.focus < 6 || session.prepared,
        action: () => performWorkTurn("inspect")
      },
      {
        label: "パーツを立て直す",
        meta: "工数 +0 / 品質変化なし / 集中力 -28 / パーツ状態 +22",
        detail: "接合部を整え、破損までの余裕を取り戻す。",
        disabled: session.focus < 28 || project.partCondition >= project.maxPartCondition,
        action: () => performWorkTurn("repair")
      },
      {
        label: "本日の工作を切り上げる",
        meta: "ここまでを保存して1日終了",
        detail: "残った手数は失われますが、パーツ状態を温存できます。",
        disabled: session.turnsTaken === 0,
        action: () => finishCraftSession("工作を切り上げ、机を片付けた。")
      }
    ].filter((option) => option.visible !== false)
  });
}

function performWorkTurn(actionId) {
  const session = game.contest.session;
  const project = game.contest.project;
  if (!session || session.type !== "work" || session.turnsLeft <= 0) return;

  const condition = CRAFT_CONDITIONS[session.condition];
  const tweezers = isEquippedTool("tweezers") ? getItem("tweezers") : { speed: 0, quality: 0, risk: 0 };
  const preparedBoost = session.prepared ? 1.2 : 1;
  const effectiveSkill = getEffectiveSkill("build");
  const conditionSave = getEquippedItems().reduce((total, item) => total + (item.conditionSave || 0), 0);
  const baseProgress = (
    3 + effectiveSkill * 0.25 + session.tool.speed * 0.3 + tweezers.speed * 0.15
  ) / project.kit.difficulty;
  const baseQuality =
    0.55 + effectiveSkill * 0.12 + session.tool.quality * 0.25 + tweezers.quality * 0.1;

  let progressGain = 0;
  let qualityGain = 0;
  let conditionCost = 0;
  let success = true;

  if (actionId === "standard") {
    progressGain = baseProgress * preparedBoost;
    qualityGain = baseQuality * 0.65 * condition.quality * preparedBoost;
    conditionCost = 10;
  } else if (actionId === "precise" && session.focus >= 18) {
    session.focus -= 18;
    progressGain = baseProgress * 0.32 * preparedBoost;
    qualityGain = baseQuality * 2.25 * condition.quality * preparedBoost;
    conditionCost = 10;
  } else if (actionId === "afterFit" && hasTechnique("afterFit") && session.focus >= 24) {
    session.focus -= 24;
    progressGain = baseProgress * 0.48 * preparedBoost;
    qualityGain = baseQuality * 1.75 * condition.quality * preparedBoost;
    conditionCost = 8;
    project.afterFitBonus = clamp((project.afterFitBonus || 0) + 8, 0, 30);
  } else if (actionId === "rush") {
    const useInstant = session.instantReady && !session.instantUsed && supply("instantCement") > 0;
    if (useInstant) {
      useSupply("instantCement");
      session.instantUsed = true;
    }
    const successChance = clamp(0.55 + effectiveSkill * 0.025 + (session.prepared ? 0.18 : 0) + (useInstant ? 0.12 : 0), 0.55, 0.95);
    success = Math.random() < successChance;
    progressGain = success ? baseProgress * 1.85 * (useInstant ? 1.25 : 1) : 0;
    qualityGain = success ? -0.35 : -0.8;
    conditionCost = 15;
    project.quickActions = (project.quickActions || 0) + 1;
  } else if (actionId === "inspect" && session.focus >= 6 && !session.prepared) {
    session.focus -= 6;
    session.prepared = true;
    addMessage("仮組みで干渉を確認。次の一手の精度が上がる。 ");
  } else if (actionId === "repair" && session.focus >= 28) {
    session.focus -= 28;
    const recovered = Math.min(22, project.maxPartCondition - project.partCondition);
    project.partCondition += recovered;
    addMessage(`接合部を立て直し、パーツ状態が${recovered}回復した。`);
  } else {
    return;
  }

  if (!["inspect", "repair"].includes(actionId)) {
    const progressAmount = rateToAmount(progressGain, "work", project);
    project.workProgress = clamp(project.workProgress + progressAmount, 0, getProjectMaximum("work", project));
    const qualityAmount = applyQualityGain(project, qualityGain);
    project.partCondition = Math.max(0, project.partCondition - Math.max(1, conditionCost - conditionSave));
    session.prepared = false;
    addMessage(success
      ? `${actionId === "precise" ? "精密加工" : actionId === "afterFit" ? "後はめ加工" : actionId === "rush" ? "一気組み" : "組み進め"}。工数+${Math.round(progressAmount)}、品質${qualityAmount >= 0 ? "+" : ""}${Math.round(qualityAmount)}。`
      : "一気組みに失敗。進行せず、パーツ状態と品質だけを消耗した。"
    );
  }

  playWorkEffect(session.tool, session.stageId, actionId);

  session.turnsLeft -= 1;
  session.turnsTaken += 1;
  if (!["inspect", "repair"].includes(actionId)) gainExperience(actionId === "precise" || actionId === "afterFit" ? 5 : 3);
  const risk = clamp(getAdjustedRisk(
    project.kit.fragile + session.tool.risk + tweezers.risk + (actionId === "rush" ? 7 : 0),
  ), 1, 20);
  const forcedAccident = actionId === "rush" && project.quickActions >= 5 && game.contest.majorAccidents === 0;
  const workRate = getProjectRate("work", project);
  const accident = workRate < 100 && game.contest.majorAccidents < 2 && (
    project.partCondition <= 0 || forcedAccident || Math.random() * 100 < risk * 0.32
  );

  if (accident) {
    triggerPartAccident();
    return;
  }

  const crossedStage = workRate >= (WORK_STAGES.find((entry) => entry.id === session.stageId)?.until || 100);
  if (workRate >= 100 || crossedStage || session.turnsLeft <= 0) {
    finishCraftSession(crossedStage && workRate < 100
      ? "工程の区切りまで到達。次の道具へ持ち替える。"
      : "本日の工作セッションを終えた。"
    );
    return;
  }

  session.condition = rollCraftCondition(session.condition, "work");
  saveGame();
  renderGame();
  renderWorkSession();
}

function triggerPartAccident() {
  const project = game.contest.project;
  const stage = WORK_STAGES.find((entry) => entry.id === game.contest.session?.stageId) || getWorkStage();
  applyQualityGain(project, -4);
  project.partCondition = Math.ceil(project.maxPartCondition * 0.45);
  game.contest.majorAccidents += 1;
  project.pendingAccident = {
    type: "partBreak",
    stage: stage.name,
    part: getBrokenPartName(stage.id),
    orderCost: Math.round(650 + project.kit.price * 0.12)
  };
  addMessage(`${stage.name}中に${project.pendingAccident.part}を破損してしまった！`);
  playEffect("snap");
  game.contest.session = null;
  closeModal(true);
  finishDay();
}

function finishCraftSession(message) {
  if (message) addMessage(message);
  game.contest.session = null;
  closeModal(true);
  finishDay();
}

function getBrokenPartName(stageId) {
  const names = {
    cutting: "細い手すりパーツ",
    assembly: "車体接合部",
    shaping: "砲塔ディテール",
    finish: "フェンダー部品"
  };
  return names[stageId] || "精密パーツ";
}

/* =========================================================
   塗装方法、天候、乾燥
   ========================================================= */

function getPaintOptions() {
  const weather = getWeather();
  const options = [];
  const booth = isEquippedTool("sprayBooth") ? getItem("sprayBooth") : null;
  const paintPacks = ["premiumPaint", "basicPaint", "waterAcrylic", "lacquerColor", "enamelColor", "highCoveragePaint", "camouflagePaint", "metallicPaint"]
    .map((key) => ({ key, item: getItem(key) }))
    .filter((paint) => paint.item && supply(paint.key) > 0 && game.player.level >= getRequiredLevel(paint.item));

  const paintingTool = getItem(game.player.equipment?.painting);
  const method = paintingTool?.id?.toLowerCase().includes("airbrush") ? "airbrush" : paintingTool ? "brush" : null;
  if (method) {
    paintPacks
      .filter((paint) => !paint.item.methods || paint.item.methods.includes(method))
      .forEach((paint) => {
        const isBrush = method === "brush";
        const weatherGuard = booth?.weatherGuard || 0;
        const trait = paint.item.paintTrait || (paint.key === "premiumPaint" ? "発色・品質" : "基本色");
        options.push({
          id: `${method}|${paintingTool.id}|${paint.key}`,
          method,
          name: `${paintingTool.name}＋${paint.item.name}`,
          speed: paintingTool.speed + paint.item.speed,
          quality: paintingTool.quality + paint.item.quality,
          risk: paintingTool.risk + (paint.item.risk || 0) - (booth ? 2 : 0),
          energy: method === "airbrush" ? 20 : 18,
          paintKey: paint.key,
          maskingBonus: paint.item.maskingBonus || 1,
          weatherGuard,
          detail: isBrush
            ? `${trait}。筆塗りは天候の影響が少なく、細部へ品質を配分しやすい。`
            : `${trait}。${booth ? "塗装ブースで天候影響を軽減中。" : "湿度と風の影響を受ける。"}`
        });
      });
  }

  if (supply("sprayCan") > 0) {
    options.push({
      id: "spray|sprayCan|sprayCan",
      method: "spray",
      name: "缶スプレー",
      speed: 5.5,
      quality: 1,
      risk: 2,
      energy: 15,
      paintKey: "sprayCan",
      disabled: ["rain", "windy"].includes(weather.id) && !booth,
      weatherGuard: booth?.weatherGuard || 0,
      detail: ["rain", "windy"].includes(weather.id) && !booth
        ? `${weather.name}のため今日は使用できない。`
        : `素早く広い面を塗れるが、細かな調整は苦手。${booth ? "塗装ブースで天候影響を軽減中。" : ""}`
    });
  }

  return options;
}

function openPaintModal() {
  const project = game.contest.project;
  if (getProjectRate("work", project) < 60) return;

  if (game.contest.session?.type === "paint") {
    renderPaintSession();
    return;
  }

  if (getElapsedDays() < project.dryReadyAt) {
    addMessage(`塗膜の乾燥完了まで、あと${project.dryReadyAt - getElapsedDays()}日。`);
    renderGame();
    return;
  }

  if (!hasPaintStock()) {
    openPaintShortageModal(true);
    return;
  }

  const options = getPaintOptions();
  if (!options.length) {
    openModal({
      kicker: "PAINT REQUIRED",
      title: "使える塗装道具がない",
      description: "筆＋塗料、缶スプレー、またはエアブラシ＋塗料を用意しよう。",
      options: [{
        label: "模型店へ行く",
        meta: "塗装用品を購入",
        detail: "雨の日でも使える筆は、最初の一式におすすめ。",
        action: () => {
          closeModal();
          openShop();
        }
      }]
    });
    return;
  }

  const weather = getWeather();
  openModal({
    kicker: `PAINT / ${weather.icon} ${weather.name}`,
    title: "塗装方法を選ぶ",
    description: `${weather.note}。道具を決めたら、最大${SESSION_TURNS}手で塗装の進行と品質を配分します。`,
    options: [
      ...options.map((option) => ({
      label: option.name,
      meta: `残量 ${supply(option.paintKey)} / 進行 ${option.speed >= 6 ? "大" : option.speed >= 4 ? "中" : "小"} / 品質 ${option.quality >= 4 ? "大" : option.quality >= 2 ? "中" : "小"} / リスク ${getRiskLabel(option.risk + weather.risk)}`,
      detail: option.detail,
      disabled: option.disabled || game.contest.energy < (option.energy || 18),
      action: () => startPaintSession(option)
      })),
      {
        label: "装備を変更する",
        meta: "日数消費なし / 塗装工具を見直す",
        detail: "装備変更後、もう一度「塗装する」を選んでください。",
        action: () => { closeModal(); openEquipmentModal("painting"); }
      }
    ]
  });
}

function startPaintSession(option) {
  const project = game.contest.project;
  if (!option || option.disabled || game.contest.energy < (option.energy || 18) || supply(option.paintKey) <= 0) return;

  useSupply(option.paintKey);
  game.contest.energy -= option.energy || 18;
  const maxFocus = getSessionFocus(getEffectiveSkill("paint"));
  game.contest.session = {
    type: "paint",
    option: { ...option },
    turnsLeft: SESSION_TURNS,
    turnsTaken: 0,
    focus: maxFocus,
    maxFocus,
    condition: rollCraftCondition(null, "paint"),
    prepared: Boolean(game.player.studyPrep?.paint)
  };
  if (game.player.studyPrep?.paint) game.player.studyPrep.paint = Math.max(0, game.player.studyPrep.paint - 1);
  addMessage(`${option.name}で塗装セッションを開始。残り${SESSION_TURNS}手。`);
  playPaintEffect(option.method);
  saveGame();
  renderPaintSession();
}

function getPaintTurnPreview(actionId) {
  const session = game.contest.session;
  const project = game.contest.project;
  const weather = getWeather();
  const option = session.option;
  const condition = CRAFT_CONDITIONS[session.condition];
  const effectiveSkill = getEffectiveSkill("paint");
  let weatherSpeed = weather.speed;
  let weatherQuality = weather.quality;
  const weatherGuard = clamp(option.weatherGuard || 0, 0, 0.8);
  weatherSpeed = 1 - (1 - weatherSpeed) * (1 - weatherGuard);
  weatherQuality *= 1 - weatherGuard;
  if (option.method === "brush") {
    weatherSpeed = 1 - (1 - weather.speed) * 0.35;
    weatherQuality *= 0.3;
  } else if (option.method === "airbrush" && ["humid", "rain"].includes(weather.id)) {
    weatherSpeed *= 0.82;
    weatherQuality -= 0.8;
  }
  const preparedBoost = session.prepared ? 1.2 : 1;
  const baseProgress = (3.3 + effectiveSkill * 0.25 + option.speed * 0.28) / project.kit.paintDifficulty * weatherSpeed;
  const baseQuality = Math.max(0.25, 0.55 + effectiveSkill * 0.12 + option.quality * 0.25 + weatherQuality * 0.3 + (project.afterFitBonus || 0) * 0.018);
  const patterns = {
    standard: [baseProgress * preparedBoost, baseQuality * 0.65 * condition.quality * preparedBoost],
    precise: [baseProgress * 0.34 * preparedBoost, baseQuality * 2.3 * condition.quality * preparedBoost],
    masking: [baseProgress * 0.58 * preparedBoost, baseQuality * 2.65 * (option.maskingBonus || 1) * condition.quality * preparedBoost],
    rush: [baseProgress * 1.75, -0.4]
  };
  const [progressRate, qualityRate] = patterns[actionId] || [0, 0];
  const penalty = ["humid", "rain", "windy"].includes(weather.id) ? 0.18 * (1 - weatherGuard) : 0;
  const success = actionId === "rush"
    ? Math.round(clamp(0.68 + effectiveSkill * 0.02 + (session.prepared ? 0.16 : 0) - penalty, 0.42, 0.9) * 100)
    : null;
  const rawRisk = project.kit.fragile * 0.3 + option.risk + weather.risk * (1 - weatherGuard) + (actionId === "rush" ? 5 : 0);
  return {
    progress: Math.round(rateToAmount(progressRate, "paint", project)),
    quality: Math.round(estimateQualityGain(project, qualityRate)),
    success,
    risk: getRiskLabel(rawRisk)
  };
}

function renderPaintSession() {
  const session = game.contest.session;
  const project = game.contest.project;
  if (!session || session.type !== "paint") return;
  const weather = getWeather();

  openModal({
    kicker: `PAINT TURN ${session.turnsTaken + 1} / ${SESSION_TURNS}`,
    title: `${weather.icon} ${weather.name}の塗装`,
    description: `${session.option.name}を使用中。${session.prepared ? "試し塗り済み：次の実塗装は効果が20%上がり、一気塗りの成功率も上がります。" : "悪天候では好調になりにくく、塗膜トラブルも増えます。"}`,
    closable: false,
    session: {
      turns: session.turnsLeft,
      focus: session.focus,
      maxFocus: session.maxFocus,
      integrity: project.paintCondition,
      maxIntegrity: project.maxPaintCondition,
      condition: CRAFT_CONDITIONS[session.condition],
      prepared: session.prepared,
      preparedText: "試し塗り補正 +20%"
    },
    options: [
      {
        label: "塗り進める",
        meta: formatTurnPreview(getPaintTurnPreview("standard"), "塗膜状態 -10"),
        detail: "塗膜を安定させながら面積を広げる基本塗装。",
        action: () => performPaintTurn("standard")
      },
      {
        label: "薄く重ねる",
        meta: hasTechnique("precise") ? formatTurnPreview(getPaintTurnPreview("precise"), "集中力 -18 / 状態 -10") : "モデラーLv.3で解禁",
        detail: "進行を抑え、発色やグラデーションの品質を伸ばす。",
        visible: hasTechnique("precise"),
        disabled: !hasTechnique("precise") || session.focus < 18,
        action: () => performPaintTurn("precise")
      },
      {
        label: "マスキング塗装",
        meta: hasTechnique("masking") ? formatTurnPreview(getPaintTurnPreview("masking"), `テープ残り${supply("maskingTape")} / 集中力 -20`) : "モデラーLv.4で解禁",
        detail: "境界を正確に塗り分け、迷彩とマーキングの密度を高める。",
        visible: hasTechnique("masking"),
        disabled: !hasTechnique("masking") || supply("maskingTape") <= 0 || session.focus < 20,
        action: () => performPaintTurn("masking")
      },
      {
        label: "広い面を一気に塗る",
        meta: formatTurnPreview(getPaintTurnPreview("rush"), "失敗時は品質低下 / 状態 -15"),
        detail: "速いが、湿度・風・塗装方法によって失敗しやすい。",
        action: () => performPaintTurn("rush")
      },
      {
        label: "試し吹き・試し塗り",
        meta: hasTechnique("inspect") ? "工数 +0 / 品質変化なし / 集中力 -6 / 次の一手 ×1.2" : "モデラーLv.2で解禁",
        detail: "色味と濃度を確認し、次の塗装効果を高める。",
        visible: hasTechnique("inspect"),
        disabled: !hasTechnique("inspect") || session.focus < 6 || session.prepared,
        action: () => performPaintTurn("inspect")
      },
      {
        label: "塗膜を整える",
        meta: "工数 +0 / 品質変化なし / 集中力 -28 / 塗膜状態 +22",
        detail: "荒れた表面を均し、塗装を続ける余裕を取り戻す。",
        disabled: session.focus < 28 || project.paintCondition >= project.maxPaintCondition,
        action: () => performPaintTurn("repair")
      },
      {
        label: "本日の塗装を切り上げる",
        meta: "乾燥に入り1日終了",
        detail: "残った手数は失われますが、塗膜状態を温存できます。",
        disabled: session.turnsTaken === 0,
        action: () => finishPaintSession("塗装を切り上げ、乾燥工程に入った。")
      }
    ].filter((option) => option.visible !== false)
  });
}

function performPaintTurn(actionId) {
  const session = game.contest.session;
  const project = game.contest.project;
  if (!session || session.type !== "paint" || session.turnsLeft <= 0) return;

  const weather = getWeather();
  const option = session.option;
  const condition = CRAFT_CONDITIONS[session.condition];
  const effectiveSkill = getEffectiveSkill("paint");
  let weatherSpeed = weather.speed;
  let weatherQuality = weather.quality;
  let weatherRisk = weather.risk;
  const weatherGuard = clamp(option.weatherGuard || 0, 0, 0.8);
  weatherSpeed = 1 - (1 - weatherSpeed) * (1 - weatherGuard);
  weatherQuality *= 1 - weatherGuard;
  weatherRisk *= 1 - weatherGuard;

  // 筆塗りは湿度の影響を受けにくく、エアブラシは受けやすい
  if (option.method === "brush") {
    weatherSpeed = 1 - (1 - weather.speed) * 0.35;
    weatherQuality *= 0.3;
    weatherRisk = Math.floor(weather.risk * 0.25);
  } else if (option.method === "airbrush" && ["humid", "rain"].includes(weather.id)) {
    weatherSpeed *= 0.82;
    weatherQuality -= 0.8;
    weatherRisk += 3;
  }

  const preparedBoost = session.prepared ? 1.2 : 1;
  const baseProgress = (
    3.3 + effectiveSkill * 0.25 + option.speed * 0.28
  ) / project.kit.paintDifficulty * weatherSpeed;
  const baseQuality = Math.max(0.25,
    0.55 + effectiveSkill * 0.12 + option.quality * 0.25 + weatherQuality * 0.3 + (project.afterFitBonus || 0) * 0.018
  );

  let progressGain = 0;
  let qualityGain = 0;
  let coatingCost = 0;
  let success = true;

  if (actionId === "standard") {
    progressGain = baseProgress * preparedBoost;
    qualityGain = baseQuality * 0.65 * condition.quality * preparedBoost;
    coatingCost = 10;
  } else if (actionId === "precise" && session.focus >= 18) {
    session.focus -= 18;
    progressGain = baseProgress * 0.34 * preparedBoost;
    qualityGain = baseQuality * 2.3 * condition.quality * preparedBoost;
    coatingCost = 10;
  } else if (actionId === "masking" && hasTechnique("masking") && session.focus >= 20 && supply("maskingTape") > 0) {
    session.focus -= 20;
    useSupply("maskingTape");
    progressGain = baseProgress * 0.58 * preparedBoost;
    qualityGain = baseQuality * 2.65 * (option.maskingBonus || 1) * condition.quality * preparedBoost;
    coatingCost = 8;
  } else if (actionId === "rush") {
    const penalty = ["humid", "rain", "windy"].includes(weather.id) ? 0.18 : 0;
    const successChance = clamp(0.68 + effectiveSkill * 0.02 + (session.prepared ? 0.16 : 0) - penalty, 0.42, 0.9);
    success = Math.random() < successChance;
    progressGain = success ? baseProgress * 1.75 : 0;
    qualityGain = success ? -0.4 : -1;
    coatingCost = 15;
  } else if (actionId === "inspect" && session.focus >= 6 && !session.prepared) {
    session.focus -= 6;
    session.prepared = true;
    addMessage("試し塗りで濃度を調整。次の一手の精度が上がる。 ");
  } else if (actionId === "repair" && session.focus >= 28) {
    session.focus -= 28;
    const recovered = Math.min(22, project.maxPaintCondition - project.paintCondition);
    project.paintCondition += recovered;
    addMessage(`塗膜を整え、状態が${recovered}回復した。`);
  } else {
    return;
  }

  if (!["inspect", "repair"].includes(actionId)) {
    const progressAmount = rateToAmount(progressGain, "paint", project);
    project.paintProgress = clamp(project.paintProgress + progressAmount, 0, getProjectMaximum("paint", project));
    const qualityAmount = applyQualityGain(project, qualityGain);
    project.paintCondition = Math.max(0, project.paintCondition - coatingCost);
    session.prepared = false;
    addMessage(success
      ? `${actionId === "precise" ? "薄塗り" : actionId === "masking" ? "マスキング塗装" : actionId === "rush" ? "一気塗り" : "塗り進め"}。工数+${Math.round(progressAmount)}、品質${qualityAmount >= 0 ? "+" : ""}${Math.round(qualityAmount)}。`
      : `${weather.name}の影響で一気塗りに失敗。塗膜状態と品質を消耗した。`
    );
  }

  playPaintEffect(option.method, actionId);

  session.turnsLeft -= 1;
  session.turnsTaken += 1;
  if (!["inspect", "repair"].includes(actionId)) gainExperience(actionId === "precise" || actionId === "masking" ? 5 : 3);
  const mishapRisk = clamp(getAdjustedRisk(project.kit.fragile * 0.3 + option.risk + weatherRisk + (actionId === "rush" ? 5 : 0)), 1, 20);
  const mishap = getProjectRate("paint", project) < 100 && (
    project.paintCondition <= 0 || Math.random() * 100 < mishapRisk * 0.3
  );
  if (mishap) {
    triggerPaintMishap();
    return;
  }

  if (getProjectRate("paint", project) >= 100 || session.turnsLeft <= 0) {
    finishPaintSession("本日の塗装セッションを終え、乾燥工程に入った。");
    return;
  }

  session.condition = rollCraftCondition(session.condition, "paint");
  saveGame();
  renderGame();
  renderPaintSession();
}

function triggerPaintMishap() {
  const project = game.contest.project;
  const weather = getWeather();
  applyQualityGain(project, -4);
  project.paintCondition = Math.ceil(project.maxPaintCondition * 0.45);
  project.dryReadyAt = getElapsedDays() + 2 + weather.dryPenalty;
  addMessage(`${weather.name}の影響で塗膜トラブル。品質が下がり、乾燥に時間がかかる。`);
  playEffect("paintTrouble");
  game.contest.session = null;
  closeModal(true);
  finishDay();
}

function finishPaintSession(message) {
  const project = game.contest.project;
  const weather = getWeather();
  if (message) addMessage(message);
  project.dryReadyAt = getElapsedDays() + 1 + weather.dryPenalty;
  game.contest.session = null;
  closeModal(true);
  finishDay();
}

/* =========================================================
   学習、休息、仕上げ、出品
   ========================================================= */

function readMagazine(skillType) {
  const learnable = getLearnableTechniques(skillType);
  if (learnable.length) {
    openModal({
      kicker: "MODELING MAGAZINE / 特集を選択",
      title: "専門誌で学ぶ技法を選ぶ",
      description: "専門誌は技法を指定して習得でき、次の関連制作セッションも準備済みで始まります。費用と1日は、特集を選んだ時に消費します。",
      options: learnable.map((technique) => ({
        label: technique.name,
        meta: `Lv.${technique.level} / ${technique.type} / 次回セッション効果 +20%`,
        detail: technique.note,
        action: () => applyMagazineStudy(skillType, technique)
      }))
    });
    return;
  }
  applyMagazineStudy(skillType, null);
}

function applyMagazineStudy(skillType, chosenTechnique) {
  const magazine = getItem("magazine");
  if (supply("magazine") > 0) {
    useSupply("magazine");
  } else if (game.player.money >= magazine.price) {
    game.player.money -= magazine.price;
  } else {
    addMessage("模型雑誌を買うお金が足りない。");
    renderGame();
    return;
  }

  closeModal(true);

  if (skillType === "build") {
    const gain = Math.max(0.3, 1.15 - (game.player.buildSkill - 1) * 0.1);
    game.player.buildSkill = clamp(game.player.buildSkill + gain, 1, 10);
    addMessage(`工作特集を熟読。工作スキルが${neat(gain)}上がった。`);
  } else {
    const gain = Math.max(0.3, 1.15 - (game.player.paintSkill - 1) * 0.1);
    game.player.paintSkill = clamp(game.player.paintSkill + gain, 1, 10);
    addMessage(`塗装特集を熟読。塗装スキルが${neat(gain)}上がった。`);
  }
  if (chosenTechnique && !hasTechnique(chosenTechnique.id)) {
    game.player.learnedTechniques.push(chosenTechnique.id);
    addMessage(`専門誌で「${chosenTechnique.name}」を指定習得した！`);
    showStudyToast("専門誌", chosenTechnique);
    playEffect("levelUp");
  } else {
    learnTechniqueFromStudy(skillType, "専門誌");
  }
  game.player.studyPrep[skillType] = 1;
  game.player.bookshelf.push({ type: skillType, month: game.player.month });
  addMessage(`専門誌の手順を付箋に整理。次の${skillType === "build" ? "工作" : "塗装"}セッションは準備効果+20%。`);
  playEffect("page");
  gainExperience(14, "専門誌の研究");
  finishDay();
}

function watchVideo(skillType) {
  if (!game.player.videoStudy || game.player.videoStudy.month !== game.player.month) {
    game.player.videoStudy = { month: game.player.month, build: 0, paint: 0 };
  }
  game.player.videoStudy[skillType] = (game.player.videoStudy[skillType] || 0) + 1;
  const views = game.player.videoStudy[skillType];
  const studyFactor = views <= 3 ? 1 : views === 4 ? 0.7 : views === 5 ? 0.45 : 0.25;
  if (skillType === "build") {
    const gain = Math.max(0.03, (0.42 - (game.player.buildSkill - 1) * 0.035) * studyFactor);
    game.player.buildSkill = clamp(game.player.buildSkill + gain, 1, 10);
    addMessage(`工作動画を視聴。工作スキルが${neat(gain)}上がった。${views >= 4 ? " 同じ月の連続視聴で伸びが鈍くなっている。" : ""}`);
  } else {
    const gain = Math.max(0.03, (0.42 - (game.player.paintSkill - 1) * 0.035) * studyFactor);
    game.player.paintSkill = clamp(game.player.paintSkill + gain, 1, 10);
    addMessage(`塗装動画を視聴。塗装スキルが${neat(gain)}上がった。${views >= 4 ? " 同じ月の連続視聴で伸びが鈍くなっている。" : ""}`);
  }
  if (views <= 3) learnTechniqueFromStudy(skillType, "解説動画");
  else addMessage("今回は復習視聴のため、新しい技法は習得できなかった。");
  playEffect("video");
  gainExperience(Math.max(1, Math.round(6 * studyFactor)));
  finishDay();
}

function rest() {
  const recovery = Math.min(45, 100 - game.contest.energy);
  const project = game.contest.project;
  game.contest.energy = clamp(game.contest.energy + 45);
  project.partCondition = Math.min(project.maxPartCondition, project.partCondition + 8);
  project.paintCondition = Math.min(project.maxPaintCondition, project.paintCondition + 8);
  addMessage(recovery > 0
    ? `しっかり休み、体力が${recovery}、パーツと塗膜の状態が少し回復した。`
    : "体力は満タン。工房の整理をして過ごした。");
  playEffect("rest");
  finishDay();
}

const REVIEW_TASK_TEMPLATES = [
  { id: "surface", title: "接合線と表面を整える", type: "工作", note: "車体側面の継ぎ目とヤスリ跡を均一にする。", condition: "part" },
  { id: "paint", title: "塗膜のムラを修正する", type: "塗装", note: "発色の弱い面を薄く重ね、境界を整える。", condition: "paint" },
  { id: "detail", title: "細部の情報量を追加する", type: "共通", note: "ハッチ、工具、足回りの見せ場を絞って磨く。", condition: "both" }
];

function assignReviewTasks(project) {
  const unresolved = (project.reviewTasks || []).filter((task) => !task.resolved);
  if (unresolved.length) return;
  project.reviewTasks = REVIEW_TASK_TEMPLATES.map((task) => ({ ...task, resolved: false }));
}

function getUnresolvedReviewTasks(project = game.contest?.project) {
  return (project?.reviewTasks || []).filter((task) => !task.resolved);
}

function getRefinementRawGain(actionId) {
  const project = game.contest.project;
  const session = game.contest.session;
  const condition = CRAFT_CONDITIONS[session.condition];
  const averageSkill = (getEffectiveSkill("build") + getEffectiveSkill("paint")) / 2;
  const preparedBoost = session.prepared ? 1.2 : 1;
  if (actionId.startsWith("task:")) return (3.8 + averageSkill * 0.16) * condition.quality * preparedBoost;
  const repeatPenalty = 1 / (1 + (project.refinementCount || 0) * 0.16);
  if (actionId === "surface") return (1.7 + getEffectiveSkill("build") * 0.12) * condition.quality * preparedBoost * repeatPenalty;
  if (actionId === "paint") return (1.8 + getEffectiveSkill("paint") * 0.12) * condition.quality * preparedBoost * repeatPenalty;
  return 0;
}

function renderRefinementSession() {
  const session = game.contest.session;
  const project = game.contest.project;
  if (!session || session.type !== "refine") return;
  const tasks = getUnresolvedReviewTasks(project);
  const judged = Boolean(project.hasBeenJudged || tasks.length);
  const repaintSupply = supply("premiumPaint") > 0 ? "premiumPaint" : supply("basicPaint") > 0 ? "basicPaint" : null;
  const taskOptions = tasks.map((task) => ({
    label: `審査課題：${task.title}`,
    meta: `品質 +${Math.round(estimateQualityGain(project, getRefinementRawGain(`task:${task.id}`)))} / 集中力 -16 / 一度だけ`,
    detail: task.note,
    disabled: session.focus < 16 || (task.condition === "part" && project.partCondition < 8) || (task.condition === "paint" && project.paintCondition < 8),
    action: () => performRefinementTurn(`task:${task.id}`)
  }));
  openModal({
    kicker: `${judged ? "REVIEW REFINISH" : "FINAL FINISH"} TURN ${session.turnsTaken + 1} / ${SESSION_TURNS}`,
    title: tasks.length ? "審査課題を再仕上げ" : "最終仕上げ",
    description: session.prepared
      ? "指摘箇所を確認済み。次の再仕上げ効果が20%上がります。"
      : judged
        ? "審査講評と作品を見比べ、4手で弱点を直します。課題の改善効果は一度だけです。"
        : "出品前に自分で見つけた弱点を4手で整えます。表面仕上げは安定、再塗装は伸びが大きいぶん素材と乾燥が必要です。",
    closable: false,
    session: {
      turns: session.turnsLeft,
      focus: session.focus,
      maxFocus: session.maxFocus,
      integrity: Math.round((project.partCondition / project.maxPartCondition + project.paintCondition / project.maxPaintCondition) * 50),
      maxIntegrity: 100,
      condition: CRAFT_CONDITIONS[session.condition],
      prepared: session.prepared,
      preparedText: "再確認補正 +20%"
    },
    options: [
      ...taskOptions,
      {
        label: "表面を磨き直す",
        meta: `品質 +${Math.round(estimateQualityGain(project, getRefinementRawGain("surface")))} / 状態 -8 / リスク 低`,
        detail: "天候に左右されない安定仕上げ。同じ作品で繰り返すほど伸びは小さくなります。",
        disabled: project.partCondition < 8,
        action: () => performRefinementTurn("surface")
      },
      {
        label: "細部を塗り直す",
        meta: `品質 +${Math.round(estimateQualityGain(project, getRefinementRawGain("paint") * 1.2))} / 塗料 -1 / 状態 -8 / リスク ${getRiskLabel(getWeather().risk + 3)}`,
        detail: "発色や塗り分けを大きく改善できますが、塗料を使い、終了後は乾燥が必要です。",
        disabled: project.paintCondition < 8 || !repaintSupply,
        action: () => performRefinementTurn("paint")
      },
      {
        label: judged ? "審査講評を確認する" : "仕上げ箇所を確認する",
        meta: "工数 +0 / 品質変化なし / 集中力 -6 / 次の一手 ×1.2",
        detail: judged ? "審査写真と講評を見比べ、次の再仕上げを確実にします。" : "光を当てて表面を確認し、次の仕上げを確実にします。",
        disabled: session.focus < 6 || session.prepared,
        action: () => performRefinementTurn("inspect")
      },
      {
        label: "状態を整える",
        meta: "工数 +0 / 品質変化なし / 集中力 -28 / 両状態 +16",
        detail: "表面と塗膜を休ませ、再仕上げできる余裕を戻します。",
        disabled: session.focus < 28 || (project.partCondition >= project.maxPartCondition && project.paintCondition >= project.maxPaintCondition),
        action: () => performRefinementTurn("repair")
      },
      {
        label: "本日の再仕上げを切り上げる",
        meta: "ここまでを保存して1日終了",
        detail: "残った手数は失われます。",
        disabled: session.turnsTaken === 0,
        action: () => finishRefinementSession("最終仕上げを終え、作品をケースへ戻した。")
      }
    ]
  });
}

function performRefinementTurn(actionId) {
  const session = game.contest.session;
  const project = game.contest.project;
  if (!session || session.type !== "refine" || session.turnsLeft <= 0) return;
  let qualityGain = 0;
  if (actionId === "inspect" && session.focus >= 6 && !session.prepared) {
    session.focus -= 6;
    session.prepared = true;
    addMessage(`${project.hasBeenJudged ? "審査写真と作品" : "照明を当てた作品"}を確認し、次に直す箇所を絞り込んだ。`);
    playEffect("inspect");
  } else if (actionId === "repair" && session.focus >= 28) {
    session.focus -= 28;
    project.partCondition = Math.min(project.maxPartCondition, project.partCondition + 16);
    project.paintCondition = Math.min(project.maxPaintCondition, project.paintCondition + 16);
    addMessage("作品を休ませ、表面と塗膜の状態を整えた。 ");
    playEffect("repair");
  } else if (actionId.startsWith("task:") && session.focus >= 16) {
    const task = project.reviewTasks.find((entry) => entry.id === actionId.slice(5) && !entry.resolved);
    if (!task) return;
    session.focus -= 16;
    if (task.condition !== "paint") project.partCondition = Math.max(0, project.partCondition - 8);
    if (task.condition !== "part") project.paintCondition = Math.max(0, project.paintCondition - 8);
    qualityGain = applyQualityGain(project, getRefinementRawGain(actionId));
    task.resolved = true;
    session.prepared = false;
    addMessage(`審査課題「${task.title}」を改善。品質+${Math.round(qualityGain)}。`);
    playEffect(task.condition === "paint" ? "brush" : "sandpaper");
  } else if (["surface", "paint"].includes(actionId)) {
    const conditionKey = actionId === "surface" ? "partCondition" : "paintCondition";
    if (project[conditionKey] < 8) return;
    if (actionId === "paint") {
      const paintKey = supply("premiumPaint") > 0 ? "premiumPaint" : "basicPaint";
      if (supply(paintKey) <= 0) return;
      useSupply(paintKey);
      session.repainted = true;
    }
    project[conditionKey] -= 8;
    qualityGain = applyQualityGain(project, getRefinementRawGain(actionId) * (actionId === "paint" ? 1.2 : 1));
    session.prepared = false;
    addMessage(`${actionId === "surface" ? "表面" : "塗装"}を磨き直し、品質+${Math.round(qualityGain)}。`);
    playEffect(actionId === "surface" ? "sandpaper" : "brush");
  } else {
    return;
  }
  session.turnsLeft -= 1;
  session.turnsTaken += 1;
  if (!["inspect", "repair"].includes(actionId)) gainExperience(5, "再仕上げ");
  if (session.turnsLeft <= 0) {
    finishRefinementSession("本日の最終仕上げを終え、作品をケースへ戻した。 ");
    return;
  }
  session.condition = rollCraftCondition(session.condition, "work");
  saveGame();
  renderGame();
  renderRefinementSession();
}

function finishRefinementSession(message) {
  const session = game.contest.session;
  if (session?.repainted) {
    const weather = getWeather();
    game.contest.project.dryReadyAt = getElapsedDays() + 1 + weather.dryPenalty;
    addMessage(`再塗装した塗膜を乾燥中。${1 + weather.dryPenalty}日後に出品できます。`);
  }
  finishCraftSession(message);
}

function polishWork() {
  const project = game.contest.project;
  const qualityCap = getProjectMaximum("quality", project);
  if (game.contest.session?.type === "refine") {
    renderRefinementSession();
    return;
  }
  if (!isProjectComplete() || game.contest.energy < 20 || project.quality >= qualityCap) return;
  game.contest.energy -= 20;
  const maxFocus = getSessionFocus((getEffectiveSkill("build") + getEffectiveSkill("paint")) / 2);
  game.contest.session = {
    type: "refine",
    turnsLeft: SESSION_TURNS,
    turnsTaken: 0,
    focus: maxFocus,
    maxFocus,
    condition: rollCraftCondition(null, "work"),
    prepared: false,
    repainted: false
  };
  project.refinementCount = (project.refinementCount || 0) + 1;
  addMessage(`${project.hasBeenJudged ? "審査課題の再仕上げ" : "出品前の最終仕上げ"}を開始。残り${SESSION_TURNS}手。`);
  playEffect("upgrade");
  saveGame();
  renderRefinementSession();
}

/* =========================================================
   任意制作：改造、ウェザリング、ジオラマ
   素組みのままでも出品でき、挑戦した分だけ別枠で評価されます
   ========================================================= */

function openCustomizationModal() {
  const project = game.contest.project;
  if (game.player.level < 3 || getProjectRate("work", project) < 55 || game.contest.energy < 20) return;
  const cap = getOptionalCap("modification");
  const cheapMastery = hasTechnique("materialAlchemy");

  openModal({
    kicker: `CUSTOM BUILD / ${Math.round(project.modification)} / ${cap}`,
    title: "どんな改造を加える？",
    description: "改造は任意です。素材と1日を使い、作品の情報量とクオリティを高めます。",
    options: [
      {
        label: "100円素材で工夫する",
        meta: `素材残り${supply("dollarMaterials")} / ${cheapMastery ? "見立て効果 最大" : "Lv.7で真価"}`,
        detail: "綿棒、網、コードなどを別の部品に見立てる。腕が上がるほど市販品級に仕上がる。",
        disabled: supply("dollarMaterials") <= 0 || project.modification >= cap,
        action: () => applyOptionalCraft("modification", "dollarMaterials", 10 + game.player.level * 3.2, 0.5 + game.player.level * 0.45, "100円素材を工夫して改造")
      },
      {
        label: "市販パーツで精密化",
        meta: `パーツ残り${supply("detailParts")} / 安定した高精度`,
        detail: "金網や手すりを置き換え、失敗しにくく確実に密度を上げる。",
        disabled: supply("detailParts") <= 0 || project.modification >= cap,
        action: () => applyOptionalCraft("modification", "detailParts", 24, 2.8, "市販パーツでディテールアップ")
      },
      {
        label: "プラ板でスクラッチ工作",
        meta: hasTechnique("scratchBuild") ? `プラ材残り${supply("plasticPlate")} / 改造効果 大` : "モデラーLv.5で解禁",
        detail: "装甲板や収納箱を一から作る。デザインナイフか精密ノコギリが必要。",
        disabled: !hasTechnique("scratchBuild") || supply("plasticPlate") <= 0 || !(canUseTool("designKnife") || canUseTool("hobbySaw")) || project.modification >= cap,
        action: () => applyOptionalCraft("modification", "plasticPlate", 30, 3.8, "プラ板から追加装備を自作")
      },
      {
        label: "金属ディテール加工",
        meta: hasTechnique("metalWork") ? `金属素材残り${supply("brassWire")} / 改造効果 特大` : "モデラーLv.6で解禁",
        detail: "真鍮線やメッシュで配線と金属部品を再現。精密ピンバイスが必要。",
        disabled: !hasTechnique("metalWork") || supply("brassWire") <= 0 || !canUseTool("pinVise") || project.modification >= cap,
        action: () => applyOptionalCraft("modification", "brassWire", 36, 4.8, "真鍮線で金属ディテールを追加")
      }
    ]
  });
}

function openWeatheringModal() {
  const project = game.contest.project;
  if (!hasTechnique("weathering") || getProjectRate("paint", project) < 70 || game.contest.energy < 18) return;
  const cap = getOptionalCap("weathering");
  openModal({
    kicker: `WEATHERING / ${Math.round(project.weathering)} / ${cap}`,
    title: "どんな使用感を加える？",
    description: "汚しすぎも作品の印象を変えます。狙う物語に合う表現を選びます。",
    options: [
      {
        label: "薄い埃と雨だれ",
        meta: `塗料残り${supply("weatheringSet")} / 品質重視`,
        detail: "控えめな濃淡で立体感を引き出し、清潔感を残す。",
        disabled: supply("weatheringSet") <= 0 || project.weathering >= cap,
        action: () => applyOptionalCraft("weathering", "weatheringSet", 22 + game.player.level, 3.2, "薄い埃と雨だれを表現")
      },
      {
        label: "泥と錆を重ねる",
        meta: `塗料残り${supply("weatheringSet")} / 情報量重視`,
        detail: "足回りへ泥、金属部へ錆を加え、実戦を経た車両に仕上げる。",
        disabled: supply("weatheringSet") <= 0 || project.weathering >= cap,
        action: () => applyOptionalCraft("weathering", "weatheringSet", 30 + game.player.level, 2.4, "泥と錆のウェザリング")
      }
    ]
  });
}

function openDioramaModal() {
  const project = game.contest.project;
  if (game.player.level < 2 || !isProjectComplete() || game.contest.energy < 22) return;
  const type = getDioramaType(project);
  if (!type) {
    openModal({
      kicker: "DIORAMA PLAN / 日数消費なし",
      title: "情景の規模を決める",
      description: "ジオラマは車両とは別に、工数と情景品質を育てます。総合部門では任意、情景部門では完成が必要です。",
      options: DIORAMA_TYPES.filter((entry) => entry.minLevel <= game.player.level).map((entry) => ({
        label: entry.name,
        meta: `工数 ${entry.workMax.toLocaleString("ja-JP")} / 品質上限 ${entry.qualityMax.toLocaleString("ja-JP")}`,
        detail: "規模が大きいほど制作日数は増えますが、情景としての評価上限も高くなります。",
        action: () => {
          project.dioramaTypeId = entry.id;
          closeModal();
          saveGame();
          renderGame();
          openDioramaModal();
        }
      }))
    });
    return;
  }
  const cheapMastery = hasTechnique("materialAlchemy");
  openModal({
    kicker: `DIORAMA / ${Math.round(project.dioramaProgress)} / ${type.workMax}`,
    title: `${type.name}を制作する`,
    description: `情景工数 ${Math.round(project.dioramaProgress)} / ${type.workMax}、情景品質 ${Math.round(project.dioramaQuality)} / ${type.qualityMax}。工数が満タンになると情景部門へ出品できます。`,
    options: [
      {
        label: "100円素材の小情景",
        meta: `素材残り${supply("dollarMaterials")} / ${cheapMastery ? "高品質化ボーナス" : "安価で小さな情景"}`,
        detail: "砂、木片、綿などを地面や瓦礫に見立てる。Lv.7から素材の質を超えた表現が可能。",
        disabled: supply("dollarMaterials") <= 0,
        action: () => applyDioramaCraft("dollarMaterials", 12 + game.player.level * 3.6, 0.4 + game.player.level * 0.5, "100円素材で情景を制作")
      },
      {
        label: "木製ベースで地面を作る",
        meta: `ベース残り${supply("dioramaBase")} / 安定した構成`,
        detail: "車両を引き立てる地面と高低差を作り、作品としてまとめる。",
        disabled: supply("dioramaBase") <= 0,
        action: () => applyDioramaCraft("dioramaBase", 28, 2.6, "木製ベースに地面を制作")
      },
      {
        label: "高級情景素材で作り込む",
        meta: game.player.level >= 5 ? `素材残り${supply("scenicSet")} / 情景効果 特大` : "モデラーLv.5で解禁",
        detail: "草、瓦礫、顔料を組み合わせ、視線誘導まで考えた本格情景を作る。",
        disabled: game.player.level < 5 || supply("scenicSet") <= 0,
        action: () => applyDioramaCraft("scenicSet", 40, 4.2, "本格的な情景を作り込み")
      }
    ]
  });
}

function applyDioramaCraft(supplyKey, progressRate, qualityRate, message) {
  const project = game.contest.project;
  const type = getDioramaType(project);
  if (!type || supply(supplyKey) <= 0 || game.contest.energy < 22) return;
  useSupply(supplyKey);
  game.contest.energy -= 22;
  const beforeProgress = project.dioramaProgress;
  const beforeQuality = project.dioramaQuality;
  project.dioramaProgress = clamp(project.dioramaProgress + type.workMax * progressRate / 100, 0, type.workMax);
  const currentQualityRate = getDioramaRate("quality", project);
  const comfort = getQualityComfortRate();
  const multiplier = currentQualityRate < comfort ? 1 : currentQualityRate < comfort + 10 ? 0.42 : 0.16;
  project.dioramaQuality = clamp(project.dioramaQuality + type.qualityMax * qualityRate * multiplier / 100, 0, type.qualityMax);
  addMessage(`${message}。情景工数+${Math.round(project.dioramaProgress - beforeProgress)}、情景品質+${Math.round(project.dioramaQuality - beforeQuality)}。`);
  gainExperience(15, "情景制作");
  closeModal();
  playEffect("diorama");
  finishDay();
}

function applyOptionalCraft(type, supplyKey, progressGain, qualityGain, message) {
  const project = game.contest.project;
  const energyCost = type === "weathering" ? 18 : 20;
  const cap = getOptionalCap(type);
  if (!project || supply(supplyKey) <= 0 || game.contest.energy < energyCost || project[type] >= cap) return;

  useSupply(supplyKey);
  game.contest.energy -= energyCost;
  const actualGain = Math.min(progressGain, cap - project[type]);
  project[type] = clamp(project[type] + actualGain);
  const qualityAmount = applyQualityGain(project, qualityGain);
  addMessage(`${message}。${type === "modification" ? "改造" : "ウェザリング"}+${neat(actualGain)}、品質+${Math.round(qualityAmount)}。`);
  gainExperience(12, "応用制作");
  closeModal();
  playEffect("upgrade");
  finishDay();
}

function confirmSubmit() {
  if (!isContestEntryComplete()) return;
  openModal({
    kicker: "FINAL ENTRY",
    title: "この作品を出品しますか？",
    description: `残り${game.contest.daysLeft}日、作品品質${Math.round(game.contest.project.quality)} / ${getProjectMaximum("quality")}。出品すると今大会の制作は終了します。`,
    options: [
      {
        label: "コンテストへ出品する",
        meta: "審査を開始",
        detail: "完成度、作品品質、改造・情景表現、部門との相性から審査します。",
        action: () => {
          closeModal();
          judgeContest();
        }
      },
      {
        label: "もう少し工房で考える",
        meta: "制作画面へ戻る",
        detail: "残り日数で仕上げ、学習、休息ができます。",
        action: closeModal
      }
    ]
  });
}

/* =========================================================
   アクシデント
   ========================================================= */

function openAccidentModal() {
  const project = game.contest?.project;
  const accident = project?.pendingAccident;
  if (!accident) return;

  const canOrder = game.player.money >= accident.orderCost;
  const canScratch = owns("designKnife") && supply("plasticPlate") > 0 && game.contest.energy >= 15;
  const canJunk = supply("junkParts") > 0;

  openModal({
    kicker: "ACCIDENT!",
    title: `${accident.part}が破損！`,
    description: `${accident.stage}中の事故。対応を選ぶまで工作を再開できません。`,
    accident: true,
    closable: false,
    options: [
      {
        label: "交換パーツを注文",
        meta: `${yen(accident.orderCost)} / 到着まで2日`,
        detail: canOrder ? "品質を落とさず確実に復旧。待ち時間は別の行動が可能。" : "所持金が足りない。",
        disabled: !canOrder,
        action: () => resolveAccident("order")
      },
      {
        label: "パーツを自作する",
        meta: "プラ板1 / 追加1日 / 体力-15",
        detail: canScratch ? "工作スキルで成功判定。成功時は品質も少し上がる。" : "デザインナイフ、プラ板、体力が必要。",
        disabled: !canScratch,
        action: () => resolveAccident("scratch")
      },
      {
        label: "ジャンクパーツを使う",
        meta: "ジャンク1 / 品質-3",
        detail: canJunk ? "すぐに工作を再開できる。" : "手持ちのジャンクパーツがない。",
        disabled: !canJunk,
        action: () => resolveAccident("junk")
      },
      {
        label: "このキットをジャンクにする",
        meta: "現在の進行をすべて失う",
        detail: "ジャンクパーツ2個と下取り金を得て、別のキットを選び直す。",
        action: () => resolveAccident("scrap")
      }
    ]
  });
}

function resolveAccident(method) {
  const project = game.contest.project;
  const accident = project.pendingAccident;
  if (!accident) return;

  if (method === "order") {
    if (game.player.money < accident.orderCost) return;
    game.player.money -= accident.orderCost;
    project.partsReadyAt = getElapsedDays() + 2;
    project.pendingAccident = null;
    project.repairs += 1;
    addMessage(`交換パーツを${yen(accident.orderCost)}で注文。2日後に届く。`);
    closeModal(true);
    renderGame();
    saveGame();
    if (isPaintStockBlocked() && !project.paintShortageWarned) {
      window.setTimeout(() => openPaintShortageModal(), 180);
    }
    return;
  }

  if (method === "scratch") {
    if (!owns("designKnife") || supply("plasticPlate") <= 0 || game.contest.energy < 15) return;
    useSupply("plasticPlate");
    game.contest.energy -= 15;
    const successChance = Math.min(0.9, 0.45 + game.player.buildSkill * 0.055);
    if (Math.random() < successChance) {
      applyQualityGain(project, 1.5);
      addMessage("破損パーツの自作に成功。手作業が審査上の個性になりそうだ。");
    } else {
      applyQualityGain(project, -5);
      addMessage("自作パーツは形が少し崩れた。工作は再開できるが品質が下がった。");
    }
    project.pendingAccident = null;
    project.repairs += 1;
    closeModal(true);
    finishDay();
    return;
  }

  if (method === "junk") {
    if (supply("junkParts") <= 0) return;
    useSupply("junkParts");
    applyQualityGain(project, -3);
    project.pendingAccident = null;
    project.repairs += 1;
    addMessage("ジャンクパーツで応急修理。形は違うが工作を再開できる。");
    closeModal(true);
    renderGame();
    saveGame();
    if (isPaintStockBlocked() && !project.paintShortageWarned) {
      window.setTimeout(() => openPaintShortageModal(), 180);
    }
    return;
  }

  if (method === "scrap") {
    const salvageMoney = Math.max(700, Math.round(project.kit.price * 0.28));
    game.player.money += salvageMoney;
    game.player.supplies.junkParts += 2;
    game.contest.project = null;
    game.replacingKit = true;
    addMessage(`${project.kit.name}をジャンク化。下取り${yen(salvageMoney)}とジャンク2個を得た。`);
    closeModal(true);
    renderKitChoices();
    renderToolbelt();
    showScreen("kit");
    saveGame();
  }
}

/* =========================================================
   1日の終了と待ち状態
   ========================================================= */

function finishDay() {
  game.contest.daysLeft = Math.max(0, game.contest.daysLeft - 1);
  refreshTimedStates();
  playTone(420);

  if (game.contest.daysLeft <= 0) {
    addMessage("コンテスト当日。現在の状態で審査を受ける。");
    renderGame();
    saveGame();
    window.setTimeout(judgeContest, 550);
    return;
  }

  renderGame();
  saveGame();
  if (game.contest.project?.pendingAccident) {
    window.setTimeout(openAccidentModal, 220);
  } else if (isPaintStockBlocked() && !game.contest.project.paintShortageWarned) {
    window.setTimeout(() => openPaintShortageModal(), 240);
  }
}

function refreshTimedStates() {
  const project = game.contest?.project;
  if (!project) return;
  const elapsed = getElapsedDays();

  if (project.partsReadyAt > 0 && elapsed >= project.partsReadyAt) {
    project.partsReadyAt = 0;
    project.pendingAccident = null;
    addMessage("注文していた交換パーツが届いた。工作を再開できる！");
  }

  if (project.dryReadyAt > 0 && elapsed >= project.dryReadyAt) {
    project.dryReadyAt = 0;
    addMessage("塗膜が乾燥した。次の塗装工程に進める。");
  }
}

/* =========================================================
   買い物：カートの商品をまとめて買って1日消費
   ========================================================= */

function openShop(initialFilter = "all") {
  shopCart = new Set();
  shopFilter = typeof initialFilter === "string" ? initialFilter : "all";
  renderShop();
  showScreen("shop");
  playTone(480);
}

function renderShop() {
  document.querySelector("#shop-money").textContent = yen(game.player.money);

  const filters = [
    ["all", "すべて"],
    ["tool", "工具"],
    ["paint", "塗料・塗装材"],
    ["supply", "工作消耗品"],
    ["material", "改造・情景素材"]
  ];
  const filterBar = document.querySelector("#shop-filters");
  filterBar.innerHTML = filters.map(([id, label]) => `<button type="button" class="${shopFilter === id ? "active" : ""}" data-shop-filter="${id}">${label}</button>`).join("");
  filterBar.querySelectorAll("[data-shop-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      shopFilter = button.dataset.shopFilter;
      renderShop();
      playTone(420);
    });
  });

  const paintIds = new Set([...PAINT_ITEM_IDS, "maskingTape", "weatheringSet"]);
  const workSupplyIds = new Set(["cement", "thinCement", "instantCement", "sandpaper"]);
  const visibleItems = ITEMS.filter((item) => {
    if (shopFilter === "all") return true;
    if (shopFilter === "tool") return item.type === "durable";
    if (shopFilter === "paint") return paintIds.has(item.id);
    if (shopFilter === "supply") return workSupplyIds.has(item.id) || item.id === "magazine";
    return item.type === "supply" && !paintIds.has(item.id) && !workSupplyIds.has(item.id) && item.id !== "magazine";
  });

  shopList.innerHTML = visibleItems.map((item) => {
    const alreadyOwned = item.type === "durable" && owns(item.id);
    const levelLocked = game.player.level < getRequiredLevel(item) && !alreadyOwned;
    const selected = shopCart.has(item.id);
    const currentQuantity = item.type === "supply" ? supply(item.supplyKey) : 0;
    const buttonText = alreadyOwned ? "所持済み" : levelLocked ? `Lv.${getRequiredLevel(item)}で解禁` : selected ? "カートから外す" : "カートへ";

    return `
      <article class="shop-item shop-category-${getShopCategory(item)} ${selected ? "selected" : ""} ${alreadyOwned ? "unavailable" : ""} ${levelLocked ? "locked" : ""}">
        <div class="shop-item-top">
          <div class="item-pixel" aria-hidden="true">${item.short}</div>
          <div>
            ${item.maker ? `<p class="item-maker">${item.maker}</p>` : ""}
            <p class="item-category">${item.category}</p>
            <h3>${item.name}${item.type === "supply" ? ` / 所持${currentQuantity}` : ""}</h3>
          </div>
        </div>
        <p>${item.description}</p>
        <div class="item-role-tags">
          ${item.specialty ? `<span>${item.specialty}</span>` : ""}
          ${item.paintTrait ? `<span>${item.paintTrait}</span>` : ""}
          ${item.methods ? `<span>${item.methods.map((entry) => entry === "brush" ? "筆" : "エアブラシ").join("・")}</span>` : ""}
        </div>
        <div class="item-level-row"><span>必要Lv.${getRequiredLevel(item)}</span>${item.slot ? `<span>${TOOL_SLOTS[item.slot]} / 進行${item.speed >= 4 ? "大" : item.speed >= 2.5 ? "中" : "小"}・品質${item.quality >= 2.2 ? "大" : item.quality >= 1 ? "中" : "小"}</span>` : ""}</div>
        <div class="shop-price-row">
          <strong>${yen(item.price)}</strong>
          <button class="shop-buy-button ${selected ? "in-cart" : ""}" type="button" data-item-id="${item.id}" ${alreadyOwned || levelLocked ? "disabled" : ""}>
            ${buttonText}
          </button>
        </div>
      </article>
    `;
  }).join("");

  shopList.querySelectorAll("[data-item-id]").forEach((button) => {
    button.addEventListener("click", () => toggleCart(button.dataset.itemId));
  });
  renderCartSummary();
}

function getShopCategory(item) {
  if (item.id === "magazine") return "book";
  if (item.type === "durable") return "tool";
  if ([...PAINT_ITEM_IDS, "maskingTape", "weatheringSet"].includes(item.id)) return "paint";
  if (["cement", "thinCement", "instantCement", "sandpaper"].includes(item.id)) return "supply";
  return "material";
}

function toggleCart(itemId) {
  const item = getItem(itemId);
  if (!item || game.player.level < getRequiredLevel(item) || (item.type === "durable" && owns(item.id))) return;
  if (shopCart.has(itemId)) shopCart.delete(itemId);
  else shopCart.add(itemId);
  renderShop();
}

function getCartTotal() {
  return [...shopCart].reduce((total, id) => total + (getItem(id)?.price || 0), 0);
}

function renderCartSummary() {
  const total = getCartTotal();
  document.querySelector("#cart-count").textContent = shopCart.size;
  document.querySelector("#cart-total").textContent = yen(total);
  document.querySelector("#checkout-button").disabled =
    shopCart.size === 0 || total > game.player.money || game.contest.daysLeft <= 0;
}

function checkoutCart() {
  const total = getCartTotal();
  if (!shopCart.size || total > game.player.money) return;

  const boughtNames = [];
  let boughtPaint = false;
  [...shopCart].forEach((id) => {
    const item = getItem(id);
    if (!item || game.player.level < getRequiredLevel(item)) return;
    if (item.type === "durable") {
      if (!owns(item.id)) {
        game.player.tools.push(item.id);
        autoEquip(item);
      }
    } else {
      game.player.supplies[item.supplyKey] = supply(item.supplyKey) + item.amount;
    }
    if (PAINT_ITEM_IDS.includes(item.id)) boughtPaint = true;
    boughtNames.push(item.name);
  });

  if (boughtPaint && game.contest.project) {
    game.contest.project.paintShortageWarned = false;
    game.contest.project.studyMode = false;
  }

  game.player.money -= total;
  shopCart.clear();
  addMessage(`${boughtNames.join("、")}をまとめて${yen(total)}で購入した。`);
  gainExperience(4);
  playEffect("buy");
  showScreen("game");
  finishDay();
}

/* =========================================================
   コンテスト審査と次の大会
   ========================================================= */

/* 審査対象は作品そのもの。工具・レベル・所持品は制作過程にだけ影響します */
function calculateOutputScores(project = game.contest?.project) {
  if (!project) return null;
  const category = getContestCategory().id;
  const base = project.kit?.baseScore || 0;
  const progress = (getProjectRate("work", project) + getProjectRate("paint", project)) * 0.2;
  const qualityRate = getProjectRate("quality", project);
  const quality = qualityRate * (category === "straight" ? 0.78 : category === "diorama" ? 0.45 : 0.65);
  const modification = category === "general" ? (project.modification || 0) * 0.18 : 0;
  const weathering = category === "straight" ? 0 : (project.weathering || 0) * 0.16;
  const diorama = category === "diorama"
    ? getDioramaRate("work", project) * 0.18 + getDioramaRate("quality", project) * 0.42
    : category === "general" ? getDioramaRate("quality", project) * 0.14 : 0;
  const hasOptionalWork = (project.modification || 0) > 0 || (project.weathering || 0) > 0 || getDioramaRate("work", project) > 0;
  const categoryFit = category === "straight" ? (hasOptionalWork ? -10 : 8)
    : category === "diorama" ? (isDioramaComplete(project) ? 8 : -30)
      : 0;
  return { base, progress, quality, modification, weathering, diorama, categoryFit };
}

/* 数字を断定せず、現時点の作品から大まかな見込みと改善ヒントだけを返します */
function calculateContestPreview() {
  const project = game.contest?.project;
  if (!project) return { rank: "未完成", label: "審査不能", hint: "キットを選んで制作を始めよう" };
  if (!isProjectComplete()) {
    const weaker = getProjectRate("work", project) <= getProjectRate("paint", project) ? "工作" : "塗装";
    return { rank: "未完成", label: "制作途中", hint: `${weaker}工数を完成させる必要があります` };
  }
  if (!isPaintDry(project)) return { rank: "未完成", label: "乾燥待ち", hint: "塗膜が乾けば出品できます" };
  if (getContestCategory().id === "diorama" && !isDioramaComplete(project)) {
    return { rank: "未完成", label: "情景未完成", hint: "ジオラマ工数の完成が出品条件です" };
  }
  const scores = calculateOutputScores(project);
  const total = Math.max(0, Math.round(Object.values(scores).reduce((sum, value) => sum + value, 0)));
  const rank = getRank(total, true);
  const label = rank === "優勝" ? "優勝候補" : ["2位", "3位"].includes(rank) ? "表彰台を狙えそう" : rank === "入選" ? "入選が見えてきた" : "まだ厳しそう";
  let hint = getProjectRate("quality", project) < getQualityComfortRate() ? "作品品質にまだ伸びしろがあります" : "部門に合う表現を足すと評価が安定します";
  if (getContestCategory().id === "straight") hint = "素組み部門は基本工作と品質を重視します";
  if (getContestCategory().id === "diorama" && getDioramaRate("quality", project) < 50) hint = "情景品質を高める余地があります";
  return { rank, label, hint };
}

function getRank(score, completed) {
  if (!completed) return "未完成";
  const shift = getContestData().thresholdShift;
  if (score >= 150 + shift) return "優勝";
  if (score >= 135 + shift) return "2位";
  if (score >= 120 + shift) return "3位";
  if (score >= 94 + shift) return "入選";
  return "落選";
}

function getRankComment(rank) {
  return {
    "優勝": "審査員全員がうなった圧巻の完成度！ 小さな戦車に、君だけの物語が宿っている。",
    "2位": "細部まで丁寧に作り込まれた力作。あと一歩で頂点に届く、見事な仕上がりだ。",
    "3位": "工作と塗装の調和が高く評価された。表彰台にふさわしい、堂々たる作品！",
    "入選": "基本を大切にした誠実な作品。次の大会へ進む資格をつかんだ。",
    "落選": "完成はしたが、審査基準にはあと一歩。講評を手がかりに、作品品質や部門に合う表現を磨こう。",
    "未完成": "時間切れ。ただし制作中のキットは、進行と品質を保ったまま次月へ持ち越せる。"
  }[rank];
}

function judgeContest() {
  if (game.ended) return;
  game.ended = true;
  const project = game.contest.project;
  const completed = isContestEntryComplete();
  const category = getContestCategory().id;
  const output = calculateOutputScores(project) || { base: 0, progress: 0, quality: 0, modification: 0, weathering: 0, diorama: 0, categoryFit: 0 };
  const { base, progress, quality, modification, weathering, diorama, categoryFit } = output;
  const random = Math.floor(Math.random() * 14) - 5;
  const incompletePenalty = completed ? 0 : -60;
  const total = Math.max(0, Math.round(base + progress + quality + modification + weathering + diorama + categoryFit + random + incompletePenalty));
  const rank = getRank(total, completed);
  const prize = PRIZES[rank];
  const cleared = !["落選", "未完成"].includes(rank);

  // 完成して落選した作品には、次月に直せる具体的な講評を残します
  if (project) project.hasBeenJudged = true;
  if (completed && rank === "落選") assignReviewTasks(project);

  game.player.money += prize;
  if (rank === "優勝" && game.player.contestIndex === CONTESTS.length - 1) {
    game.player.championships += 1;
  }

  const scores = [
    ["キット基礎点", base],
    ["制作進行", Math.round(progress)],
    ["作品品質", Math.round(quality)],
    ["改造表現", Math.round(modification)],
    ["ウェザリング", Math.round(weathering)],
    [category === "diorama" ? "情景工数・品質" : "ジオラマ", Math.round(diorama)],
    ["部門との相性", Math.round(categoryFit)],
    ["審査員の好み", random],
    ...(completed ? [] : [["未完成ペナルティ", incompletePenalty]])
  ];

  game.lastResult = {
    rank,
    prize,
    total,
    scores,
    cleared,
    contestIndex: game.player.contestIndex,
    categoryName: getContestCategory().name,
    finalMoney: game.player.money,
    comment: getRankComment(rank)
  };

  renderResult(game.lastResult);
  showScreen("result");
  renderToolbelt();
  saveGame();
  playResultJingle(rank);
}

function renderResult(result) {
  document.querySelector("#result-heading").textContent = result.rank;
  document.querySelector("#result-comment").textContent = result.comment;
  document.querySelector("#total-score").textContent = String(result.total).padStart(3, "0");
  document.querySelector("#prize-money").textContent = yen(result.prize);
  document.querySelector("#final-money").textContent = yen(result.finalMoney);
  document.querySelector("#trophy-pixel").classList.toggle("lost", ["落選", "未完成"].includes(result.rank));

  const contest = CONTESTS[result.contestIndex];
  const canCarryProject = ["未完成", "落選"].includes(result.rank) && Boolean(game.contest?.project);
  document.querySelector("#career-result-label").textContent = result.cleared
    ? `${contest.name}クリア！ 資金・スキル・工具を引き継ぎます。`
    : canCarryProject
      ? `${contest.name}・${result.categoryName || getContestCategory().name}は未突破。作品を次月へ持ち越して仕上げ直すか、新しいキットで再挑戦できます。`
      : `${contest.name}は未突破。同じ大会へ装備を引き継いで再挑戦できます。`;

  document.querySelector("#score-breakdown").innerHTML = result.scores.map(([label, value]) => `
    <div><dt>${label}</dt><dd>${value >= 0 ? "+" : ""}${value} PTS</dd></div>
  `).join("");

  const nextButton = document.querySelector("#next-contest-button");
  const carryButton = document.querySelector("#carry-project-button");
  carryButton.hidden = !canCarryProject;
  carryButton.disabled = false;
  carryButton.textContent = isProjectComplete() ? "完成作品を次月へ持ち越して仕上げる ▶" : "制作中キットを次月へ持ち越す ▶";
  nextButton.classList.toggle("primary", !canCarryProject);
  nextButton.classList.toggle("secondary", canCarryProject);

  if (canCarryProject) nextButton.textContent = "新しいキットで同じ大会に再挑戦 ▶";
  else if (!result.cleared) nextButton.textContent = "同じコンテストに再挑戦 ▶";
  else if (result.contestIndex < CONTESTS.length - 1) nextButton.textContent = "次のコンテストへ ▶";
  else nextButton.textContent = "全国大会にもう一度挑戦 ▶";
}

function carryProjectToNextContest() {
  const result = game.lastResult;
  const oldContest = game.contest;
  const project = oldContest?.project;
  const carryButton = document.querySelector("#carry-project-button");

  // 不正な保存状態でも無言で終了せず、次に取る行動を結果画面へ表示します
  if (!result || !["未完成", "落選"].includes(result.rank) || !project) {
    document.querySelector("#career-result-label").textContent =
      "制作中作品を確認できませんでした。新しいキットで同じ大会へ再挑戦してください。";
    return;
  }

  const contestIndex = Number.isInteger(result.contestIndex) && CONTESTS[result.contestIndex]
    ? result.contestIndex
    : game.player.contestIndex;
  if (!CONTESTS[contestIndex]) {
    document.querySelector("#career-result-label").textContent =
      "大会データを確認できず、持ち越せませんでした。最初からやり直してください。";
    return;
  }

  carryButton.disabled = true;
  carryButton.textContent = "持ち越し処理中…";
  const carrySnapshot = {
    money: game.player.money,
    month: game.player.month,
    totalAllowance: game.player.totalAllowance,
    contestIndex: game.player.contestIndex,
    messages: game.messages,
    partsReadyAt: project.partsReadyAt,
    dryReadyAt: project.dryReadyAt,
    partCondition: project.partCondition,
    paintCondition: project.paintCondition,
    carryovers: project.carryovers
  };

  try {
    // 待ち時間は「あと何日か」に変換してから、新しい30日へ移します
    const elapsed = getElapsedDays();
    const partsReadyAt = Number.isFinite(project.partsReadyAt) ? project.partsReadyAt : 0;
    const partsWait = Math.max(0, partsReadyAt - elapsed);
    const nextContest = createContest(contestIndex);
    nextContest.categoryId = oldContest.categoryId || "general";
    nextContest.project = project;
    nextContest.session = null;

    game.player.contestIndex = contestIndex;
    game.contest = nextContest;
    game.messages = [];
    game.replacingKit = false;
    game.lastResult = null;
    game.ended = false;

    project.partsReadyAt = partsWait;
    // 月をまたぐ休養と保管で通常の消耗は回復。未解決の破損だけは持ち越します
    project.dryReadyAt = 0;
    if (!project.pendingAccident) project.partCondition = project.maxPartCondition;
    project.paintCondition = project.maxPaintCondition;
    project.carryovers = (project.carryovers || 0) + 1;
    // 月をまたいだら、塗料切れの警告を新しい月の状況でもう一度判定します
    project.paintShortageWarned = false;
    project.studyMode = false;

    grantMonthlyAllowance();
    addMessage(`${project.kit.name}を次月へ持ち越した。工数・品質は保存し、休養と保管で体力・素材状態・乾燥を整えて再開。`);
    if (partsWait > 0) addMessage(`交換パーツ到着まで、あと${partsWait}日。`);

    // 先に画面を切り替え、補助欄の描画失敗で遷移まで止まらないようにします
    showScreen("game");
    renderGame();
    saveGame();
    playEffect("carry");

    if (project.pendingAccident) window.setTimeout(openAccidentModal, 180);
  } catch (error) {
    console.error("制作中キットの持ち越しに失敗しました", error);
    game.player.money = carrySnapshot.money;
    game.player.month = carrySnapshot.month;
    game.player.totalAllowance = carrySnapshot.totalAllowance;
    game.player.contestIndex = carrySnapshot.contestIndex;
    game.messages = carrySnapshot.messages;
    project.partsReadyAt = carrySnapshot.partsReadyAt;
    project.dryReadyAt = carrySnapshot.dryReadyAt;
    project.partCondition = carrySnapshot.partCondition;
    project.paintCondition = carrySnapshot.paintCondition;
    project.carryovers = carrySnapshot.carryovers;
    game.contest = oldContest;
    game.lastResult = result;
    game.ended = true;
    showScreen("result");
    renderResult(result);
    document.querySelector("#career-result-label").textContent =
      "持ち越し処理に失敗しました。もう一度押すか、新しいキットで再挑戦してください。";
    carryButton.disabled = false;
  } finally {
    carryButton.textContent = isProjectComplete() ? "完成作品を次月へ持ち越して仕上げる ▶" : "制作中キットを次月へ持ち越す ▶";
  }
}

function goToNextContest() {
  const result = game.lastResult;
  if (!result) return;
  const nextIndex = result.cleared
    ? Math.min(CONTESTS.length - 1, result.contestIndex + 1)
    : result.contestIndex;
  prepareContest(nextIndex);
}

/* =========================================================
   表示更新
   ========================================================= */

function renderGame() {
  const project = game.contest?.project;
  if (!project) return;

  const contestData = getContestData();
  document.querySelector("#contest-round-label").textContent =
    `ROUND ${String(game.player.contestIndex + 1).padStart(2, "0")} / ${contestData.subtitle} / ${getContestCategory().name}`;
  document.querySelector("#game-heading").textContent = contestData.name;
  document.querySelector("#month-number").textContent = game.player.month;
  document.querySelector("#days-left").textContent = game.contest.daysLeft;
  document.querySelector("#money").textContent = yen(game.player.money);
  document.querySelector("#allowance-amount").textContent = yen(MONTHLY_ALLOWANCE);
  document.querySelector("#energy-text").textContent = `${Math.round(game.contest.energy)} / 100`;
  updateMeter("energy-bar", game.contest.energy, true);
  const effectiveBuild = getEffectiveSkill("build");
  const effectivePaint = getEffectiveSkill("paint");
  document.querySelector("#build-skill").textContent = `${effectiveBuild.toFixed(1)}（基礎${game.player.buildSkill.toFixed(1)}）`;
  document.querySelector("#paint-skill").textContent = `${effectivePaint.toFixed(1)}（基礎${game.player.paintSkill.toFixed(1)}）`;
  updateMeter("build-skill-bar", clamp(effectiveBuild * 8));
  updateMeter("paint-skill-bar", clamp(effectivePaint * 8));
  const expNeeded = getExperienceNeeded();
  const currentExperience = Math.round(game.player.experience);
  const remainingExperience = Math.max(0, expNeeded - currentExperience);
  document.querySelector("#modeler-level").textContent = game.player.level;
  document.querySelector("#experience-text").textContent = game.player.level >= MAX_MODELER_LEVEL
    ? "MASTER / 最大レベル"
    : `${currentExperience} / ${expNeeded} EXP`;
  document.querySelector("#experience-remaining").textContent = game.player.level >= MAX_MODELER_LEVEL
    ? "LEVEL MAX"
    : `あと${remainingExperience} EXP`;
  document.querySelector("#experience-meter-label").textContent = game.player.level >= MAX_MODELER_LEVEL
    ? "MAX"
    : `${currentExperience} / ${expNeeded}`;
  updateMeter("experience-bar", game.player.level >= MAX_MODELER_LEVEL ? 100 : game.player.experience / expNeeded * 100);
  const workRate = getProjectRate("work", project);
  const paintRate = getProjectRate("paint", project);
  const qualityRate = getProjectRate("quality", project);
  document.querySelector("#build-progress-text").textContent = `${Math.round(project.workProgress).toLocaleString("ja-JP")} / ${getProjectMaximum("work", project).toLocaleString("ja-JP")}（${Math.round(workRate)}%）`;
  document.querySelector("#paint-progress-text").textContent = `${Math.round(project.paintProgress).toLocaleString("ja-JP")} / ${getProjectMaximum("paint", project).toLocaleString("ja-JP")}（${Math.round(paintRate)}%）`;
  updateMeter("build-progress-bar", workRate);
  updateMeter("paint-progress-bar", paintRate);
  document.querySelector("#quality-progress-text").textContent = `${Math.round(project.quality).toLocaleString("ja-JP")} / ${getProjectMaximum("quality", project).toLocaleString("ja-JP")}（${Math.round(qualityRate)}%）`;
  updateMeter("quality-progress-bar", qualityRate);
  const comfortRate = getQualityComfortRate();
  const comfortMarker = document.querySelector("#quality-comfort-marker");
  comfortMarker.style.left = `${comfortRate}%`;
  comfortMarker.dataset.label = `Lv.${game.player.level}目安`;
  document.querySelector("#quality-guidance").textContent = `Lv.${game.player.level}の伸ばしやすい目安：${Math.round(rateToAmount(comfortRate, "quality", project)).toLocaleString("ja-JP")}（${comfortRate}%）`;
  const contestPreview = calculateContestPreview();
  const contestPreviewBox = document.querySelector(".quality-box");
  contestPreviewBox.dataset.rank = contestPreview.rank;
  document.querySelector("#contest-preview").textContent = contestPreview.label;
  document.querySelector("#contest-preview-score").textContent = contestPreview.hint;
  document.querySelector("#part-condition-text").textContent = `${Math.round(project.partCondition)} / ${project.maxPartCondition}`;
  updateMeter("part-condition-bar", project.partCondition / project.maxPartCondition * 100, true);
  document.querySelector("#paint-condition-text").textContent = `${Math.round(project.paintCondition)} / ${project.maxPaintCondition}`;
  updateMeter("paint-condition-bar", project.paintCondition / project.maxPaintCondition * 100, true);
  ["modification", "weathering"].forEach((type) => {
    const cap = getOptionalCap(type);
    document.querySelector(`#${type}-text`).textContent = `${Math.round(project[type])} / ${cap}`;
    updateMeter(`${type}-bar`, project[type] / cap * 100);
  });
  const dioramaType = getDioramaType(project);
  document.querySelector("#diorama-text").textContent = dioramaType ? `${Math.round(project.dioramaProgress).toLocaleString("ja-JP")} / ${dioramaType.workMax.toLocaleString("ja-JP")}` : "未着手";
  updateMeter("diorama-bar", getDioramaRate("work", project));
  document.querySelector("#diorama-quality-text").textContent = dioramaType ? `${Math.round(project.dioramaQuality).toLocaleString("ja-JP")} / ${dioramaType.qualityMax.toLocaleString("ja-JP")}` : "未着手";
  updateMeter("diorama-quality-bar", getDioramaRate("quality", project));
  document.querySelector("#current-kit-name").textContent = project.kit.name;
  const maker = getMaker(project.kit);
  document.querySelector("#current-kit-maker").textContent = `${maker.english}（${maker.name}） / ${project.kit.productCode} / ${project.kit.scale}`;

  const stage = getWorkStage();
  const tool = getBestWorkTool(stage);
  document.querySelector("#work-stage-label").textContent = workRate >= 100
    ? "工程：工作完了"
    : `工程：${stage.name} / ${tool ? `推奨 ${tool.name}` : `必要 ${stage.required}`}`;

  const elapsed = getElapsedDays();
  let dryText = `${getWeather().icon} ${getWeather().name}・塗装可能`;
  if (elapsed < project.dryReadyAt) dryText = `乾燥待ち あと${project.dryReadyAt - elapsed}日`;
  if (elapsed < project.partsReadyAt) dryText = `交換パーツ待ち あと${project.partsReadyAt - elapsed}日`;
  document.querySelector("#dry-status-label").textContent = dryText;

  let condition = "箱を開けたばかり";
  if (dioramaType) condition = isDioramaComplete(project) ? "情景作品が完成" : "情景作品を制作中";
  else if (project.weathering > 0) condition = "ウェザリング仕上げ中";
  else if (project.modification > 0) condition = "改造・ディテールアップ中";
  else if (isProjectComplete()) condition = isPaintDry(project) ? "完成・出品可能" : "完成・塗膜乾燥中";
  else if (paintRate > 0) condition = "塗装・乾燥中";
  else if (workRate >= 80) condition = "表面仕上げ中";
  else if (workRate >= 55) condition = "車体形状が完成";
  else if (workRate >= 25) condition = "組み立て中";
  else if (workRate > 0) condition = "パーツ切り出し中";
  document.querySelector("#project-condition").textContent = condition;

  const projectCard = document.querySelector(".project-card");
  const visualPhase = dioramaType ? "diorama" : paintRate > 0 ? "paint" : workRate >= 55 ? "assembly" : "parts";
  projectCard.dataset.phase = visualPhase;
  projectCard.dataset.weather = getWeather().id;
  document.querySelector("#game-screen").dataset.phase = visualPhase;
  drawTank(document.querySelector("#project-canvas"), project.kit, workRate, paintRate, { ...project, diorama: getDioramaRate("work", project) });
  renderWeather();
  renderToolbelt();
  renderEquipment();
  renderReviewTasks();
  renderTechniques();
  renderInventory();
  renderMessages();
  updateActionButtons();
}

function renderToolbelt() {
  const container = document.querySelector("#toolbelt-items");
  const entries = [];
  game.player.tools.forEach((id) => {
    const item = getItem(id);
    if (item) entries.push(`<span class="tool-chip ${isEquipped(id) ? "equipped" : ""}">${isEquipped(id) ? "★ " : ""}${item.name}${game.player.level < getRequiredLevel(item) ? `（Lv.${getRequiredLevel(item)}）` : ""}</span>`);
  });
  ITEMS.filter((item) => item.type === "supply" && supply(item.supplyKey) > 0).forEach((item) => {
    entries.push(`<span class="tool-chip supply">${item.name} ×${supply(item.supplyKey)}</span>`);
  });
  container.innerHTML = entries.length
    ? entries.join("")
    : '<span class="tool-chip empty">所持工具なし</span>';
}

function renderEquipment() {
  const list = document.querySelector("#equipment-list");
  list.innerHTML = Object.entries(TOOL_SLOTS).map(([slot, label]) => {
    const item = getItem(game.player.equipment?.[slot]);
    const bonus = item
      ? [item.buildBonus ? `工作+${item.buildBonus}` : "", item.paintBonus ? `塗装+${item.paintBonus}` : ""].filter(Boolean).join(" / ")
      : "能力補正なし";
    const uses = getToolUseTags(item, slot).join("・");
    return `<li><span>${label} <em>${uses}</em></span><strong>${item?.name || "未装備"}</strong><small>${bonus}</small></li>`;
  }).join("");
}

function renderReviewTasks() {
  const panel = document.querySelector("#review-panel");
  const list = document.querySelector("#review-task-list");
  const progress = document.querySelector("#review-progress");
  const tasks = game.contest?.project?.reviewTasks || [];
  panel.hidden = tasks.length === 0;
  if (!tasks.length) return;
  const resolved = tasks.filter((task) => task.resolved).length;
  progress.textContent = `${resolved} / ${tasks.length} 改善`;
  list.innerHTML = tasks.map((task) => `
    <li class="${task.resolved ? "resolved" : ""}">
      <span>${task.resolved ? "✓" : "!"}</span>
      <div><strong>${task.title}</strong><small>${task.type}｜${task.note}</small></div>
    </li>
  `).join("");
}

function renderTechniques() {
  const list = document.querySelector("#technique-list");
  const groups = [
    { id: "work", label: "工作技法", types: ["工作", "改造"] },
    { id: "paint", label: "塗装技法", types: ["塗装"] },
    { id: "common", label: "共通・応用", types: ["共通", "仕上げ", "情景"] }
  ];

  list.innerHTML = groups.map((group) => {
    const visible = TECHNIQUES.filter((technique) =>
      group.types.includes(technique.type) &&
      (hasTechnique(technique.id) || technique.level <= game.player.level)
    );
    if (!visible.length) return "";

    return `
      <li class="technique-group-heading ${group.id}">${group.label}</li>
      ${visible.map((technique) => {
        const learned = hasTechnique(technique.id);
        return `
          <li class="${learned ? "unlocked" : "next-unlock"}">
            <span>${learned ? "◆" : "◇ 習得可能"} Lv.${technique.level} ${technique.name}</span>
            <small>${technique.note}${learned ? "" : "｜専門誌か動画で習得"}</small>
          </li>
        `;
      }).join("")}
    `;
  }).join("");
}

function getToolUseTags(item, slot = item?.slot) {
  if (!item) return ({ cutting: ["切り出し"], shaping: ["表面処理"], support: ["補助・改造"], painting: ["塗装"] }[slot] || ["工具"]);
  if (item.specialty) {
    const base = ({ cutting: "切り出し", shaping: "表面処理", support: "補助", painting: "塗装" }[slot] || item.category);
    return [base, item.specialty];
  }
  if (item.id === "hobbySaw") return ["切断", "後はめ", "改造"];
  if (item.id === "designKnife") return ["ゲート処理", "精密加工"];
  if (item.id === "spongeSander") return ["曲面", "仕上げ"];
  if (item.id === "pinVise") return ["開口", "改造"];
  if (item.id === "tweezers") return ["細部工作", "塗装補助"];
  return ({ cutting: ["切り出し"], shaping: ["表面処理", "仕上げ"], support: ["補助", "改造"], painting: [item.category || "塗装"] }[slot] || [item.category || "工具"]);
}

function getEffectiveSkillWithCandidate(type, slot, candidate) {
  const key = type === "paint" ? "paintBonus" : "buildBonus";
  const base = type === "paint" ? game.player.paintSkill : game.player.buildSkill;
  const bonus = Object.entries(game.player.equipment || {}).reduce((total, [entrySlot, id]) => {
    const item = entrySlot === slot ? candidate : getItem(id);
    return total + (item?.[key] || 0);
  }, 0);
  return base + bonus;
}

function renderEquipmentModal() {
  if (!equipmentModal || equipmentModal.hidden) return;
  const current = getItem(game.player.equipment?.[selectedEquipmentSlot]);
  const owned = game.player.tools.map(getItem).filter((item) => item?.slot === selectedEquipmentSlot);
  const tabs = document.querySelector("#equipment-slot-tabs");
  tabs.innerHTML = Object.entries(TOOL_SLOTS).map(([slot, label]) => {
    const item = getItem(game.player.equipment?.[slot]);
    return `<button type="button" class="${slot === selectedEquipmentSlot ? "active" : ""}" data-equipment-slot="${slot}"><span>${label}</span><small>${item?.name || "未装備"}</small></button>`;
  }).join("");
  tabs.querySelectorAll("[data-equipment-slot]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedEquipmentSlot = button.dataset.equipmentSlot;
      renderEquipmentModal();
      playTone(420);
    });
  });

  document.querySelector("#equipment-summary").innerHTML = `
    <div><small>選択中の枠</small><strong>${TOOL_SLOTS[selectedEquipmentSlot]}</strong></div>
    <div><small>現在の装備</small><strong>${current?.name || "未装備"}</strong></div>
    <div><small>現在の実効スキル</small><strong>工作 ${getEffectiveSkill("build").toFixed(1)} / 塗装 ${getEffectiveSkill("paint").toFixed(1)}</strong></div>
  `;

  const candidates = document.querySelector("#equipment-candidates");
  candidates.innerHTML = owned.length ? owned.map((item) => {
    const required = getRequiredLevel(item);
    const locked = game.player.level < required;
    const equipped = current?.id === item.id;
    const nextBuild = getEffectiveSkillWithCandidate("build", selectedEquipmentSlot, item);
    const nextPaint = getEffectiveSkillWithCandidate("paint", selectedEquipmentSlot, item);
    return `
      <article class="equipment-candidate ${equipped ? "equipped" : ""} ${locked ? "locked" : ""}">
        <div class="equipment-candidate-head"><span class="tool-pixel">${item.short}</span><div><small>${item.category}</small><h3>${item.name}</h3></div></div>
        <div class="equipment-use-tags">${getToolUseTags(item).map((tag) => `<span>${tag}</span>`).join("")}</div>
        <p>${item.description}</p>
        <dl>
          <div><dt>進行</dt><dd><b>${item.speed >= 4 ? "大" : item.speed >= 2.5 ? "中" : "小"}</b></dd></div>
          <div><dt>品質</dt><dd><b>${item.quality >= 2.2 ? "大" : item.quality >= 1 ? "中" : "小"}</b></dd></div>
          <div><dt>リスク</dt><dd><b>${getRiskLabel(item.risk + 4)}</b></dd></div>
          <div><dt>実効スキル</dt><dd>工作 ${nextBuild.toFixed(1)} / 塗装 ${nextPaint.toFixed(1)}</dd></div>
        </dl>
        <button type="button" data-equip-item="${item.id}" ${locked || equipped ? "disabled" : ""}>${locked ? `Lv.${required}で装備可能` : equipped ? "装備中" : "この工具を装備"}</button>
      </article>`;
  }).join("") : `<p class="equipment-empty">この枠の工具はまだ持っていません。模型店で購入すると、ここに候補が増えます。</p>`;
  candidates.querySelectorAll("[data-equip-item]").forEach((button) => {
    button.addEventListener("click", () => equipTool(getItem(button.dataset.equipItem)));
  });

  const supplies = ITEMS.filter((item) => item.type === "supply" && supply(item.supplyKey) > 0);
  document.querySelector("#equipment-supply-list").textContent = supplies.length
    ? supplies.map((item) => `${item.name} ×${supply(item.supplyKey)}`).join(" ／ ")
    : "所持なし（紙やすり・接着剤・塗料は、必要な工程で自動的に候補へ出ます）";
}

function openEquipmentModal(preferredSlot = null) {
  const requestedSlot = typeof preferredSlot === "string" && TOOL_SLOTS[preferredSlot] ? preferredSlot : null;
  selectedEquipmentSlot = requestedSlot || Object.keys(TOOL_SLOTS).find((slot) => game.player.equipment?.[slot]) || "cutting";
  equipmentModal.hidden = false;
  document.body.classList.add("modal-open");
  renderEquipmentModal();
}

function closeEquipmentModal() {
  equipmentModal.hidden = true;
  if (modal.hidden) document.body.classList.remove("modal-open");
}

function equipTool(item) {
  if (!item?.slot || !owns(item.id) || game.player.level < getRequiredLevel(item)) return;
  game.player.equipment[item.slot] = item.id;
  addMessage(`${TOOL_SLOTS[item.slot]}に${item.name}を装備した。`);
  playEffect("upgrade");
  renderGame();
  renderEquipmentModal();
  saveGame();
}

function renderInventory() {
  const inventoryList = document.querySelector("#inventory-list");
  const entries = [];
  game.player.tools.forEach((id) => {
    const item = getItem(id);
    if (item) entries.push(`${item.name}［${item.category}］`);
  });
  ITEMS.filter((item) => item.type === "supply" && supply(item.supplyKey) > 0).forEach((item) => {
    entries.push(`${item.name} ×${supply(item.supplyKey)}`);
  });
  if (game.player.bookshelf?.length) entries.push(`読み返せる専門誌アーカイブ ×${game.player.bookshelf.length}`);
  inventoryList.innerHTML = entries.length
    ? entries.map((name) => `<li>${name}</li>`).join("")
    : '<li class="empty-item">まだ何も持っていない</li>';
}

function addMessage(text) {
  const day = game.contest ? clamp(getElapsedDays() + 1, 1, game.contest.totalDays) : 1;
  game.messages.unshift({ day, text });
  game.messages = game.messages.slice(0, 5);
}

function renderMessages() {
  const log = document.querySelector("#message-log");
  log.innerHTML = game.messages.map((message) => `
    <p><time>DAY ${String(message.day).padStart(2, "0")}</time>${message.text}</p>
  `).join("");
}

function updateActionButtons() {
  const project = game.contest.project;
  const stage = getWorkStage();
  const workSetup = getWorkSetup(stage);
  const elapsed = getElapsedDays();
  const workRate = getProjectRate("work", project);
  const paintRate = getProjectRate("paint", project);
  const paintingReady = workRate >= 60 &&
    elapsed >= project.dryReadyAt &&
    getPaintOptions().some((option) => !option.disabled && game.contest.energy >= (option.energy || 18));

  const actionMap = {
    build: workRate < 100 &&
      elapsed >= project.partsReadyAt &&
      Boolean(workSetup) &&
      game.contest.energy >= 17 &&
      !project.pendingAccident,
    paint: paintRate < 100 && paintingReady && game.contest.energy >= 18,
    readBuild: supply("magazine") > 0 || game.player.money >= 800,
    readPaint: supply("magazine") > 0 || game.player.money >= 800,
    watchBuild: true,
    watchPaint: true,
    shop: true,
    rest: true,
    customize: game.player.level >= 3 && workRate >= 55 && project.modification < getOptionalCap("modification") && game.contest.energy >= 20,
    weathering: hasTechnique("weathering") && paintRate >= 70 && project.weathering < getOptionalCap("weathering") && supply("weatheringSet") > 0 && game.contest.energy >= 18,
    diorama: game.player.level >= 2 && isProjectComplete() && game.contest.energy >= 22,
    polish: isProjectComplete() && project.quality < getProjectMaximum("quality", project) && game.contest.energy >= 20,
    submit: isContestEntryComplete()
  };

  // 上級行動は解禁されるまで隠し、序盤の選択肢を読みやすくします
  const visibilityMap = {
    customize: game.player.level >= 3,
    weathering: hasTechnique("weathering"),
    diorama: game.player.level >= 2,
    polish: isProjectComplete(),
    submit: isProjectComplete()
  };

  actionButtons.forEach((button) => {
    button.hidden = visibilityMap[button.dataset.action] === false;
    button.disabled = game.ended || game.contest.daysLeft <= 0 || !actionMap[button.dataset.action];
  });

  const buildHint = document.querySelector('[data-action="build"] small');
  if (workRate >= 100) buildHint.textContent = "工作完了";
  else if (elapsed < project.partsReadyAt) buildHint.textContent = `交換パーツ待ち あと${project.partsReadyAt - elapsed}日`;
  else if (!workSetup) buildHint.textContent = `必要工具を購入・装備：${stage.required}`;
  else if (game.contest.energy < 17) buildHint.textContent = "体力不足・休息が必要";
  else buildHint.textContent = `使用：${workSetup.tool.name}${workSetup.supports.length ? `＋${workSetup.supports.join("＋")}` : ""} / 4手`;

  const paintHint = document.querySelector('[data-action="paint"] small');
  if (paintRate >= 100) paintHint.textContent = "塗装完了";
  else if (workRate < 60) paintHint.textContent = "工作工数60%で解禁";
  else if (!hasPaintStock()) paintHint.textContent = "塗料切れ・買い物か学習へ";
  else if (elapsed < project.dryReadyAt) paintHint.textContent = `乾燥待ち あと${project.dryReadyAt - elapsed}日`;
  else if (game.contest.energy < 18) paintHint.textContent = "体力不足・休息が必要";
  else paintHint.textContent = "塗装道具を選び、4手で仕上げる";

  // 学習前に、今回覚えられる技法があるかを具体的に知らせます
  [
    ["build", "工作", "readBuild", "watchBuild"],
    ["paint", "塗装", "readPaint", "watchPaint"]
  ].forEach(([skillType, skillLabel, readAction, watchAction]) => {
    const learnable = getLearnableTechnique(skillType);
    const matchingTypes = getMatchingTechniqueTypes(skillType);
    const next = TECHNIQUES.find((technique) => matchingTypes.includes(technique.type) && !hasTechnique(technique.id));
    const resultText = learnable ? `習得候補あり` : next ? `次技法 Lv.${next.level}` : "全技法習得済み";
    const videoViews = game.player.videoStudy?.month === game.player.month ? (game.player.videoStudy?.[skillType] || 0) : 0;
    const videoEffect = videoViews < 3 ? "通常効果" : "連続視聴で効果低下";
    document.querySelector(`[data-action="${readAction}"] small`).textContent = `${supply("magazine") > 0 ? `専門誌 残り${supply("magazine")}` : "¥800"} / 大幅UP・技法を選択 / 次回準備+20% / ${resultText}`;
    document.querySelector(`[data-action="${watchAction}"] small`).textContent = `無料 / 今月${videoViews}回 / ${videoEffect} / ${resultText}`;
  });

  const customizeHint = document.querySelector('[data-action="customize"] small');
  if (game.player.level < 3) customizeHint.textContent = "モデラーLv.3で解禁";
  else if (workRate < 55) customizeHint.textContent = "工作工数55%で解禁";
  else customizeHint.textContent = `改造 ${Math.round(project.modification)} / ${getOptionalCap("modification")}・素材を選択`;

  const weatheringHint = document.querySelector('[data-action="weathering"] small');
  if (!hasTechnique("weathering")) weatheringHint.textContent = "モデラーLv.4で解禁";
  else if (paintRate < 70) weatheringHint.textContent = "塗装工数70%で解禁";
  else if (supply("weatheringSet") <= 0) weatheringHint.textContent = "ウェザリング塗料が必要";
  else weatheringHint.textContent = `表現 ${Math.round(project.weathering)} / ${getOptionalCap("weathering")}`;

  const dioramaHint = document.querySelector('[data-action="diorama"] small');
  if (game.player.level < 2) dioramaHint.textContent = "モデラーLv.2で解禁";
  else if (!isProjectComplete()) dioramaHint.textContent = "車両完成後に制作可能";
  else if (!getDioramaType(project)) dioramaHint.textContent = "情景の規模を選んで制作開始";
  else dioramaHint.textContent = `情景工数 ${Math.round(project.dioramaProgress)} / ${getDioramaType(project).workMax}`;

  const polishHint = document.querySelector('[data-action="polish"] small');
  const polishTitle = document.querySelector('[data-action="polish"] strong');
  const remainingReviews = getUnresolvedReviewTasks(project).length;
  polishTitle.textContent = remainingReviews ? "審査課題を再仕上げ" : "出品前の最終仕上げ";
  polishHint.textContent = remainingReviews
    ? `4手 / 体力-20 / 未改善の審査課題 ${remainingReviews}件`
    : `4手 / 体力-20 / 繰り返すほど基本効果は低下`;

  const submitHint = document.querySelector('[data-action="submit"] small');
  if (isProjectComplete() && !isPaintDry(project)) submitHint.textContent = `塗膜の乾燥完了まであと${project.dryReadyAt - elapsed}日`;
  else if (getContestCategory().id === "diorama" && !isDioramaComplete()) submitHint.textContent = "情景工数を完成させると出品可能";
  else submitHint.textContent = `${getContestCategory().name}へ出品する`;
}

/* =========================================================
   共通ダイアログ
   ========================================================= */

function openModal({ kicker, title, description, options, closable = true, accident = false, critical = false, session = null }) {
  modalCanClose = closable;
  document.querySelector("#modal-kicker").textContent = kicker;
  document.querySelector("#modal-title").textContent = title;
  document.querySelector("#modal-description").textContent = description;
  document.querySelector("#modal-close-button").disabled = !closable;
  document.querySelector(".modal-card").classList.toggle("accident-card", accident);
  document.querySelector(".modal-card").classList.toggle("critical-card", critical);

  const sessionHud = document.querySelector("#craft-session-hud");
  sessionHud.hidden = !session;
  if (session) {
    document.querySelector("#session-turns").textContent = session.turns;
    document.querySelector("#session-focus").textContent = `${Math.round(session.focus)} / ${session.maxFocus}`;
    document.querySelector("#session-integrity").textContent = `${Math.round(session.integrity)} / ${session.maxIntegrity}`;
    const conditionLabel = document.querySelector("#session-condition");
    conditionLabel.textContent = session.condition.name;
    conditionLabel.className = session.condition.className;
    const preparedLabel = document.querySelector("#session-prepared");
    preparedLabel.textContent = session.prepared ? session.preparedText : "なし";
    preparedLabel.className = session.prepared ? "active" : "";
  }

  modalOptions.innerHTML = "";
  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "modal-option";
    button.disabled = Boolean(option.disabled);
    const metaParts = String(option.meta || "").split(" / ").filter(Boolean);
    button.innerHTML = `
      <strong>${option.label}</strong>
      <span class="modal-meta">${metaParts.map((part) => `<em>${part}</em>`).join("")}</span>
      <small>${option.detail || ""}</small>
    `;
    button.addEventListener("click", option.action);
    modalOptions.appendChild(button);
  });

  modal.hidden = false;
  document.body.classList.add("modal-open");
  window.setTimeout(() => modalOptions.querySelector("button:not(:disabled)")?.focus(), 20);
}

function closeModal(force = false) {
  if (!modalCanClose && !force) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  document.querySelector(".modal-card").classList.remove("accident-card");
  document.querySelector(".modal-card").classList.remove("critical-card");
  document.querySelector("#craft-session-hud").hidden = true;
}

/* =========================================================
   Canvasで描くドット絵戦車
   外部画像を使わず、キットごとに輪郭と工程を変えます
   ========================================================= */

const TANK_BASE_WIDTH = 192;
const TANK_BASE_HEIGHT = 128;
const TANK_HIRES_WIDTH = 384;
const TANK_HIRES_HEIGHT = 256;

/*
  旧来の192×128ドット絵を輪郭の土台として使い、その上へ
  384×256専用の1ドット細部を重ねます。総画素数はちょうど4倍です。
*/
function drawTank(canvas, kit, workProgress, paintProgress, extras = {}) {
  if (!canvas || !kit) return;

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 土台用キャンバスは画面へ追加せず、メモリ上だけで使います
  const baseCanvas = document.createElement("canvas");
  baseCanvas.width = TANK_BASE_WIDTH;
  baseCanvas.height = TANK_BASE_HEIGHT;
  drawTankBase(baseCanvas, kit, workProgress, paintProgress, extras);

  // 補間を切って整数倍に拡大し、ドットの輪郭を保ちます
  ctx.drawImage(baseCanvas, 0, 0, canvas.width, canvas.height);
  drawTankHighResolutionDetails(ctx, canvas, kit, workProgress, paintProgress, extras);
}

/* キットごとの車体寸法を一か所で求め、細部の位置ずれを防ぎます */
function getTankGeometry(kit) {
  const geometry = {
    bodyX: 28,
    bodyY: 66,
    bodyW: 137,
    bodyH: 28,
    turretX: 70,
    turretY: 43,
    turretW: 58,
    turretH: 27,
    wheelCount: 6,
    gunLength: 52
  };

  if (kit.sprite === "light") {
    Object.assign(geometry, { bodyX: 38, bodyW: 116, turretX: 78, turretW: 43 });
  } else if (kit.sprite === "heavy") {
    Object.assign(geometry, { bodyX: 20, bodyW: 152, bodyH: 31, turretX: 62, turretW: 72, turretH: 30, wheelCount: 7 });
  } else if (kit.sprite === "modern") {
    Object.assign(geometry, { bodyX: 19, bodyW: 154, turretX: 60, turretY: 46, turretW: 76, turretH: 22, gunLength: 60 });
  } else if (kit.sprite === "destroyer") {
    Object.assign(geometry, { bodyX: 24, bodyW: 146, turretX: 50, turretY: 48, turretW: 78, turretH: 21, gunLength: 67 });
  } else if (kit.sprite === "open") {
    Object.assign(geometry, { bodyX: 23, bodyW: 147, turretX: 61, turretY: 49, turretW: 62, turretH: 18 });
  } else if (kit.sprite === "salvage") {
    Object.assign(geometry, { bodyX: 31, bodyW: 132, turretX: 75, turretW: 48 });
  }

  return geometry;
}

/* 384×256だから描ける、転輪・ボルト・継ぎ目などの追加レイヤー */
function drawTankHighResolutionDetails(ctx, canvas, kit, workProgress, paintProgress, extras) {
  const scaleX = canvas.width / TANK_HIRES_WIDTH;
  const scaleY = canvas.height / TANK_HIRES_HEIGHT;
  const ink = "#243333";
  const metal = paintProgress > 15 ? kit.color : "#64706a";
  const light = paintProgress > 55 ? kit.accent : "#9aa19a";
  const dark = shadeColor(metal, -34);
  const highlight = shadeColor(metal, 32);

  ctx.save();
  ctx.scale(scaleX, scaleY);
  ctx.imageSmoothingEnabled = false;

  // 作業マットへ1ドットの繊維と目盛りを追加します
  ctx.fillStyle = "rgba(255,255,255,.22)";
  for (let x = 15; x < 374; x += 32) {
    for (let y = 15; y < 222; y += 32) ctx.fillRect(x, y, 1, 1);
  }
  ctx.fillStyle = "rgba(36,51,51,.35)";
  for (let x = 18; x < 368; x += 24) ctx.fillRect(x, 229, 10, 1);

  // ニッパーや塗料瓶にも刃先・ラベル・キャップの細部を足します
  if (paintProgress <= 0) {
    ctx.fillStyle = "#f1b58e";
    ctx.fillRect(17, 42, 2, 39);
    ctx.fillRect(25, 94, 13, 2);
    ctx.fillStyle = "#101d1c";
    ctx.fillRect(34, 35, 2, 48);
  } else {
    [20, 46, 72].forEach((x, index) => {
      ctx.fillStyle = "#d8d2ba";
      ctx.fillRect(x, 188, 8, 1);
      ctx.fillStyle = index === 0 ? "#e8b0a5" : index === 1 ? "#a9cad6" : "#efda94";
      ctx.fillRect(x + 2, 192, 4, 13);
      ctx.fillStyle = ink;
      ctx.fillRect(x, 180, 8, 3);
    });
  }

  // ジオラマには細い草、砂粒、木目を追加します
  if ((extras.diorama || 0) > 0) {
    ctx.fillStyle = "#c4a56e";
    for (let x = 45; x < 346; x += 17) {
      ctx.fillRect(x, 197 + (x % 5), 2, 1);
      ctx.fillRect(x + 7, 211 - (x % 7), 1, 1);
    }
    ctx.fillStyle = "#526d49";
    for (let x = 56; x < 336; x += 37) {
      const height = 8 + (x % 9);
      ctx.fillRect(x, 184 - height, 1, height);
      ctx.fillRect(x + 1, 178 - Math.floor(height / 2), 1, Math.floor(height / 2) + 5);
    }
    if ((extras.diorama || 0) > 70) {
      ctx.fillStyle = "#776245";
      for (let y = 159; y < 181; y += 5) ctx.fillRect(284, y, 42, 1);
      ctx.fillStyle = "#d3c69f";
      ctx.fillRect(291, 153, 16, 2);
    }
  }

  // ランナー状態にもパーツの縁、接続ピン、番号板を描き込みます
  if (workProgress < 25) {
    ctx.fillStyle = "#b5bdb7";
    for (let x = 78; x < 145; x += 12) ctx.fillRect(x, 66, 1, 25);
    for (let x = 218; x < 294; x += 14) ctx.fillRect(x, 58, 1, 32);
    ctx.fillStyle = ink;
    [[72,62],[142,62],[212,54],[294,54],[100,134],[240,134],[262,132],[304,132]].forEach(([x, y]) => {
      ctx.fillRect(x, y, 3, 3);
      ctx.fillRect(x + 1, y + 1, 1, 1);
    });
    ctx.fillStyle = "#e6e0c9";
    ctx.fillRect(48, 39, 11, 6);
    ctx.fillRect(322, 197, 11, 6);
    ctx.restore();
    return;
  }

  const geometry = getTankGeometry(kit);
  const bodyX = geometry.bodyX * 2;
  const bodyY = geometry.bodyY * 2;
  const bodyW = geometry.bodyW * 2;
  const bodyH = geometry.bodyH * 2;
  const turretX = geometry.turretX * 2;
  const turretY = geometry.turretY * 2;
  const turretW = geometry.turretW * 2;
  const turretH = geometry.turretH * 2;
  const trackX = (geometry.bodyX - 4) * 2;
  const trackY = (geometry.bodyY + 19) * 2;

  // 履帯の一枚ずつの継ぎ目と滑り止めを1～2ドットで描きます
  ctx.fillStyle = "#172423";
  for (let x = trackX + 4; x < trackX + (geometry.bodyW + 8) * 2 - 4; x += 9) {
    ctx.fillRect(x, trackY + 3, 1, 42);
    ctx.fillRect(x + 2, trackY, 5, 2);
    ctx.fillRect(x + 2, trackY + 46, 5, 2);
  }

  // 転輪のリム、ハブ、ハイライトを追加します
  const wheelGap = Math.floor((geometry.bodyW - 14) / geometry.wheelCount);
  for (let index = 0; index < geometry.wheelCount; index += 1) {
    const wx = (geometry.bodyX + 7 + index * wheelGap) * 2;
    const wy = (geometry.bodyY + 26) * 2;
    ctx.fillStyle = highlight;
    ctx.fillRect(wx + 2, wy + 2, 16, 1);
    ctx.fillRect(wx + 2, wy + 3, 1, 14);
    ctx.fillStyle = dark;
    ctx.fillRect(wx + 18, wy + 4, 1, 14);
    ctx.fillRect(wx + 4, wy + 18, 14, 1);
    ctx.fillStyle = "#111c1b";
    ctx.fillRect(wx + 9, wy + 9, 4, 4);
    ctx.fillStyle = light;
    ctx.fillRect(wx + 10, wy + 10, 1, 1);
  }

  // 車体の装甲継ぎ目、溶接跡、ボルト、前照灯です
  ctx.fillStyle = dark;
  ctx.fillRect(bodyX + 7, bodyY + 21, bodyW - 14, 1);
  ctx.fillRect(bodyX + Math.floor(bodyW * .67), bodyY + 3, 1, Math.max(13, bodyH - 16));
  for (let x = bodyX + 13; x < bodyX + bodyW - 12; x += 23) {
    ctx.fillRect(x, bodyY + 4, 2, 2);
    ctx.fillRect(x + 1, bodyY + bodyH - 10, 1, 1);
  }
  ctx.fillStyle = "#d9d29f";
  ctx.fillRect(bodyX + 13, bodyY + 12, 5, 4);
  ctx.fillRect(bodyX + bodyW - 19, bodyY + 12, 5, 4);
  ctx.fillStyle = "#f2e6aa";
  ctx.fillRect(bodyX + 14, bodyY + 12, 2, 1);
  ctx.fillRect(bodyX + bodyW - 18, bodyY + 12, 2, 1);

  // 車体後部のエンジングリルは工作が進むと見えるようになります
  if (workProgress >= 45) {
    ctx.fillStyle = "rgba(20,31,30,.72)";
    for (let x = bodyX + bodyW - 66; x < bodyX + bodyW - 25; x += 5) {
      ctx.fillRect(x, bodyY + 8, 2, 11);
    }
    ctx.fillStyle = highlight;
    ctx.fillRect(bodyX + bodyW - 68, bodyY + 6, 46, 1);
  }

  if (workProgress < 55) {
    ctx.restore();
    return;
  }

  // 砲塔のハッチ、照準器、装甲板の継ぎ目です
  ctx.fillStyle = dark;
  ctx.fillRect(turretX + 5, turretY + turretH - 9, turretW - 10, 1);
  ctx.fillRect(turretX + Math.floor(turretW * .58), turretY + 4, 1, turretH - 13);
  ctx.fillStyle = highlight;
  ctx.fillRect(turretX + 14, turretY + 8, 27, 1);
  ctx.fillStyle = ink;
  ctx.fillRect(turretX + 23, turretY - 8, 28, 2);
  ctx.fillRect(turretX + 27, turretY - 12, 20, 4);
  ctx.fillStyle = "#9bc3c0";
  ctx.fillRect(turretX + 34, turretY + 4, 5, 2);

  // 砲口の穴と砲身の上下ハイライトです
  const muzzleX = (geometry.turretX + geometry.turretW + geometry.gunLength - 5) * 2;
  const gunY = (geometry.turretY + 7) * 2;
  ctx.fillStyle = highlight;
  ctx.fillRect(turretX + turretW, gunY + 8, geometry.gunLength * 2 - 8, 1);
  ctx.fillStyle = "#0d1716";
  ctx.fillRect(muzzleX + 11, gunY + 7, 3, 8);
  ctx.fillStyle = "#60706b";
  ctx.fillRect(muzzleX + 10, gunY + 6, 1, 10);

  // 車種固有の情報量を増やし、箱を変えた時の見た目も変えます
  if (kit.sprite === "open") {
    ctx.fillStyle = "#202b29";
    ctx.fillRect(turretX + 20, turretY + 3, turretW - 40, 13);
    ctx.fillStyle = "#bc8d57";
    for (let x = turretX + 26; x < turretX + turretW - 23; x += 9) ctx.fillRect(x, turretY + 6, 4, 8);
  } else if (kit.sprite === "modern") {
    ctx.fillStyle = dark;
    for (let x = turretX + 18; x < turretX + 62; x += 12) ctx.fillRect(x, turretY - 7, 7, 5);
    ctx.fillRect(bodyX + 5, bodyY + bodyH + 1, bodyW - 10, 3);
  } else if (kit.sprite === "heavy") {
    ctx.fillStyle = highlight;
    for (let x = turretX + 8; x < turretX + turretW - 8; x += 13) ctx.fillRect(x, turretY + turretH - 5, 2, 2);
  } else if (kit.sprite === "destroyer") {
    ctx.fillStyle = dark;
    ctx.fillRect(turretX + 8, turretY + 7, turretW - 16, 1);
    ctx.fillRect(turretX + 17, turretY - 6, 31, 4);
  } else if (kit.sprite === "salvage") {
    ctx.fillStyle = "#a46e4a";
    ctx.fillRect(bodyX + 49, bodyY + 3, 37, 2);
    ctx.fillRect(turretX + 9, turretY + 18, 18, 2);
  }

  // 塗装が進むと細い迷彩境界と部隊マーキングが現れます
  if (paintProgress > 35) {
    const camo = shadeColor(kit.color, -22);
    ctx.fillStyle = camo;
    [[34,7,21,3],[58,13,14,2],[88,5,25,3],[119,16,17,2]].forEach(([x, y, w, h]) => {
      const px = bodyX + (x * 2) % Math.max(40, bodyW - 35);
      ctx.fillRect(px, bodyY + y, w, h);
      ctx.fillRect(px + 5, bodyY + y + h, Math.max(4, w - 9), 1);
    });
    ctx.fillRect(turretX + 53, turretY + 11, 29, 3);
    ctx.fillRect(turretX + 63, turretY + 14, 13, 2);
  }
  if (paintProgress > 75) {
    ctx.fillStyle = "#f2ead2";
    ctx.fillRect(turretX + 10, turretY + 24, 12, 2);
    ctx.fillRect(turretX + 15, turretY + 19, 2, 12);
    ctx.fillRect(turretX + 25, turretY + 20, 2, 10);
    ctx.fillStyle = "#a04439";
    ctx.fillRect(bodyX + bodyW - 26, bodyY + 27, 9, 2);
    ctx.fillRect(bodyX + bodyW - 23, bodyY + 24, 3, 8);
  }

  // 改造の進行に応じてアンテナ線、固定ベルト、金網を細密化します
  if ((extras.modification || 0) > 15) {
    ctx.fillStyle = "#101a19";
    ctx.fillRect(turretX + 17, turretY - 37, 1, 35);
    ctx.fillStyle = "#c2a775";
    ctx.fillRect(bodyX + 37, bodyY - 8, 39, 1);
    for (let x = bodyX + 42; x < bodyX + 73; x += 10) ctx.fillRect(x, bodyY - 11, 2, 7);
  }
  if ((extras.modification || 0) > 45) {
    ctx.fillStyle = "#182625";
    for (let x = bodyX + 94; x < bodyX + 123; x += 5) {
      ctx.fillRect(x, bodyY + bodyH - 6, 1, 15);
    }
  }
  if ((extras.modification || 0) > 75) {
    ctx.fillStyle = "#ded3ad";
    for (let y = turretY + 7; y < turretY + 36; y += 5) ctx.fillRect(turretX - 19, y, 12, 1);
    for (let x = turretX - 18; x < turretX - 7; x += 4) ctx.fillRect(x, turretY + 6, 1, 31);
  }

  // ウェザリングは1ドットの擦り傷と泥跳ねとして重ねます
  if ((extras.weathering || 0) > 0) {
    const wear = extras.weathering || 0;
    const spots = Math.min(31, 7 + Math.floor(wear / 4));
    ctx.fillStyle = wear > 55 ? "#4c3829" : "#8b704e";
    for (let index = 0; index < spots; index += 1) {
      const sx = bodyX + 9 + (index * 37) % Math.max(25, bodyW - 20);
      const sy = bodyY + 8 + (index * 11) % Math.max(12, bodyH - 10);
      ctx.fillRect(sx, sy, index % 4 === 0 ? 4 : 2, 1);
      if (index % 5 === 0) ctx.fillRect(sx, trackY + 33 + (index % 9), 1, 5);
    }
    ctx.fillStyle = "#c4b99b";
    for (let index = 0; index < Math.floor(spots / 3); index += 1) {
      const sx = bodyX + 17 + (index * 43) % Math.max(20, bodyW - 30);
      ctx.fillRect(sx, bodyY + 3 + (index * 7) % 22, 3, 1);
    }
  }

  ctx.restore();
}

/* 既存の大きなシルエットを作る低解像度レイヤー */
function drawTankBase(canvas, kit, workProgress, paintProgress, extras = {}) {
  if (!canvas || !kit) return;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const ink = "#243333";
  const metal = paintProgress > 15 ? kit.color : "#64706a";
  const light = paintProgress > 55 ? kit.accent : "#9aa19a";
  const dark = shadeColor(metal, -28);
  const ghost = "#87918a";

  // 作業マットのドット
  ctx.fillStyle = "rgba(255,255,255,.12)";
  for (let x = 8; x < 192; x += 16) {
    for (let y = 8; y < 128; y += 16) ctx.fillRect(x, y, 2, 2);
  }

  // 工程に応じて机の上の道具や塗料瓶が入れ替わります
  ctx.fillStyle = "#263b39";
  ctx.fillRect(5, 112, 182, 3);
  if (paintProgress <= 0) {
    ctx.fillStyle = "#d07142";
    ctx.fillRect(8, 20, 4, 34);
    ctx.fillRect(12, 49, 10, 4);
    ctx.fillStyle = "#263b39";
    ctx.fillRect(15, 17, 7, 27);
  } else {
    ["#b85245", "#6e94a5", "#d4b25f"].forEach((color, index) => {
      ctx.fillStyle = "#263b39";
      ctx.fillRect(8 + index * 13, 88, 10, 17);
      ctx.fillStyle = color;
      ctx.fillRect(10 + index * 13, 92, 6, 11);
    });
  }

  if ((extras.diorama || 0) > 0) {
    ctx.fillStyle = "#6f5940";
    ctx.fillRect(18, 96, 160, 19);
    ctx.fillStyle = "#9a7a4d";
    ctx.fillRect(22, 92, 152, 18);
    ctx.fillStyle = "#6f8256";
    for (let x = 28; x < 168; x += 19) {
      const height = 3 + (x % 5);
      ctx.fillRect(x, 91 - height, 2, height + 2);
      if ((extras.diorama || 0) > 45) ctx.fillRect(x + 3, 89 - height, 2, height + 4);
    }
    if ((extras.diorama || 0) > 70) {
      ctx.fillStyle = "#4e5551";
      ctx.fillRect(140, 79, 22, 12);
      ctx.fillStyle = "#c0b28d";
      ctx.fillRect(144, 75, 10, 6);
    }
  }

  if (workProgress < 25) {
    ctx.fillStyle = ink;
    ctx.fillRect(22, 18, 3, 88);
    ctx.fillRect(166, 18, 3, 88);
    ctx.fillRect(22, 18, 147, 3);
    ctx.fillRect(22, 103, 147, 3);
    ctx.fillStyle = ghost;
    ctx.fillRect(38, 34, 35, 13);
    ctx.fillRect(108, 30, 40, 17);
    ctx.fillRect(52, 70, 68, 16);
    ctx.fillRect(132, 69, 18, 28);
    ctx.fillStyle = light;
    ctx.fillRect(77, 34, 5, 42);
    ctx.fillRect(92, 47, 49, 5);
    return;
  }

  let bodyX = 28;
  let bodyY = 66;
  let bodyW = 137;
  let bodyH = 28;
  let turretX = 70;
  let turretY = 43;
  let turretW = 58;
  let turretH = 27;

  if (kit.sprite === "light") {
    bodyX = 38; bodyW = 116; turretX = 78; turretW = 43;
  } else if (kit.sprite === "heavy") {
    bodyX = 20; bodyW = 152; bodyH = 31; turretX = 62; turretW = 72; turretH = 30;
  } else if (kit.sprite === "modern") {
    bodyX = 19; bodyW = 154; turretX = 60; turretY = 46; turretW = 76; turretH = 22;
  } else if (kit.sprite === "destroyer") {
    bodyX = 24; bodyW = 146; turretX = 50; turretY = 48; turretW = 78; turretH = 21;
  } else if (kit.sprite === "open") {
    bodyX = 23; bodyW = 147; turretX = 61; turretY = 49; turretW = 62; turretH = 18;
  } else if (kit.sprite === "salvage") {
    bodyX = 31; bodyW = 132; turretX = 75; turretW = 48;
  }

  // 履帯
  ctx.fillStyle = ink;
  ctx.fillRect(bodyX - 4, bodyY + 19, bodyW + 8, 24);
  ctx.fillStyle = "#46514e";
  ctx.fillRect(bodyX, bodyY + 23, bodyW, 16);
  ctx.fillStyle = light;
  const wheelCount = kit.sprite === "heavy" ? 7 : 6;
  const wheelGap = Math.floor((bodyW - 14) / wheelCount);
  for (let i = 0; i < wheelCount; i += 1) {
    const wx = bodyX + 7 + i * wheelGap;
    ctx.fillRect(wx, bodyY + 26, 11, 11);
    ctx.fillStyle = ink;
    ctx.fillRect(wx + 3, bodyY + 29, 5, 5);
    ctx.fillStyle = light;
  }

  // 車体
  ctx.fillStyle = ink;
  ctx.fillRect(bodyX - 3, bodyY - 3, bodyW + 6, bodyH + 6);
  ctx.fillStyle = metal;
  ctx.fillRect(bodyX, bodyY, bodyW, bodyH);
  ctx.fillStyle = dark;
  ctx.fillRect(bodyX + 5, bodyY + bodyH - 7, bodyW - 10, 7);
  ctx.fillStyle = light;
  ctx.fillRect(bodyX + 8, bodyY + 5, 22, 4);
  ctx.fillRect(bodyX + bodyW - 27, bodyY + 5, 18, 4);

  if (workProgress < 55) return;

  // 砲塔または戦闘室
  ctx.fillStyle = ink;
  ctx.fillRect(turretX - 3, turretY - 3, turretW + 6, turretH + 6);
  ctx.fillStyle = metal;
  ctx.fillRect(turretX, turretY, turretW, turretH);
  ctx.fillStyle = light;
  ctx.fillRect(turretX + 8, turretY + 4, 17, 4);

  if (kit.sprite === "open") {
    ctx.fillStyle = "#3a403e";
    ctx.fillRect(turretX + 7, turretY - 2, turretW - 14, 10);
    ctx.fillStyle = metal;
    ctx.fillRect(turretX + 3, turretY, 7, turretH);
    ctx.fillRect(turretX + turretW - 10, turretY, 7, turretH);
  }

  // 砲身
  const gunLength = kit.sprite === "destroyer" ? 67 : kit.sprite === "modern" ? 60 : 52;
  ctx.fillStyle = ink;
  ctx.fillRect(turretX + turretW - 2, turretY + 9, gunLength, 7);
  ctx.fillStyle = metal;
  ctx.fillRect(turretX + turretW, turretY + 11, gunLength - 4, 3);
  ctx.fillStyle = ink;
  ctx.fillRect(turretX + turretW + gunLength - 5, turretY + 7, 7, 11);

  if (workProgress < 80 && !(extras.modification > 0)) return;

  // 細部。仕上がりが進むほど装備品が増える
  ctx.fillStyle = light;
  ctx.fillRect(turretX + 10, turretY - 8, 18, 8);
  ctx.fillStyle = ink;
  ctx.fillRect(turretX + 13, turretY - 6, 12, 4);
  ctx.fillRect(bodyX + 12, bodyY - 8, 3, 11);
  ctx.fillRect(bodyX + bodyW - 18, bodyY - 7, 12, 4);

  if (paintProgress > 35) {
    ctx.fillStyle = kit.accent;
    ctx.fillRect(bodyX + 34, bodyY + 4, 18, 5);
    ctx.fillRect(turretX + turretW - 22, turretY + 5, 13, 5);
  }
  if (paintProgress > 75) {
    ctx.fillStyle = "#e8dfc7";
    ctx.fillRect(turretX + 5, turretY + 12, 6, 6);
    ctx.fillStyle = "#9a4d3f";
    ctx.fillRect(bodyX + bodyW - 13, bodyY + 13, 6, 6);
  }

  // 改造度に応じてアンテナ、増加装甲、車外装備を追加します
  if ((extras.modification || 0) > 15) {
    ctx.fillStyle = ink;
    ctx.fillRect(turretX + 8, turretY - 18, 2, 18);
    ctx.fillRect(bodyX + 18, bodyY - 5, 20, 3);
  }
  if ((extras.modification || 0) > 45) {
    ctx.fillStyle = kit.accent;
    ctx.fillRect(bodyX + 44, bodyY + bodyH - 4, 18, 9);
    ctx.fillStyle = ink;
    ctx.fillRect(bodyX + 47, bodyY + bodyH - 2, 3, 5);
    ctx.fillRect(bodyX + 55, bodyY + bodyH - 2, 3, 5);
  }
  if ((extras.modification || 0) > 75) {
    ctx.fillStyle = "#c4b787";
    ctx.fillRect(turretX - 9, turretY + 2, 7, 18);
    ctx.fillStyle = ink;
    ctx.fillRect(turretX - 11, turretY, 11, 3);
  }

  // ウェザリングは輪郭に細かな泥・塗装剥がれを重ねます
  if ((extras.weathering || 0) > 0) {
    ctx.fillStyle = (extras.weathering || 0) > 55 ? "#5d4431" : "#846b48";
    const spots = Math.min(13, 3 + Math.floor((extras.weathering || 0) / 8));
    for (let index = 0; index < spots; index += 1) {
      const sx = bodyX + 7 + (index * 23) % Math.max(24, bodyW - 12);
      const sy = bodyY + 7 + (index * 7) % Math.max(8, bodyH - 8);
      ctx.fillRect(sx, sy, index % 3 === 0 ? 5 : 3, 2);
    }
  }
}

function shadeColor(hex, amount) {
  const clean = hex.replace("#", "");
  const number = Number.parseInt(clean, 16);
  const r = clamp((number >> 16) + amount, 0, 255);
  const g = clamp(((number >> 8) & 0xff) + amount, 0, 255);
  const b = clamp((number & 0xff) + amount, 0, 255);
  return `rgb(${r}, ${g}, ${b})`;
}

/* =========================================================
   ボタンイベント
   ========================================================= */

const actions = {
  build: openWorkModal,
  paint: openPaintModal,
  readBuild: () => readMagazine("build"),
  readPaint: () => readMagazine("paint"),
  watchBuild: () => watchVideo("build"),
  watchPaint: () => watchVideo("paint"),
  shop: openShop,
  rest,
  customize: openCustomizationModal,
  weathering: openWeatheringModal,
  diorama: openDioramaModal,
  polish: polishWork,
  submit: confirmSubmit
};

document.querySelector("#start-button").addEventListener("click", startNewCareer);
document.querySelector("#continue-button").addEventListener("click", continueCareer);
document.querySelector("#equipment-button").addEventListener("click", openEquipmentModal);
document.querySelector("#carry-project-button").addEventListener("click", carryProjectToNextContest);
document.querySelector("#next-contest-button").addEventListener("click", goToNextContest);
document.querySelector("#checkout-button").addEventListener("click", checkoutCart);

document.querySelector("#restart-button").addEventListener("click", () => {
  clearSave();
  game = createEmptyGame();
  renderToolbelt();
  updateContinueButton();
  showScreen("title");
  playTone(520);
});

document.querySelector("#leave-shop-button").addEventListener("click", () => {
  shopCart.clear();
  showScreen("game");
  renderGame();
  playTone(360);
});

document.querySelector("#modal-close-button").addEventListener("click", () => closeModal());
document.querySelector(".modal-backdrop").addEventListener("click", () => closeModal());
document.querySelector("#equipment-close-button").addEventListener("click", closeEquipmentModal);
equipmentModal.querySelector(".modal-backdrop").addEventListener("click", closeEquipmentModal);

document.querySelector("#bgm-button").addEventListener("click", (event) => {
  ensureAudio();
  bgmEnabled = !bgmEnabled;
  event.currentTarget.textContent = bgmEnabled ? "BGM ON" : "BGM OFF";
  event.currentTarget.setAttribute("aria-pressed", String(bgmEnabled));
});

document.querySelector("#sfx-button").addEventListener("click", (event) => {
  ensureAudio();
  sfxEnabled = !sfxEnabled;
  event.currentTarget.textContent = sfxEnabled ? "SE ON" : "SE OFF";
  event.currentTarget.setAttribute("aria-pressed", String(sfxEnabled));
  if (sfxEnabled) playTone(620);
});

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = actions[button.dataset.action];
    if (action) action();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!equipmentModal.hidden) closeEquipmentModal();
  else if (!modal.hidden) closeModal();
});

/* ページを開いた直後は、保存済み工具だけ先に工具帯へ表示します */
document.querySelectorAll("[data-app-version]").forEach((element) => {
  element.textContent = `v${APP_VERSION}`;
});
if (loadGame()) {
  game.screen = "title";
}
renderToolbelt();
updateContinueButton();
