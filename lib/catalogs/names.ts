import type { PrismaClient } from '@prisma/client'

export const FANTASY_NAMES: string[] = [
  // A
  'Aethon', 'Aldrix', 'Alvaryn', 'Ambrix', 'Andrak', 'Anireth', 'Araxis', 'Ardyn', 'Arevon', 'Arion',
  'Arkhan', 'Arlyn', 'Armix', 'Arnyx', 'Arox', 'Ashen', 'Ashryn', 'Askel', 'Asvyr', 'Athos',
  'Aurath', 'Aurex', 'Aurin', 'Auvyn', 'Avalis', 'Avark', 'Aveth', 'Avron', 'Axival', 'Aymis',
  // B
  'Baelith', 'Baeryn', 'Balgrim', 'Banrox', 'Bathix', 'Belgor', 'Belvyn', 'Bendrak', 'Benyx', 'Berith',
  'Beryn', 'Beshar', 'Bexal', 'Bimrak', 'Birkon', 'Blaire', 'Blaxon', 'Bolrak', 'Bolvyn', 'Borkan',
  'Brakis', 'Bralyx', 'Branix', 'Braxis', 'Brelyn', 'Brendar', 'Brenth', 'Brevon', 'Brexal', 'Brixar',
  // C
  'Cadryn', 'Calith', 'Calryx', 'Camrix', 'Candrax', 'Careth', 'Carix', 'Carlyn', 'Carnyx', 'Casrix',
  'Celith', 'Celvyn', 'Cerith', 'Ceryx', 'Chalryx', 'Chandrax', 'Charith', 'Charvyn', 'Chelion', 'Chendrax',
  'Chirath', 'Choryn', 'Chyrix', 'Claris', 'Claryx', 'Colvyn', 'Corith', 'Coryx', 'Corvyn', 'Cralyx',
  // D
  'Daelith', 'Daeryn', 'Dakrix', 'Dalvyn', 'Damryx', 'Danith', 'Darkon', 'Darlyx', 'Darnyx', 'Darrith',
  'Daxon', 'Delvyn', 'Denrax', 'Dervon', 'Dexthal', 'Dhalmor', 'Dralyx', 'Draxis', 'Drelith', 'Drelvyn',
  'Drenmor', 'Drexal', 'Drixon', 'Drolvyn', 'Dronyx', 'Drothal', 'Dryvon', 'Dulvyn', 'Durvax', 'Dynarix',
  // E
  'Ealdrix', 'Eavyn', 'Edrath', 'Edrix', 'Edryn', 'Elarix', 'Eldrak', 'Eldrith', 'Elryx', 'Elvyn',
  'Embrix', 'Emryx', 'Endrix', 'Enrath', 'Enryx', 'Entrax', 'Enurith', 'Eolvyn', 'Erith', 'Erkon',
  'Erlyx', 'Ernyx', 'Eroth', 'Errin', 'Ervyn', 'Esvrix', 'Ethrax', 'Ethryn', 'Exarith', 'Exorin',
  // F
  'Faeldrix', 'Faelith', 'Faldryx', 'Falryx', 'Fandrix', 'Farith', 'Farkon', 'Farlyn', 'Farnyx', 'Farryx',
  'Faxon', 'Felvyn', 'Fendrix', 'Fernith', 'Ferryx', 'Fethon', 'Fevrix', 'Forith', 'Fornyx', 'Forvyn',
  'Fraxis', 'Fredrix', 'Frelith', 'Frelyn', 'Frenyx', 'Frolvyn', 'Fronyx', 'Froxal', 'Frykon', 'Fulvyn',
  // G
  'Gaeldrix', 'Gaelith', 'Galryx', 'Galvyn', 'Gandrix', 'Garith', 'Garkon', 'Garlyn', 'Garnyx', 'Garvyn',
  'Gaxon', 'Geldrix', 'Gelvyn', 'Gendrix', 'Gerith', 'Gerkon', 'Gerlyn', 'Gernyx', 'Geroth', 'Gervyn',
  'Glaxis', 'Gledrix', 'Glelith', 'Glelvyn', 'Glenyx', 'Glolvyn', 'Glonyx', 'Gloxal', 'Glykon', 'Gorith',
  // H
  'Haeldrix', 'Haelith', 'Halryx', 'Halvyn', 'Handrix', 'Harith', 'Harkon', 'Harlyn', 'Harnyx', 'Harvyn',
  'Haxon', 'Heldrix', 'Helvyn', 'Hendrix', 'Herith', 'Herkon', 'Herlyn', 'Hernyx', 'Heroth', 'Hervyn',
  'Hexal', 'Hildrix', 'Hilryx', 'Hindrix', 'Hirith', 'Horith', 'Hornyx', 'Horvyn', 'Hoxal', 'Hyrkon',
  // I
  'Ialdrix', 'Iaelith', 'Ialryx', 'Ialvyn', 'Iandrix', 'Iarith', 'Iarkon', 'Iarlyn', 'Iarnyx', 'Iarvyn',
  'Iaxon', 'Ieldrix', 'Ielvyn', 'Iendrix', 'Ierith', 'Ierkon', 'Ierlyn', 'Iernyx', 'Ieroth', 'Iervyn',
  'Ildryx', 'Ilith', 'Ilkon', 'Illyn', 'Ilnyx', 'Iloth', 'Ilvyn', 'Indryx', 'Inith', 'Irkon',
  // J
  'Jaeldrix', 'Jaelith', 'Jalryx', 'Jalvyn', 'Jandrix', 'Jarith', 'Jarkon', 'Jarlyn', 'Jarnyx', 'Jarvyn',
  'Jaxon', 'Jeldrix', 'Jelvyn', 'Jendrix', 'Jerith', 'Jerkon', 'Jerlyn', 'Jernyx', 'Jeroth', 'Jervyn',
  // K
  'Kaeldrix', 'Kaelith', 'Kalryx', 'Kalvyn', 'Kandrix', 'Karith', 'Karkon', 'Karlyn', 'Karnyx', 'Karvyn',
  'Kaxon', 'Keldrix', 'Kelvyn', 'Kendrix', 'Kerith', 'Kerkon', 'Kerlyn', 'Kernyx', 'Keroth', 'Kervyn',
  'Kildryx', 'Kilith', 'Kilkon', 'Killyn', 'Kilnyx', 'Kiloth', 'Kilvyn', 'Kindryx', 'Kinith', 'Kirkon',
  // L
  'Laeldrix', 'Laelith', 'Lalryx', 'Lalvyn', 'Landrix', 'Larith', 'Larkon', 'Larlyn', 'Larnyx', 'Larvyn',
  'Laxon', 'Leldrix', 'Lelvyn', 'Lendrix', 'Lerith', 'Lerkon', 'Lerlyn', 'Lernyx', 'Leroth', 'Lervyn',
  'Lildryx', 'Lilith', 'Lilkon', 'Lillyn', 'Lilnyx', 'Liloth', 'Lilvyn', 'Lindryx', 'Linith', 'Lorkon',
  // M
  'Maeldrix', 'Maelith', 'Malryx', 'Malvyn', 'Mandrix', 'Marith', 'Markon', 'Marlyn', 'Marnyx', 'Marvyn',
  'Maxon', 'Meldrix', 'Melvyn', 'Mendrix', 'Merith', 'Merkon', 'Merlyn', 'Mernyx', 'Meroth', 'Mervyn',
  'Mildryx', 'Milith', 'Milkon', 'Millyn', 'Milnyx', 'Miloth', 'Milvyn', 'Mindryx', 'Minith', 'Mirkon',
  // N
  'Naeldrix', 'Naelith', 'Nalryx', 'Nalvyn', 'Nandrix', 'Narith', 'Narkon', 'Narlyn', 'Narnyx', 'Narvyn',
  'Naxon', 'Neldrix', 'Nelvyn', 'Nendrix', 'Nerith', 'Nerkon', 'Nerlyn', 'Nernyx', 'Neroth', 'Nervyn',
  'Noctara', 'Noctis', 'Nolvyn', 'Norith', 'Norkon', 'Norlyn', 'Nornyx', 'Noroth', 'Norvyn', 'Nyrkon',
  // O
  'Oaeldrix', 'Oaelith', 'Oalryx', 'Oalvyn', 'Oandrix', 'Oarith', 'Oarkon', 'Oarlyn', 'Oarnyx', 'Oarvyn',
  'Oaxon', 'Oeldrix', 'Oelvyn', 'Oendrix', 'Oerith', 'Oerkon', 'Oerlyn', 'Oernyx', 'Oeroth', 'Oervyn',
  'Oldryx', 'Olith', 'Olkon', 'Ollyn', 'Olnyx', 'Oloth', 'Olvyn', 'Ondryx', 'Onith', 'Orkon',
  // P
  'Paeldrix', 'Paelith', 'Palryx', 'Palvyn', 'Pandrix', 'Parith', 'Parkon', 'Parlyn', 'Parnyx', 'Parvyn',
  'Paxon', 'Peldrix', 'Pelvyn', 'Pendrix', 'Perith', 'Perkon', 'Perlyn', 'Pernyx', 'Peroth', 'Pervyn',
  'Pildryx', 'Pilith', 'Pilkon', 'Pillyn', 'Pilnyx', 'Piloth', 'Pilvyn', 'Pindryx', 'Pinith', 'Pirkon',
  // Q
  'Qaeldrix', 'Qaelith', 'Qalryx', 'Qalvyn', 'Qandrix', 'Quarith', 'Quarkon', 'Quarlyn', 'Quarnyx', 'Quarvyn',
  // R
  'Raeldrix', 'Raelith', 'Ralryx', 'Ralvyn', 'Randrix', 'Rarith', 'Rarkon', 'Rarlyn', 'Rarnyx', 'Rarvyn',
  'Raxon', 'Reldrix', 'Relvyn', 'Rendrix', 'Rerith', 'Rerkon', 'Rerlyn', 'Rernyx', 'Reroth', 'Rervyn',
  'Rildryx', 'Rilith', 'Rilkon', 'Rillyn', 'Rilnyx', 'Riloth', 'Rilvyn', 'Rindryx', 'Rinith', 'Rirkon',
  // S
  'Saeldrix', 'Saelith', 'Salryx', 'Salvar', 'Sandrax', 'Sarith', 'Sarkon', 'Sarlyn', 'Sarnyx', 'Sarvyn',
  'Saxon', 'Seldrix', 'Selvyn', 'Sendrix', 'Serith', 'Serkon', 'Serlyn', 'Sernyx', 'Seroth', 'Servyn',
  'Sildryx', 'Silith', 'Silkon', 'Sillyn', 'Silnyx', 'Siloth', 'Silvyn', 'Sindryx', 'Sinith', 'Sirkon',
  'Solaris', 'Soldryx', 'Solith', 'Solkon', 'Sollyn', 'Solnyx', 'Soloth', 'Solvyn', 'Sondryx', 'Surkon',
  // T
  'Taeldrix', 'Taelith', 'Talryx', 'Talvyn', 'Tandrix', 'Tarith', 'Tarkon', 'Tarlyn', 'Tarnyx', 'Tarvyn',
  'Taxon', 'Teldrix', 'Telvyn', 'Tendrix', 'Terith', 'Terkon', 'Terlyn', 'Ternyx', 'Teroth', 'Tervyn',
  'Tharox', 'Therion', 'Thiron', 'Tildryx', 'Tilith', 'Tilkon', 'Tillyn', 'Tilnyx', 'Tiloth', 'Tilvyn',
  // U
  'Umbrak', 'Umbrith', 'Umbryx', 'Undrix', 'Unith', 'Urkon', 'Urlyn', 'Urnyx', 'Uroth', 'Urvyn',
  'Uxal', 'Uxon', 'Uxryx', 'Uxvyn', 'Uzdryx', 'Uzith', 'Uzkon', 'Uzlyn', 'Uznyx', 'Uzoth',
  // V
  'Vaeldrix', 'Vaelith', 'Valryx', 'Valvyn', 'Vandrix', 'Varith', 'Varkon', 'Varlyn', 'Varnyx', 'Varvyn',
  'Vaxon', 'Veldrix', 'Velmira', 'Velvyn', 'Vendrix', 'Verith', 'Verkon', 'Verlyn', 'Vernyx', 'Veroth',
  'Vervyn', 'Vildryx', 'Vilith', 'Vilkon', 'Villyn', 'Vilnyx', 'Viloth', 'Vilvyn', 'Vindryx', 'Vorkon',
  // W
  'Waeldrix', 'Waelith', 'Walryx', 'Walvyn', 'Wandrix', 'Warith', 'Warkon', 'Warlyn', 'Warnyx', 'Warvyn',
  'Waxon', 'Weldrix', 'Welvyn', 'Wendrix', 'Werith', 'Werkon', 'Werlyn', 'Wernyx', 'Weroth', 'Wervyn',
  'Wildryx', 'Wilith', 'Wilkon', 'Willyn', 'Wilnyx', 'Wiloth', 'Wilvyn', 'Windryx', 'Winith', 'Wirkon',
  // X
  'Xaeldrix', 'Xaelith', 'Xalryx', 'Xalvyn', 'Xandrix', 'Xarith', 'Xarkon', 'Xarlyn', 'Xarnyx', 'Xarvyn',
  'Xaxon', 'Xeldrix', 'Xelvyn', 'Xendrix', 'Xerith', 'Xerkon', 'Xerlyn', 'Xernyx', 'Xeroth', 'Xervyn',
  // Y
  'Yaeldrix', 'Yaelith', 'Yalryx', 'Yalvyn', 'Yandrix', 'Yarith', 'Yarkon', 'Yarlyn', 'Yarnyx', 'Yarvyn',
  'Yaxon', 'Yeldrix', 'Yelvyn', 'Yendrix', 'Yerith', 'Yerkon', 'Yerlyn', 'Yernyx', 'Yeroth', 'Yervyn',
  // Z
  'Zaeldrix', 'Zaelith', 'Zalryx', 'Zalvyn', 'Zandrix', 'Zarith', 'Zarkon', 'Zarlyn', 'Zarnyx', 'Zarvyn',
  'Zaxon', 'Zeldrix', 'Zelvyn', 'Zendrix', 'Zerith', 'Zerkon', 'Zerlyn', 'Zernyx', 'Zeroth', 'Zervyn',
  'Zephyrin', 'Zildryx', 'Zilith', 'Zilkon', 'Zillyn', 'Zilnyx', 'Ziloth', 'Zilvyn', 'Zindryx', 'Zorkon',
  // Extra evocative names
  'Aethonis', 'Aevris', 'Aexor', 'Aeyris', 'Aezorn', 'Afalith', 'Afarkon', 'Afarlyn', 'Afarnyx', 'Afarvyn',
  'Agshari', 'Agvalyx', 'Agvaris', 'Ahkaris', 'Ahlvara', 'Ahmurex', 'Ahnaris', 'Ahneris', 'Ahnorex', 'Ahshrix',
  'Aikaris', 'Aikvara', 'Aimurix', 'Ainaris', 'Ainerix', 'Ainorex', 'Aishrix', 'Aivlara', 'Akaris', 'Akelith',
  'Akeron', 'Akhiron', 'Akhoris', 'Akorith', 'Aksamix', 'Aktaris', 'Akuron', 'Akvalyx', 'Akvaris', 'Alkarix',
  'Alluryn', 'Almerix', 'Almirax', 'Almoryn', 'Almurex', 'Alnaris', 'Alnerix', 'Alnorex', 'Alshrix', 'Alvarix',
]

export async function assignUniqueName(db: PrismaClient): Promise<string> {
  const shuffled = [...FANTASY_NAMES].sort(() => Math.random() - 0.5)

  for (let i = 0; i < Math.min(20, shuffled.length); i++) {
    const candidate = shuffled[i]
    const existing = await db.therian.findUnique({ where: { name: candidate } })
    if (!existing) return candidate
  }

  // All tried names are taken — add a numeric suffix
  const base = shuffled[0]
  for (let suffix = 2; suffix <= 9999; suffix++) {
    const candidate = `${base}${suffix}`
    const existing = await db.therian.findUnique({ where: { name: candidate } })
    if (!existing) return candidate
  }

  // Should never reach here
  return `Therian_${Date.now()}`
}
