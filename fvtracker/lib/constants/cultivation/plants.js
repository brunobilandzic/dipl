export const PREMIUM = "premium";
export const STANDARD = "standardno";
export const SATISFACTORY = "zadovoljivo";

export const VARIETIES_QUALITIES = [SATISFACTORY, PREMIUM, STANDARD];

// POVRĆE – glavne vrste
export const vegatablesGeneralCropTypes = [
  {
    name: "Lisnato povrće",
    description: "Povrće kod kojeg se koristi list kao jestivi dio.",
    cropTypes: [
      {
        name: "Salata",
        color: "green",
        description:
          "Lisnato povrće iz roda Lactuca, blagoga okusa, najčešće konzumirano svježe. Za razliku od cikorijastih kultura, nema izraženu gorčinu.",
        cropVarieties: [
          { name: "Iceberg", shade: 200, quantityPerCell: 250 },
          { name: "Kristalka", shade: 300, quantityPerCell: 210 },
          { name: "Puterica", shade: 400, quantityPerCell: 54 },
          { name: "Batavia", shade: 500, quantityPerCell: 45 },
          { name: "Rimska salata", shade: 600, quantityPerCell: 36 },
          { name: "Lollo rosso", shade: 700, quantityPerCell: 54 },
          { name: "Lollo bionda", shade: 100, quantityPerCell: 54 },
          { name: "Hrastov list", shade: 800, quantityPerCell: 72 },
          { name: "Baby leaf salate", shade: 50, quantityPerCell: 144 },
        ],
      },

      {
        name: "Špinat",
        color: "emerald",
        description:
          "Brzorastuće lisnato povrće nježnih listova, bogato željezom, vitaminima A i C. Može se koristiti svježe ili termički obrađeno.",
        cropVarieties: [
          { name: "Obični špinat", shade: 500, quantityPerCell: 72 },
          { name: "Novozelandski špinat", shade: 400, quantityPerCell: 27 },
          { name: "Malabarski špinat", shade: 600, quantityPerCell: 27 },
          { name: "Jagodasti špinat", shade: 700, quantityPerCell: 36 },
          { name: "Perzijski špinat", shade: 200, quantityPerCell: 72 },
          { name: "Divlji špinat", shade: 800, quantityPerCell: 90 },
          { name: "Planinski špinat", shade: 900, quantityPerCell: 81 },
          { name: "Baby špinat", shade: 300, quantityPerCell: 108 },
        ],
      },
      {
        name: "Blitva",
        color: "teal",
        description:
          "Lisnato povrće s velikim listovima i mesnatim peteljkama, otporno i jednostavno za uzgoj.",
        cropVarieties: [
          { name: "Bijela blitva", shade: 200, quantityPerCell: 36 },
          { name: "Zelena blitva", shade: 500, quantityPerCell: 36 },
          { name: "Crvena blitva", shade: 700, quantityPerCell: 36 },
          { name: "Žuta blitva", shade: 400, quantityPerCell: 36 },
          { name: "Baby blitva", shade: 300, quantityPerCell: 54 },
        ],
      },
      {
        name: "Kupusnjače (lisnate)",
        color: "lime",
        description:
          "Lisnate vrste iz porodice kupusnjača s čvrstim listovima i izraženim okusom, bogate vlaknima i vitaminima.",
        cropVarieties: [
          { name: "Kelj", shade: 600, quantityPerCell: 27 },
          { name: "Raštika", shade: 500, quantityPerCell: 27 },
          { name: "Kovrčavi kelj", shade: 700, quantityPerCell: 27 },
          { name: "Kineski kupus", shade: 300, quantityPerCell: 36 },
          { name: "Pak choi", shade: 400, quantityPerCell: 45 },
          { name: "Tatsoi", shade: 200, quantityPerCell: 54 },
          { name: "Mizuna", shade: 100, quantityPerCell: 72 },
        ],
      },
      {
        name: "Cikorijasto lisnato povrće",
        color: "amber",
        description:
          "Lisnato povrće iz roda Cichorium, karakteristično po gorkastom okusu i čvrstim listovima.",
        cropVarieties: [
          { name: "Radič", shade: 700, quantityPerCell: 36 },
          { name: "Cikorija", shade: 600, quantityPerCell: 36 },
          { name: "Endivija", shade: 400, quantityPerCell: 45 },
          { name: "Escarole", shade: 500, quantityPerCell: 45 },
          { name: "Puntarelle", shade: 800, quantityPerCell: 27 },
        ],
      },
      {
        name: "Divlje lisnato povrće",
        color: "green",
        description:
          "Samonikle lisnate biljke tradicionalno korištene u prehrani, često jačeg okusa.",
        cropVarieties: [
          { name: "Maslačak", shade: 600, quantityPerCell: 72 },
          { name: "Kopriva", shade: 700, quantityPerCell: 54 },
          { name: "Šćir", shade: 500, quantityPerCell: 81 },
          { name: "Loboda", shade: 800, quantityPerCell: 72 },
        ],
      },
    ],
  },
  {
    name: "Plodovito povrće",
    description:
      "Povrće kod kojeg je plod glavni jestivi dio biljke, najčešće bogato vodom i pogodno za svježu i termičku upotrebu.",
    cropTypes: [
      {
        name: "Rajčica",
        color: "red",
        description:
          "Jedna od najčešće korištenih plodovitih kultura, blagog do kiselkastog okusa.",
        cropVarieties: [
          { name: "Cherry rajčica", shade: 400, quantityPerCell: 18 },
          { name: "Šljivar", shade: 500, quantityPerCell: 9 },
          { name: "Volovsko srce", shade: 600, quantityPerCell: 9 },
          { name: "Beefsteak", shade: 700, quantityPerCell: 9 },
          { name: "Žuta rajčica", shade: 300, quantityPerCell: 18 },
        ],
      },
      {
        name: "Paprika",
        color: "orange",
        description: "Plodovito povrće različitih oblika i stupnjeva ljutine.",
        cropVarieties: [
          { name: "Babura", shade: 400, quantityPerCell: 9 },
          { name: "Roga", shade: 500, quantityPerCell: 9 },
          { name: "Kapia", shade: 600, quantityPerCell: 9 },
          { name: "Feferon", shade: 700, quantityPerCell: 18 },
          { name: "Čili paprika", shade: 800, quantityPerCell: 27 },
        ],
      },
      {
        name: "Krastavac",
        color: "green",
        description: "Osvježavajuće povrće visokog udjela vode.",
        cropVarieties: [
          { name: "Salatni krastavac", shade: 500, quantityPerCell: 18 },
          { name: "Kornišon", shade: 600, quantityPerCell: 27 },
          { name: "Mini krastavac", shade: 400, quantityPerCell: 36 },
        ],
      },
      {
        name: "Tikvica",
        color: "lime",
        description:
          "Mlada plodovita kultura neutralnog okusa, vrlo prilagodljiva u kuhanju.",
        cropVarieties: [
          { name: "Zelena tikvica", shade: 500, quantityPerCell: 18 },
          { name: "Žuta tikvica", shade: 300, quantityPerCell: 18 },
          { name: "Okrugla tikvica", shade: 600, quantityPerCell: 18 },
        ],
      },
      {
        name: "Patlidžan",
        color: "purple",
        description: "Plodovito povrće spužvaste strukture koje upija masnoću.",
        cropVarieties: [
          { name: "Ljubičasti patlidžan", shade: 700, quantityPerCell: 9 },
          { name: "Bijeli patlidžan", shade: 200, quantityPerCell: 9 },
          { name: "Mini patlidžan", shade: 600, quantityPerCell: 18 },
        ],
      },
      {
        name: "Bundeva i tikve",
        color: "amber",
        description: "Plodovito povrće s tvrdom korom i dugim rokom trajanja.",
        cropVarieties: [
          { name: "Muškatna tikva", shade: 500, quantityPerCell: 9 },
          { name: "Hokkaido", shade: 600, quantityPerCell: 9 },
          { name: "Butternut", shade: 400, quantityPerCell: 9 },
          { name: "Tikva golica", shade: 700, quantityPerCell: 9 },
        ],
      },
    ],
  },
  {
    name: "Korjenasto povrće",
    description: "Povrće kod kojeg se koristi zadebljani korijen.",
    cropTypes: [
      {
        name: "Mrkva",
        color: "orange",
        description: "Slatkast korijen bogat beta-karotenom.",
        cropVarieties: [
          { name: "Nantes", shade: 500, quantityPerCell: 126 },
          { name: "Chantenay", shade: 600, quantityPerCell: 108 },
          { name: "Imperator", shade: 700, quantityPerCell: 90 },
          { name: "Ljubičasta mrkva", shade: 400, quantityPerCell: 126 },
        ],
      },
      {
        name: "Cikla",
        color: "rose",
        description: "Korjenasto povrće zemljastog okusa i jake boje.",
        cropVarieties: [
          { name: "Crvena", shade: 700, quantityPerCell: 108 },
          { name: "Zlatna", shade: 400, quantityPerCell: 108 },
          { name: "Chioggia", shade: 500, quantityPerCell: 108 },
        ],
      },
      {
        name: "Rotkva",
        color: "slate",
        description: "Veliki, pikantni korijen.",
        cropVarieties: [
          { name: "Bijela", shade: 200, quantityPerCell: 54 },
          { name: "Crna", shade: 800, quantityPerCell: 36 },
        ],
      },
      {
        name: "Rotkvica",
        color: "rose",
        description: "Mali, hrskavi korijen.",
        cropVarieties: [
          { name: "Crvena", shade: 500, quantityPerCell: 144 },
          { name: "Bijela", shade: 200, quantityPerCell: 144 },
          { name: "Ljubičasta", shade: 700, quantityPerCell: 144 },
        ],
      },
      {
        name: "Peršin korijen",
        color: "stone",
        description: "Aromatičan korijen za temeljce.",
        cropVarieties: [
          { name: "Dugi", shade: 400, quantityPerCell: 108 },
          { name: "Kratki", shade: 300, quantityPerCell: 90 },
        ],
      },
      {
        name: "Pastrnjak",
        color: "amber",
        description: "Slatkast korijen sličan mrkvi.",
        cropVarieties: [{ name: "Klasični", shade: 500, quantityPerCell: 90 }],
      },
    ],
  },
  {
    name: "Gomoljasto povrće",
    description: "Povrće koje razvija gomolje kao skladišne organe.",
    cropTypes: [
      {
        name: "Krumpir",
        color: "yellow",
        description: "Najvažnija gomoljasta kultura.",
        cropVarieties: [
          { name: "Mladi", shade: 200, quantityPerCell: 36 },
          { name: "Bijeli", shade: 100, quantityPerCell: 27 },
          { name: "Crveni", shade: 400, quantityPerCell: 27 },
          { name: "Ljubičasti", shade: 600, quantityPerCell: 18 },
        ],
      },
      {
        name: "Batat",
        color: "orange",
        description: "Slatki gomolj bogat vlaknima.",
        cropVarieties: [
          { name: "Narančasti", shade: 500, quantityPerCell: 18 },
          { name: "Ljubičasti", shade: 700, quantityPerCell: 18 },
          { name: "Bijeli", shade: 200, quantityPerCell: 27 },
        ],
      },
      {
        name: "Topinambur",
        color: "amber",
        description: "Gomolj orašastog okusa.",
        cropVarieties: [{ name: "Klasični", shade: 500, quantityPerCell: 36 }],
      },
    ],
  },
  {
    name: "Lukovičasto povrće",
    description: "Povrće s razvijenom lukovicom kao jestivim dijelom.",
    cropTypes: [
      {
        name: "Luk",
        color: "amber",
        description: "Osnovna kuhinjska kultura.",
        cropVarieties: [
          { name: "Bijeli", shade: 200, quantityPerCell: 108 },
          { name: "Crveni", shade: 600, quantityPerCell: 90 },
          { name: "Žuti", shade: 400, quantityPerCell: 90 },
          { name: "Mladi", shade: 300, quantityPerCell: 126 },
        ],
      },
      {
        name: "Češnjak",
        color: "slate",
        description: "Intenzivno aromatična lukovica.",
        cropVarieties: [
          { name: "Bijeli", shade: 200, quantityPerCell: 72 },
          { name: "Ljubičasti", shade: 600, quantityPerCell: 54 },
        ],
      },
      {
        name: "Poriluk",
        color: "teal",
        description: "Blaga lukovičasta kultura.",
        cropVarieties: [
          { name: "Zimski", shade: 600, quantityPerCell: 18 },
          { name: "Ljetni", shade: 400, quantityPerCell: 18 },
        ],
      },
      {
        name: "Luk šalot",
        color: "rose",
        description: "Fini, aromatičan luk.",
        cropVarieties: [
          { name: "Crveni", shade: 600, quantityPerCell: 72 },
          { name: "Smeđi", shade: 500, quantityPerCell: 72 },
        ],
      },
    ],
  },
  {
    name: "Stabljikasto povrće",
    description: "Povrće kod kojeg se konzumira stabljika ili peteljka.",
    cropTypes: [
      {
        name: "Celer stabljika",
        color: "lime",
        description: "Hrskava stabljika blagog okusa.",
        cropVarieties: [
          { name: "Zeleni", shade: 500, quantityPerCell: 54 },
          { name: "Blijedi", shade: 200, quantityPerCell: 54 },
        ],
      },
      {
        name: "Šparoga",
        color: "emerald",
        description: "Sezonska stabljikasta kultura.",
        cropVarieties: [
          { name: "Zelena", shade: 600, quantityPerCell: 36 },
          { name: "Bijela", shade: 200, quantityPerCell: 36 },
        ],
      },
      {
        name: "Rabarbara",
        color: "rose",
        description: "Kisela stabljika, botanički povrće.",
        cropVarieties: [
          { name: "Zelena", shade: 400, quantityPerCell: 27 },
          { name: "Crvena", shade: 700, quantityPerCell: 27 },
        ],
      },
    ],
  },
  {
    name: "Cvjetasto povrće",
    description: "Povrće kod kojeg se konzumiraju cvjetovi ili cvatovi.",
    cropTypes: [
      {
        name: "Cvjetača",
        color: "slate",
        description: "Zbijeni cvat neutralnog okusa.",
        cropVarieties: [
          { name: "Bijela", shade: 100, quantityPerCell: 54 },
          { name: "Zelena", shade: 400, quantityPerCell: 45 },
          { name: "Ljubičasta", shade: 600, quantityPerCell: 45 },
        ],
      },
      {
        name: "Brokula",
        color: "green",
        description: "Zeleni cvat bogat hranjivim tvarima.",
        cropVarieties: [
          { name: "Klasična", shade: 600, quantityPerCell: 27 },
          { name: "Broccolini", shade: 500, quantityPerCell: 36 },
        ],
      },
      {
        name: "Artičoka",
        color: "green",
        description: "Cvjetni pupoljak.",
        cropVarieties: [
          { name: "Zelena", shade: 500, quantityPerCell: 18 },
          { name: "Ljubičasta", shade: 700, quantityPerCell: 18 },
        ],
      },
    ],
  },
  {
    name: "Mahunarke (povrće)",
    description:
      "Biljke koje daju mahune i koriste se kao povrće, svježe ili sušene.",
    cropTypes: [
      {
        name: "Grah",
        color: "stone",
        description: "Najraširenija mahunarka u prehrani.",
        cropVarieties: [
          { name: "Bijeli", shade: 200, quantityPerCell: 72 },
          { name: "Crveni", shade: 600, quantityPerCell: 72 },
          { name: "Crni", shade: 800, quantityPerCell: 63 },
          { name: "Trebješ", shade: 400, quantityPerCell: 81 },
        ],
      },
      {
        name: "Grašak",
        color: "green",
        description: "Slatke zelene mahune ili zrna.",
        cropVarieties: [
          { name: "Mladi", shade: 400, quantityPerCell: 54 },
          { name: "Šećerac", shade: 500, quantityPerCell: 54 },
        ],
      },
      {
        name: "Bob",
        color: "green",
        description: "Krupan grahast plod.",
        cropVarieties: [
          { name: "Zeleni", shade: 500, quantityPerCell: 54 },
          { name: "Suhi", shade: 700, quantityPerCell: 45 },
        ],
      },
      {
        name: "Leća",
        color: "amber",
        description: "Sitna mahunarka brzog kuhanja.",
        cropVarieties: [
          { name: "Zelena", shade: 600, quantityPerCell: 81 },
          { name: "Crvena", shade: 500, quantityPerCell: 81 },
          { name: "Smeđa", shade: 700, quantityPerCell: 90 },
        ],
      },
      {
        name: "Slanutak",
        color: "yellow",
        description: "Mahunarka orašastog okusa.",
        cropVarieties: [
          { name: "Sitni", shade: 400, quantityPerCell: 72 },
          { name: "Krupan", shade: 500, quantityPerCell: 54 },
        ],
      },
    ],
  },
  {
    name: "Sjemenasto povrće",
    description: "Povrće kod kojeg se u prehrani koriste zrna ili sjemenke.",
    cropTypes: [
      {
        name: "Kukuruz",
        color: "yellow",
        description: "Slatko zrno koje se koristi svježe ili kuhano.",
        cropVarieties: [
          { name: "Šećerac", shade: 400, quantityPerCell: 36 },
          { name: "Kokičar", shade: 300, quantityPerCell: 27 },
        ],
      },
      {
        name: "Bamija",
        color: "lime",
        description: "Plod sa sjemenkama, često u varivima.",
        cropVarieties: [
          { name: "Zelena", shade: 500, quantityPerCell: 36 },
          { name: "Crvena", shade: 600, quantityPerCell: 36 },
        ],
      },
    ],
  },
  {
    name: "Gljive",
    description: "Jestive gljive koje se u prehrani koriste kao povrće.",
    cropTypes: [
      {
        name: "Šampinjoni",
        color: "stone",
        description: "Najčešće uzgajane gljive.",
        cropVarieties: [
          { name: "Bijeli", shade: 200, quantityPerCell: 108 },
          { name: "Smeđi", shade: 500, quantityPerCell: 108 },
        ],
      },
      {
        name: "Bukovače",
        color: "gray",
        description: "Mesnate gljive blagog okusa.",
        cropVarieties: [
          { name: "Siva", shade: 500, quantityPerCell: 108 },
          { name: "Bijela", shade: 200, quantityPerCell: 108 },
        ],
      },
      {
        name: "Shiitake",
        color: "amber",
        description: "Aromatične gljive azijskog porijekla.",
        cropVarieties: [
          { name: "Svježi", shade: 600, quantityPerCell: 90 },
          { name: "Sušeni", shade: 700, quantityPerCell: 72 },
        ],
      },
    ],
  },
  {
    name: "Začinsko i aromatično povrće",
    description:
      "Biljke koje se koriste za začinjavanje i aromatiziranje hrane.",
    cropTypes: [
      {
        name: "Peršin",
        color: "green",
        description: "Svježe lišće za završetak jela.",
        cropVarieties: [
          { name: "List", shade: 600, quantityPerCell: 180 },
          { name: "Korijen", shade: 500, quantityPerCell: 108 },
        ],
      },
      {
        name: "Bosiljak",
        color: "green",
        description: "Aromatična biljka osjetljiva na hladnoću.",
        cropVarieties: [
          { name: "Zeleni", shade: 500, quantityPerCell: 72 },
          { name: "Ljubičasti", shade: 700, quantityPerCell: 72 },
        ],
      },
      {
        name: "Kopar",
        color: "lime",
        description: "Blaga aroma za ribu i povrće.",
        cropVarieties: [{ name: "Svježi", shade: 400, quantityPerCell: 144 }],
      },
    ],
  },
];

export const fruitsGeneralCropTypes = [
  // VOĆE – glavne vrste
  {
    name: "Jabučasto voće",
    description: "Voće s mesnatim plodom i sjemenom smještenim u kućici.",
    cropTypes: [
      {
        name: "Jabuka",
        color: "red",
        description: "Najraširenije jabučasto voće.",
        cropVarieties: [
          { name: "Idared", shade: 600, quantityPerCell: 250 },
          { name: "Golden Delicious", shade: 400, quantityPerCell: 150 },
          { name: "Granny Smith", shade: 500, quantityPerCell: 140 },
          { name: "Fuji", shade: 700, quantityPerCell: 160 },
          { name: "Gala", shade: 300, quantityPerCell: 180 },
        ],
      },
      {
        name: "Kruška",
        color: "yellow",
        description: "Sočno voće mekše teksture.",
        cropVarieties: [
          { name: "Williams", shade: 400, quantityPerCell: 100 },
          { name: "Conference", shade: 500, quantityPerCell: 110 },
          { name: "Abate", shade: 600, quantityPerCell: 95 },
        ],
      },
      {
        name: "Dunja",
        color: "amber",
        description: "Tvrdo i aromatično voće.",
        cropVarieties: [
          { name: "Obična dunja", shade: 500, quantityPerCell: 80 },
        ],
      },
    ],
  },
  {
    name: "Koštičavo voće",
    description: "Voće s jednom velikom košticom u sredini ploda.",
    cropTypes: [
      {
        name: "Breskva",
        color: "orange",
        description: "Sočno voće baršunaste kožice.",
        cropVarieties: [
          { name: "Žuta", shade: 400, quantityPerCell: 90 },
          { name: "Bijela", shade: 200, quantityPerCell: 85 },
          { name: "Nektarina", shade: 600, quantityPerCell: 100 },
        ],
      },
      {
        name: "Marelica",
        color: "orange",
        description: "Slatko-kiselo voće mekane teksture.",
        cropVarieties: [
          { name: "Mađarska", shade: 500, quantityPerCell: 110 },
          { name: "Bergeron", shade: 600, quantityPerCell: 125 },
        ],
      },
      {
        name: "Trešnja",
        color: "red",
        description: "Slatko koštičavo voće.",
        cropVarieties: [
          { name: "Slatka", shade: 600, quantityPerCell: 60 },
          { name: "Višnja", shade: 700, quantityPerCell: 40 },
        ],
      },
      {
        name: "Šljiva",
        color: "purple",
        description: "Voće pogodno za preradu.",
        cropVarieties: [
          { name: "Bistrica", shade: 600, quantityPerCell: 140 },
          { name: "Stanley", shade: 700, quantityPerCell: 150 },
        ],
      },
    ],
  },

  {
    name: "Bobičasto voće",
    description: "Sitno voće mekane kožice i više sjemenki.",
    cropTypes: [
      {
        name: "Jagoda",
        color: "red",
        description: "Najpoznatije bobičasto voće.",
        cropVarieties: [
          { name: "Alba", shade: 400, quantityPerCell: 16 },
          { name: "Clery", shade: 500, quantityPerCell: 16 },
          { name: "Marmolada", shade: 600, quantityPerCell: 12 },
        ],
      },
      {
        name: "Malina",
        color: "red",
        description: "Osjetljivo i aromatično voće.",
        cropVarieties: [
          { name: "Willamette", shade: 500, quantityPerCell: 12 },
          { name: "Polka", shade: 600, quantityPerCell: 12 },
        ],
      },
      {
        name: "Borovnica",
        color: "blue",
        description: "Sitno plavo voće.",
        cropVarieties: [
          { name: "Američka", shade: 600, quantityPerCell: 10 },
          { name: "Šumska", shade: 700, quantityPerCell: 10 },
        ],
      },
      {
        name: "Kupina",
        color: "purple",
        description: "Tamno bobičasto voće.",
        cropVarieties: [
          { name: "Divlja", shade: 800, quantityPerCell: 10 },
          { name: "Uzgajana", shade: 700, quantityPerCell: 10 },
        ],
      },
      {
        name: "Grožđe",
        color: "purple",
        description:
          "Bobičasto voće koje raste u grozdovima, koristi se svježe, sušeno i za preradu.",
        cropVarieties: [
          { name: "Bijelo grožđe", shade: 200, quantityPerCell: 6 },
          { name: "Crno grožđe", shade: 800, quantityPerCell: 4 },
          { name: "Crveno grožđe", shade: 600, quantityPerCell: 5 },
          { name: "Bez sjemenki", shade: 400, quantityPerCell: 6 },
        ],
      },
    ],
  },

  {
    name: "Agrumi",
    description: "Citrusno voće karakteristično po kiselkastom okusu i aromi.",
    cropTypes: [
      {
        name: "Naranča",
        color: "orange",
        description: "Najčešći citrus.",
        cropVarieties: [
          { name: "Valencia", shade: 500, quantityPerCell: 200 },
          { name: "Navel", shade: 600, quantityPerCell: 180 },
        ],
      },
      {
        name: "Limun",
        color: "yellow",
        description: "Vrlo kiseli citrus.",
        cropVarieties: [
          { name: "Eureka", shade: 400, quantityPerCell: 150 },
          { name: "Lisbon", shade: 500, quantityPerCell: 140 },
        ],
      },
      {
        name: "Mandarina",
        color: "orange",
        description: "Slatki citrus tanke kore.",
        cropVarieties: [
          { name: "Clementina", shade: 400, quantityPerCell: 160 },
          { name: "Satsuma", shade: 500, quantityPerCell: 170 },
        ],
      },
    ],
  },
  {
    name: "Suptropsko voće",
    description:
      "Voće koje raste u suptropskim klimatskim uvjetima, često osjetljivo na hladnoću.",
    cropTypes: [
      {
        name: "Smokva",
        color: "purple",
        description: "Mekano i vrlo slatko voće tanke kore.",
        cropVarieties: [
          { name: "Bijela", shade: 200, quantityPerCell: 30 },
          { name: "Crna", shade: 800, quantityPerCell: 50 },
          { name: "Petrovača", shade: 600, quantityPerCell: 40 },
        ],
      },
      {
        name: "Nar",
        color: "red",
        description: "Voće s jestivim sočnim sjemenkama.",
        cropVarieties: [
          { name: "Slatki", shade: 500, quantityPerCell: 200 },
          { name: "Kiselkasti", shade: 600, quantityPerCell: 180 },
        ],
      },
      {
        name: "Kaki",
        color: "orange",
        description: "Slatko voće mekane teksture kada dozrije.",
        cropVarieties: [
          { name: "Vanilija", shade: 400, quantityPerCell: 70 },
          { name: "Hachiya", shade: 600, quantityPerCell: 60 },
        ],
      },
    ],
  },
  {
    name: "Oraškasto voće",
    description: "Voće s tvrdim oklopom i jestivom jezgrom bogatom mastima.",
    cropTypes: [
      {
        name: "Orah",
        color: "amber",
        description: "Najčešće orašasto voće u regiji.",
        cropVarieties: [
          { name: "Domaći", shade: 600, quantityPerCell: 80 },
          { name: "Chandler", shade: 500, quantityPerCell: 120 },
        ],
      },
      {
        name: "Lješnjak",
        color: "amber",
        description: "Sitno orašasto voće slatkastog okusa.",
        cropVarieties: [
          { name: "Istarski", shade: 500, quantityPerCell: 100 },
          { name: "Tonda Gentile", shade: 600, quantityPerCell: 150 },
        ],
      },
      {
        name: "Badem",
        color: "amber",
        description: "Orašasti plod blagog okusa.",
        cropVarieties: [
          { name: "Slatki", shade: 400, quantityPerCell: 180 },
          { name: "Gorki", shade: 700, quantityPerCell: 160 },
        ],
      },
      {
        name: "Pistacija",
        color: "green",
        description: "Zelenkasta jezgra intenzivne arome.",
        cropVarieties: [
          { name: "Slana", shade: 600, quantityPerCell: 140 },
          { name: "Neslana", shade: 500, quantityPerCell: 130 },
        ],
      },
    ],
  },
  {
    name: "Suho voće",
    description:
      "Voće koje je prirodno ili industrijski osušeno radi duljeg trajanja.",
    cropTypes: [
      {
        name: "Suhe smokve",
        color: "amber",
        description: "Sušeni plod smokve visoke energetske vrijednosti.",
        cropVarieties: [
          { name: "Bijele", shade: 400, quantityPerCell: 2 },
          { name: "Tamne", shade: 700, quantityPerCell: 1 },
        ],
      },
      {
        name: "Grožđice",
        color: "amber",
        description: "Sušeno grožđe.",
        cropVarieties: [
          { name: "Svijetle", shade: 400, quantityPerCell: 20 },
          { name: "Tamne", shade: 700, quantityPerCell: 20 },
        ],
      },
      {
        name: "Suhe marelice",
        color: "orange",
        description: "Sušene marelice bez koštice.",
        cropVarieties: [
          { name: "Prirodne", shade: 500, quantityPerCell: 16 },
          { name: "Sulfitirane", shade: 600, quantityPerCell: 14 },
        ],
      },
    ],
  },
  {
    name: "Egzotično / rijetko voće",
    description: "Manje poznate ili rijetko uzgajane vrste voća.",
    cropTypes: [
      {
        name: "Mango",
        color: "yellow",
        description: "Tropsko voće slatke i sočne pulpe.",
        cropVarieties: [
          { name: "Kent", shade: 500, quantityPerCell: 80 },
          { name: "Tommy Atkins", shade: 600, quantityPerCell: 75 },
        ],
      },
      {
        name: "Ananas",
        color: "yellow",
        description: "Tropsko voće čvrste kore i aromatične pulpe.",
        cropVarieties: [
          { name: "Smooth Cayenne", shade: 400, quantityPerCell: 60 },
          { name: "Queen", shade: 500, quantityPerCell: 50 },
          { name: "Red Spanish", shade: 600, quantityPerCell: 55 },
        ],
      },
      {
        name: "Papaja",
        color: "orange",
        description: "Meko tropsko voće blagog okusa.",
        cropVarieties: [
          { name: "Solo", shade: 400, quantityPerCell: 40 },
          { name: "Red Lady", shade: 500, quantityPerCell: 45 },
          { name: "Maradol", shade: 600, quantityPerCell: 50 },
        ],
      },
      {
        name: "Dragon fruit",
        color: "fuchsia",
        description: "Egzotično voće blagog okusa i dekorativnog izgleda.",
        cropVarieties: [
          { name: "Bijela pulpa", shade: 300, quantityPerCell: 20 },
          { name: "Crvena pulpa", shade: 600, quantityPerCell: 25 },
        ],
      },
    ],
  },
];

export const mainTypes = [{ name: "Povrće" }, { name: "Voće" }];

const allCropTypes = [
  { name: "Povrće", generalTypes: vegatablesGeneralCropTypes },
  { name: "Voće", generalTypes: fruitsGeneralCropTypes },
];

export default allCropTypes;

export const END_PLANTING = "Završi spodručje sadnje";
export const CONTINUE_PLANTING = "Nastavi kreirati područje sadnje";

export const END_HARVESTING = "Završi područje žetve";
export const CONTINUE_HARVESTING = "Nastavi kreirati područje žetve";
