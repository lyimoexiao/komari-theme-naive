// 地区emoji到名称的映射
export const emojiToRegionMap: Record<string, { en: string, zh: string, code: string, aliases: string[] }> = {
  '🇭🇰': {
    en: 'Hong Kong',
    zh: '香港',
    code: 'HK',
    aliases: ['hk', 'hongkong', 'hong kong', '香港', 'HK'],
  },
  '🇨🇳': {
    en: 'China',
    zh: '中国',
    code: 'CN',
    aliases: ['cn', 'china', '中国', '中华人民共和国', 'prc', 'CN'],
  },
  '🇺🇸': {
    en: 'United States',
    zh: '美国',
    code: 'US',
    aliases: ['us', 'usa', 'united states', 'america', '美国', '美利坚', 'US', 'USA'],
  },
  '🇯🇵': {
    en: 'Japan',
    zh: '日本',
    code: 'JP',
    aliases: ['jp', 'japan', '日本', 'JP'],
  },
  '🇰🇷': {
    en: 'South Korea',
    zh: '韩国',
    code: 'KR',
    aliases: ['kr', 'korea', 'south korea', '韩国', '南韩', 'KR'],
  },
  '🇸🇬': {
    en: 'Singapore',
    zh: '新加坡',
    code: 'SG',
    aliases: ['sg', 'singapore', '新加坡', 'SG'],
  },
  '🇹🇼': {
    en: 'Taiwan',
    zh: '台湾',
    code: 'TW',
    aliases: ['tw', 'taiwan', '台湾', '台灣', 'TW'],
  },
  '🇬🇧': {
    en: 'United Kingdom',
    zh: '英国',
    code: 'GB',
    aliases: ['gb', 'uk', 'united kingdom', 'britain', '英国', '英國', 'GB', 'UK'],
  },
  '🇩🇪': {
    en: 'Germany',
    zh: '德国',
    code: 'DE',
    aliases: ['de', 'germany', 'deutschland', '德国', '德國', 'DE'],
  },
  '🇫🇷': {
    en: 'France',
    zh: '法国',
    code: 'FR',
    aliases: ['fr', 'france', '法国', '法國', 'FR'],
  },
  '🇨🇦': {
    en: 'Canada',
    zh: '加拿大',
    code: 'CA',
    aliases: ['ca', 'canada', '加拿大', 'CA'],
  },
  '🇦🇺': {
    en: 'Australia',
    zh: '澳大利亚',
    code: 'AU',
    aliases: ['au', 'australia', '澳大利亚', '澳洲', 'AU'],
  },
  '🇷🇺': {
    en: 'Russia',
    zh: '俄罗斯',
    code: 'RU',
    aliases: ['ru', 'russia', '俄罗斯', '俄國', 'RU'],
  },
  '🇮🇳': {
    en: 'India',
    zh: '印度',
    code: 'IN',
    aliases: ['in', 'india', '印度', 'IN'],
  },
  '🇧🇷': {
    en: 'Brazil',
    zh: '巴西',
    code: 'BR',
    aliases: ['br', 'brazil', '巴西', 'BR'],
  },
  '🇳🇱': {
    en: 'Netherlands',
    zh: '荷兰',
    code: 'NL',
    aliases: ['nl', 'netherlands', 'holland', '荷兰', '荷蘭', 'NL'],
  },
  '🇮🇹': {
    en: 'Italy',
    zh: '意大利',
    code: 'IT',
    aliases: ['it', 'italy', '意大利', 'IT'],
  },
  '🇪🇸': {
    en: 'Spain',
    zh: '西班牙',
    code: 'ES',
    aliases: ['es', 'spain', '西班牙', 'ES'],
  },
  '🇸🇪': {
    en: 'Sweden',
    zh: '瑞典',
    code: 'SE',
    aliases: ['se', 'sweden', '瑞典', 'SE'],
  },
  '🇳🇴': {
    en: 'Norway',
    zh: '挪威',
    code: 'NO',
    aliases: ['no', 'norway', '挪威', 'NO'],
  },
  '🇫🇮': {
    en: 'Finland',
    zh: '芬兰',
    code: 'FI',
    aliases: ['fi', 'finland', '芬兰', '芬蘭', 'FI'],
  },
  '🇨🇭': {
    en: 'Switzerland',
    zh: '瑞士',
    code: 'CH',
    aliases: ['ch', 'switzerland', '瑞士', 'CH'],
  },
  '🇦🇹': {
    en: 'Austria',
    zh: '奥地利',
    code: 'AT',
    aliases: ['at', 'austria', '奥地利', '奧地利', 'AT'],
  },
  '🇧🇪': {
    en: 'Belgium',
    zh: '比利时',
    code: 'BE',
    aliases: ['be', 'belgium', '比利时', '比利時', 'BE'],
  },
  '🇵🇹': {
    en: 'Portugal',
    zh: '葡萄牙',
    code: 'PT',
    aliases: ['pt', 'portugal', '葡萄牙', 'PT'],
  },
  '🇬🇷': {
    en: 'Greece',
    zh: '希腊',
    code: 'GR',
    aliases: ['gr', 'greece', '希腊', '希臘', 'GR'],
  },
  '🇹🇷': {
    en: 'Turkey',
    zh: '土耳其',
    code: 'TR',
    aliases: ['tr', 'turkey', '土耳其', 'TR'],
  },
  '🇵🇱': {
    en: 'Poland',
    zh: '波兰',
    code: 'PL',
    aliases: ['pl', 'poland', '波兰', '波蘭', 'PL'],
  },
  '🇨🇿': {
    en: 'Czech Republic',
    zh: '捷克',
    code: 'CZ',
    aliases: ['cz', 'czech', 'czech republic', '捷克', 'CZ'],
  },
  '🇭🇺': {
    en: 'Hungary',
    zh: '匈牙利',
    code: 'HU',
    aliases: ['hu', 'hungary', '匈牙利', 'HU'],
  },
  '🇷🇴': {
    en: 'Romania',
    zh: '罗马尼亚',
    code: 'RO',
    aliases: ['ro', 'romania', '罗马尼亚', '羅馬尼亞', 'RO'],
  },
  '🇧🇬': {
    en: 'Bulgaria',
    zh: '保加利亚',
    code: 'BG',
    aliases: ['bg', 'bulgaria', '保加利亚', '保加利亞', 'BG'],
  },
  '🇭🇷': {
    en: 'Croatia',
    zh: '克罗地亚',
    code: 'HR',
    aliases: ['hr', 'croatia', '克罗地亚', '克羅地亞', 'HR'],
  },
  '🇸🇮': {
    en: 'Slovenia',
    zh: '斯洛文尼亚',
    code: 'SI',
    aliases: ['si', 'slovenia', '斯洛文尼亚', '斯洛文尼亞', 'SI'],
  },
  '🇸🇰': {
    en: 'Slovakia',
    zh: '斯洛伐克',
    code: 'SK',
    aliases: ['sk', 'slovakia', '斯洛伐克', 'SK'],
  },
  '🇱🇻': {
    en: 'Latvia',
    zh: '拉脱维亚',
    code: 'LV',
    aliases: ['lv', 'latvia', '拉脱维亚', '拉脫維亞', 'LV'],
  },
  '🇱🇹': {
    en: 'Lithuania',
    zh: '立陶宛',
    code: 'LT',
    aliases: ['lt', 'lithuania', '立陶宛', 'LT'],
  },
  '🇪🇪': {
    en: 'Estonia',
    zh: '爱沙尼亚',
    code: 'EE',
    aliases: ['ee', 'estonia', '爱沙尼亚', '愛沙尼亞', 'EE'],
  },
  '🇲🇽': {
    en: 'Mexico',
    zh: '墨西哥',
    code: 'MX',
    aliases: ['mx', 'mexico', '墨西哥', 'MX'],
  },
  '🇦🇷': {
    en: 'Argentina',
    zh: '阿根廷',
    code: 'AR',
    aliases: ['ar', 'argentina', '阿根廷', 'AR'],
  },
  '🇨🇱': {
    en: 'Chile',
    zh: '智利',
    code: 'CL',
    aliases: ['cl', 'chile', '智利', 'CL'],
  },
  '🇨🇴': {
    en: 'Colombia',
    zh: '哥伦比亚',
    code: 'CO',
    aliases: ['co', 'colombia', '哥伦比亚', '哥倫比亞', 'CO'],
  },
  '🇵🇪': {
    en: 'Peru',
    zh: '秘鲁',
    code: 'PE',
    aliases: ['pe', 'peru', '秘鲁', '秘魯', 'PE'],
  },
  '🇻🇪': {
    en: 'Venezuela',
    zh: '委内瑞拉',
    code: 'VE',
    aliases: ['ve', 'venezuela', '委内瑞拉', '委內瑞拉', 'VE'],
  },
  '🇺🇾': {
    en: 'Uruguay',
    zh: '乌拉圭',
    code: 'UY',
    aliases: ['uy', 'uruguay', '乌拉圭', '烏拉圭', 'UY'],
  },
  '🇪🇨': {
    en: 'Ecuador',
    zh: '厄瓜多尔',
    code: 'EC',
    aliases: ['ec', 'ecuador', '厄瓜多尔', '厄瓜多爾', 'EC'],
  },
  '🇧🇴': {
    en: 'Bolivia',
    zh: '玻利维亚',
    code: 'BO',
    aliases: ['bo', 'bolivia', '玻利维亚', '玻利維亞', 'BO'],
  },
  '🇵🇾': {
    en: 'Paraguay',
    zh: '巴拉圭',
    code: 'PY',
    aliases: ['py', 'paraguay', '巴拉圭', 'PY'],
  },
  '🇬🇾': {
    en: 'Guyana',
    zh: '圭亚那',
    code: 'GY',
    aliases: ['gy', 'guyana', '圭亚那', '圭亞那', 'GY'],
  },
  '🇸🇷': {
    en: 'Suriname',
    zh: '苏里南',
    code: 'SR',
    aliases: ['sr', 'suriname', '苏里南', '蘇里南', 'SR'],
  },
  '🇫🇰': {
    en: 'Falkland Islands',
    zh: '福克兰群岛',
    code: 'FK',
    aliases: ['fk', 'falkland', '福克兰', '福克蘭', 'FK'],
  },
  '🇬🇫': {
    en: 'French Guiana',
    zh: '法属圭亚那',
    code: 'GF',
    aliases: ['gf', 'french guiana', '法属圭亚那', '法屬圭亞那', 'GF'],
  },
  '🇵🇦': {
    en: 'Panama',
    zh: '巴拿马',
    code: 'PA',
    aliases: ['pa', 'panama', '巴拿马', '巴拿馬', 'PA'],
  },
  '🇨🇷': {
    en: 'Costa Rica',
    zh: '哥斯达黎加',
    code: 'CR',
    aliases: ['cr', 'costa rica', '哥斯达黎加', '哥斯達黎加', 'CR'],
  },
  '🇳🇮': {
    en: 'Nicaragua',
    zh: '尼加拉瓜',
    code: 'NI',
    aliases: ['ni', 'nicaragua', '尼加拉瓜', 'NI'],
  },
  '🇭🇳': {
    en: 'Honduras',
    zh: '洪都拉斯',
    code: 'HN',
    aliases: ['hn', 'honduras', '洪都拉斯', 'HN'],
  },
  '🇬🇹': {
    en: 'Guatemala',
    zh: '危地马拉',
    code: 'GT',
    aliases: ['gt', 'guatemala', '危地马拉', '危地馬拉', 'GT'],
  },
  '🇧🇿': {
    en: 'Belize',
    zh: '伯利兹',
    code: 'BZ',
    aliases: ['bz', 'belize', '伯利兹', '伯利茲', 'BZ'],
  },
  '🇸🇻': {
    en: 'El Salvador',
    zh: '萨尔瓦多',
    code: 'SV',
    aliases: ['sv', 'el salvador', '萨尔瓦多', '薩爾瓦多', 'SV'],
  },
  '🇯🇲': {
    en: 'Jamaica',
    zh: '牙买加',
    code: 'JM',
    aliases: ['jm', 'jamaica', '牙买加', '牙買加', 'JM'],
  },
  '🇨🇺': {
    en: 'Cuba',
    zh: '古巴',
    code: 'CU',
    aliases: ['cu', 'cuba', '古巴', 'CU'],
  },
  '🇩🇴': {
    en: 'Dominican Republic',
    zh: '多明尼加',
    code: 'DO',
    aliases: ['do', 'dominican', '多明尼加', 'DO'],
  },
  '🇭🇹': {
    en: 'Haiti',
    zh: '海地',
    code: 'HT',
    aliases: ['ht', 'haiti', '海地', 'HT'],
  },
  '🇧🇸': {
    en: 'Bahamas',
    zh: '巴哈马',
    code: 'BS',
    aliases: ['bs', 'bahamas', '巴哈马', '巴哈馬', 'BS'],
  },
  '🇧🇧': {
    en: 'Barbados',
    zh: '巴巴多斯',
    code: 'BB',
    aliases: ['bb', 'barbados', '巴巴多斯', 'BB'],
  },
  '🇹🇹': {
    en: 'Trinidad and Tobago',
    zh: '特立尼达和多巴哥',
    code: 'TT',
    aliases: ['tt', 'trinidad', '特立尼达', '特立尼達', 'TT'],
  },
  '🇵🇭': {
    en: 'Philippines',
    zh: '菲律宾',
    code: 'PH',
    aliases: ['ph', 'philippines', '菲律宾', '菲律賓', 'PH'],
  },
  '🇹🇭': {
    en: 'Thailand',
    zh: '泰国',
    code: 'TH',
    aliases: ['th', 'thailand', '泰国', '泰國', 'TH'],
  },
  '🇻🇳': {
    en: 'Vietnam',
    zh: '越南',
    code: 'VN',
    aliases: ['vn', 'vietnam', '越南', 'VN'],
  },
  '🇲🇾': {
    en: 'Malaysia',
    zh: '马来西亚',
    code: 'MY',
    aliases: ['my', 'malaysia', '马来西亚', '馬來西亞', 'MY'],
  },
  '🇮🇩': {
    en: 'Indonesia',
    zh: '印度尼西亚',
    code: 'ID',
    aliases: ['id', 'indonesia', '印度尼西亚', '印尼', 'ID'],
  },
  '🇱🇦': {
    en: 'Laos',
    zh: '老挝',
    code: 'LA',
    aliases: ['la', 'laos', '老挝', '老撾', 'LA'],
  },
  '🇰🇭': {
    en: 'Cambodia',
    zh: '柬埔寨',
    code: 'KH',
    aliases: ['kh', 'cambodia', '柬埔寨', 'KH'],
  },
  '🇲🇲': {
    en: 'Myanmar',
    zh: '缅甸',
    code: 'MM',
    aliases: ['mm', 'myanmar', 'burma', '缅甸', '緬甸', 'MM'],
  },
  '🇧🇳': {
    en: 'Brunei',
    zh: '文莱',
    code: 'BN',
    aliases: ['bn', 'brunei', '文莱', '汶萊', 'BN'],
  },
  '🇪🇬': {
    en: 'Egypt',
    zh: '埃及',
    code: 'EG',
    aliases: ['eg', 'egypt', '埃及', 'EG'],
  },
  '🇿🇦': {
    en: 'South Africa',
    zh: '南非',
    code: 'ZA',
    aliases: ['za', 'south africa', '南非', 'ZA'],
  },
  '🇳🇬': {
    en: 'Nigeria',
    zh: '尼日利亚',
    code: 'NG',
    aliases: ['ng', 'nigeria', '尼日利亚', '尼日利亞', 'NG'],
  },
  '🇰🇪': {
    en: 'Kenya',
    zh: '肯尼亚',
    code: 'KE',
    aliases: ['ke', 'kenya', '肯尼亚', '肯亞', 'KE'],
  },
  '🇪🇹': {
    en: 'Ethiopia',
    zh: '埃塞俄比亚',
    code: 'ET',
    aliases: ['et', 'ethiopia', '埃塞俄比亚', '埃塞俄比亞', 'ET'],
  },
  '🇬🇭': {
    en: 'Ghana',
    zh: '加纳',
    code: 'GH',
    aliases: ['gh', 'ghana', '加纳', '迦納', 'GH'],
  },
  '🇺🇬': {
    en: 'Uganda',
    zh: '乌干达',
    code: 'UG',
    aliases: ['ug', 'uganda', '乌干达', '烏干達', 'UG'],
  },
  '🇹🇿': {
    en: 'Tanzania',
    zh: '坦桑尼亚',
    code: 'TZ',
    aliases: ['tz', 'tanzania', '坦桑尼亚', '坦尚尼亞', 'TZ'],
  },
  '🇷🇼': {
    en: 'Rwanda',
    zh: '卢旺达',
    code: 'RW',
    aliases: ['rw', 'rwanda', '卢旺达', '盧旺達', 'RW'],
  },
  '🇿🇼': {
    en: 'Zimbabwe',
    zh: '津巴布韦',
    code: 'ZW',
    aliases: ['zw', 'zimbabwe', '津巴布韦', '辛巴威', 'ZW'],
  },
  '🇿🇲': {
    en: 'Zambia',
    zh: '赞比亚',
    code: 'ZM',
    aliases: ['zm', 'zambia', '赞比亚', '尚比亞', 'ZM'],
  },
  '🇧🇼': {
    en: 'Botswana',
    zh: '博茨瓦纳',
    code: 'BW',
    aliases: ['bw', 'botswana', '博茨瓦纳', '波札那', 'BW'],
  },
  '🇳🇦': {
    en: 'Namibia',
    zh: '纳米比亚',
    code: 'NA',
    aliases: ['na', 'namibia', '纳米比亚', '納米比亞', 'NA'],
  },
  '🇲🇦': {
    en: 'Morocco',
    zh: '摩洛哥',
    code: 'MA',
    aliases: ['ma', 'morocco', '摩洛哥', 'MA'],
  },
  '🇩🇿': {
    en: 'Algeria',
    zh: '阿尔及利亚',
    code: 'DZ',
    aliases: ['dz', 'algeria', '阿尔及利亚', '阿爾及利亞', 'DZ'],
  },
  '🇹🇳': {
    en: 'Tunisia',
    zh: '突尼斯',
    code: 'TN',
    aliases: ['tn', 'tunisia', '突尼斯', 'TN'],
  },
  '🇱🇾': {
    en: 'Libya',
    zh: '利比亚',
    code: 'LY',
    aliases: ['ly', 'libya', '利比亚', '利比亞', 'LY'],
  },
  '🇸🇩': {
    en: 'Sudan',
    zh: '苏丹',
    code: 'SD',
    aliases: ['sd', 'sudan', '苏丹', '蘇丹', 'SD'],
  },
  '🇸🇸': {
    en: 'South Sudan',
    zh: '南苏丹',
    code: 'SS',
    aliases: ['ss', 'south sudan', '南苏丹', '南蘇丹', 'SS'],
  },
  '🇨🇩': {
    en: 'Democratic Republic of Congo',
    zh: '刚果民主共和国',
    code: 'CD',
    aliases: ['cd', 'congo', 'drc', '刚果', '剛果', 'CD'],
  },
  '🇨🇬': {
    en: 'Republic of Congo',
    zh: '刚果共和国',
    code: 'CG',
    aliases: ['cg', 'congo', '刚果', '剛果', 'CG'],
  },
  '🇨🇫': {
    en: 'Central African Republic',
    zh: '中非共和国',
    code: 'CF',
    aliases: ['cf', 'central african', '中非', 'CF'],
  },
  '🇨🇲': {
    en: 'Cameroon',
    zh: '喀麦隆',
    code: 'CM',
    aliases: ['cm', 'cameroon', '喀麦隆', '喀麥隆', 'CM'],
  },
  '🇹🇩': {
    en: 'Chad',
    zh: '乍得',
    code: 'TD',
    aliases: ['td', 'chad', '乍得', 'TD'],
  },
  '🇳🇪': {
    en: 'Niger',
    zh: '尼日尔',
    code: 'NE',
    aliases: ['ne', 'niger', '尼日尔', '尼日爾', 'NE'],
  },
  '🇲🇱': {
    en: 'Mali',
    zh: '马里',
    code: 'ML',
    aliases: ['ml', 'mali', '马里', '馬利', 'ML'],
  },
  '🇧🇫': {
    en: 'Burkina Faso',
    zh: '布基纳法索',
    code: 'BF',
    aliases: ['bf', 'burkina', '布基纳法索', '布吉納法索', 'BF'],
  },
  '🇸🇳': {
    en: 'Senegal',
    zh: '塞内加尔',
    code: 'SN',
    aliases: ['sn', 'senegal', '塞内加尔', '塞內加爾', 'SN'],
  },
  '🇬🇲': {
    en: 'Gambia',
    zh: '冈比亚',
    code: 'GM',
    aliases: ['gm', 'gambia', '冈比亚', '甘比亞', 'GM'],
  },
  '🇬🇼': {
    en: 'Guinea-Bissau',
    zh: '几内亚比绍',
    code: 'GW',
    aliases: ['gw', 'guinea-bissau', '几内亚比绍', '幾內亞比索', 'GW'],
  },
  '🇬🇳': {
    en: 'Guinea',
    zh: '几内亚',
    code: 'GN',
    aliases: ['gn', 'guinea', '几内亚', '幾內亞', 'GN'],
  },
  '🇸🇱': {
    en: 'Sierra Leone',
    zh: '塞拉利昂',
    code: 'SL',
    aliases: ['sl', 'sierra leone', '塞拉利昂', 'SL'],
  },
  '🇱🇷': {
    en: 'Liberia',
    zh: '利比里亚',
    code: 'LR',
    aliases: ['lr', 'liberia', '利比里亚', '賴比瑞亞', 'LR'],
  },
  '🇨🇮': {
    en: 'Ivory Coast',
    zh: '科特迪瓦',
    code: 'CI',
    aliases: ['ci', 'ivory coast', '科特迪瓦', '象牙海岸', 'CI'],
  },
  '🇹🇬': {
    en: 'Togo',
    zh: '多哥',
    code: 'TG',
    aliases: ['tg', 'togo', '多哥', 'TG'],
  },
  '🇧🇯': {
    en: 'Benin',
    zh: '贝宁',
    code: 'BJ',
    aliases: ['bj', 'benin', '贝宁', '貝寧', 'BJ'],
  },
}

/**
 * 检查地区emoji是否匹配搜索词
 * @param regionEmoji 地区emoji（如：🇭🇰）
 * @param searchTerm 搜索词
 * @returns 是否匹配
 */
export function isRegionMatch(regionEmoji: string, searchTerm: string): boolean {
  const lowerSearchTerm = searchTerm.toLowerCase().trim()

  // 直接匹配emoji
  if (regionEmoji === searchTerm) {
    return true
  }

  // 从映射表中查找
  const regionInfo = emojiToRegionMap[regionEmoji]
  if (!regionInfo) {
    // 如果映射表中没有，则只进行简单的包含匹配
    return regionEmoji.toLowerCase().includes(lowerSearchTerm)
  }

  // 检查英文名称
  if (regionInfo.en.toLowerCase().includes(lowerSearchTerm)) {
    return true
  }

  // 检查中文名称
  if (regionInfo.zh.includes(lowerSearchTerm)) {
    return true
  }

  // 检查别名
  return regionInfo.aliases.some(alias =>
    alias.toLowerCase().includes(lowerSearchTerm),
  )
}

/**
 * 获取地区的显示名称
 * @param regionEmoji 地区emoji
 * @param language 语言 ('en' | 'zh')
 * @returns 地区名称
 */
export function getRegionDisplayName(regionEmoji: string, language: 'en' | 'zh' = 'zh'): string {
  const regionInfo = emojiToRegionMap[regionEmoji]
  if (!regionInfo) {
    return regionEmoji
  }

  return language === 'zh' ? regionInfo.zh : regionInfo.en
}

/**
 * 获取所有支持的地区emoji列表
 * @returns 地区emoji数组
 */
export function getSupportedRegions(): string[] {
  return Object.keys(emojiToRegionMap)
}

/**
 * 获取地区代码
 * @param regionEmoji 地区emoji
 * @returns 地区代码（如：HK, CN, US）
 */
export function getRegionCode(regionEmoji: string): string {
  const regionInfo = emojiToRegionMap[regionEmoji]
  if (!regionInfo) {
    return regionEmoji
  }

  return regionInfo.code
}

/**
 * 根据地区代码获取emoji
 * @param code 地区代码（如：HK, CN, US）
 * @returns 地区emoji
 */
export function getEmojiByCode(code: string): string {
  const upperCode = code.toUpperCase()
  for (const [emoji, info] of Object.entries(emojiToRegionMap)) {
    if (info.code === upperCode) {
      return emoji
    }
  }
  return code
}

/**
 * 根据搜索词查找匹配的地区
 * @param searchTerm 搜索词
 * @returns 匹配的地区信息数组
 */
export function searchRegions(searchTerm: string): Array<{ emoji: string, en: string, zh: string, code: string }> {
  const results: Array<{ emoji: string, en: string, zh: string, code: string }> = []
  const lowerSearchTerm = searchTerm.toLowerCase().trim()

  for (const [emoji, info] of Object.entries(emojiToRegionMap)) {
    if (isRegionMatch(emoji, lowerSearchTerm)) {
      results.push({
        emoji,
        en: info.en,
        zh: info.zh,
        code: info.code,
      })
    }
  }

  return results
}

/**
 * 根据别名或代码获取地区信息
 * @param aliasOrCode 别名或代码（如：hk, HK, 香港, hongkong）
 * @returns 地区信息，如果未找到则返回 null
 */
export function getRegionByAlias(aliasOrCode: string): { emoji: string, en: string, zh: string, code: string } | null {
  const lowerAlias = aliasOrCode.toLowerCase().trim()

  for (const [emoji, info] of Object.entries(emojiToRegionMap)) {
    // 直接匹配代码
    if (info.code.toLowerCase() === lowerAlias) {
      return { emoji, en: info.en, zh: info.zh, code: info.code }
    }

    // 匹配别名
    if (info.aliases.some(alias => alias.toLowerCase() === lowerAlias)) {
      return { emoji, en: info.en, zh: info.zh, code: info.code }
    }
  }

  return null
}

/**
 * 从文本中提取地区emoji
 * @param text 包含地区emoji的文本
 * @returns 提取到的地区emoji数组
 */
export function extractRegionEmojis(text: string): string[] {
  const emojis: string[] = []
  // 匹配国旗emoji（由两个区域指示符字符组成）
  const flagRegex = /[\u{1F1E0}-\u{1F1FF}]{2}/gu
  const matches = text.match(flagRegex)

  if (matches) {
    for (const match of matches) {
      if (emojiToRegionMap[match]) {
        emojis.push(match)
      }
    }
  }

  return emojis
}
