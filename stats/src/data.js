export const SITE = {
  name: "AngkaBangsa",
  country: "Indonesia",
  tagline: "Indonesia in Numbers",
  publisher: "BPS – Statistics Indonesia & Official Sources"
};

export const HEADLINES = [
  {
    id: "population",
    label: "Population",
    labelId: "Penduduk",
    value: "284.4",
    unit: "million people",
    note: "Mid-2025 estimate; the 2020 census counted 270.2 million",
    noteId: "Estimasi pertengahan 2025; sensus 2020 mencatat 270,2 juta",
    source: "BPS",
    year: "2025"
  },
  {
    id: "gdp",
    label: "Gross Domestic Product",
    labelId: "Produk Domestik Bruto",
    value: "22,139",
    valueId: "22.139",
    unit: "trillion rupiah",
    note: "Per capita Rp 78.6 million (about US$4,960) at current prices",
    noteId: "Per kapita Rp 78,6 juta (sekitar US$4.960) atas dasar harga berlaku",
    source: "BPS",
    year: "2024"
  },
  {
    id: "gdp-growth",
    label: "GDP Growth",
    labelId: "Pertumbuhan PDB",
    value: "5.03",
    unit: "%",
    note: "Steady post-pandemic economic expansion",
    noteId: "Ekspansi ekonomi pascapandemi yang stabil",
    source: "BPS",
    year: "2024"
  },
  {
    id: "poverty",
    label: "Poverty Rate",
    labelId: "Tingkat Kemiskinan",
    value: "8.47",
    unit: "% of population",
    note: "Lowest in decades; represents 23.9 million people",
    noteId: "Terendah dalam beberapa dekade; setara 23,9 juta jiwa",
    source: "BPS",
    year: "March 2025"
  },
  {
    id: "unemployment",
    label: "Unemployment Rate",
    labelId: "Tingkat Pengangguran",
    value: "4.76",
    unit: "% of labour force",
    note: "Open unemployment rate (TPT)",
    noteId: "Tingkat pengangguran terbuka (TPT)",
    source: "BPS",
    year: "February 2025"
  },
  {
    id: "inflation",
    label: "Inflation",
    labelId: "Inflasi",
    value: "1.57",
    unit: "% year on year",
    note: "December 2024, within the central bank target band",
    noteId: "Desember 2024, di dalam kisaran sasaran bank sentral",
    source: "BPS",
    year: "2024"
  }
];

export const FACTS = [
  {
    label: "Land Area",
    labelId: "Luas Daratan",
    value: "1,904,569 km²",
    valueId: "1.904.569 km²",
    source: "BPS",
    year: "2024"
  },
  {
    label: "Islands",
    labelId: "Pulau",
    value: "17,508 islands",
    valueId: "17.508 pulau",
    source: "BPS geographic",
    year: "2024"
  },
  {
    label: "Provinces",
    labelId: "Provinsi",
    value: "38 provinces",
    valueId: "38 provinsi",
    source: "Kemendagri",
    year: "2024"
  },
  {
    label: "Regencies and Cities",
    labelId: "Kabupaten dan Kota",
    value: "514 administrative regions",
    valueId: "514 daerah administratif",
    source: "Kemendagri",
    year: "2024"
  },
  {
    label: "Human Development Index",
    labelId: "Indeks Pembangunan Manusia",
    value: "75.90",
    valueId: "75,90",
    source: "BPS",
    year: "2025"
  },
  {
    label: "Internet Penetration",
    labelId: "Penetrasi Internet",
    value: "79.5% (221.6M users)",
    valueId: "79,5% (221,6 juta pengguna)",
    source: "APJII",
    year: "2024"
  },
  {
    label: "Electricity Access",
    labelId: "Akses Listrik",
    value: "99.83% of households",
    valueId: "99,83% rumah tangga",
    source: "Ministry of Energy and Mineral Resources",
    year: "2024"
  },
  {
    label: "Urban Share",
    labelId: "Porsi Perkotaan",
    value: "56.6% of population",
    valueId: "56,6% dari penduduk",
    source: "Population Census",
    year: "2020"
  },
  {
    label: "Foreign Visitors",
    labelId: "Wisatawan Mancanegara",
    value: "13.90 million arrivals",
    valueId: "13,90 juta kunjungan",
    source: "BPS",
    year: "2024"
  },
  {
    label: "Highest Minimum Wage",
    labelId: "Upah Minimum Tertinggi",
    value: "Rp 5,396,761 / month (Jakarta)",
    valueId: "Rp 5.396.761 / bulan (Jakarta)",
    source: "Provincial wage councils",
    year: "2025"
  },
  {
    label: "Lowest Minimum Wage",
    labelId: "Upah Minimum Terendah",
    value: "Rp 2,169,349 / month (Central Java)",
    valueId: "Rp 2.169.349 / bulan (Jawa Tengah)",
    source: "Provincial wage councils",
    year: "2025"
  },
  {
    label: "Mean years of schooling",
    labelId: "Rata-rata lama sekolah",
    value: "8.85 years",
    valueId: "8,85 tahun",
    source: "BPS",
    year: "2024"
  },
  {
    label: "Stunting among children under five",
    labelId: "Stunting pada balita",
    value: "19.8 percent",
    valueId: "19,8 persen",
    source: "Ministry of Health (SSGI)",
    year: "2024"
  }
];

export const SERIES = {
  "gdp-growth": {
    id: "gdp-growth",
    title: "GDP growth",
    titleId: "Pertumbuhan PDB",
    unit: "percent",
    source: "BPS",
    points: [
      { year: 2015, value: 4.88 },
      { year: 2016, value: 5.03 },
      { year: 2017, value: 5.07 },
      { year: 2018, value: 5.17 },
      { year: 2019, value: 5.02 },
      { year: 2020, value: -2.07 },
      { year: 2021, value: 3.70 },
      { year: 2022, value: 5.31 },
      { year: 2023, value: 5.05 },
      { year: 2024, value: 5.03 }
    ]
  },
  "gdp-per-capita": {
    id: "gdp-per-capita",
    title: "GDP per capita",
    titleId: "PDB per kapita",
    unit: "million rupiah (current prices)",
    source: "BPS",
    points: [
      { year: 2019, value: 59.1 },
      { year: 2020, value: 56.9 },
      { year: 2021, value: 62.2 },
      { year: 2022, value: 71.1 },
      { year: 2023, value: 75.0 },
      { year: 2024, value: 78.6 }
    ]
  },
  "inflation": {
    id: "inflation",
    title: "Inflation (December, year on year)",
    titleId: "Inflasi (Desember, tahun ke tahun)",
    unit: "percent",
    source: "BPS",
    points: [
      { year: 2015, value: 3.35 },
      { year: 2016, value: 3.02 },
      { year: 2017, value: 3.61 },
      { year: 2018, value: 3.13 },
      { year: 2019, value: 2.72 },
      { year: 2020, value: 1.68 },
      { year: 2021, value: 1.87 },
      { year: 2022, value: 5.51 },
      { year: 2023, value: 2.61 },
      { year: 2024, value: 1.57 }
    ]
  },
  "poverty": {
    id: "poverty",
    title: "Poverty rate (March)",
    titleId: "Tingkat kemiskinan (Maret)",
    unit: "percent",
    source: "BPS",
    points: [
      { year: 2015, value: 11.22 },
      { year: 2016, value: 10.86 },
      { year: 2017, value: 10.64 },
      { year: 2018, value: 9.82 },
      { year: 2019, value: 9.41 },
      { year: 2020, value: 9.78 },
      { year: 2021, value: 10.14 },
      { year: 2022, value: 9.54 },
      { year: 2023, value: 9.36 },
      { year: 2024, value: 9.03 }
    ]
  },
  "unemployment": {
    id: "unemployment",
    title: "Unemployment rate (February)",
    titleId: "Tingkat pengangguran (Februari)",
    unit: "percent",
    source: "BPS",
    points: [
      { year: 2019, value: 5.01 },
      { year: 2020, value: 4.99 },
      { year: 2021, value: 6.26 },
      { year: 2022, value: 5.83 },
      { year: 2023, value: 5.45 },
      { year: 2024, value: 4.82 },
      { year: 2025, value: 4.76 }
    ]
  },
  "population": {
    id: "population",
    title: "Population (mid-year)",
    titleId: "Penduduk (pertengahan tahun)",
    unit: "million people",
    source: "BPS",
    note: "2020 is the census count; other years are BPS estimates.",
    noteId: "2020 adalah hasil sensus; tahun lainnya estimasi BPS.",
    points: [
      { year: 2015, value: 255.2 },
      { year: 2016, value: 258.7 },
      { year: 2017, value: 262.0 },
      { year: 2018, value: 265.0 },
      { year: 2019, value: 268.1 },
      { year: 2020, value: 270.2 },
      { year: 2021, value: 272.7 },
      { year: 2022, value: 275.8 },
      { year: 2023, value: 279.1 },
      { year: 2024, value: 281.6 },
      { year: 2025, value: 284.4 }
    ]
  },
  "trade": {
    id: "trade",
    title: "Exports and imports",
    titleId: "Ekspor dan impor",
    unit: "billion US dollars",
    source: "BPS",
    subSeries: {
      exports: [
        { year: 2019, value: 167.7 },
        { year: 2020, value: 163.2 },
        { year: 2021, value: 231.5 },
        { year: 2022, value: 291.9 },
        { year: 2023, value: 258.8 },
        { year: 2024, value: 264.7 }
      ],
      imports: [
        { year: 2019, value: 170.7 },
        { year: 2020, value: 141.6 },
        { year: 2021, value: 196.2 },
        { year: 2022, value: 237.4 },
        { year: 2023, value: 221.9 },
        { year: 2024, value: 235.6 }
      ]
    }
  },
  "visitors": {
    id: "visitors",
    title: "Foreign visitor arrivals",
    titleId: "Kunjungan wisatawan mancanegara",
    unit: "million arrivals",
    source: "BPS",
    points: [
      { year: 2019, value: 16.11 },
      { year: 2020, value: 4.05 },
      { year: 2021, value: 1.56 },
      { year: 2022, value: 5.47 },
      { year: 2023, value: 11.68 },
      { year: 2024, value: 13.90 }
    ]
  },
  "hdi": {
    id: "hdi",
    title: "Human Development Index",
    titleId: "Indeks Pembangunan Manusia",
    unit: "index (0-100)",
    source: "BPS",
    points: [
      { year: 2022, value: 73.77 },
      { year: 2023, value: 74.39 },
      { year: 2024, value: 75.02 },
      { year: 2025, value: 75.90 }
    ]
  }
};

export const PROVINCES = {
  note: "Populations are BPS mid-2025 estimates for the current 38 provinces — Southwest, South, Central and Highland Papua were created in 2022. The HDI column is the 2024 Human Development Index. Census detail elsewhere on this site is from the 2020 Census.",
  noteId: "Angka penduduk adalah estimasi BPS pertengahan 2025 untuk 38 provinsi saat ini — Papua Barat Daya, Papua Selatan, Papua Tengah, dan Papua Pegunungan dibentuk pada 2022. Kolom IPM adalah Indeks Pembangunan Manusia 2024. Rincian sensus di bagian lain situs ini berasal dari Sensus Penduduk 2020.",
  source: "BPS, mid-2025 population estimates; HDI by province 2024; poverty rate September 2024; GRDP per capita 2025, derived from BPS GRDP totals",
  items: [
    { name: "West Java", nameId: "Jawa Barat", population: 50759000, share: 17.8, hdi: 74.92, poverty: 7.08, grdpPc: 59.9 },
    { name: "East Java", nameId: "Jawa Timur", population: 42089300, share: 14.8, hdi: 75.35, poverty: 9.56, grdpPc: 80.9 },
    { name: "Central Java", nameId: "Jawa Tengah", population: 38233900, share: 13.4, hdi: 73.87, poverty: 9.58, grdpPc: 50.8 },
    { name: "North Sumatra", nameId: "Sumatra Utara", population: 15785800, share: 5.5, hdi: 75.76, poverty: 7.19, grdpPc: 78.3 },
    { name: "Banten", nameId: "Banten", population: 12537400, share: 4.4, hdi: 76.35, poverty: 5.70, grdpPc: 74.7 },
    { name: "Jakarta", nameId: "DKI Jakarta", population: 10678000, share: 3.8, hdi: 84.15, poverty: 4.14, grdpPc: 367.7 },
    { name: "South Sulawesi", nameId: "Sulawesi Selatan", population: 9563100, share: 3.4, hdi: 75.18, poverty: 7.77, grdpPc: 78.7 },
    { name: "Lampung", nameId: "Lampung", population: 9522900, share: 3.3, hdi: 73.13, poverty: 10.62, grdpPc: 55.0 },
    { name: "South Sumatra", nameId: "Sumatra Selatan", population: 8928500, share: 3.1, hdi: 73.84, poverty: 10.51, grdpPc: 80.7 },
    { name: "Riau", nameId: "Riau", population: 6811200, share: 2.4, hdi: 75.67, poverty: 6.36, grdpPc: 176.4 },
    { name: "West Sumatra", nameId: "Sumatra Barat", population: 5914300, share: 2.1, hdi: 76.43, poverty: 5.42, grdpPc: 59.5 },
    { name: "West Kalimantan", nameId: "Kalimantan Barat", population: 5766000, share: 2, hdi: 71.19, poverty: 6.25, grdpPc: 57.0 },
    { name: "East Nusa Tenggara", nameId: "Nusa Tenggara Timur", population: 5742600, share: 2, hdi: 69.14, poverty: 19.02, grdpPc: 25.8 },
    { name: "West Nusa Tenggara", nameId: "Nusa Tenggara Barat", population: 5731100, share: 2, hdi: 73.10, poverty: 11.91, grdpPc: 33.7 },
    { name: "Aceh", nameId: "Aceh", population: 5626000, share: 2, hdi: 75.36, poverty: 12.64, grdpPc: 45.8 },
    { name: "Bali", nameId: "Bali", population: 4461300, share: 1.6, hdi: 78.63, poverty: 3.80, grdpPc: 72.7 },
    { name: "South Kalimantan", nameId: "Kalimantan Selatan", population: 4323300, share: 1.5, hdi: 75.19, poverty: 4.02, grdpPc: 70.6 },
    { name: "East Kalimantan", nameId: "Kalimantan Timur", population: 4267600, share: 1.5, hdi: 78.79, poverty: 5.51, grdpPc: 208.3 },
    { name: "Yogyakarta", nameId: "DI Yogyakarta", population: 3781500, share: 1.3, hdi: 81.62, poverty: 10.40, grdpPc: 55.0 },
    { name: "Jambi", nameId: "Jambi", population: 3768500, share: 1.3, hdi: 74.36, poverty: 7.26, grdpPc: 92.8 },
    { name: "Central Sulawesi", nameId: "Sulawesi Tengah", population: 3156100, share: 1.1, hdi: 72.24, poverty: 11.04, grdpPc: 131.6 },
    { name: "Central Kalimantan", nameId: "Kalimantan Tengah", population: 2845000, share: 1, hdi: 74.28, poverty: 5.26, grdpPc: 84.7 },
    { name: "Southeast Sulawesi", nameId: "Sulawesi Tenggara", population: 2836700, share: 1, hdi: 73.62, poverty: 10.63, grdpPc: 72.0 },
    { name: "North Sulawesi", nameId: "Sulawesi Utara", population: 2721400, share: 1, hdi: 75.68, poverty: 6.70, grdpPc: 75.2 },
    { name: "Riau Islands", nameId: "Kepulauan Riau", population: 2213500, share: 0.8, hdi: 79.89, poverty: 4.78, grdpPc: 172.5 },
    { name: "Bengkulu", nameId: "Bengkulu", population: 2138000, share: 0.8, hdi: 74.91, poverty: 12.52, grdpPc: 52.3 },
    { name: "Maluku", nameId: "Maluku", population: 1970600, share: 0.7, hdi: 73.40, poverty: 15.78, grdpPc: 33.7 },
    { name: "Bangka Belitung", nameId: "Kepulauan Bangka Belitung", population: 1550800, share: 0.5, hdi: 74.55, poverty: 5.08, grdpPc: 75.3 },
    { name: "West Sulawesi", nameId: "Sulawesi Barat", population: 1525300, share: 0.5, hdi: 70.46, poverty: 10.71, grdpPc: 46.7 },
    { name: "Central Papua", nameId: "Papua Tengah", population: 1492300, share: 0.5, hdi: 60.25, poverty: 27.60, grdpPc: 107.6 },
    { name: "Highland Papua", nameId: "Papua Pegunungan", population: 1484900, share: 0.5, hdi: 54.43, poverty: 29.66, grdpPc: 19.1 },
    { name: "North Maluku", nameId: "Maluku Utara", population: 1373800, share: 0.5, hdi: 71.84, poverty: 6.03, grdpPc: 97.3 },
    { name: "Gorontalo", nameId: "Gorontalo", population: 1242200, share: 0.4, hdi: 72.01, poverty: 13.87, grdpPc: 47.5 },
    { name: "Papua", nameId: "Papua", population: 1073600, share: 0.4, hdi: 73.83, poverty: 18.09, grdpPc: 84.3 },
    { name: "North Kalimantan", nameId: "Kalimantan Utara", population: 749400, share: 0.3, hdi: 73.41, poverty: 5.38, grdpPc: 208.2 },
    { name: "Southwest Papua", nameId: "Papua Barat Daya", population: 636400, share: 0.2, hdi: 69.65, poverty: 16.95, grdpPc: 61.6 },
    { name: "West Papua", nameId: "Papua Barat", population: 587600, share: 0.2, hdi: 67.69, poverty: 21.09, grdpPc: 139.2 },
    { name: "South Papua", nameId: "Papua Selatan", population: 549700, share: 0.2, hdi: 68.86, poverty: 19.35, grdpPc: 64.9 },
  ]
};

export const ISLANDS = {
  note: "Island-group figures are rounded; shares may not sum to exactly 100.",
  noteId: "Angka kelompok pulau dibulatkan; proporsi mungkin tidak berjumlah tepat 100.",
  source: "BPS, Population Census 2020",
  items: [
    { name: "Java", nameId: "Jawa", population: 151.6, share: 56.1 },
    { name: "Sumatra", population: 58.6, share: 21.7 },
    { name: "Sulawesi", population: 19.9, share: 7.4 },
    { name: "Kalimantan", population: 16.6, share: 6.1 },
    { name: "Bali and Nusa Tenggara", nameId: "Bali dan Nusa Tenggara", population: 15.0, share: 5.5 },
    { name: "Maluku and Papua", nameId: "Maluku dan Papua", population: 8.9, share: 3.3 }
  ]
};

export const AGE = {
  note: "Seven in ten Indonesians are of working age — the demographic bonus BPS projects to peak around 2030.",
  noteId: "Tujuh dari sepuluh penduduk Indonesia berada di usia kerja — bonus demografi yang diproyeksikan BPS mencapai puncak sekitar 2030.",
  source: "BPS, Population Census 2020",
  items: [
    { name: "Ages 0-14", nameId: "Umur 0–14", percent: 23.3 },
    { name: "Ages 15-64 (working age)", nameId: "Umur 15–64 (usia kerja)", percent: 70.7 },
    { name: "Ages 65 and over", nameId: "Umur 65 ke atas", percent: 6.0 }
  ]
};

export const RELIGION = {
  source: "BPS, Population Census 2020",
  items: [
    { name: "Islam", percent: 86.88 },
    { name: "Protestant", nameId: "Protestan", percent: 7.47 },
    { name: "Catholic", nameId: "Katolik", percent: 3.06 },
    { name: "Hindu", percent: 1.71 },
    { name: "Buddhist", nameId: "Buddha", percent: 0.72 },
    { name: "Confucian", nameId: "Konghucu", percent: 0.05 },
    { name: "Other", nameId: "Lainnya", percent: 0.11 }
  ]
};

export const SOURCES = [
  { id: 1, publisher: "BPS – Statistics Indonesia", covers: "national accounts and GDP releases 2024–2025", coversId: "neraca nasional dan rilis PDB 2024–2025" },
  { id: 2, publisher: "BPS – Statistics Indonesia", covers: "Consumer price index and inflation releases 2015–2024", coversId: "indeks harga konsumen dan rilis inflasi 2015–2024" },
  { id: 3, publisher: "BPS – Statistics Indonesia", covers: "Poverty profile of Indonesia (March 2025 and earlier rounds)", coversId: "profil kemiskinan Indonesia (Maret 2025 dan putaran sebelumnya)" },
  { id: 4, publisher: "BPS – Statistics Indonesia", covers: "Labour force situation (Sakernas, February 2025)", coversId: "keadaan angkatan kerja (Sakernas, Februari 2025)" },
  { id: 5, publisher: "BPS – Statistics Indonesia", covers: "Population Census 2020 results", coversId: "hasil Sensus Penduduk 2020" },
  { id: 6, publisher: "BPS – Statistics Indonesia", covers: "Indonesia population projections and mid-year estimates 2015–2025, national and by province", coversId: "proyeksi penduduk Indonesia dan estimasi pertengahan tahun 2015–2025, nasional dan menurut provinsi" },
  { id: 7, publisher: "BPS – Statistics Indonesia", covers: "Human Development Index (IPM) releases: national 2022–2025, by province 2024", coversId: "Rilis Indeks Pembangunan Manusia (IPM): nasional 2022–2025, menurut provinsi 2024" },
  { id: 8, publisher: "BPS – Statistics Indonesia", covers: "Foreign trade statistics 2019–2024", coversId: "statistik perdagangan luar negeri 2019–2024" },
  { id: 9, publisher: "BPS – Statistics Indonesia", covers: "Tourism statistics: foreign visitor arrivals 2019–2024", coversId: "statistik pariwisata: kunjungan wisatawan mancanegara 2019–2024" },
  { id: 10, publisher: "APJII", covers: "Indonesia internet penetration survey 2024", coversId: "survei penetrasi internet Indonesia 2024" },
  { id: 11, publisher: "Ministry of Energy and Mineral Resources", covers: "electrification ratio 2024", coversId: "rasio elektrifikasi 2024" },
  { id: 12, publisher: "Ministry of Home Affairs (Kemendagri)", covers: "administrative divisions 2024", coversId: "pembagian administratif 2024" },
  { id: 13, publisher: "Provincial wage councils", covers: "provincial minimum wages (UMP) 2025", coversId: "upah minimum provinsi (UMP) 2025" }
];
