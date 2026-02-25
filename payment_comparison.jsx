import { useState } from "react";

const SOLUTIONS = ["WalletConnect Pay", "ERC-681 (OPK Rail A)", "OPK Closed-Loop", "Colossus Credit"];
const COLORS = {
  "WalletConnect Pay": { bg: "#1a1a2e", accent: "#6C63FF", light: "#8B85FF", dim: "#3d3a5c" },
  "ERC-681 (OPK Rail A)": { bg: "#1a2e1a", accent: "#22C55E", light: "#4ADE80", dim: "#2d4a2d" },
  "OPK Closed-Loop": { bg: "#1a2e2e", accent: "#06B6D4", light: "#22D3EE", dim: "#1e3a3a" },
  "Colossus Credit": { bg: "#2e1a1a", accent: "#F59E0B", light: "#FBBF24", dim: "#4a3520" },
};

const FRICTION_LEVELS = { "Very Low": 1, Low: 2, Medium: 3, High: 4, "Very High": 5, Extreme: 6, "N/A": 0 };
const FRICTION_COLORS = { 1: "#22C55E", 2: "#4ADE80", 3: "#FBBF24", 4: "#F97316", 5: "#EF4444", 6: "#991B1B", 0: "#555" };
const FRICTION_LABELS = {
  "Very Low": { zh: "极低", en: "Very Low" },
  Low: { zh: "低", en: "Low" },
  Medium: { zh: "中", en: "Medium" },
  High: { zh: "高", en: "High" },
  "Very High": { zh: "很高", en: "Very High" },
  Extreme: { zh: "极高", en: "Extreme" },
  "N/A": { zh: "不适用", en: "N/A" },
};

const LANGUAGE_OPTIONS = [
  { id: "zh", label: "中文" },
  { id: "en", label: "EN" },
];

const TABS = [
  { id: "overview", label: { zh: "总览", en: "Overview" } },
  { id: "friction", label: { zh: "采纳摩擦", en: "Adoption Friction" } },
  { id: "wallet", label: { zh: "钱包 vs 卡", en: "Wallet vs Card" } },
  { id: "fees", label: { zh: "手续费迷思", en: "Fee Myth" } },
  { id: "verdict", label: { zh: "结论", en: "Verdict" } },
];

const STAKEHOLDERS = [
  { id: "cryptoUsers", label: { zh: "Crypto用户", en: "Crypto Users" } },
  { id: "generalUsers", label: { zh: "普通用户", en: "General Users" } },
  { id: "merchants", label: { zh: "商家", en: "Merchants" } },
  { id: "acquirers", label: { zh: "收单机构", en: "Acquirers" } },
];

const UI_COPY = {
  subtitle: { zh: "采纳摩擦分析 / OpenPasskey 内部", en: "Adoption Friction Analysis / OpenPasskey Internal" },
  overview: {
    radarTitle: { zh: "雷达图：各角色采纳摩擦", en: "RADAR: FRICTION BY STAKEHOLDER" },
    keyDependenciesTitle: { zh: "关键依赖链", en: "KEY DEPENDENCIES" },
    bottleneckLabel: { zh: "瓶颈", en: "Bottleneck" },
    universalBlockerTitle: { zh: "共性阻塞点", en: "UNIVERSAL BLOCKER" },
    universalBlockerHeadline: { zh: "法币 -> Stablecoin 入金", en: "Fiat -> Stablecoin On-ramp" },
    universalBlockerBody: {
      zh: "所有方案对普通用户的支付friction都很高。根本障碍相同：没有简单的法币入金通道，任何协议设计都无法绕过。OPK的loyalty funnel是唯一能先圈人再转化的路径。",
      en: "All options still have high payment friction for mainstream users. The root blocker is the same: no simple fiat on-ramp. No protocol design can bypass this. OPK's loyalty funnel is the only practical path to gather users first and convert later.",
    },
    radarFooter: { zh: "越大 = friction越高 = 越难", en: "Larger area = higher friction = harder adoption" },
  },
  friction: {
    titleSuffix: { zh: "采纳摩擦", en: "Adoption Friction" },
    detailFields: {
      onboarding: { zh: "Onboarding", en: "Onboarding" },
      existing: { zh: "已有资源", en: "Existing Resources" },
      action: { zh: "用户动作", en: "User Actions" },
      barrier: { zh: "障碍", en: "Barrier" },
    },
  },
  wallet: {
    title: { zh: "用户会用现有钱包支付吗?", en: "Will users pay with existing wallets?" },
    warning: {
      zh: "大部分crypto用户不会用主钱包去cafe买咖啡",
      en: "Most crypto users will not use their primary wallet to buy coffee",
    },
    comparisonTitle: { zh: "物理卡 vs App：详细对比", en: "Physical Card vs App: Detailed Comparison" },
    insightTitle: { zh: "Insight", en: "Insight" },
    insightBody: {
      zh: "Rail A (ERC-681/App) 和 Rail B (IIN Card) 不是竞争关系，而是targeting不同人群。Rail A for crypto-native，Rail B for everyone else。两者都结算到同一个链上钱包。",
      en: "Rail A (ERC-681/App) and Rail B (IIN Card) are not direct competitors. They target different cohorts: Rail A for crypto-native users, Rail B for everyone else. Both settle into the same onchain wallet.",
    },
  },
  fees: {
    headline: { zh: "\"省手续费\" 不是有效卖点", en: "\"Saving Fees\" Is Not an Effective Pitch" },
    summary: {
      zh: "一个cafe每天100笔交易，手续费约$10-16/天。不足以驱动商家换支付系统。",
      en: "A cafe with 100 daily transactions only saves around $10-16 per day in fees. That is not enough to trigger system migration.",
    },
    caresLabel: { zh: "在乎手续费?", en: "Cares About Fees?" },
    actualCareLabel: { zh: "实际更在乎", en: "Actually Cares About" },
    pitchTitle: { zh: "有效话术（不是“省手续费”）", en: "Effective Pitch (Not \"Save Fees\")" },
    footer: {
      zh: "省下的手续费应该用于：1) Fund rewards program（返给用户）2) Fund merchant incentives（补贴terminal部署）3) OPK margin。Visa没有靠“便宜”赢，它靠everywhere + rewards赢。",
      en: "Any fee savings should be reinvested into: 1) user rewards, 2) merchant incentives for terminal rollout, and 3) OPK margin. Visa did not win by being cheaper; it won with ubiquity and rewards.",
    },
  },
  verdict: {
    winnersTitle: { zh: "各维度谁更优?", en: "WHO WINS EACH DIMENSION?" },
    risksTitle: { zh: "真实风险", en: "HONEST RISKS" },
    opkRiskTitle: { zh: "OPK最大风险", en: "Largest OPK Risk" },
    opkRiskBody: {
      zh: "Terminal distribution是瓶颈。23家到2,300家需要资本和BD。WC Pay借Ingenico的40M terminals绕过了这个问题。",
      en: "Terminal distribution is the bottleneck. Scaling from 23 to 2,300 merchants requires capital and BD execution. WC Pay bypasses this via Ingenico's 40M terminal footprint.",
    },
    sharedRiskTitle: { zh: "所有方案共同风险", en: "Shared Risk Across All Solutions" },
    sharedRiskBody: {
      zh: "法币入金。没解决fiat -> stablecoin通道，所有方案对普通用户都是空中楼阁。",
      en: "Fiat on-ramp. Without solving fiat -> stablecoin conversion, every solution remains inaccessible to mainstream users.",
    },
    formulaTitle: { zh: "OPK战略公式", en: "OPK STRATEGIC FORMULA" },
    settlePrefix: { zh: "所有rails最终结算到 -> ", en: "All rails settle to -> " },
    settleValue: { zh: "同一个钱包、同一条链、同一份余额", en: "Same wallet, same chain, same balance" },
  },
};

const OVERVIEW_DEPENDENCIES = [
  {
    sol: "WalletConnect Pay",
    chain: { zh: "WC -> Ingenico -> Acquirer -> 商家", en: "WC -> Ingenico -> Acquirer -> Merchant" },
    bottleneck: { zh: "Acquirer激活 + 商家培训", en: "Acquirer activation + cashier training" },
    color: "#6C63FF",
  },
  {
    sol: "ERC-681 (OPK)",
    chain: { zh: "OPK -> 商家（直接）", en: "OPK -> Merchant (direct)" },
    bottleneck: { zh: "Terminal部署（一家一家）", en: "Terminal rollout (merchant by merchant)" },
    color: "#22C55E",
  },
  {
    sol: "OPK Closed-Loop",
    chain: { zh: "OPK -> 商家（直接）", en: "OPK -> Merchant (direct)" },
    bottleneck: { zh: "Terminal部署 + loyalty补偿", en: "Terminal rollout + loyalty subsidy" },
    color: "#06B6D4",
  },
  {
    sol: "Colossus",
    chain: { zh: "Colossus -> Acquirer -> 商家", en: "Colossus -> Acquirer -> Merchant" },
    bottleneck: { zh: "Acquirer签约（政治风险极高）", en: "Acquirer signing (very high political risk)" },
    color: "#F59E0B",
  },
];

const frictionData = {
  cryptoUsers: { "WalletConnect Pay": "Low", "ERC-681 (OPK Rail A)": "Low", "OPK Closed-Loop": "Medium", "Colossus Credit": "High" },
  generalUsers: { "WalletConnect Pay": "Very High", "ERC-681 (OPK Rail A)": "Very High", "OPK Closed-Loop": "High", "Colossus Credit": "High" },
  merchants: { "WalletConnect Pay": "Medium", "ERC-681 (OPK Rail A)": "High", "OPK Closed-Loop": "High", "Colossus Credit": "Very High" },
  acquirers: { "WalletConnect Pay": "N/A", "ERC-681 (OPK Rail A)": "N/A", "OPK Closed-Loop": "Medium", "Colossus Credit": "Extreme" },
};

const detailData = {
  zh: {
    cryptoUsers: {
      "WalletConnect Pay": { onboarding: "0步", existing: "700+钱包", action: "扫QR，选token/chain，确认", barrier: "QR scan慢（5-15s）", verdict: "零friction但UX慢" },
      "ERC-681 (OPK Rail A)": { onboarding: "0步", existing: "MetaMask、Coinbase等", action: "NFC tap或扫QR，确认", barrier: "钱包ERC-681解析不一致", verdict: "零friction，NFC比QR快" },
      "OPK Closed-Loop": { onboarding: "2-3步", existing: "需下载OPK App", action: "下载App，设置，tap", barrier: "需要新App", verdict: "有friction但loyalty补偿" },
      "Colossus Credit": { onboarding: "3-5步", existing: "需申请新卡", action: "申请卡，绑钱包，充值", barrier: "已有钱包为何还要卡?", verdict: "对crypto用户无吸引力" },
    },
    generalUsers: {
      "WalletConnect Pay": { onboarding: "5+步", existing: "需先有crypto钱包", action: "下载钱包，入金，扫QR", barrier: "法币 -> stablecoin入金", verdict: "致命：\"什么是钱包?\"" },
      "ERC-681 (OPK Rail A)": { onboarding: "5+步", existing: "需先有crypto钱包", action: "下载钱包，入金，tap/QR", barrier: "法币 -> stablecoin入金", verdict: "同上，但OPK App可优化" },
      "OPK Closed-Loop": { onboarding: "Loyalty: 1步 / Payment: 4步", existing: "Loyalty: 无门槛", action: "Loyalty: 1 tap领Pass", barrier: "Payment仍需入金", verdict: "唯一有loyalty funnel的方案" },
      "Colossus Credit": { onboarding: "3-5步", existing: "需申请卡", action: "申请卡，充值stablecoin", barrier: "法币 -> stablecoin入金", verdict: "卡形态降低心理门槛，但入金仍是障碍" },
    },
    merchants: {
      "WalletConnect Pay": { onboarding: "被动（Ingenico推送）", existing: "Ingenico 40M+终端", action: "终端软件更新", barrier: "需acquirer激活 + 培训收银员", verdict: "理论distribution大，实际last mile难" },
      "ERC-681 (OPK Rail A)": { onboarding: "主动部署OPK终端", existing: "23家OPK商户", action: "安装终端，培训", barrier: "需部署新硬件", verdict: "慢但可控，loyalty是甜头" },
      "OPK Closed-Loop": { onboarding: "同上", existing: "23家OPK商户", action: "同上", barrier: "同上", verdict: "loyalty已验证可行" },
      "Colossus Credit": { onboarding: "透明（acquirer处理）", existing: "0（需acquirer先签）", action: "无需商家操作", barrier: "acquirer不存在则无法开始", verdict: "对商家透明，但前提不存在" },
    },
    acquirers: {
      "WalletConnect Pay": { onboarding: "N/A", existing: "N/A", action: "N/A", barrier: "绕过acquirer", verdict: "不需要acquirer参与" },
      "ERC-681 (OPK Rail A)": { onboarding: "N/A", existing: "N/A", action: "N/A", barrier: "绕过acquirer", verdict: "closed-loop不需要acquirer" },
      "OPK Closed-Loop": { onboarding: "添加IIN routing", existing: "潜在：Tyro、Zeller、Windcave", action: "配置routing到OPK auth host", barrier: "增量业务，政治风险低", verdict: "增量不替代，可行" },
      "Colossus Credit": { onboarding: "添加BIN routing", existing: "0", action: "配置routing到Colossus", barrier: "得罪Visa/MC，极高政治风险", verdict: "没有acquirer会冒这个险" },
    },
  },
  en: {
    cryptoUsers: {
      "WalletConnect Pay": { onboarding: "0 steps", existing: "700+ wallets", action: "Scan QR, choose token/chain, confirm", barrier: "QR scan is slow (5-15s)", verdict: "Zero friction but slower UX" },
      "ERC-681 (OPK Rail A)": { onboarding: "0 steps", existing: "MetaMask, Coinbase, etc.", action: "NFC tap or scan QR, then confirm", barrier: "Inconsistent ERC-681 parsing across wallets", verdict: "Zero friction, NFC is faster than QR" },
      "OPK Closed-Loop": { onboarding: "2-3 steps", existing: "Requires OPK App download", action: "Install app, set up, tap", barrier: "Needs a new app", verdict: "Adds friction but loyalty can compensate" },
      "Colossus Credit": { onboarding: "3-5 steps", existing: "Requires new card application", action: "Apply card, link wallet, top up", barrier: "Why add a card if user already has a wallet?", verdict: "Unattractive for crypto-native users" },
    },
    generalUsers: {
      "WalletConnect Pay": { onboarding: "5+ steps", existing: "Requires a crypto wallet first", action: "Install wallet, top up, scan QR", barrier: "Fiat -> stablecoin on-ramp", verdict: "Fatal: \"What is a wallet?\"" },
      "ERC-681 (OPK Rail A)": { onboarding: "5+ steps", existing: "Requires a crypto wallet first", action: "Install wallet, top up, tap/scan QR", barrier: "Fiat -> stablecoin on-ramp", verdict: "Same issue, though OPK App can improve UX" },
      "OPK Closed-Loop": { onboarding: "Loyalty: 1 step / Payment: 4 steps", existing: "Loyalty: no barrier", action: "Loyalty: claim pass with 1 tap", barrier: "Payment still requires top-up", verdict: "Only option with a loyalty funnel" },
      "Colossus Credit": { onboarding: "3-5 steps", existing: "Requires card application", action: "Apply card, top up stablecoin", barrier: "Fiat -> stablecoin on-ramp", verdict: "Card format lowers mental barrier, but top-up remains" },
    },
    merchants: {
      "WalletConnect Pay": { onboarding: "Passive (Ingenico push)", existing: "Ingenico 40M+ terminals", action: "Terminal software update", barrier: "Needs acquirer activation + cashier training", verdict: "Huge theoretical distribution, difficult last mile" },
      "ERC-681 (OPK Rail A)": { onboarding: "Active OPK terminal rollout", existing: "23 OPK merchants", action: "Install terminal, train staff", barrier: "Requires new hardware deployment", verdict: "Slower but controllable; loyalty is the sweetener" },
      "OPK Closed-Loop": { onboarding: "Same as above", existing: "23 OPK merchants", action: "Same as above", barrier: "Same as above", verdict: "Loyalty viability already validated" },
      "Colossus Credit": { onboarding: "Transparent (handled by acquirer)", existing: "0 (acquirer contract needed first)", action: "No merchant operation needed", barrier: "If no acquirer, rollout cannot start", verdict: "Transparent to merchants, but prerequisite is missing" },
    },
    acquirers: {
      "WalletConnect Pay": { onboarding: "N/A", existing: "N/A", action: "N/A", barrier: "Bypasses acquirer", verdict: "No acquirer involvement needed" },
      "ERC-681 (OPK Rail A)": { onboarding: "N/A", existing: "N/A", action: "N/A", barrier: "Bypasses acquirer", verdict: "Closed-loop model does not need acquirer" },
      "OPK Closed-Loop": { onboarding: "Add IIN routing", existing: "Potential: Tyro, Zeller, Windcave", action: "Configure routing to OPK auth host", barrier: "Incremental business, low political risk", verdict: "Incremental not replacement, feasible" },
      "Colossus Credit": { onboarding: "Add BIN routing", existing: "0", action: "Configure routing to Colossus", barrier: "Conflicts with Visa/MC, very high political risk", verdict: "No acquirer will take this risk" },
    },
  },
};

const feeSavingsData = [
  {
    who: { zh: "商家", en: "Merchants" },
    cares: { zh: "弱", en: "Weak" },
    caresLevel: "weak",
    reason: { zh: "每天省$10-16，不值得换系统", en: "Only saves $10-16/day, not enough to switch systems" },
    realCare: { zh: "顾客流量 + loyalty", en: "Customer traffic + loyalty" },
  },
  {
    who: { zh: "收单机构", en: "Acquirers" },
    cares: { zh: "负面", en: "Negative" },
    caresLevel: "negative",
    reason: { zh: "手续费低 = acquirer赚更少", en: "Lower fees means less acquirer margin" },
    realCare: { zh: "增量revenue、新merchant", en: "Incremental revenue, new merchants" },
  },
  {
    who: { zh: "Crypto用户", en: "Crypto Users" },
    cares: { zh: "无感", en: "No" },
    caresLevel: "neutral",
    reason: { zh: "通常不直接承担商户手续费", en: "They typically do not directly pay merchant fees" },
    realCare: { zh: "用stablecoin支付 + rewards", en: "Pay with stablecoin + rewards" },
  },
  {
    who: { zh: "普通用户", en: "General Users" },
    cares: { zh: "无感", en: "No" },
    caresLevel: "neutral",
    reason: { zh: "多数人不知道手续费存在", en: "Most users do not even know fee structures exist" },
    realCare: { zh: "方便 + rewards", en: "Convenience + rewards" },
  },
];

const walletSecurityData = [
  {
    id: "mainWallet",
    method: { zh: "主钱包（MetaMask等）", en: "Primary Wallet (MetaMask etc.)" },
    background: "#1a0a0a",
    border: "#3a1a1a",
    metrics: [
      { key: "safety", value: { zh: "低", en: "Low" }, tone: "negative" },
      { key: "convenience", value: { zh: "低", en: "Low" }, tone: "negative" },
      { key: "likelihood", value: { zh: "不太可能", en: "Unlikely" }, tone: "negative" },
    ],
  },
  {
    id: "dedicatedApp",
    method: { zh: "专用支付App", en: "Dedicated Payment App" },
    background: "#0a0a1a",
    border: "#1a1a3a",
    metrics: [
      { key: "safety", value: { zh: "高", en: "High" }, tone: "warning" },
      { key: "convenience", value: { zh: "中", en: "Medium" }, tone: "warning" },
      { key: "likelihood", value: { zh: "Crypto用户可能", en: "Likely for crypto users" }, tone: "warning" },
    ],
  },
  {
    id: "physicalCard",
    method: { zh: "物理卡", en: "Physical Card" },
    background: "#0a1a0a",
    border: "#1a3a1a",
    metrics: [
      { key: "safety", value: { zh: "最高", en: "Highest" }, tone: "positive" },
      { key: "convenience", value: { zh: "最高", en: "Highest" }, tone: "positive" },
      { key: "likelihood", value: { zh: "最可能（所有人群）", en: "Most likely (all user groups)" }, tone: "positive" },
    ],
  },
];

const WALLET_METRIC_LABELS = {
  safety: { zh: "心理安全感", en: "Perceived Safety" },
  convenience: { zh: "操作便利", en: "Operational Convenience" },
  likelihood: { zh: "实际采用可能性", en: "Adoption Likelihood" },
};

const walletComparisonData = [
  {
    id: "physicalCard",
    title: { zh: "物理卡", en: "Physical Card" },
    titleColor: "#F59E0B",
    bestFor: { zh: "普通用户、所有人群", en: "Mainstream users, broad population" },
    bestForBg: "#1a1a0a",
    bestForColor: "#FBBF24",
    points: [
      { type: "pro", text: { zh: "人类理解卡（50年习惯）", en: "Cards are intuitive (50 years of habit)" } },
      { type: "pro", text: { zh: "不需要手机电量", en: "No phone battery dependency" } },
      { type: "pro", text: { zh: "不暴露屏幕，隐私更好", en: "No exposed screen, better privacy" } },
      { type: "pro", text: { zh: "可以交给他人代付", en: "Can be handed to someone else to pay" } },
      { type: "con", text: { zh: "需要等卡寄到", en: "Needs card issuance and shipping" } },
      { type: "con", text: { zh: "丢失后需要补卡", en: "Lost card requires re-issuance" } },
      { type: "con", text: { zh: "一张卡通常绑定一个钱包", en: "One card usually maps to one wallet" } },
    ],
  },
  {
    id: "dedicatedApp",
    title: { zh: "专用支付App", en: "Dedicated Payment App" },
    titleColor: "#22C55E",
    bestFor: { zh: "Crypto用户", en: "Crypto users" },
    bestForBg: "#0a1a0a",
    bestForColor: "#4ADE80",
    points: [
      { type: "pro", text: { zh: "立即可用，无需等待", en: "Instantly available, no shipping delay" } },
      { type: "pro", text: { zh: "可查看余额和历史", en: "Balance and history are visible" } },
      { type: "pro", text: { zh: "可集成loyalty", en: "Loyalty can be integrated natively" } },
      { type: "pro", text: { zh: "支持远程freeze", en: "Supports remote freeze control" } },
      { type: "pro", text: { zh: "兼容NFCSEP升级路径", en: "Works with NFCSEP upgrade path" } },
      { type: "con", text: { zh: "依赖手机电量", en: "Requires phone battery" } },
      { type: "con", text: { zh: "通常要先打开App（多一步）", en: "Usually needs opening app first (extra step)" } },
      { type: "con", text: { zh: "对非tech人群有门槛", en: "Has a barrier for non-technical users" } },
    ],
  },
];

const pitchData = [
  {
    to: { zh: "商家", en: "Merchants" },
    bad: { zh: "帮你省手续费", en: "We help you save processing fees" },
    good: { zh: "免费loyalty系统，让顾客回来更多次", en: "Free loyalty system that increases repeat visits" },
    color: "#F59E0B",
  },
  {
    to: { zh: "收单机构", en: "Acquirers" },
    bad: { zh: "替代Visa/MC，更低费率", en: "Replace Visa/MC with lower fees" },
    good: { zh: "新IIN、新merchant vertical、增量revenue", en: "New IIN, new merchant verticals, incremental revenue" },
    color: "#6C63FF",
  },
  {
    to: { zh: "Crypto用户", en: "Crypto Users" },
    bad: { zh: "省手续费", en: "Save fees" },
    good: { zh: "用stablecoin直接买咖啡，还赚积分", en: "Buy coffee directly with stablecoin and earn rewards" },
    color: "#22C55E",
  },
  {
    to: { zh: "普通用户", en: "General Users" },
    bad: { zh: "去中心化支付", en: "Decentralized payment rail" },
    good: { zh: "一张卡，tap就付，还有rewards", en: "One card, tap to pay, plus rewards" },
    color: "#06B6D4",
  },
];

const verdictData = [
  {
    dimension: { zh: "Crypto用户获取", en: "Crypto User Acquisition" },
    winner: { zh: "WC Pay = ERC-681", en: "WC Pay = ERC-681" },
    reason: { zh: "零onboarding、现有钱包即用", en: "Zero onboarding and existing wallet compatibility" },
  },
  {
    dimension: { zh: "普通用户获取", en: "General User Acquisition" },
    winner: { zh: "OPK", en: "OPK" },
    reason: { zh: "唯一拥有loyalty funnel", en: "Only solution with a loyalty funnel" },
  },
  {
    dimension: { zh: "商家获取（数量）", en: "Merchant Acquisition (Scale)" },
    winner: { zh: "WC Pay", en: "WC Pay" },
    reason: { zh: "依赖Ingenico分发网络", en: "Leverages Ingenico distribution footprint" },
  },
  {
    dimension: { zh: "商家获取（粘性）", en: "Merchant Retention (Stickiness)" },
    winner: { zh: "OPK", en: "OPK" },
    reason: { zh: "Loyalty + payment打包", en: "Loyalty + payment bundle" },
  },
  {
    dimension: { zh: "收单机构获取", en: "Acquirer Adoption" },
    winner: { zh: "OPK Rail B", en: "OPK Rail B" },
    reason: { zh: "增量不替代，政治风险低", en: "Incremental, not replacement, with lower political risk" },
  },
  {
    dimension: { zh: "端到端上线速度", en: "Fastest End-to-End Launch" },
    winner: { zh: "ERC-681 @ OPK", en: "ERC-681 @ OPK" },
    reason: { zh: "已有terminal + 既有用户路径", en: "Existing terminal footprint + existing user path" },
  },
];

const strategicPhases = [
  {
    phase: { zh: "Phase 1：圈人", en: "Phase 1: Audience Build" },
    desc: { zh: "Loyalty（VAS Pass）", en: "Loyalty (VAS Pass)" },
    detail: { zh: "零friction、1 tap、已验证（2,300人）", en: "Zero friction, 1 tap, already validated (2,300 users)" },
    color: "#06B6D4",
  },
  {
    phase: { zh: "Phase 2：转化（Crypto）", en: "Phase 2: Conversion (Crypto)" },
    desc: { zh: "Rail A（ERC-681）", en: "Rail A (ERC-681)" },
    detail: { zh: "开放标准、任何钱包、OPK App最优", en: "Open standard, wallet agnostic, best UX via OPK App" },
    color: "#22C55E",
  },
  {
    phase: { zh: "Phase 3：转化（大众）", en: "Phase 3: Conversion (Mainstream)" },
    desc: { zh: "Rail B（IIN Card）", en: "Rail B (IIN Card)" },
    detail: { zh: "卡tap、零crypto知识、Visa-like体验", en: "Card tap, zero crypto knowledge, Visa-like UX" },
    color: "#F59E0B",
  },
  {
    phase: { zh: "Phase 4：升级", en: "Phase 4: Upgrade" },
    desc: { zh: "NFCSEP（可选）", en: "NFCSEP (Optional)" },
    detail: { zh: "SE签名、Face ID、单tap支付", en: "SE signing, Face ID, single-tap payment" },
    color: "#6C63FF",
  },
];

const careColors = { negative: "#EF4444", weak: "#F97316", neutral: "#888" };
const toneColors = { positive: "#22C55E", warning: "#FBBF24", negative: "#EF4444" };

function copyText(value, lang) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] ?? value.zh ?? value.en ?? "";
}

function shortName(solution) {
  return solution.split(" (")[0];
}

function FrictionBar({ level, label, lang }) {
  const val = FRICTION_LEVELS[label];
  const color = FRICTION_COLORS[val];
  const width = val === 0 ? 8 : (val / 6) * 100;
  const localizedLevel = copyText(FRICTION_LABELS[label], lang) || label;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
      <div style={{ width: 120, fontSize: 11, color: "#aaa", textAlign: "right", flexShrink: 0 }}>{level}</div>
      <div style={{ flex: 1, background: "#1a1a1a", borderRadius: 4, height: 22, position: "relative", overflow: "hidden" }}>
        <div
          style={{
            width: `${width}%`,
            height: "100%",
            background: color,
            borderRadius: 4,
            transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: 8,
          }}
        >
          <span style={{ fontSize: 10, color: val > 3 ? "#fff" : "#111", fontWeight: 700 }}>{localizedLevel}</span>
        </div>
      </div>
    </div>
  );
}

function RadarChart({ data, solutions, dimensions, dimensionLabels, footerLabel }) {
  const cx = 160;
  const cy = 155;
  const radius = 110;
  const angleStep = (2 * Math.PI) / dimensions.length;
  const maxVal = 6;

  const getPoint = (dimensionIndex, val) => {
    const angle = angleStep * dimensionIndex - Math.PI / 2;
    const distance = (val / maxVal) * radius;
    return [cx + distance * Math.cos(angle), cy + distance * Math.sin(angle)];
  };

  const gridLevels = [1, 2, 3, 4, 5, 6];
  const solutionColors = ["#6C63FF", "#22C55E", "#06B6D4", "#F59E0B"];

  return (
    <svg viewBox="0 0 320 320" style={{ width: "100%", maxWidth: 360 }}>
      {gridLevels.map((level) => {
        const points = dimensions.map((_, index) => getPoint(index, level));
        return <polygon key={level} points={points.map((point) => point.join(",")).join(" ")} fill="none" stroke="#333" strokeWidth={0.5} />;
      })}

      {dimensions.map((dimension, index) => {
        const [x, y] = getPoint(index, maxVal + 0.8);
        const [lineX, lineY] = getPoint(index, maxVal);
        return (
          <g key={dimension}>
            <line x1={cx} y1={cy} x2={lineX} y2={lineY} stroke="#333" strokeWidth={0.5} />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#999" fontSize={10} fontFamily="monospace">
              {dimensionLabels[dimension]}
            </text>
          </g>
        );
      })}

      {solutions.map((solution, solutionIndex) => {
        const points = dimensions.map((dimension, dimensionIndex) => {
          const val = FRICTION_LEVELS[data[dimension]?.[solution]] || 0;
          return getPoint(dimensionIndex, val);
        });

        return (
          <g key={solution}>
            <polygon points={points.map((point) => point.join(",")).join(" ")} fill={solutionColors[solutionIndex]} fillOpacity={0.08} stroke={solutionColors[solutionIndex]} strokeWidth={1.5} />
            {points.map((point, pointIndex) => (
              <circle key={pointIndex} cx={point[0]} cy={point[1]} r={3} fill={solutionColors[solutionIndex]} />
            ))}
          </g>
        );
      })}

      <text x={cx} y={310} textAnchor="middle" fill="#666" fontSize={9} fontFamily="monospace">
        {footerLabel}
      </text>
    </svg>
  );
}

export default function App() {
  const [lang, setLang] = useState("zh");
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSolution, setActiveSolution] = useState(null);
  const [activeStakeholder, setActiveStakeholder] = useState("cryptoUsers");

  const stakeholderLabelMap = Object.fromEntries(
    STAKEHOLDERS.map((stakeholder) => [stakeholder.id, copyText(stakeholder.label, lang)]),
  );
  const activeStakeholderLabel = stakeholderLabelMap[activeStakeholder];
  const detailForStakeholder = detailData[lang]?.[activeStakeholder] ?? detailData.zh[activeStakeholder];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#e0e0e0",
        fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
        padding: "24px 16px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 32, borderBottom: "1px solid #222", paddingBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>Crypto Payment Solutions</h1>
              <p style={{ fontSize: 12, color: "#666", margin: "6px 0 0" }}>{copyText(UI_COPY.subtitle, lang)}</p>
            </div>

            <div style={{ display: "inline-flex", border: "1px solid #333", borderRadius: 6, padding: 2 }}>
              {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setLang(option.id)}
                  style={{
                    padding: "6px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    background: lang === option.id ? "#fff" : "transparent",
                    color: lang === option.id ? "#000" : "#999",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 28, flexWrap: "wrap" }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 16px",
                fontSize: 12,
                fontWeight: 600,
                background: activeTab === tab.id ? "#fff" : "transparent",
                color: activeTab === tab.id ? "#000" : "#666",
                border: `1px solid ${activeTab === tab.id ? "#fff" : "#333"}`,
                borderRadius: 4,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              {copyText(tab.label, lang)}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
              {SOLUTIONS.map((solution) => {
                const color = COLORS[solution];
                return (
                  <div
                    key={solution}
                    onClick={() => setActiveSolution(activeSolution === solution ? null : solution)}
                    style={{
                      flex: "1 1 200px",
                      padding: 16,
                      background: activeSolution === solution ? color.dim : "#111",
                      border: `1px solid ${activeSolution === solution ? color.accent : "#222"}`,
                      borderRadius: 6,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: color.accent, marginBottom: 8 }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: color.light }}>{solution}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 340px" }}>
                <h3 style={{ fontSize: 13, color: "#888", marginBottom: 12, fontWeight: 600 }}>{copyText(UI_COPY.overview.radarTitle, lang)}</h3>
                <div style={{ background: "#111", borderRadius: 8, padding: 16, border: "1px solid #222" }}>
                  <RadarChart
                    data={frictionData}
                    solutions={SOLUTIONS}
                    dimensions={STAKEHOLDERS.map((stakeholder) => stakeholder.id)}
                    dimensionLabels={stakeholderLabelMap}
                    footerLabel={copyText(UI_COPY.overview.radarFooter, lang)}
                  />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 8 }}>
                    {SOLUTIONS.map((solution, index) => (
                      <div key={solution} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: ["#6C63FF", "#22C55E", "#06B6D4", "#F59E0B"][index] }} />
                        <span style={{ color: "#999" }}>{shortName(solution)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ flex: "1 1 340px" }}>
                <h3 style={{ fontSize: 13, color: "#888", marginBottom: 12, fontWeight: 600 }}>{copyText(UI_COPY.overview.keyDependenciesTitle, lang)}</h3>
                <div style={{ background: "#111", borderRadius: 8, padding: 16, border: "1px solid #222" }}>
                  {OVERVIEW_DEPENDENCIES.map((dependency) => (
                    <div key={dependency.sol} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #1a1a1a" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: dependency.color }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: dependency.color }}>{dependency.sol}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#888", marginBottom: 4, paddingLeft: 14 }}>{copyText(dependency.chain, lang)}</div>
                      <div style={{ fontSize: 11, color: "#cc6666", paddingLeft: 14 }}>
                        {copyText(UI_COPY.overview.bottleneckLabel, lang)}: {copyText(dependency.bottleneck, lang)}
                      </div>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: 13, color: "#888", margin: "20px 0 12px", fontWeight: 600 }}>{copyText(UI_COPY.overview.universalBlockerTitle, lang)}</h3>
                <div style={{ background: "#1a1111", borderRadius: 8, padding: 16, border: "1px solid #331a1a" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#EF4444", marginBottom: 8 }}>{copyText(UI_COPY.overview.universalBlockerHeadline, lang)}</div>
                  <div style={{ fontSize: 11, color: "#999", lineHeight: 1.6 }}>{copyText(UI_COPY.overview.universalBlockerBody, lang)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "friction" && (
          <div>
            <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
              {STAKEHOLDERS.map((stakeholder) => (
                <button
                  key={stakeholder.id}
                  onClick={() => setActiveStakeholder(stakeholder.id)}
                  style={{
                    padding: "6px 14px",
                    fontSize: 12,
                    background: activeStakeholder === stakeholder.id ? "#222" : "transparent",
                    color: activeStakeholder === stakeholder.id ? "#fff" : "#666",
                    border: `1px solid ${activeStakeholder === stakeholder.id ? "#444" : "#222"}`,
                    borderRadius: 4,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {copyText(stakeholder.label, lang)}
                </button>
              ))}
            </div>

            <div style={{ background: "#111", borderRadius: 8, padding: 20, border: "1px solid #222", marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
                {activeStakeholderLabel} {copyText(UI_COPY.friction.titleSuffix, lang)}
              </h3>
              {SOLUTIONS.map((solution) => (
                <FrictionBar key={solution} level={shortName(solution)} label={frictionData[activeStakeholder][solution]} lang={lang} />
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {SOLUTIONS.map((solution) => {
                const details = detailForStakeholder[solution];
                const color = COLORS[solution];
                return (
                  <div key={solution} style={{ background: "#111", borderRadius: 8, padding: 14, border: "1px solid #222", borderTop: `2px solid ${color.accent}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: color.light, marginBottom: 10 }}>{shortName(solution)}</div>
                    {["onboarding", "existing", "action", "barrier"].map((field) => (
                      <div key={field} style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 9, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>{copyText(UI_COPY.friction.detailFields[field], lang)}</div>
                        <div style={{ fontSize: 11, color: "#ccc" }}>{details[field]}</div>
                      </div>
                    ))}
                    <div style={{ marginTop: 10, padding: "8px 10px", background: "#0a0a0a", borderRadius: 4 }}>
                      <div style={{ fontSize: 11, color: color.light, fontWeight: 600 }}>{details.verdict}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "wallet" && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>{copyText(UI_COPY.wallet.title, lang)}</h3>
            <div style={{ background: "#111", borderRadius: 8, padding: 20, border: "1px solid #222", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#EF4444", fontWeight: 700, marginBottom: 12 }}>{copyText(UI_COPY.wallet.warning, lang)}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                {walletSecurityData.map((item) => (
                  <div key={item.id} style={{ background: item.background, borderRadius: 8, padding: 14, border: `1px solid ${item.border}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{copyText(item.method, lang)}</div>
                    {item.metrics.map((metric) => (
                      <div key={metric.key} style={{ marginBottom: 6, display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontSize: 10, color: "#888" }}>{copyText(WALLET_METRIC_LABELS[metric.key], lang)}</span>
                        <span style={{ fontSize: 11, color: toneColors[metric.tone], fontWeight: 600 }}>{copyText(metric.value, lang)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>{copyText(UI_COPY.wallet.comparisonTitle, lang)}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {walletComparisonData.map((option) => (
                <div key={option.id} style={{ background: "#111", borderRadius: 8, padding: 16, border: "1px solid #222" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: option.titleColor, marginBottom: 12 }}>{copyText(option.title, lang)}</div>
                  {option.points.map((point, index) => (
                    <div
                      key={`${option.id}-${index}`}
                      style={{
                        fontSize: 11,
                        color: point.type === "pro" ? "#4ADE80" : "#F87171",
                        marginBottom: 4,
                        paddingLeft: 16,
                        position: "relative",
                      }}
                    >
                      <span style={{ position: "absolute", left: 0 }}>{point.type === "pro" ? "+" : "-"}</span>
                      {copyText(point.text, lang)}
                    </div>
                  ))}
                  <div style={{ marginTop: 12, padding: 8, background: option.bestForBg, borderRadius: 4, fontSize: 11, color: option.bestForColor, fontWeight: 600 }}>
                    Best for: {copyText(option.bestFor, lang)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, background: "#0a0a1a", borderRadius: 8, padding: 16, border: "1px solid #1a1a3a" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#06B6D4", marginBottom: 6 }}>{copyText(UI_COPY.wallet.insightTitle, lang)}</div>
              <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6 }}>{copyText(UI_COPY.wallet.insightBody, lang)}</div>
            </div>
          </div>
        )}

        {activeTab === "fees" && (
          <div>
            <div style={{ background: "#1a1111", borderRadius: 8, padding: 20, border: "1px solid #331a1a", marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#EF4444", marginBottom: 8 }}>{copyText(UI_COPY.fees.headline, lang)}</div>
              <div style={{ fontSize: 12, color: "#999" }}>{copyText(UI_COPY.fees.summary, lang)}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
              {feeSavingsData.map((entry) => (
                <div key={copyText(entry.who, "en")} style={{ background: "#111", borderRadius: 8, padding: 16, border: "1px solid #222" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{copyText(entry.who, lang)}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color: "#666" }}>{copyText(UI_COPY.fees.caresLabel, lang)}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: careColors[entry.caresLevel] }}>{copyText(entry.cares, lang)}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>{copyText(entry.reason, lang)}</div>
                  <div style={{ padding: "8px 10px", background: "#0a1a0a", borderRadius: 4 }}>
                    <div style={{ fontSize: 9, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>{copyText(UI_COPY.fees.actualCareLabel, lang)}</div>
                    <div style={{ fontSize: 11, color: "#22C55E", fontWeight: 600, marginTop: 4 }}>{copyText(entry.realCare, lang)}</div>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>{copyText(UI_COPY.fees.pitchTitle, lang)}</h3>
            <div style={{ background: "#111", borderRadius: 8, padding: 20, border: "1px solid #222" }}>
              {pitchData.map((entry) => (
                <div
                  key={copyText(entry.to, "en")}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr 1fr",
                    gap: 12,
                    marginBottom: 12,
                    paddingBottom: 12,
                    borderBottom: "1px solid #1a1a1a",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: entry.color }}>{copyText(entry.to, lang)}</div>
                  <div style={{ fontSize: 11, padding: "6px 10px", background: "#1a0a0a", borderRadius: 4, color: "#F87171", textDecoration: "line-through", textDecorationColor: "#F8717166" }}>
                    {copyText(entry.bad, lang)}
                  </div>
                  <div style={{ fontSize: 11, padding: "6px 10px", background: "#0a1a0a", borderRadius: 4, color: "#4ADE80", fontWeight: 600 }}>{copyText(entry.good, lang)}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, background: "#0a0a1a", borderRadius: 8, padding: 16, border: "1px solid #1a1a3a" }}>
              <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6 }}>{copyText(UI_COPY.fees.footer, lang)}</div>
            </div>
          </div>
        )}

        {activeTab === "verdict" && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>{copyText(UI_COPY.verdict.winnersTitle, lang)}</h3>
            <div style={{ background: "#111", borderRadius: 8, padding: 20, border: "1px solid #222", marginBottom: 24 }}>
              {verdictData.map((entry, index) => {
                const winnerText = copyText(entry.winner, lang);
                const isOPK = winnerText.includes("OPK") || winnerText.includes("ERC-681");
                return (
                  <div
                    key={copyText(entry.dimension, "en")}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "160px 160px 1fr",
                      gap: 12,
                      padding: "10px 0",
                      borderBottom: index < verdictData.length - 1 ? "1px solid #1a1a1a" : "none",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#999" }}>{copyText(entry.dimension, lang)}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isOPK ? "#22C55E" : "#FBBF24" }}>{winnerText}</div>
                    <div style={{ fontSize: 11, color: "#666" }}>{copyText(entry.reason, lang)}</div>
                  </div>
                );
              })}
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>{copyText(UI_COPY.verdict.risksTitle, lang)}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              <div style={{ background: "#1a1111", borderRadius: 8, padding: 16, border: "1px solid #331a1a" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#EF4444", marginBottom: 8 }}>{copyText(UI_COPY.verdict.opkRiskTitle, lang)}</div>
                <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6 }}>{copyText(UI_COPY.verdict.opkRiskBody, lang)}</div>
              </div>
              <div style={{ background: "#1a1111", borderRadius: 8, padding: 16, border: "1px solid #331a1a" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#EF4444", marginBottom: 8 }}>{copyText(UI_COPY.verdict.sharedRiskTitle, lang)}</div>
                <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6 }}>{copyText(UI_COPY.verdict.sharedRiskBody, lang)}</div>
              </div>
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>{copyText(UI_COPY.verdict.formulaTitle, lang)}</h3>
            <div style={{ background: "#0a1a0a", borderRadius: 8, padding: 20, border: "1px solid #1a3a1a" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
                {strategicPhases.map((phase) => (
                  <div key={copyText(phase.phase, "en")} style={{ padding: 14, background: "#0a0a0a", borderRadius: 6, borderLeft: `3px solid ${phase.color}` }}>
                    <div style={{ fontSize: 10, color: phase.color, fontWeight: 700, marginBottom: 4 }}>{copyText(phase.phase, lang)}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{copyText(phase.desc, lang)}</div>
                    <div style={{ fontSize: 11, color: "#999" }}>{copyText(phase.detail, lang)}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: 12, background: "#111", borderRadius: 6, textAlign: "center" }}>
                <span style={{ fontSize: 12, color: "#999" }}>{copyText(UI_COPY.verdict.settlePrefix, lang)}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#22C55E" }}>{copyText(UI_COPY.verdict.settleValue, lang)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
