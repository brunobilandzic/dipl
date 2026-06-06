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
        healthBenefits:
          "Bogata vlaknima, vitaminima A i K, nizak sadržaj kalorija. Pomaže pri izgradnji čvrstih kostiju i poboljšanju vida.",
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
        culinaryUse: [
          "Svježe salate",
          "Prilozi uz glavna jela",
          "Sendviči i wrapovi",
          "Hladna jela",
        ],
        cookingNotes:
          "Salata se rijetko termički obrađuje jer toplina brzo uništava strukturu listova.",
        storage:
          "Čuvati u hladnjaku na 0–4 °C, neopranu do upotrebe. Trajnost 3–7 dana ovisno o sorti.",
      },

      {
        name: "Špinat",
        color: "emerald",
        description:
          "Brzorastuće lisnato povrće nježnih listova, bogato željezom, vitaminima A i C. Može se koristiti svježe ili termički obrađeno.",
        healthBenefits:
          "Izvor željeza, kalcija, vitamina K i antioksidanata. Sprječava anemiju i poboljšava sirenje krvi. Izvrstan za jačanje imuniteta.",
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
        culinaryUse: [
          "Svježe salate (baby listovi)",
          "Blanširanje",
          "Kratko pirjanje",
          "Juhe i variva",
          "Nadjevi, pite i umaci",
        ],
        cookingNotes:
          "Kratka termička obrada čuva boju i hranjive tvari. Predugo kuhanje uzrokuje gubitak strukture i okusa.",
        storage:
          "Čuvati u hladnjaku na 0–4 °C, u labavo zatvorenoj ambalaži. Potrošiti unutar 2–4 dana.",
      },
      {
        name: "Blitva",
        color: "teal",
        description:
          "Lisnato povrće s velikim listovima i mesnatim peteljkama, otporno i jednostavno za uzgoj.",
        healthBenefits:
          "Bogata magnezijom, željezom i vlaknima. Pomaže pri regulaciji krvnog tlaka i poboljšava probavu. Sadrži antioksidanse koji štite od bolesti.",
        cropVarieties: [
          { name: "Bijela blitva", shade: 200, quantityPerCell: 36 },
          { name: "Zelena blitva", shade: 500, quantityPerCell: 36 },
          { name: "Crvena blitva", shade: 700, quantityPerCell: 36 },
          { name: "Žuta blitva", shade: 400, quantityPerCell: 36 },
          { name: "Baby blitva", shade: 300, quantityPerCell: 54 },
        ],
        culinaryUse: [
          "Kuhanje i pirjanje",
          "Prilozi uz ribu i krumpir",
          "Juhe i variva",
          "Zapečena jela",
        ],
        cookingNotes:
          "Peteljke zahtijevaju dulju termičku obradu od listova. Blanširanje smanjuje gorčinu.",
        storage:
          "Čuvati u hladnjaku na 0–4 °C, u vlažnoj krpi ili perforiranoj vrećici. Trajnost 4–6 dana.",
      },
      {
        name: "Kupusnjače (lisnate)",
        color: "lime",
        description:
          "Lisnate vrste iz porodice kupusnjača s čvrstim listovima i izraženim okusom, bogate vlaknima i vitaminima.",
        healthBenefits:
          "Izvor vitamina C i K, sadrže sulforafan koji ima protiupalnih svojstava. Sprječavaju rak i jačaju imunitet. Odličan izvor vlakana.",
        cropVarieties: [
          { name: "Kelj", shade: 600, quantityPerCell: 27 },
          { name: "Raštika", shade: 500, quantityPerCell: 27 },
          { name: "Kovrčavi kelj", shade: 700, quantityPerCell: 27 },
          { name: "Kineski kupus", shade: 300, quantityPerCell: 36 },
          { name: "Pak choi", shade: 400, quantityPerCell: 45 },
          { name: "Tatsoi", shade: 200, quantityPerCell: 54 },
          { name: "Mizuna", shade: 100, quantityPerCell: 72 },
        ],
        culinaryUse: [
          "Kuhanje i pirjanje",
          "Pečenje u pećnici",
          "Fermentacija",
          "Juhe i variva",
        ],
        cookingNotes:
          "Dulja obrada omekšava listove i smanjuje intenzitet okusa. Mladi listovi mogu se koristiti kraće kuhani.",
        storage:
          "Čuvati u hladnjaku na 0–4 °C. Veće glavice do 1–2 tjedna, manji listovi 3–5 dana.",
      },
      {
        name: "Cikorijasto lisnato povrće",
        color: "amber",
        description:
          "Lisnato povrće iz roda Cichorium, karakteristično po gorkastom okusu i čvrstim listovima.",
        healthBenefits:
          "Podržava zdravlje jetre i probave. Sadrži inulina koji hranit korisne bakterije u crijevima. Sniža krvni šećer i pomaže pri mršavljenju.",
        cropVarieties: [
          { name: "Radič", shade: 700, quantityPerCell: 36 },
          { name: "Cikorija", shade: 600, quantityPerCell: 36 },
          { name: "Endivija", shade: 400, quantityPerCell: 45 },
          { name: "Escarole", shade: 500, quantityPerCell: 45 },
          { name: "Puntarelle", shade: 800, quantityPerCell: 27 },
        ],
        culinaryUse: [
          "Svježa konzumacija",
          "Blanširanje",
          "Pirjanje",
          "Pečenje",
          "Dodavanje tjestenini i rižotima",
        ],
        cookingNotes:
          "Blanširanje i toplinska obrada smanjuju gorčinu. Mladi listovi su blaži i pogodni za sirovu konzumaciju.",
        storage:
          "Čuvati u hladnjaku na 0–4 °C, visoka vlažnost zraka (90–95 %). Trajnost 5–10 dana.",
      },
      {
        name: "Divlje lisnato povrće",
        color: "green",
        description:
          "Samonikle lisnate biljke tradicionalno korištene u prehrani, često jačeg okusa.",
        healthBenefits:
          "Bogat mineralno i vitaminima, posebno vitaminom K. Pomaže pri detoksikaciji organizma. Snažno diuretsko i desinficijuće svojstvo.",
        cropVarieties: [
          { name: "Maslačak", shade: 600, quantityPerCell: 72 },
          { name: "Kopriva", shade: 700, quantityPerCell: 54 },
          { name: "Šćir", shade: 500, quantityPerCell: 81 },
          { name: "Loboda", shade: 800, quantityPerCell: 72 },
        ],
        culinaryUse: [
          "Blanširanje",
          "Juhe i variva",
          "Nadjevi i pite",
          "Mješavine s drugim povrćem",
        ],
        cookingNotes:
          "Obavezno kratko blanširati radi uklanjanja gorčine ili iritirajućih tvari (npr. kopriva).",
        storage:
          "Najbolje koristiti svježe. Kratkoročno čuvati u hladnjaku do 2 dana.",
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
        healthBenefits:
          "Bogata likopenom i витамином C, jaka antioksidacijska svojstva. Štiti od srčanih bolesti i raka. Pomaže pri izgradnji kostiju.",
        cropVarieties: [
          { name: "Cherry rajčica", shade: 400, quantityPerCell: 18 },
          { name: "Šljivar", shade: 500, quantityPerCell: 9 },
          { name: "Volovsko srce", shade: 600, quantityPerCell: 9 },
          { name: "Beefsteak", shade: 700, quantityPerCell: 9 },
          { name: "Žuta rajčica", shade: 300, quantityPerCell: 18 },
        ],
        culinaryUse: ["Svježa konzumacija", "Umaci", "Juhe", "Pečenje"],
        cookingNotes: "Kuhanjem se pojačava okus i dostupnost likopena.",
        storage:
          "Čuvati na sobnoj temperaturi, ne u hladnjaku. Potrošiti unutar 3–5 dana.",
      },
      {
        name: "Paprika",
        color: "orange",
        description: "Plodovito povrće različitih oblika i stupnjeva ljutine.",
        healthBenefits:
          "Odličan izvor vitamina C, karotenoidâ i kapsaicina. Jača imunitet i sprječava upale. Poboljšava cirkulaciju krvi.",
        cropVarieties: [
          { name: "Babura", shade: 400, quantityPerCell: 9 },
          { name: "Roga", shade: 500, quantityPerCell: 9 },
          { name: "Kapia", shade: 600, quantityPerCell: 9 },
          { name: "Feferon", shade: 700, quantityPerCell: 18 },
          { name: "Čili paprika", shade: 800, quantityPerCell: 27 },
        ],
        culinaryUse: ["Svježe salate", "Pečenje", "Punjenje", "Kuhanje"],
        cookingNotes: "Pečenjem se pojačava slatkoća. Ljutina ovisi o sorti.",
        storage: "Čuvati u hladnjaku 5–7 dana, u ladici za povrće.",
      },
      {
        name: "Krastavac",
        color: "green",
        description: "Osvježavajuće povrće visokog udjela vode.",
        healthBenefits:
          "Idealan za hidrataciju, mali sadržaj kalorija. Sadrži silicij za zdrave kožu i kosu. Pomaže pri gubitku težine.",
        cropVarieties: [
          { name: "Salatni krastavac", shade: 500, quantityPerCell: 18 },
          { name: "Kornišon", shade: 600, quantityPerCell: 27 },
          { name: "Mini krastavac", shade: 400, quantityPerCell: 36 },
        ],
        culinaryUse: ["Svježe salate", "Kiseljenje", "Hladne juhe"],
        cookingNotes: "Najčešće se koristi sirov, bez termičke obrade.",
        storage: "Čuvati u hladnjaku 4–7 dana.",
      },
      {
        name: "Tikvica",
        color: "lime",
        description:
          "Mlada plodovita kultura neutralnog okusa, vrlo prilagodljiva u kuhanju.",
        healthBenefits:
          "Nizak sadržaj kalorija, bogata vlaknima. Sadrži beta-karoten i vitamina C. Pomaže pri probavi i jačanju imuniteta.",
        cropVarieties: [
          { name: "Zelena tikvica", shade: 500, quantityPerCell: 18 },
          { name: "Žuta tikvica", shade: 300, quantityPerCell: 18 },
          { name: "Okrugla tikvica", shade: 600, quantityPerCell: 18 },
        ],
        culinaryUse: ["Pirjanje", "Pečenje", "Roštilj", "Juhe"],
        cookingNotes: "Brzo omekšava; kratka obrada daje najbolju teksturu.",
        storage: "Čuvati u hladnjaku do 5 dana.",
      },
      {
        name: "Patlidžan",
        color: "purple",
        description: "Plodovito povrće spužvaste strukture koje upija masnoću.",
        healthBenefits:
          "Sadrži nasutin koji smanjuje krvni kolesterol. Bogat antioksidansima i vlaknima. Pomaže pri kontroli težine.",
        cropVarieties: [
          { name: "Ljubičasti patlidžan", shade: 700, quantityPerCell: 9 },
          { name: "Bijeli patlidžan", shade: 200, quantityPerCell: 9 },
          { name: "Mini patlidžan", shade: 600, quantityPerCell: 18 },
        ],
        culinaryUse: ["Pečenje", "Grilanje", "Variva", "Namazi"],
        cookingNotes:
          "Soljenje prije pripreme smanjuje gorčinu i upijanje ulja.",
        storage: "Čuvati u hladnjaku 5–7 dana.",
      },
      {
        name: "Bundeva i tikve",
        color: "amber",
        description: "Plodovito povrće s tvrdom korom i dugim rokom trajanja.",
        healthBenefits:
          "Bogata beta-karotenom i vitaminom C, prirodna slatkoća umjesto šećera. Pomaže pri zdravlju očiju i kostiju. Niski indeks glikemije.",
        cropVarieties: [
          { name: "Muškatna tikva", shade: 500, quantityPerCell: 9 },
          { name: "Hokkaido", shade: 600, quantityPerCell: 9 },
          { name: "Butternut", shade: 400, quantityPerCell: 9 },
          { name: "Tikva golica", shade: 700, quantityPerCell: 9 },
        ],
        culinaryUse: ["Juhe", "Pečenje", "Pirei", "Deserti"],
        cookingNotes: "Slatkast okus dolazi do izražaja pečenjem.",
        storage:
          "Cijele plodove čuvati na hladnom i suhom mjestu; narezane u hladnjaku do 5 dana.",
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
        healthBenefits:
          "Izvor beta-karotena koji se pretvara u vitamin A, jačanja vida. Bogata vlaknima i antioksidansima. Sprječava bolesti srca.",
        cropVarieties: [
          { name: "Nantes", shade: 500, quantityPerCell: 126 },
          { name: "Chantenay", shade: 600, quantityPerCell: 108 },
          { name: "Imperator", shade: 700, quantityPerCell: 90 },
          { name: "Ljubičasta mrkva", shade: 400, quantityPerCell: 126 },
        ],
        culinaryUse: ["Svježe", "Juhe", "Variva", "Pečenje"],
        cookingNotes: "Kratko kuhanje čuva slatkoću.",
        storage: "0–4 °C, visoka vlažnost, više tjedana.",
      },
      {
        name: "Cikla",
        color: "rose",
        description: "Korjenasto povrće zemljastog okusa i jake boje.",
        healthBenefits:
          "Bogata dušičnima koji poboljšavaju krvni tlak. Sadrži betalainâ koje su moćne antioksidanse. Pomaže pri detoksikaciji jetre.",
        cropVarieties: [
          { name: "Crvena", shade: 700, quantityPerCell: 108 },
          { name: "Zlatna", shade: 400, quantityPerCell: 108 },
          { name: "Chioggia", shade: 500, quantityPerCell: 108 },
        ],
        culinaryUse: ["Pečenje", "Kuhanje", "Salate"],
        cookingNotes: "Pečenje pojačava slatkoću.",
        storage: "Hladnjak, 2–3 tjedna.",
      },
      {
        name: "Rotkva",
        color: "slate",
        description: "Veliki, pikantni korijen.",
        healthBenefits:
          "Bogata vitaminom C i vlaknima. Jača imunitet i pomaže pri probavi. Ima blago dezinficijuća svojstva.",
        cropVarieties: [
          { name: "Bijela", shade: 200, quantityPerCell: 54 },
          { name: "Crna", shade: 800, quantityPerCell: 36 },
        ],
        culinaryUse: ["Svježe", "Salate"],
        cookingNotes: "Oguliti za blaži okus.",
        storage: "Hladnjak, 1–2 tjedna.",
      },
      {
        name: "Rotkvica",
        color: "rose",
        description: "Mali, hrskavi korijen.",
        healthBenefits:
          "Bogata vitaminom C, pomaže pri jačanju imuniteta. Sadrži fito-kemikalije s protiupalnim svojstvima. Nizak sadržaj kalorija.",
        cropVarieties: [
          { name: "Crvena", shade: 500, quantityPerCell: 144 },
          { name: "Bijela", shade: 200, quantityPerCell: 144 },
          { name: "Ljubičasta", shade: 700, quantityPerCell: 144 },
        ],
        culinaryUse: ["Svježe"],
        cookingNotes: "Najbolja sirova.",
        storage: "Hladnjak, do 7 dana.",
      },
      {
        name: "Peršin korijen",
        color: "stone",
        description: "Aromatičan korijen za temeljce.",
        healthBenefits:
          "Bogat vlaknima i vitaminima. Jača probavu i smanjuje nadutost. Ima diuretska svojstva.",
        cropVarieties: [
          { name: "Dugi", shade: 400, quantityPerCell: 108 },
          { name: "Kratki", shade: 300, quantityPerCell: 90 },
        ],
        culinaryUse: ["Juhe", "Variva"],
        cookingNotes: "Dodaje se rano u kuhanju.",
        storage: "Hladnjak, do 2 tjedna.",
      },
      {
        name: "Pastrnjak",
        color: "amber",
        description: "Slatkast korijen sličan mrkvi.",
        healthBenefits:
          "Bogat vlaknima i vitaminom C. Pomaže pri zdravoj probavi i održavanju razine šećera. Ima antioksidacijska svojstva.",
        cropVarieties: [{ name: "Klasični", shade: 500, quantityPerCell: 90 }],
        culinaryUse: ["Pečenje", "Juhe", "Pire"],
        cookingNotes: "Pečenjem postaje vrlo sladak.",
        storage: "Hladnjak, 2–3 tjedna.",
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
        healthBenefits:
          "Bogat kalijumom i vitaminom B6. Sadrži rezistentnog škroba koji je od koristi za zdravu probavu. Bez glutena.",
        cropVarieties: [
          { name: "Mladi", shade: 200, quantityPerCell: 36 },
          { name: "Bijeli", shade: 100, quantityPerCell: 27 },
          { name: "Crveni", shade: 400, quantityPerCell: 27 },
          { name: "Ljubičasti", shade: 600, quantityPerCell: 18 },
        ],
        culinaryUse: ["Kuhanje", "Pečenje", "Prženje", "Pire"],
        cookingNotes: "Različite sorte imaju različit udio škroba.",
        storage: "Tamno, 4–8 °C.",
      },
      {
        name: "Batat",
        color: "orange",
        description: "Slatki gomolj bogat vlaknima.",
        healthBenefits:
          "Izvor beta-karotena i manganeza. Bogat antioksidansima koji štite od bolesti. Pomaže pri regulaciji krvnog šećera.",
        cropVarieties: [
          { name: "Narančasti", shade: 500, quantityPerCell: 18 },
          { name: "Ljubičasti", shade: 700, quantityPerCell: 18 },
          { name: "Bijeli", shade: 200, quantityPerCell: 27 },
        ],
        culinaryUse: ["Pečenje", "Juhe", "Pire"],
        cookingNotes: "Ne guliti prije pečenja.",
        storage: "Suho, ne u hladnjaku.",
      },
      {
        name: "Topinambur",
        color: "amber",
        description: "Gomolj orašastog okusa.",
        healthBenefits:
          "Sadrži inulina koji hranit zdrave bakterije u crijevima. Pomaže pri snižavanju krvnog šećera i kolesterola. Nizak glikemijski indeks.",
        cropVarieties: [{ name: "Klasični", shade: 500, quantityPerCell: 36 }],
        culinaryUse: ["Pečenje", "Juhe"],
        cookingNotes: "Kratka obrada.",
        storage: "Hladnjak, do 2 tjedna.",
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
        healthBenefits:
          "Sadrži kvercetin i sulfidnih spojeva s antibakterijskim svojstvima. Pomaže pri zaštiti srca i snižavanju kolesterola. Jača imunitet.",
        cropVarieties: [
          { name: "Bijeli", shade: 200, quantityPerCell: 108 },
          { name: "Crveni", shade: 600, quantityPerCell: 90 },
          { name: "Žuti", shade: 400, quantityPerCell: 90 },
          { name: "Mladi", shade: 300, quantityPerCell: 126 },
        ],
        culinaryUse: ["Pirjanje", "Pečenje", "Sirovo"],
        cookingNotes: "Pirjanjem postaje sladak.",
        storage: "Suho i prozračno.",
      },
      {
        name: "Češnjak",
        color: "slate",
        description: "Intenzivno aromatična lukovica.",
        healthBenefits:
          "Sadrži alicina s jakim antibakterijskim svojstvima. Pomaže pri zaštiti srca i snižavanju krvnog tlaka. Prirodan antibiotik.",
        cropVarieties: [
          { name: "Bijeli", shade: 200, quantityPerCell: 72 },
          { name: "Ljubičasti", shade: 600, quantityPerCell: 54 },
        ],
        culinaryUse: ["Začinjavanje", "Ulja", "Umaci"],
        cookingNotes: "Ne prepeći.",
        storage: "Suho i tamno.",
      },
      {
        name: "Poriluk",
        color: "teal",
        description: "Blaga lukovičasta kultura.",
        healthBenefits:
          "Bogat vlaknima i vitaminom C. Pomaže pri jačanju kostiju i imuniteta. Ima blaga diuretska svojstva.",
        cropVarieties: [
          { name: "Zimski", shade: 600, quantityPerCell: 18 },
          { name: "Ljetni", shade: 400, quantityPerCell: 18 },
        ],
        culinaryUse: ["Juhe", "Pirjanje", "Pečenje"],
        cookingNotes: "Dobro oprati slojeve.",
        storage: "Hladnjak, do 2 tjedna.",
      },
      {
        name: "Luk šalot",
        color: "rose",
        description: "Fini, aromatičan luk.",
        healthBenefits:
          "Bogat antioksidansima i flonoidima. Pomaže pri regulaciji krvnog šećera i kolesterola. Blagi antibakterijski učinak.",
        cropVarieties: [
          { name: "Crveni", shade: 600, quantityPerCell: 72 },
          { name: "Smeđi", shade: 500, quantityPerCell: 72 },
        ],
        culinaryUse: ["Umaci", "Pirjanje"],
        cookingNotes: "Idealno za fine umake.",
        storage: "Suho.",
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
        culinaryUse: ["Svježe", "Juhe"],
        cookingNotes: "Kratko kuhati.",
        storage: "Hladnjak, do 2 tjedna.",
      },
      {
        name: "Šparoga",
        color: "emerald",
        description: "Sezonska stabljikasta kultura.",
        cropVarieties: [
          { name: "Zelena", shade: 600, quantityPerCell: 36 },
          { name: "Bijela", shade: 200, quantityPerCell: 36 },
        ],
        culinaryUse: ["Kuhanje", "Grilanje"],
        cookingNotes: "Vrlo kratka obrada.",
        storage: "2–3 dana.",
      },
      {
        name: "Rabarbara",
        color: "rose",
        description: "Kisela stabljika, botanički povrće.",
        cropVarieties: [
          { name: "Zelena", shade: 400, quantityPerCell: 27 },
          { name: "Crvena", shade: 700, quantityPerCell: 27 },
        ],
        culinaryUse: ["Deserti", "Kompoti"],
        cookingNotes: "Listovi nisu jestivi.",
        storage: "Hladnjak, do 1 tjedna.",
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
        culinaryUse: ["Kuhanje", "Pečenje"],
        cookingNotes: "Ne prekuhati.",
        storage: "Hladnjak, do 7 dana.",
      },
      {
        name: "Brokula",
        color: "green",
        description: "Zeleni cvat bogat hranjivim tvarima.",
        cropVarieties: [
          { name: "Klasična", shade: 600, quantityPerCell: 27 },
          { name: "Broccolini", shade: 500, quantityPerCell: 36 },
        ],
        culinaryUse: ["Parenje", "Wok"],
        cookingNotes: "Parenje čuva boju.",
        storage: "3–5 dana.",
      },
      {
        name: "Artičoka",
        color: "green",
        description: "Cvjetni pupoljak.",
        cropVarieties: [
          { name: "Zelena", shade: 500, quantityPerCell: 18 },
          { name: "Ljubičasta", shade: 700, quantityPerCell: 18 },
        ],
        culinaryUse: ["Kuhanje", "Pečenje"],
        cookingNotes: "Limun sprječava tamnjenje.",
        storage: "Hladnjak, do 5 dana.",
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
        culinaryUse: ["Variva", "Juhe", "Salate"],
        cookingNotes: "Namakanje skraćuje kuhanje.",
        storage: "Suho i hladno mjesto.",
      },
      {
        name: "Grašak",
        color: "green",
        description: "Slatke zelene mahune ili zrna.",
        cropVarieties: [
          { name: "Mladi", shade: 400, quantityPerCell: 54 },
          { name: "Šećerac", shade: 500, quantityPerCell: 54 },
        ],
        culinaryUse: ["Kuhanje", "Rižota"],
        cookingNotes: "Kuhati vrlo kratko.",
        storage: "Hladnjak, 2–3 dana.",
      },
      {
        name: "Bob",
        color: "green",
        description: "Krupan grahast plod.",
        cropVarieties: [
          { name: "Zeleni", shade: 500, quantityPerCell: 54 },
          { name: "Suhi", shade: 700, quantityPerCell: 45 },
        ],
        culinaryUse: ["Variva", "Pire"],
        cookingNotes: "Oguliti kožicu nakon kuhanja.",
        storage: "Hladnjak, nekoliko dana.",
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
        culinaryUse: ["Juhe", "Variva"],
        cookingNotes: "Ne zahtijeva namakanje.",
        storage: "Suho.",
      },
      {
        name: "Slanutak",
        color: "yellow",
        description: "Mahunarka orašastog okusa.",
        cropVarieties: [
          { name: "Sitni", shade: 400, quantityPerCell: 72 },
          { name: "Krupan", shade: 500, quantityPerCell: 54 },
        ],
        culinaryUse: ["Humus", "Variva", "Salate"],
        cookingNotes: "Dugo kuhanje ili namakanje.",
        storage: "Suho.",
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
        culinaryUse: ["Kuhanje", "Pečenje"],
        cookingNotes: "Kuhati kratko.",
        storage: "Hladnjak, 2–3 dana.",
      },
      {
        name: "Bamija",
        color: "lime",
        description: "Plod sa sjemenkama, često u varivima.",
        cropVarieties: [
          { name: "Zelena", shade: 500, quantityPerCell: 36 },
          { name: "Crvena", shade: 600, quantityPerCell: 36 },
        ],
        culinaryUse: ["Variva", "Prženje"],
        cookingNotes: "Kratko kuhati da se ne sluzi.",
        storage: "Hladnjak, do 3 dana.",
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
        culinaryUse: ["Pirjanje", "Juhe", "Pečenje"],
        cookingNotes: "Ne namakati u vodi.",
        storage: "Hladnjak, papirnata vrećica.",
      },
      {
        name: "Bukovače",
        color: "gray",
        description: "Mesnate gljive blagog okusa.",
        cropVarieties: [
          { name: "Siva", shade: 500, quantityPerCell: 108 },
          { name: "Bijela", shade: 200, quantityPerCell: 108 },
        ],
        culinaryUse: ["Wok", "Pečenje"],
        cookingNotes: "Kratko peći.",
        storage: "Hladnjak, 3–5 dana.",
      },
      {
        name: "Shiitake",
        color: "amber",
        description: "Aromatične gljive azijskog porijekla.",
        cropVarieties: [
          { name: "Svježi", shade: 600, quantityPerCell: 90 },
          { name: "Sušeni", shade: 700, quantityPerCell: 72 },
        ],
        culinaryUse: ["Juhe", "Umaci"],
        cookingNotes: "Sušene prethodno namočiti.",
        storage: "Svježe u hladnjaku, sušene suho.",
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
        culinaryUse: ["Svježe", "Juhe"],
        cookingNotes: "Dodavati na kraju.",
        storage: "Hladnjak, čaša vode.",
      },
      {
        name: "Bosiljak",
        color: "green",
        description: "Aromatična biljka osjetljiva na hladnoću.",
        cropVarieties: [
          { name: "Zeleni", shade: 500, quantityPerCell: 72 },
          { name: "Ljubičasti", shade: 700, quantityPerCell: 72 },
        ],
        culinaryUse: ["Umaci", "Salate"],
        cookingNotes: "Ne kuhati dugo.",
        storage: "Sobna temperatura.",
      },
      {
        name: "Kopar",
        color: "lime",
        description: "Blaga aroma za ribu i povrće.",
        cropVarieties: [{ name: "Svježi", shade: 400, quantityPerCell: 144 }],
        culinaryUse: ["Umaci", "Juhe"],
        cookingNotes: "Dodavati na kraju.",
        storage: "Hladnjak, kratko.",
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
        culinaryUse: ["Svježe", "Kolači", "Kompoti", "Sokovi"],
        cookingNotes: "Čvrste sorte bolje za pečenje.",
        storage: "Hladnjak ili hladna prostorija, više tjedana.",
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
        culinaryUse: ["Svježe", "Deserti", "Kompoti"],
        cookingNotes: "Brzo omekša pri kuhanju.",
        storage: "Hladnjak, 1–2 tjedna.",
      },
      {
        name: "Dunja",
        color: "amber",
        description: "Tvrdo i aromatično voće.",
        cropVarieties: [
          { name: "Obična dunja", shade: 500, quantityPerCell: 80 },
        ],
        culinaryUse: ["Marmelade", "Žele", "Pečenje"],
        cookingNotes: "Ne koristi se sirova.",
        storage: "Hladno i suho, dugo.",
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
        culinaryUse: ["Svježe", "Deserti", "Kompoti"],
        cookingNotes: "Brzo se raspada kuhanjem.",
        storage: "Hladnjak, kratko.",
      },
      {
        name: "Marelica",
        color: "orange",
        description: "Slatko-kiselo voće mekane teksture.",
        cropVarieties: [
          { name: "Mađarska", shade: 500, quantityPerCell: 110 },
          { name: "Bergeron", shade: 600, quantityPerCell: 125 },
        ],
        culinaryUse: ["Marmelade", "Kolači"],
        cookingNotes: "Pogodna za sušenje.",
        storage: "Hladnjak, nekoliko dana.",
      },
      {
        name: "Trešnja",
        color: "red",
        description: "Slatko koštičavo voće.",
        cropVarieties: [
          { name: "Slatka", shade: 600, quantityPerCell: 60 },
          { name: "Višnja", shade: 700, quantityPerCell: 40 },
        ],
        culinaryUse: ["Svježe", "Deserti"],
        cookingNotes: "Osjetljiva na toplinu.",
        storage: "Hladnjak, vrlo kratko.",
      },
      {
        name: "Šljiva",
        color: "purple",
        description: "Voće pogodno za preradu.",
        cropVarieties: [
          { name: "Bistrica", shade: 600, quantityPerCell: 140 },
          { name: "Stanley", shade: 700, quantityPerCell: 150 },
        ],
        culinaryUse: ["Svježe", "Pekmezi", "Sušenje"],
        cookingNotes: "Dobro podnosi toplinu.",
        storage: "Hladnjak, 1 tjedan.",
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
        culinaryUse: ["Svježe", "Deserti", "Džemovi"],
        cookingNotes: "Ne prati prije skladištenja.",
        storage: "Hladnjak, 1–2 dana.",
      },
      {
        name: "Malina",
        color: "red",
        description: "Osjetljivo i aromatično voće.",
        cropVarieties: [
          { name: "Willamette", shade: 500, quantityPerCell: 12 },
          { name: "Polka", shade: 600, quantityPerCell: 12 },
        ],
        culinaryUse: ["Svježe", "Džemovi"],
        cookingNotes: "Brzo se raspada.",
        storage: "Hladnjak, vrlo kratko.",
      },
      {
        name: "Borovnica",
        color: "blue",
        description: "Sitno plavo voće.",
        cropVarieties: [
          { name: "Američka", shade: 600, quantityPerCell: 10 },
          { name: "Šumska", shade: 700, quantityPerCell: 10 },
        ],
        culinaryUse: ["Svježe", "Deserti"],
        cookingNotes: "Dobro podnosi zamrzavanje.",
        storage: "Hladnjak, 5–7 dana.",
      },
      {
        name: "Kupina",
        color: "purple",
        description: "Tamno bobičasto voće.",
        cropVarieties: [
          { name: "Divlja", shade: 800, quantityPerCell: 10 },
          { name: "Uzgajana", shade: 700, quantityPerCell: 10 },
        ],
        culinaryUse: ["Svježe", "Džemovi"],
        cookingNotes: "Intenzivna boja.",
        storage: "Hladnjak, kratko.",
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
        culinaryUse: [
          "Svježa konzumacija",
          "Sokovi",
          "Sušenje (grožđice)",
          "Vino",
        ],
        cookingNotes:
          "Svježe grožđe se rijetko termički obrađuje, ali je pogodno za redukcije i deserte.",
        storage:
          "Čuvati u hladnjaku na 0–4 °C, neoprano do upotrebe. Trajnost 5–10 dana.",
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
        culinaryUse: ["Svježe", "Sokovi"],
        cookingNotes: "Sok najbolje svjež.",
        storage: "Hladno, do 2 tjedna.",
      },
      {
        name: "Limun",
        color: "yellow",
        description: "Vrlo kiseli citrus.",
        cropVarieties: [
          { name: "Eureka", shade: 400, quantityPerCell: 150 },
          { name: "Lisbon", shade: 500, quantityPerCell: 140 },
        ],
        culinaryUse: ["Začinjavanje", "Sokovi"],
        cookingNotes: "Kora se često koristi.",
        storage: "Hladnjak.",
      },
      {
        name: "Mandarina",
        color: "orange",
        description: "Slatki citrus tanke kore.",
        cropVarieties: [
          { name: "Clementina", shade: 400, quantityPerCell: 160 },
          { name: "Satsuma", shade: 500, quantityPerCell: 170 },
        ],
        culinaryUse: ["Svježe"],
        cookingNotes: "Lako se guli.",
        storage: "Hladnjak.",
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
        culinaryUse: ["Svježe", "Sušenje", "Deserti"],
        cookingNotes: "Vrlo zrele smokve koriste se odmah.",
        storage: "Hladnjak, 1–2 dana.",
      },
      {
        name: "Nar",
        color: "red",
        description: "Voće s jestivim sočnim sjemenkama.",
        cropVarieties: [
          { name: "Slatki", shade: 500, quantityPerCell: 200 },
          { name: "Kiselkasti", shade: 600, quantityPerCell: 180 },
        ],
        culinaryUse: ["Svježe", "Salate", "Sokovi"],
        cookingNotes: "Sjemenke se koriste sirove.",
        storage: "Hladnjak, do 2 tjedna.",
      },
      {
        name: "Kaki",
        color: "orange",
        description: "Slatko voće mekane teksture kada dozrije.",
        cropVarieties: [
          { name: "Vanilija", shade: 400, quantityPerCell: 70 },
          { name: "Hachiya", shade: 600, quantityPerCell: 60 },
        ],
        culinaryUse: ["Svježe", "Deserti"],
        cookingNotes: "Nezreo kaki je trpak.",
        storage: "Sobna temperatura do zrenja.",
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
        culinaryUse: ["Deserti", "Kolači", "Ulje"],
        cookingNotes: "Lagano tostiranje pojačava aromu.",
        storage: "Suho i hladno, mjesecima.",
      },
      {
        name: "Lješnjak",
        color: "amber",
        description: "Sitno orašasto voće slatkastog okusa.",
        cropVarieties: [
          { name: "Istarski", shade: 500, quantityPerCell: 100 },
          { name: "Tonda Gentile", shade: 600, quantityPerCell: 150 },
        ],
        culinaryUse: ["Deserti", "Namazi"],
        cookingNotes: "Često se koristi pržen.",
        storage: "Suho.",
      },
      {
        name: "Badem",
        color: "amber",
        description: "Orašasti plod blagog okusa.",
        cropVarieties: [
          { name: "Slatki", shade: 400, quantityPerCell: 180 },
          { name: "Gorki", shade: 700, quantityPerCell: 160 },
        ],
        culinaryUse: ["Svježe", "Deserti", "Mlijeko"],
        cookingNotes: "Oguljeni bademi su blaži.",
        storage: "Suho i hladno.",
      },
      {
        name: "Pistacija",
        color: "green",
        description: "Zelenkasta jezgra intenzivne arome.",
        cropVarieties: [
          { name: "Slana", shade: 600, quantityPerCell: 140 },
          { name: "Neslana", shade: 500, quantityPerCell: 130 },
        ],
        culinaryUse: ["Deserti", "Grickalice"],
        cookingNotes: "Koristi se sirova ili pečena.",
        storage: "Suho.",
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
        culinaryUse: ["Deserti", "Grickalice"],
        cookingNotes: "Po potrebi namočiti.",
        storage: "Suho i zatvoreno.",
      },
      {
        name: "Grožđice",
        color: "amber",
        description: "Sušeno grožđe.",
        cropVarieties: [
          { name: "Svijetle", shade: 400, quantityPerCell: 20 },
          { name: "Tamne", shade: 700, quantityPerCell: 20 },
        ],
        culinaryUse: ["Kolači", "Riže", "Salate"],
        cookingNotes: "Daju prirodnu slatkoću.",
        storage: "Suho.",
      },
      {
        name: "Suhe marelice",
        color: "orange",
        description: "Sušene marelice bez koštice.",
        cropVarieties: [
          { name: "Prirodne", shade: 500, quantityPerCell: 16 },
          { name: "Sulfitirane", shade: 600, quantityPerCell: 14 },
        ],
        culinaryUse: ["Deserti", "Variva"],
        cookingNotes: "Namakanjem omekšaju.",
        storage: "Suho.",
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
        culinaryUse: ["Svježe", "Deserti", "Smoothiji"],
        cookingNotes: "Zreo mango je mekan na dodir.",
        storage: "Sobna temperatura do zrenja.",
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
        culinaryUse: ["Svježe", "Pečenje", "Deserti"],
        cookingNotes: "Toplina pojačava slatkoću.",
        storage: "Sobna temperatura ili hladnjak.",
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
        culinaryUse: ["Svježe", "Smoothiji"],
        cookingNotes: "Sjemenke nisu jestive.",
        storage: "Hladnjak kad dozrije.",
      },
      {
        name: "Dragon fruit",
        color: "fuchsia",
        description: "Egzotično voće blagog okusa i dekorativnog izgleda.",
        cropVarieties: [
          { name: "Bijela pulpa", shade: 300, quantityPerCell: 20 },
          { name: "Crvena pulpa", shade: 600, quantityPerCell: 25 },
        ],
        culinaryUse: ["Svježe", "Deserti"],
        cookingNotes: "Koristi se hladno.",
        storage: "Hladnjak.",
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
