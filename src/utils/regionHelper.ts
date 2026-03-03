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
  '🇦🇪': {
    en: 'United Arab Emirates',
    zh: '阿联酋',
    code: 'AE',
    aliases: ['ae', 'uae', 'united arab emirates', '阿联酋', 'AE'],
  },
  '🇦🇫': {
    en: 'Afghanistan',
    zh: '阿富汗',
    code: 'AF',
    aliases: ['af', 'afghanistan', '阿富汗', 'AF'],
  },
  '🇦🇬': {
    en: 'Antigua and Barbuda',
    zh: '安提瓜和巴布达',
    code: 'AG',
    aliases: ['ag', 'antigua', 'antigua and barbuda', '安提瓜', 'AG'],
  },
  '🇦🇮': {
    en: 'Anguilla',
    zh: '安圭拉',
    code: 'AI',
    aliases: ['ai', 'anguilla', '安圭拉', 'AI'],
  },
  '🇦🇱': {
    en: 'Albania',
    zh: '阿尔巴尼亚',
    code: 'AL',
    aliases: ['al', 'albania', '阿尔巴尼亚', '阿爾巴尼亞', 'AL'],
  },
  '🇦🇲': {
    en: 'Armenia',
    zh: '亚美尼亚',
    code: 'AM',
    aliases: ['am', 'armenia', '亚美尼亚', '亞美尼亞', 'AM'],
  },
  '🇦🇴': {
    en: 'Angola',
    zh: '安哥拉',
    code: 'AO',
    aliases: ['ao', 'angola', '安哥拉', 'AO'],
  },
  '🇦🇶': {
    en: 'Antarctica',
    zh: '南极洲',
    code: 'AQ',
    aliases: ['aq', 'antarctica', '南极', '南極', 'AQ'],
  },
  '🇦🇷': {
    en: 'Argentina',
    zh: '阿根廷',
    code: 'AR',
    aliases: ['ar', 'argentina', '阿根廷', 'AR'],
  },
  '🇦🇸': {
    en: 'American Samoa',
    zh: '美属萨摩亚',
    code: 'AS',
    aliases: ['as', 'american samoa', '美属萨摩亚', '美屬薩摩亞', 'AS'],
  },
  '🇦🇼': {
    en: 'Aruba',
    zh: '阿鲁巴',
    code: 'AW',
    aliases: ['aw', 'aruba', '阿鲁巴', '阿魯巴', 'AW'],
  },
  '🇦🇽': {
    en: 'Åland Islands',
    zh: '奥兰群岛',
    code: 'AX',
    aliases: ['ax', 'aland', 'Åland', '奥兰', '奧蘭', 'AX'],
  },
  '🇦🇿': {
    en: 'Azerbaijan',
    zh: '阿塞拜疆',
    code: 'AZ',
    aliases: ['az', 'azerbaijan', '阿塞拜疆', 'AZ'],
  },
  '🇧🇦': {
    en: 'Bosnia and Herzegovina',
    zh: '波黑',
    code: 'BA',
    aliases: ['ba', 'bosnia', 'bosnia and herzegovina', '波黑', '波士尼亞', 'BA'],
  },
  '🇧🇩': {
    en: 'Bangladesh',
    zh: '孟加拉国',
    code: 'BD',
    aliases: ['bd', 'bangladesh', '孟加拉', 'BD'],
  },
  '🇧🇭': {
    en: 'Bahrain',
    zh: '巴林',
    code: 'BH',
    aliases: ['bh', 'bahrain', '巴林', 'BH'],
  },
  '🇧🇮': {
    en: 'Burundi',
    zh: '布隆迪',
    code: 'BI',
    aliases: ['bi', 'burundi', '布隆迪', 'BI'],
  },
  '🇧🇱': {
    en: 'Saint Barthélemy',
    zh: '圣巴泰勒米',
    code: 'BL',
    aliases: ['bl', 'saint barthelemy', '圣巴泰勒米', '聖巴泰勒米', 'BL'],
  },
  '🇧🇲': {
    en: 'Bermuda',
    zh: '百慕大',
    code: 'BM',
    aliases: ['bm', 'bermuda', '百慕大', 'BM'],
  },
  '🇧🇳': {
    en: 'Brunei',
    zh: '文莱',
    code: 'BN',
    aliases: ['bn', 'brunei', '文莱', '汶萊', 'BN'],
  },
  '🇧🇶': {
    en: 'Caribbean Netherlands',
    zh: '荷属加勒比',
    code: 'BQ',
    aliases: ['bq', 'caribbean netherlands', '荷属加勒比', 'BQ'],
  },
  '🇧🇹': {
    en: 'Bhutan',
    zh: '不丹',
    code: 'BT',
    aliases: ['bt', 'bhutan', '不丹', 'BT'],
  },
  '🇧🇻': {
    en: 'Bouvet Island',
    zh: '布韦岛',
    code: 'BV',
    aliases: ['bv', 'bouvet', '布韦岛', '布韋島', 'BV'],
  },
  '🇧🇼': {
    en: 'Botswana',
    zh: '博茨瓦纳',
    code: 'BW',
    aliases: ['bw', 'botswana', '博茨瓦纳', '波札那', 'BW'],
  },
  '🇧🇾': {
    en: 'Belarus',
    zh: '白俄罗斯',
    code: 'BY',
    aliases: ['by', 'belarus', '白俄罗斯', '白俄羅斯', 'BY'],
  },
  '🇧🇿': {
    en: 'Belize',
    zh: '伯利兹',
    code: 'BZ',
    aliases: ['bz', 'belize', '伯利兹', '伯利茲', 'BZ'],
  },
  '🇨🇨': {
    en: 'Cocos Islands',
    zh: '科科斯群岛',
    code: 'CC',
    aliases: ['cc', 'cocos', 'cocos islands', '科科斯', 'CC'],
  },
  '🇨🇩': {
    en: 'Democratic Republic of Congo',
    zh: '刚果民主共和国',
    code: 'CD',
    aliases: ['cd', 'congo', 'drc', '刚果', '剛果', 'CD'],
  },
  '🇨🇫': {
    en: 'Central African Republic',
    zh: '中非共和国',
    code: 'CF',
    aliases: ['cf', 'central african', '中非', 'CF'],
  },
  '🇨🇬': {
    en: 'Republic of Congo',
    zh: '刚果共和国',
    code: 'CG',
    aliases: ['cg', 'congo', '刚果', '剛果', 'CG'],
  },
  '🇨🇭': {
    en: 'Switzerland',
    zh: '瑞士',
    code: 'CH',
    aliases: ['ch', 'switzerland', '瑞士', 'CH'],
  },
  '🇨🇮': {
    en: 'Ivory Coast',
    zh: '科特迪瓦',
    code: 'CI',
    aliases: ['ci', 'ivory coast', '科特迪瓦', '象牙海岸', 'CI'],
  },
  '🇨🇰': {
    en: 'Cook Islands',
    zh: '库克群岛',
    code: 'CK',
    aliases: ['ck', 'cook islands', '库克', '庫克', 'CK'],
  },
  '🇨🇱': {
    en: 'Chile',
    zh: '智利',
    code: 'CL',
    aliases: ['cl', 'chile', '智利', 'CL'],
  },
  '🇨🇲': {
    en: 'Cameroon',
    zh: '喀麦隆',
    code: 'CM',
    aliases: ['cm', 'cameroon', '喀麦隆', '喀麥隆', 'CM'],
  },
  '🇨🇴': {
    en: 'Colombia',
    zh: '哥伦比亚',
    code: 'CO',
    aliases: ['co', 'colombia', '哥伦比亚', '哥倫比亞', 'CO'],
  },
  '🇨🇵': {
    en: 'Clipperton Island',
    zh: '克利珀顿岛',
    code: 'CP',
    aliases: ['cp', 'clipperton', '克利珀顿', '克利珀頓', 'CP'],
  },
  '🇨🇷': {
    en: 'Costa Rica',
    zh: '哥斯达黎加',
    code: 'CR',
    aliases: ['cr', 'costa rica', '哥斯达黎加', '哥斯達黎加', 'CR'],
  },
  '🇨🇺': {
    en: 'Cuba',
    zh: '古巴',
    code: 'CU',
    aliases: ['cu', 'cuba', '古巴', 'CU'],
  },
  '🇨🇻': {
    en: 'Cape Verde',
    zh: '佛得角',
    code: 'CV',
    aliases: ['cv', 'cape verde', '佛得角', '佛得角', 'CV'],
  },
  '🇨🇼': {
    en: 'Curaçao',
    zh: '库拉索',
    code: 'CW',
    aliases: ['cw', 'curacao', '库拉索', '庫拉索', 'CW'],
  },
  '🇨🇽': {
    en: 'Christmas Island',
    zh: '圣诞岛',
    code: 'CX',
    aliases: ['cx', 'christmas island', '圣诞岛', '聖誕島', 'CX'],
  },
  '🇨🇾': {
    en: 'Cyprus',
    zh: '塞浦路斯',
    code: 'CY',
    aliases: ['cy', 'cyprus', '塞浦路斯', 'CY'],
  },
  '🇨🇿': {
    en: 'Czech Republic',
    zh: '捷克',
    code: 'CZ',
    aliases: ['cz', 'czech', 'czech republic', '捷克', 'CZ'],
  },
  '🇩🇪': {
    en: 'Germany',
    zh: '德国',
    code: 'DE',
    aliases: ['de', 'germany', 'deutschland', '德国', '德國', 'DE'],
  },
  '🇩🇬': {
    en: 'Diego Garcia',
    zh: '迪戈加西亚',
    code: 'DG',
    aliases: ['dg', 'diego garcia', '迪戈加西亚', '迪戈加西亞', 'DG'],
  },
  '🇩🇯': {
    en: 'Djibouti',
    zh: '吉布提',
    code: 'DJ',
    aliases: ['dj', 'djibouti', '吉布提', 'DJ'],
  },
  '🇩🇰': {
    en: 'Denmark',
    zh: '丹麦',
    code: 'DK',
    aliases: ['dk', 'denmark', '丹麦', '丹麥', 'DK'],
  },
  '🇩🇲': {
    en: 'Dominica',
    zh: '多米尼克',
    code: 'DM',
    aliases: ['dm', 'dominica', '多米尼克', 'DM'],
  },
  '🇩🇴': {
    en: 'Dominican Republic',
    zh: '多明尼加',
    code: 'DO',
    aliases: ['do', 'dominican', '多明尼加', 'DO'],
  },
  '🇩🇿': {
    en: 'Algeria',
    zh: '阿尔及利亚',
    code: 'DZ',
    aliases: ['dz', 'algeria', '阿尔及利亚', '阿爾及利亞', 'DZ'],
  },
  '🇪🇦': {
    en: 'Ceuta and Melilla',
    zh: '休达和梅利利亚',
    code: 'EA',
    aliases: ['ea', 'ceuta', 'melilla', '休达', '休達', 'EA'],
  },
  '🇪🇨': {
    en: 'Ecuador',
    zh: '厄瓜多尔',
    code: 'EC',
    aliases: ['ec', 'ecuador', '厄瓜多尔', '厄瓜多爾', 'EC'],
  },
  '🇪🇪': {
    en: 'Estonia',
    zh: '爱沙尼亚',
    code: 'EE',
    aliases: ['ee', 'estonia', '爱沙尼亚', '愛沙尼亞', 'EE'],
  },
  '🇪🇬': {
    en: 'Egypt',
    zh: '埃及',
    code: 'EG',
    aliases: ['eg', 'egypt', '埃及', 'EG'],
  },
  '🇪🇭': {
    en: 'Western Sahara',
    zh: '西撒哈拉',
    code: 'EH',
    aliases: ['eh', 'western sahara', '西撒哈拉', 'EH'],
  },
  '🇪🇷': {
    en: 'Eritrea',
    zh: '厄立特里亚',
    code: 'ER',
    aliases: ['er', 'eritrea', '厄立特里亚', '厄立特里亞', 'ER'],
  },
  '🇪🇸': {
    en: 'Spain',
    zh: '西班牙',
    code: 'ES',
    aliases: ['es', 'spain', '西班牙', 'ES'],
  },
  '🇪🇹': {
    en: 'Ethiopia',
    zh: '埃塞俄比亚',
    code: 'ET',
    aliases: ['et', 'ethiopia', '埃塞俄比亚', '埃塞俄比亞', 'ET'],
  },
  '🇪🇺': {
    en: 'European Union',
    zh: '欧盟',
    code: 'EU',
    aliases: ['eu', 'european union', '欧盟', '歐盟', 'EU'],
  },
  '🇫🇮': {
    en: 'Finland',
    zh: '芬兰',
    code: 'FI',
    aliases: ['fi', 'finland', '芬兰', '芬蘭', 'FI'],
  },
  '🇫🇯': {
    en: 'Fiji',
    zh: '斐济',
    code: 'FJ',
    aliases: ['fj', 'fiji', '斐济', '斐濟', 'FJ'],
  },
  '🇫🇰': {
    en: 'Falkland Islands',
    zh: '福克兰群岛',
    code: 'FK',
    aliases: ['fk', 'falkland', '福克兰', '福克蘭', 'FK'],
  },
  '🇫🇲': {
    en: 'Micronesia',
    zh: '密克罗尼西亚',
    code: 'FM',
    aliases: ['fm', 'micronesia', '密克罗尼西亚', '密克羅尼西亞', 'FM'],
  },
  '🇫🇴': {
    en: 'Faroe Islands',
    zh: '法罗群岛',
    code: 'FO',
    aliases: ['fo', 'faroe', 'faroe islands', '法罗', '法羅', 'FO'],
  },
  '🇫🇷': {
    en: 'France',
    zh: '法国',
    code: 'FR',
    aliases: ['fr', 'france', '法国', '法國', 'FR'],
  },
  '🇬🇦': {
    en: 'Gabon',
    zh: '加蓬',
    code: 'GA',
    aliases: ['ga', 'gabon', '加蓬', '加蓬', 'GA'],
  },
  '🇬🇧': {
    en: 'United Kingdom',
    zh: '英国',
    code: 'GB',
    aliases: ['gb', 'uk', 'united kingdom', 'britain', '英国', '英國', 'GB', 'UK'],
  },
  '🇬🇩': {
    en: 'Grenada',
    zh: '格林纳达',
    code: 'GD',
    aliases: ['gd', 'grenada', '格林纳达', '格林納達', 'GD'],
  },
  '🇬🇪': {
    en: 'Georgia',
    zh: '格鲁吉亚',
    code: 'GE',
    aliases: ['ge', 'georgia', '格鲁吉亚', '格魯吉亞', 'GE'],
  },
  '🇬🇫': {
    en: 'French Guiana',
    zh: '法属圭亚那',
    code: 'GF',
    aliases: ['gf', 'french guiana', '法属圭亚那', '法屬圭亞那', 'GF'],
  },
  '🇬🇬': {
    en: 'Guernsey',
    zh: '根西岛',
    code: 'GG',
    aliases: ['gg', 'guernsey', '根西岛', '根西島', 'GG'],
  },
  '🇬🇭': {
    en: 'Ghana',
    zh: '加纳',
    code: 'GH',
    aliases: ['gh', 'ghana', '加纳', '迦納', 'GH'],
  },
  '🇬🇮': {
    en: 'Gibraltar',
    zh: '直布罗陀',
    code: 'GI',
    aliases: ['gi', 'gibraltar', '直布罗陀', '直布羅陀', 'GI'],
  },
  '🇬🇱': {
    en: 'Greenland',
    zh: '格陵兰',
    code: 'GL',
    aliases: ['gl', 'greenland', '格陵兰', '格陵蘭', 'GL'],
  },
  '🇬🇲': {
    en: 'Gambia',
    zh: '冈比亚',
    code: 'GM',
    aliases: ['gm', 'gambia', '冈比亚', '甘比亞', 'GM'],
  },
  '🇬🇳': {
    en: 'Guinea',
    zh: '几内亚',
    code: 'GN',
    aliases: ['gn', 'guinea', '几内亚', '幾內亞', 'GN'],
  },
  '🇬🇵': {
    en: 'Guadeloupe',
    zh: '瓜德罗普',
    code: 'GP',
    aliases: ['gp', 'guadeloupe', '瓜德罗普', '瓜德羅普', 'GP'],
  },
  '🇬🇶': {
    en: 'Equatorial Guinea',
    zh: '赤道几内亚',
    code: 'GQ',
    aliases: ['gq', 'equatorial guinea', '赤道几内亚', '赤道幾內亞', 'GQ'],
  },
  '🇬🇷': {
    en: 'Greece',
    zh: '希腊',
    code: 'GR',
    aliases: ['gr', 'greece', '希腊', '希臘', 'GR'],
  },
  '🇬🇸': {
    en: 'South Georgia',
    zh: '南乔治亚',
    code: 'GS',
    aliases: ['gs', 'south georgia', '南乔治亚', '南喬治亞', 'GS'],
  },
  '🇬🇹': {
    en: 'Guatemala',
    zh: '危地马拉',
    code: 'GT',
    aliases: ['gt', 'guatemala', '危地马拉', '危地馬拉', 'GT'],
  },
  '🇬🇺': {
    en: 'Guam',
    zh: '关岛',
    code: 'GU',
    aliases: ['gu', 'guam', '关岛', '關島', 'GU'],
  },
  '🇬🇼': {
    en: 'Guinea-Bissau',
    zh: '几内亚比绍',
    code: 'GW',
    aliases: ['gw', 'guinea-bissau', '几内亚比绍', '幾內亞比索', 'GW'],
  },
  '🇬🇾': {
    en: 'Guyana',
    zh: '圭亚那',
    code: 'GY',
    aliases: ['gy', 'guyana', '圭亚那', '圭亞那', 'GY'],
  },
  '🇭🇰': {
    en: 'Hong Kong',
    zh: '香港',
    code: 'HK',
    aliases: ['hk', 'hongkong', 'hong kong', '香港', 'HK'],
  },
  '🇭🇲': {
    en: 'Heard Island',
    zh: '赫德岛',
    code: 'HM',
    aliases: ['hm', 'heard', 'heard island', '赫德岛', '赫德島', 'HM'],
  },
  '🇭🇳': {
    en: 'Honduras',
    zh: '洪都拉斯',
    code: 'HN',
    aliases: ['hn', 'honduras', '洪都拉斯', 'HN'],
  },
  '🇭🇷': {
    en: 'Croatia',
    zh: '克罗地亚',
    code: 'HR',
    aliases: ['hr', 'croatia', '克罗地亚', '克羅地亞', 'HR'],
  },
  '🇭🇹': {
    en: 'Haiti',
    zh: '海地',
    code: 'HT',
    aliases: ['ht', 'haiti', '海地', 'HT'],
  },
  '🇭🇺': {
    en: 'Hungary',
    zh: '匈牙利',
    code: 'HU',
    aliases: ['hu', 'hungary', '匈牙利', 'HU'],
  },
  '🇮🇨': {
    en: 'Canary Islands',
    zh: '加那利群岛',
    code: 'IC',
    aliases: ['ic', 'canary islands', '加那利', '加那利群島', 'IC'],
  },
  '🇮🇩': {
    en: 'Indonesia',
    zh: '印度尼西亚',
    code: 'ID',
    aliases: ['id', 'indonesia', '印度尼西亚', '印尼', 'ID'],
  },
  '🇮🇪': {
    en: 'Ireland',
    zh: '爱尔兰',
    code: 'IE',
    aliases: ['ie', 'ireland', '爱尔兰', '愛爾蘭', 'IE'],
  },
  '🇮🇱': {
    en: 'Israel',
    zh: '以色列',
    code: 'IL',
    aliases: ['il', 'israel', '以色列', 'IL'],
  },
  '🇮🇲': {
    en: 'Isle of Man',
    zh: '马恩岛',
    code: 'IM',
    aliases: ['im', 'isle of man', '马恩岛', '馬恩島', 'IM'],
  },
  '🇮🇳': {
    en: 'India',
    zh: '印度',
    code: 'IN',
    aliases: ['in', 'india', '印度', 'IN'],
  },
  '🇮🇴': {
    en: 'British Indian Ocean Territory',
    zh: '英属印度洋领地',
    code: 'IO',
    aliases: ['io', 'british indian ocean', '英属印度洋', '英屬印度洋', 'IO'],
  },
  '🇮🇶': {
    en: 'Iraq',
    zh: '伊拉克',
    code: 'IQ',
    aliases: ['iq', 'iraq', '伊拉克', 'IQ'],
  },
  '🇮🇷': {
    en: 'Iran',
    zh: '伊朗',
    code: 'IR',
    aliases: ['ir', 'iran', '伊朗', 'IR'],
  },
  '🇮🇸': {
    en: 'Iceland',
    zh: '冰岛',
    code: 'IS',
    aliases: ['is', 'iceland', '冰岛', '冰島', 'IS'],
  },
  '🇮🇹': {
    en: 'Italy',
    zh: '意大利',
    code: 'IT',
    aliases: ['it', 'italy', '意大利', 'IT'],
  },
  '🇯🇪': {
    en: 'Jersey',
    zh: '泽西岛',
    code: 'JE',
    aliases: ['je', 'jersey', '泽西岛', '澤西島', 'JE'],
  },
  '🇯🇲': {
    en: 'Jamaica',
    zh: '牙买加',
    code: 'JM',
    aliases: ['jm', 'jamaica', '牙买加', '牙買加', 'JM'],
  },
  '🇯🇴': {
    en: 'Jordan',
    zh: '约旦',
    code: 'JO',
    aliases: ['jo', 'jordan', '约旦', '約旦', 'JO'],
  },
  '🇯🇵': {
    en: 'Japan',
    zh: '日本',
    code: 'JP',
    aliases: ['jp', 'japan', '日本', 'JP'],
  },
  '🇰🇪': {
    en: 'Kenya',
    zh: '肯尼亚',
    code: 'KE',
    aliases: ['ke', 'kenya', '肯尼亚', '肯亞', 'KE'],
  },
  '🇰🇬': {
    en: 'Kyrgyzstan',
    zh: '吉尔吉斯斯坦',
    code: 'KG',
    aliases: ['kg', 'kyrgyzstan', '吉尔吉斯斯坦', '吉爾吉斯斯坦', 'KG'],
  },
  '🇰🇭': {
    en: 'Cambodia',
    zh: '柬埔寨',
    code: 'KH',
    aliases: ['kh', 'cambodia', '柬埔寨', 'KH'],
  },
  '🇰🇮': {
    en: 'Kiribati',
    zh: '基里巴斯',
    code: 'KI',
    aliases: ['ki', 'kiribati', '基里巴斯', 'KI'],
  },
  '🇰🇲': {
    en: 'Comoros',
    zh: '科摩罗',
    code: 'KM',
    aliases: ['km', 'comoros', '科摩罗', '科摩羅', 'KM'],
  },
  '🇰🇳': {
    en: 'Saint Kitts and Nevis',
    zh: '圣基茨和尼维斯',
    code: 'KN',
    aliases: ['kn', 'saint kitts', 'kitts and nevis', '圣基茨', '聖基茨', 'KN'],
  },
  '🇰🇵': {
    en: 'North Korea',
    zh: '朝鲜',
    code: 'KP',
    aliases: ['kp', 'north korea', '朝鲜', '北韓', 'KP'],
  },
  '🇰🇷': {
    en: 'South Korea',
    zh: '韩国',
    code: 'KR',
    aliases: ['kr', 'korea', 'south korea', '韩国', '南韩', 'KR'],
  },
  '🇰🇼': {
    en: 'Kuwait',
    zh: '科威特',
    code: 'KW',
    aliases: ['kw', 'kuwait', '科威特', 'KW'],
  },
  '🇰🇾': {
    en: 'Cayman Islands',
    zh: '开曼群岛',
    code: 'KY',
    aliases: ['ky', 'cayman', 'cayman islands', '开曼', '開曼', 'KY'],
  },
  '🇰🇿': {
    en: 'Kazakhstan',
    zh: '哈萨克斯坦',
    code: 'KZ',
    aliases: ['kz', 'kazakhstan', '哈萨克斯坦', '哈薩克斯坦', 'KZ'],
  },
  '🇱🇦': {
    en: 'Laos',
    zh: '老挝',
    code: 'LA',
    aliases: ['la', 'laos', '老挝', '老撾', 'LA'],
  },
  '🇱🇧': {
    en: 'Lebanon',
    zh: '黎巴嫩',
    code: 'LB',
    aliases: ['lb', 'lebanon', '黎巴嫩', 'LB'],
  },
  '🇱🇨': {
    en: 'Saint Lucia',
    zh: '圣卢西亚',
    code: 'LC',
    aliases: ['lc', 'saint lucia', 'lucia', '圣卢西亚', '聖盧西亞', 'LC'],
  },
  '🇱🇮': {
    en: 'Liechtenstein',
    zh: '列支敦士登',
    code: 'LI',
    aliases: ['li', 'liechtenstein', '列支敦士登', 'LI'],
  },
  '🇱🇰': {
    en: 'Sri Lanka',
    zh: '斯里兰卡',
    code: 'LK',
    aliases: ['lk', 'sri lanka', '斯里兰卡', '斯里蘭卡', 'LK'],
  },
  '🇱🇷': {
    en: 'Liberia',
    zh: '利比里亚',
    code: 'LR',
    aliases: ['lr', 'liberia', '利比里亚', '賴比瑞亞', 'LR'],
  },
  '🇱🇸': {
    en: 'Lesotho',
    zh: '莱索托',
    code: 'LS',
    aliases: ['ls', 'lesotho', '莱索托', '萊索托', 'LS'],
  },
  '🇱🇹': {
    en: 'Lithuania',
    zh: '立陶宛',
    code: 'LT',
    aliases: ['lt', 'lithuania', '立陶宛', 'LT'],
  },
  '🇱🇺': {
    en: 'Luxembourg',
    zh: '卢森堡',
    code: 'LU',
    aliases: ['lu', 'luxembourg', '卢森堡', '盧森堡', 'LU'],
  },
  '🇱🇻': {
    en: 'Latvia',
    zh: '拉脱维亚',
    code: 'LV',
    aliases: ['lv', 'latvia', '拉脱维亚', '拉脫維亞', 'LV'],
  },
  '🇱🇾': {
    en: 'Libya',
    zh: '利比亚',
    code: 'LY',
    aliases: ['ly', 'libya', '利比亚', '利比亞', 'LY'],
  },
  '🇲🇦': {
    en: 'Morocco',
    zh: '摩洛哥',
    code: 'MA',
    aliases: ['ma', 'morocco', '摩洛哥', 'MA'],
  },
  '🇲🇨': {
    en: 'Monaco',
    zh: '摩纳哥',
    code: 'MC',
    aliases: ['mc', 'monaco', '摩纳哥', '摩納哥', 'MC'],
  },
  '🇲🇩': {
    en: 'Moldova',
    zh: '摩尔多瓦',
    code: 'MD',
    aliases: ['md', 'moldova', '摩尔多瓦', '摩爾多瓦', 'MD'],
  },
  '🇲🇪': {
    en: 'Montenegro',
    zh: '黑山',
    code: 'ME',
    aliases: ['me', 'montenegro', '黑山', 'ME'],
  },
  '🇲🇫': {
    en: 'Saint Martin',
    zh: '法属圣马丁',
    code: 'MF',
    aliases: ['mf', 'saint martin', '法属圣马丁', '法屬聖馬丁', 'MF'],
  },
  '🇲🇬': {
    en: 'Madagascar',
    zh: '马达加斯加',
    code: 'MG',
    aliases: ['mg', 'madagascar', '马达加斯加', '馬達加斯加', 'MG'],
  },
  '🇲🇭': {
    en: 'Marshall Islands',
    zh: '马绍尔群岛',
    code: 'MH',
    aliases: ['mh', 'marshall', 'marshall islands', '马绍尔', '馬紹爾', 'MH'],
  },
  '🇲🇰': {
    en: 'North Macedonia',
    zh: '北马其顿',
    code: 'MK',
    aliases: ['mk', 'north macedonia', 'macedonia', '北马其顿', '北馬其頓', 'MK'],
  },
  '🇲🇱': {
    en: 'Mali',
    zh: '马里',
    code: 'ML',
    aliases: ['ml', 'mali', '马里', '馬利', 'ML'],
  },
  '🇲🇲': {
    en: 'Myanmar',
    zh: '缅甸',
    code: 'MM',
    aliases: ['mm', 'myanmar', 'burma', '缅甸', '緬甸', 'MM'],
  },
  '🇲🇳': {
    en: 'Mongolia',
    zh: '蒙古',
    code: 'MN',
    aliases: ['mn', 'mongolia', '蒙古', 'MN'],
  },
  '🇲🇴': {
    en: 'Macau',
    zh: '澳门',
    code: 'MO',
    aliases: ['mo', 'macau', 'macao', '澳门', '澳門', 'MO'],
  },
  '🇲🇵': {
    en: 'Northern Mariana Islands',
    zh: '北马里亚纳群岛',
    code: 'MP',
    aliases: ['mp', 'northern mariana', '北马里亚纳', '北馬里亞納', 'MP'],
  },
  '🇲🇶': {
    en: 'Martinique',
    zh: '马提尼克',
    code: 'MQ',
    aliases: ['mq', 'martinique', '马提尼克', '馬提尼克', 'MQ'],
  },
  '🇲🇷': {
    en: 'Mauritania',
    zh: '毛里塔尼亚',
    code: 'MR',
    aliases: ['mr', 'mauritania', '毛里塔尼亚', '毛里塔尼亞', 'MR'],
  },
  '🇲🇸': {
    en: 'Montserrat',
    zh: '蒙特塞拉特',
    code: 'MS',
    aliases: ['ms', 'montserrat', '蒙特塞拉特', 'MS'],
  },
  '🇲🇹': {
    en: 'Malta',
    zh: '马耳他',
    code: 'MT',
    aliases: ['mt', 'malta', '马耳他', '馬耳他', 'MT'],
  },
  '🇲🇺': {
    en: 'Mauritius',
    zh: '毛里求斯',
    code: 'MU',
    aliases: ['mu', 'mauritius', '毛里求斯', '毛里求斯', 'MU'],
  },
  '🇲🇻': {
    en: 'Maldives',
    zh: '马尔代夫',
    code: 'MV',
    aliases: ['mv', 'maldives', '马尔代夫', '馬爾代夫', 'MV'],
  },
  '🇲🇼': {
    en: 'Malawi',
    zh: '马拉维',
    code: 'MW',
    aliases: ['mw', 'malawi', '马拉维', '馬拉維', 'MW'],
  },
  '🇲🇽': {
    en: 'Mexico',
    zh: '墨西哥',
    code: 'MX',
    aliases: ['mx', 'mexico', '墨西哥', 'MX'],
  },
  '🇲🇾': {
    en: 'Malaysia',
    zh: '马来西亚',
    code: 'MY',
    aliases: ['my', 'malaysia', '马来西亚', '馬來西亞', 'MY'],
  },
  '🇲🇿': {
    en: 'Mozambique',
    zh: '莫桑比克',
    code: 'MZ',
    aliases: ['mz', 'mozambique', '莫桑比克', '莫桑比克', 'MZ'],
  },
  '🇳🇦': {
    en: 'Namibia',
    zh: '纳米比亚',
    code: 'NA',
    aliases: ['na', 'namibia', '纳米比亚', '納米比亞', 'NA'],
  },
  '🇳🇨': {
    en: 'New Caledonia',
    zh: '新喀里多尼亚',
    code: 'NC',
    aliases: ['nc', 'new caledonia', '新喀里多尼亚', '新喀里多尼亞', 'NC'],
  },
  '🇳🇪': {
    en: 'Niger',
    zh: '尼日尔',
    code: 'NE',
    aliases: ['ne', 'niger', '尼日尔', '尼日爾', 'NE'],
  },
  '🇳🇫': {
    en: 'Norfolk Island',
    zh: '诺福克岛',
    code: 'NF',
    aliases: ['nf', 'norfolk', 'norfolk island', '诺福克', '諾福克', 'NF'],
  },
  '🇳🇬': {
    en: 'Nigeria',
    zh: '尼日利亚',
    code: 'NG',
    aliases: ['ng', 'nigeria', '尼日利亚', '尼日利亞', 'NG'],
  },
  '🇳🇮': {
    en: 'Nicaragua',
    zh: '尼加拉瓜',
    code: 'NI',
    aliases: ['ni', 'nicaragua', '尼加拉瓜', 'NI'],
  },
  '🇳🇱': {
    en: 'Netherlands',
    zh: '荷兰',
    code: 'NL',
    aliases: ['nl', 'netherlands', 'holland', '荷兰', '荷蘭', 'NL'],
  },
  '🇳🇴': {
    en: 'Norway',
    zh: '挪威',
    code: 'NO',
    aliases: ['no', 'norway', '挪威', 'NO'],
  },
  '🇳🇵': {
    en: 'Nepal',
    zh: '尼泊尔',
    code: 'NP',
    aliases: ['np', 'nepal', '尼泊尔', '尼泊爾', 'NP'],
  },
  '🇳🇷': {
    en: 'Nauru',
    zh: '瑙鲁',
    code: 'NR',
    aliases: ['nr', 'nauru', '瑙鲁', '瑙魯', 'NR'],
  },
  '🇳🇺': {
    en: 'Niue',
    zh: '纽埃',
    code: 'NU',
    aliases: ['nu', 'niue', '纽埃', '紐埃', 'NU'],
  },
  '🇳🇿': {
    en: 'New Zealand',
    zh: '新西兰',
    code: 'NZ',
    aliases: ['nz', 'new zealand', '新西兰', '新西蘭', 'NZ'],
  },
  '🇴🇲': {
    en: 'Oman',
    zh: '阿曼',
    code: 'OM',
    aliases: ['om', 'oman', '阿曼', 'OM'],
  },
  '🇵🇦': {
    en: 'Panama',
    zh: '巴拿马',
    code: 'PA',
    aliases: ['pa', 'panama', '巴拿马', '巴拿馬', 'PA'],
  },
  '🇵🇪': {
    en: 'Peru',
    zh: '秘鲁',
    code: 'PE',
    aliases: ['pe', 'peru', '秘鲁', '秘魯', 'PE'],
  },
  '🇵🇫': {
    en: 'French Polynesia',
    zh: '法属波利尼西亚',
    code: 'PF',
    aliases: ['pf', 'french polynesia', '法属波利尼西亚', '法屬波利尼西亞', 'PF'],
  },
  '🇵🇬': {
    en: 'Papua New Guinea',
    zh: '巴布亚新几内亚',
    code: 'PG',
    aliases: ['pg', 'papua new guinea', 'papua', '巴布亚', '巴布亞', 'PG'],
  },
  '🇵🇭': {
    en: 'Philippines',
    zh: '菲律宾',
    code: 'PH',
    aliases: ['ph', 'philippines', '菲律宾', '菲律賓', 'PH'],
  },
  '🇵🇰': {
    en: 'Pakistan',
    zh: '巴基斯坦',
    code: 'PK',
    aliases: ['pk', 'pakistan', '巴基斯坦', 'PK'],
  },
  '🇵🇱': {
    en: 'Poland',
    zh: '波兰',
    code: 'PL',
    aliases: ['pl', 'poland', '波兰', '波蘭', 'PL'],
  },
  '🇵🇲': {
    en: 'Saint Pierre and Miquelon',
    zh: '圣皮埃尔和密克隆',
    code: 'PM',
    aliases: ['pm', 'saint pierre', 'miquelon', '圣皮埃尔', '聖皮埃爾', 'PM'],
  },
  '🇵🇳': {
    en: 'Pitcairn Islands',
    zh: '皮特凯恩群岛',
    code: 'PN',
    aliases: ['pn', 'pitcairn', 'pitcairn islands', '皮特凯恩', '皮特凱恩', 'PN'],
  },
  '🇵🇷': {
    en: 'Puerto Rico',
    zh: '波多黎各',
    code: 'PR',
    aliases: ['pr', 'puerto rico', '波多黎各', 'PR'],
  },
  '🇵🇸': {
    en: 'Palestine',
    zh: '巴勒斯坦',
    code: 'PS',
    aliases: ['ps', 'palestine', '巴勒斯坦', 'PS'],
  },
  '🇵🇹': {
    en: 'Portugal',
    zh: '葡萄牙',
    code: 'PT',
    aliases: ['pt', 'portugal', '葡萄牙', 'PT'],
  },
  '🇵🇼': {
    en: 'Palau',
    zh: '帕劳',
    code: 'PW',
    aliases: ['pw', 'palau', '帕劳', '帕勞', 'PW'],
  },
  '🇵🇾': {
    en: 'Paraguay',
    zh: '巴拉圭',
    code: 'PY',
    aliases: ['py', 'paraguay', '巴拉圭', 'PY'],
  },
  '🇶🇦': {
    en: 'Qatar',
    zh: '卡塔尔',
    code: 'QA',
    aliases: ['qa', 'qatar', '卡塔尔', '卡塔爾', 'QA'],
  },
  '🇷🇪': {
    en: 'Réunion',
    zh: '留尼汪',
    code: 'RE',
    aliases: ['re', 'reunion', 'réunion', '留尼汪', 'RE'],
  },
  '🇷🇴': {
    en: 'Romania',
    zh: '罗马尼亚',
    code: 'RO',
    aliases: ['ro', 'romania', '罗马尼亚', '羅馬尼亞', 'RO'],
  },
  '🇷🇸': {
    en: 'Serbia',
    zh: '塞尔维亚',
    code: 'RS',
    aliases: ['rs', 'serbia', '塞尔维亚', '塞爾維亞', 'RS'],
  },
  '🇷🇺': {
    en: 'Russia',
    zh: '俄罗斯',
    code: 'RU',
    aliases: ['ru', 'russia', '俄罗斯', '俄國', 'RU'],
  },
  '🇷🇼': {
    en: 'Rwanda',
    zh: '卢旺达',
    code: 'RW',
    aliases: ['rw', 'rwanda', '卢旺达', '盧旺達', 'RW'],
  },
  '🇸🇦': {
    en: 'Saudi Arabia',
    zh: '沙特阿拉伯',
    code: 'SA',
    aliases: ['sa', 'saudi', 'saudi arabia', '沙特', '沙特阿拉伯', 'SA'],
  },
  '🇸🇧': {
    en: 'Solomon Islands',
    zh: '所罗门群岛',
    code: 'SB',
    aliases: ['sb', 'solomon', 'solomon islands', '所罗门', '所羅門', 'SB'],
  },
  '🇸🇨': {
    en: 'Seychelles',
    zh: '塞舌尔',
    code: 'SC',
    aliases: ['sc', 'seychelles', '塞舌尔', '塞舌爾', 'SC'],
  },
  '🇸🇩': {
    en: 'Sudan',
    zh: '苏丹',
    code: 'SD',
    aliases: ['sd', 'sudan', '苏丹', '蘇丹', 'SD'],
  },
  '🇸🇪': {
    en: 'Sweden',
    zh: '瑞典',
    code: 'SE',
    aliases: ['se', 'sweden', '瑞典', 'SE'],
  },
  '🇸🇬': {
    en: 'Singapore',
    zh: '新加坡',
    code: 'SG',
    aliases: ['sg', 'singapore', '新加坡', 'SG'],
  },
  '🇸🇭': {
    en: 'Saint Helena',
    zh: '圣赫勒拿',
    code: 'SH',
    aliases: ['sh', 'saint helena', 'helena', '圣赫勒拿', '聖赫勒拿', 'SH'],
  },
  '🇸🇮': {
    en: 'Slovenia',
    zh: '斯洛文尼亚',
    code: 'SI',
    aliases: ['si', 'slovenia', '斯洛文尼亚', '斯洛文尼亞', 'SI'],
  },
  '🇸🇯': {
    en: 'Svalbard and Jan Mayen',
    zh: '斯瓦尔巴和扬马延',
    code: 'SJ',
    aliases: ['sj', 'svalbard', 'jan mayen', '斯瓦尔巴', '斯瓦爾巴', 'SJ'],
  },
  '🇸🇰': {
    en: 'Slovakia',
    zh: '斯洛伐克',
    code: 'SK',
    aliases: ['sk', 'slovakia', '斯洛伐克', 'SK'],
  },
  '🇸🇱': {
    en: 'Sierra Leone',
    zh: '塞拉利昂',
    code: 'SL',
    aliases: ['sl', 'sierra leone', '塞拉利昂', 'SL'],
  },
  '🇸🇲': {
    en: 'San Marino',
    zh: '圣马力诺',
    code: 'SM',
    aliases: ['sm', 'san marino', '圣马力诺', '聖馬力諾', 'SM'],
  },
  '🇸🇳': {
    en: 'Senegal',
    zh: '塞内加尔',
    code: 'SN',
    aliases: ['sn', 'senegal', '塞内加尔', '塞內加爾', 'SN'],
  },
  '🇸🇴': {
    en: 'Somalia',
    zh: '索马里',
    code: 'SO',
    aliases: ['so', 'somalia', '索马里', '索馬里', 'SO'],
  },
  '🇸🇷': {
    en: 'Suriname',
    zh: '苏里南',
    code: 'SR',
    aliases: ['sr', 'suriname', '苏里南', '蘇里南', 'SR'],
  },
  '🇸🇸': {
    en: 'South Sudan',
    zh: '南苏丹',
    code: 'SS',
    aliases: ['ss', 'south sudan', '南苏丹', '南蘇丹', 'SS'],
  },
  '🇸🇹': {
    en: 'São Tomé and Príncipe',
    zh: '圣多美和普林西比',
    code: 'ST',
    aliases: ['st', 'sao tome', 'principe', '圣多美', '聖多美', 'ST'],
  },
  '🇸🇻': {
    en: 'El Salvador',
    zh: '萨尔瓦多',
    code: 'SV',
    aliases: ['sv', 'el salvador', '萨尔瓦多', '薩爾瓦多', 'SV'],
  },
  '🇸🇽': {
    en: 'Sint Maarten',
    zh: '荷属圣马丁',
    code: 'SX',
    aliases: ['sx', 'sint maarten', '荷属圣马丁', '荷屬聖馬丁', 'SX'],
  },
  '🇸🇾': {
    en: 'Syria',
    zh: '叙利亚',
    code: 'SY',
    aliases: ['sy', 'syria', '叙利亚', '敘利亞', 'SY'],
  },
  '🇸🇿': {
    en: 'Eswatini',
    zh: '斯威士兰',
    code: 'SZ',
    aliases: ['sz', 'eswatini', 'swaziland', '斯威士兰', '斯威士蘭', 'SZ'],
  },
  '🇹🇦': {
    en: 'Tristan da Cunha',
    zh: '特里斯坦 - 达库尼亚',
    code: 'TA',
    aliases: ['ta', 'tristan', 'tristan da cunha', '特里斯坦', '特里斯坦 - 達庫尼亞', 'TA'],
  },
  '🇹🇨': {
    en: 'Turks and Caicos Islands',
    zh: '特克斯和凯科斯群岛',
    code: 'TC',
    aliases: ['tc', 'turks', 'caicos', '特克斯', '特克斯和凱科斯', 'TC'],
  },
  '🇹🇩': {
    en: 'Chad',
    zh: '乍得',
    code: 'TD',
    aliases: ['td', 'chad', '乍得', 'TD'],
  },
  '🇹🇫': {
    en: 'French Southern Territories',
    zh: '法属南部领地',
    code: 'TF',
    aliases: ['tf', 'french southern', '法属南部', '法屬南部', 'TF'],
  },
  '🇹🇬': {
    en: 'Togo',
    zh: '多哥',
    code: 'TG',
    aliases: ['tg', 'togo', '多哥', 'TG'],
  },
  '🇹🇭': {
    en: 'Thailand',
    zh: '泰国',
    code: 'TH',
    aliases: ['th', 'thailand', '泰国', '泰國', 'TH'],
  },
  '🇹🇯': {
    en: 'Tajikistan',
    zh: '塔吉克斯坦',
    code: 'TJ',
    aliases: ['tj', 'tajikistan', '塔吉克斯坦', '塔吉克斯坦', 'TJ'],
  },
  '🇹🇰': {
    en: 'Tokelau',
    zh: '托克劳',
    code: 'TK',
    aliases: ['tk', 'tokelau', '托克劳', '托克勞', 'TK'],
  },
  '🇹🇱': {
    en: 'Timor-Leste',
    zh: '东帝汶',
    code: 'TL',
    aliases: ['tl', 'timor', 'timor-leste', '东帝汶', '東帝汶', 'TL'],
  },
  '🇹🇲': {
    en: 'Turkmenistan',
    zh: '土库曼斯坦',
    code: 'TM',
    aliases: ['tm', 'turkmenistan', '土库曼斯坦', '土庫曼斯坦', 'TM'],
  },
  '🇹🇳': {
    en: 'Tunisia',
    zh: '突尼斯',
    code: 'TN',
    aliases: ['tn', 'tunisia', '突尼斯', 'TN'],
  },
  '🇹🇴': {
    en: 'Tonga',
    zh: '汤加',
    code: 'TO',
    aliases: ['to', 'tonga', '汤加', '湯加', 'TO'],
  },
  '🇹🇷': {
    en: 'Turkey',
    zh: '土耳其',
    code: 'TR',
    aliases: ['tr', 'turkey', '土耳其', 'TR'],
  },
  '🇹🇹': {
    en: 'Trinidad and Tobago',
    zh: '特立尼达和多巴哥',
    code: 'TT',
    aliases: ['tt', 'trinidad', '特立尼达', '特立尼達', 'TT'],
  },
  '🇹🇻': {
    en: 'Tuvalu',
    zh: '图瓦卢',
    code: 'TV',
    aliases: ['tv', 'tuvalu', '图瓦卢', '圖瓦盧', 'TV'],
  },
  '🇹🇼': {
    en: 'Taiwan',
    zh: '台湾',
    code: 'TW',
    aliases: ['tw', 'taiwan', '台湾', '台灣', 'TW'],
  },
  '🇹🇿': {
    en: 'Tanzania',
    zh: '坦桑尼亚',
    code: 'TZ',
    aliases: ['tz', 'tanzania', '坦桑尼亚', '坦尚尼亞', 'TZ'],
  },
  '🇺🇦': {
    en: 'Ukraine',
    zh: '乌克兰',
    code: 'UA',
    aliases: ['ua', 'ukraine', '乌克兰', '烏克蘭', 'UA'],
  },
  '🇺🇬': {
    en: 'Uganda',
    zh: '乌干达',
    code: 'UG',
    aliases: ['ug', 'uganda', '乌干达', '烏干達', 'UG'],
  },
  '🇺🇲': {
    en: 'U.S. Minor Outlying Islands',
    zh: '美国本土外小岛屿',
    code: 'UM',
    aliases: ['um', 'us minor', '美国本土外小岛屿', '美國本土外小島嶼', 'UM'],
  },
  '🇺🇳': {
    en: 'United Nations',
    zh: '联合国',
    code: 'UN',
    aliases: ['un', 'united nations', '联合国', '聯合國', 'UN'],
  },
  '🇺🇸': {
    en: 'United States',
    zh: '美国',
    code: 'US',
    aliases: ['us', 'usa', 'united states', 'america', '美国', '美利坚', 'US', 'USA'],
  },
  '🇺🇾': {
    en: 'Uruguay',
    zh: '乌拉圭',
    code: 'UY',
    aliases: ['uy', 'uruguay', '乌拉圭', '烏拉圭', 'UY'],
  },
  '🇺🇿': {
    en: 'Uzbekistan',
    zh: '乌兹别克斯坦',
    code: 'UZ',
    aliases: ['uz', 'uzbekistan', '乌兹别克斯坦', '烏茲別克斯坦', 'UZ'],
  },
  '🇻🇦': {
    en: 'Vatican City',
    zh: '梵蒂冈',
    code: 'VA',
    aliases: ['va', 'vatican', 'vatican city', '梵蒂冈', '梵蒂岡', 'VA'],
  },
  '🇻🇨': {
    en: 'Saint Vincent and the Grenadines',
    zh: '圣文森特和格林纳丁斯',
    code: 'VC',
    aliases: ['vc', 'saint vincent', 'grenadines', '圣文森特', '聖文森特', 'VC'],
  },
  '🇻🇪': {
    en: 'Venezuela',
    zh: '委内瑞拉',
    code: 'VE',
    aliases: ['ve', 'venezuela', '委内瑞拉', '委內瑞拉', 'VE'],
  },
  '🇻🇬': {
    en: 'British Virgin Islands',
    zh: '英属维尔京群岛',
    code: 'VG',
    aliases: ['vg', 'british virgin', '英属维尔京', '英屬維爾京', 'VG'],
  },
  '🇻🇮': {
    en: 'U.S. Virgin Islands',
    zh: '美属维尔京群岛',
    code: 'VI',
    aliases: ['vi', 'us virgin', '美属维尔京', '美屬維爾京', 'VI'],
  },
  '🇻🇳': {
    en: 'Vietnam',
    zh: '越南',
    code: 'VN',
    aliases: ['vn', 'vietnam', '越南', 'VN'],
  },
  '🇻🇺': {
    en: 'Vanuatu',
    zh: '瓦努阿图',
    code: 'VU',
    aliases: ['vu', 'vanuatu', '瓦努阿图', '瓦努阿圖', 'VU'],
  },
  '🇼🇫': {
    en: 'Wallis and Futuna',
    zh: '瓦利斯和富图纳',
    code: 'WF',
    aliases: ['wf', 'wallis', 'futuna', '瓦利斯', '瓦利斯和富圖納', 'WF'],
  },
  '🇼🇸': {
    en: 'Samoa',
    zh: '萨摩亚',
    code: 'WS',
    aliases: ['ws', 'samoa', '萨摩亚', '薩摩亞', 'WS'],
  },
  '🇽🇰': {
    en: 'Kosovo',
    zh: '科索沃',
    code: 'XK',
    aliases: ['xk', 'kosovo', '科索沃', 'XK'],
  },
  '🇾🇪': {
    en: 'Yemen',
    zh: '也门',
    code: 'YE',
    aliases: ['ye', 'yemen', '也门', '也門', 'YE'],
  },
  '🇾🇹': {
    en: 'Mayotte',
    zh: '马约特',
    code: 'YT',
    aliases: ['yt', 'mayotte', '马约特', '馬約特', 'YT'],
  },
  '🇿🇦': {
    en: 'South Africa',
    zh: '南非',
    code: 'ZA',
    aliases: ['za', 'south africa', '南非', 'ZA'],
  },
  '🇿🇲': {
    en: 'Zambia',
    zh: '赞比亚',
    code: 'ZM',
    aliases: ['zm', 'zambia', '赞比亚', '尚比亞', 'ZM'],
  },
  '🇿🇼': {
    en: 'Zimbabwe',
    zh: '津巴布韦',
    code: 'ZW',
    aliases: ['zw', 'zimbabwe', '津巴布韦', '辛巴威', 'ZW'],
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
