export enum ShipRarity {
    COMMON = 'COMMON',
    RARE = 'RARE',
    EPIC = 'EPIC',
    LEGENDARY = 'LEGENDARY'
}

export enum GameEventType {
    ITEM = 'PŘEDMĚT',
    ENCOUNTER = 'SETKÁNÍ',
    TRAP = 'NÁSTRAHA',
    MERCHANT = 'OBCHODNÍK',
    DILEMA = 'DILEMA',
    BOSS = 'BOSS',
    SPACE_STATION = 'VESMÍRNÁ_STANICE',
    PLANET = 'PLANETA',
    CHEST = 'TRUHLA'
}



export interface Stat {
    label: string;
    value: string | number;
    icon?: string;
}

export interface MerchantItemEntry {
    id: string;
    stock: number;
    price?: number;
    sellPrice?: number;
    saleChance?: number;
    allowBuy?: boolean; // NEW: Jestli obchodník tento předmět vykupuje
}

export interface DilemmaReward {
    type: 'HP' | 'GOLD' | 'FUEL' | 'OXYGEN' | 'HULL' | 'ARMOR';
    value: number;
}

export interface DilemmaOption {
    label: string;

    // Success Scenarion
    successChance: number; // 0-100
    consequenceText: string;
    rewards?: DilemmaReward[]; // List of effects on success

    // Legacy / Simple effect support
    effectType?: string;
    effectValue?: number;

    // Fail Scenario
    failMessage?: string;
    failDamage?: number; // DMG on fail

    physicalInstruction?: string;
}

export interface BossPhase {
    triggerType: 'TURN' | 'HP_PERCENT';
    triggerValue: number;
    name: string;
    description: string;
    damageBonus: number;
}

export interface CharacterMerchantBonus {
    buyDiscount: number;      // % sleva při nákupu (0-100)
    sellBonus: number;        // % bonus při prodeji (0-100)
    stealChance: number;      // % šance na krádež (0-100)
    specialAbility?: string;  // Popis speciální schopnosti
}

export interface MerchantTradeConfig {
    [characterId: string]: CharacterMerchantBonus; // Dynamic character bonuses
}

export interface TrapConfig {
    difficulty: number;
    damage: number;
    disarmClass?: string;
    successMessage: string;
    failMessage: string;
    trapType?: string; // NEW: Např. "MECHANISMUS", "MAGICKÁ", "TECH"
    loot?: Stat[]; // NEW: Odměna za zneškodnění
}

export interface CombatConfig {
    defBreakChance?: number; // 0-100% šance, že nepřítel ignoruje obranu hráče
}

export interface EnemyLoot {
    lootStats?: Stat[]; // Nový systém odměn (flexibilní seznam statů)
    // Legacy support
    goldReward?: number;
    dropItemChance?: number;
    dropItemId?: string;
    // REMOVED XP REWARD
}

export interface StationModuleConfig {
    enabled: boolean;
    title?: string;
    description?: string;
}

export interface StationConfig {
    fuelReward: number;     // Kolik paliva se doplní (např. 50)
    repairAmount: number;   // Kolik HP/Hull se opraví (např. 30)
    refillO2: boolean;      // Zda doplnit O2 na 100% (true)
    welcomeMessage: string;
    // New Modules
    modules?: {
        shop: StationModuleConfig;
        factory: StationModuleConfig;
        quarters: StationModuleConfig;
        missions: StationModuleConfig;
    };
    backgroundImage?: string;
}

export interface ResourceConfig {
    isResourceContainer: boolean;
    resourceName: string;
    resourceAmount: number;
    customLabel?: string; // Vlastní nápis sekce (např. "Palivová Nádrž" místo "Surovina k Těžbě")
}

export interface CraftingRecipe {
    enabled: boolean;
    requiredResources: {
        resourceName: string;
        amount: number;
    }[];
    craftingTimeSeconds: number;
}

export interface TimeVariant {
    enabled: boolean;
    nightTitle?: string;
    nightDescription?: string;
    nightType?: GameEventType;
    nightStats?: Stat[];
    nightFlavorText?: string;
    nightRarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface ClassVariant {
    overrideTitle?: string;
    overrideDescription?: string;
    overrideType?: GameEventType;
    bonusStats?: Stat[];
}

// --- NEW MARKET & RECYCLING INTERFACES ---

export interface RecycleOutput {
    resourceName: string; // ID suroviny (např. "Kovový šrot")
    amount: number;
}

// ClassMarketModifier removed

export interface MarketConfig {
    enabled: boolean;
    marketPrice?: number; // Override standardní ceny
    saleChance: number; // 0-100% šance, že bude v akci
    recyclingOutput: RecycleOutput[];
}

export interface PlanetConfig {
    planetId: string; // ID pro párování s UI (p1, p2, p3, p4)
    landingEventType: GameEventType; // Legacy fallback
    landingEventId?: string; // Legacy fallback
    phases?: string[]; // Array of Event IDs representing waves/phases
}

export interface GameEvent {
    id: string;
    title: string;
    description: string;
    type: GameEventType;
    imageUrl?: string; // Added for item images
    stats?: Stat[];
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    flavorText?: string;

    isShareable?: boolean;
    isConsumable?: boolean;
    isSellOnly?: boolean;
    canBeSaved?: boolean;
    isLocked?: boolean;
    requiredKeyId?: string;

    price?: number;

    canSellToMerchant?: boolean;
    tradeConfig?: MerchantTradeConfig;
    merchantItems?: MerchantItemEntry[];

    dilemmaScope?: 'INDIVIDUAL' | 'GLOBAL';
    dilemmaOptions?: DilemmaOption[];

    bossPhases?: BossPhase[];
    combatConfig?: CombatConfig; // NOVÉ

    trapConfig?: TrapConfig;
    enemyLoot?: EnemyLoot;

    stationConfig?: StationConfig;

    resourceConfig?: ResourceConfig;
    craftingRecipe?: CraftingRecipe;

    marketConfig?: MarketConfig;

    planetConfig?: PlanetConfig;
    planetProgress?: number; // Sleduje, kolikátou fázi už hráč splnil (0 = začátek)

    timeVariant?: TimeVariant;
    qrCodeUrl?: string;
    _merchantEntry?: MerchantItemEntry; // Temporary runtime property
}

export interface ScanHistoryItem extends GameEvent {
    timestamp: number;
}

export interface RaidState {
    isActive: boolean;
    bossName: string;
    bossId: string;
    maxHp: number;
    currentHp: number;
    turnIndex: number;
    combatLog: string[];
}

// NEW INTERFACES FOR MULTIPLAYER
export interface Message {
    id: string;
    sender: string;
    text: string;
    timestamp: number;
    isSystem?: boolean;
}

export interface RoomMember {
    name: string;
    email?: string;
    hp: number;
    lastSeen?: number;
    isReady?: boolean;
}

export interface RoomState {
    id: string;
    isInRoom: boolean;
    members: RoomMember[];
    messages: Message[];
    nickname: string;
    isNicknameSet: boolean;
    isGameStarted: boolean;
    roundNumber: number;
    turnIndex: number;
    turnOrder: string[];
    readyForNextRound: string[];
    host: string;
    activeEncounter?: GameEvent | null;
    activeTrades?: any[]; // Array of active trade sessions
}

// CHARACTER CREATOR INTERFACES
export interface CharacterPerk {
    name: string;
    description: string;
    effect: {
        stat: string;              // např. "damage", "hp", "armor"
        modifier: number;          // např. 5 pro +5 flat bonus
        condition?: 'night' | 'day' | 'combat' | 'always';
    };
}

export interface Character {
    characterId: string;           // Unikátní ID (např. "CHAR-001")
    adminEmail: string;
    name: string;
    description: string;
    imageUrl?: string;
    initialShipId?: string; // ID startovní lodě
    baseStats: {
        hp: number;
        armor: number;
        fuel: number;
        gold: number;
        oxygen: number;
    };
    perks: CharacterPerk[];
    hullDamageChance?: number; // % šance na poškození trupu při skenování (0-100)
    timeVariant?: {
        enabled: boolean;
        nightModifiers: {
            statChanges: Array<{
                stat: string;
                modifier: number;
            }>;
            additionalPerks?: CharacterPerk[];
        };
    };
    createdAt?: number;
    updatedAt?: number;
}

export interface Ship {
    shipId: string;
    adminEmail: string;
    name: string;
    description: string;
    imageUrl?: string;
    rarity: ShipRarity;
    slots: number;
    baseStats: {
        hull: number;
        fuelCapacity: number;
        oxygenCapacity: number;
    };
    createdAt?: number;
    updatedAt?: number;
}
