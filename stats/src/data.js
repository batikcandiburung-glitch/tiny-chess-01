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
    value: "75.02",
    valueId: "75,02",
    source: "BPS",
    year: "2024"
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
  }
};

export const PROVINCES = {
  note: "The 2020 census counted 34 provinces; four new Papuan provinces created in 2022 bring today's total to 38.",
  noteId: "Sensus 2020 mencatat 34 provinsi; empat provinsi baru di Papua yang dibentuk pada 2022 membuat total hari ini menjadi 38.",
  source: "BPS, Population Census 2020",
  items: [
    { name: "West Java", nameId: "Jawa Barat", population: 48274162, share: 17.9 },
    { name: "East Java", nameId: "Jawa Timur", population: 40665696, share: 15.1 },
    { name: "Central Java", nameId: "Jawa Tengah", population: 36516035, share: 13.5 },
    { name: "North Sumatra", nameId: "Sumatra Utara", population: 14799361, share: 5.5 },
    { name: "Banten", population: 11904562, share: 4.4 },
    { name: "Jakarta", population: 10562088, share: 3.9 },
    { name: "South Sulawesi", nameId: "Sulawesi Selatan", population: 9073509, share: 3.4 },
    { name: "Lampung", population: 9007848, share: 3.3 },
    { name: "South Sumatra", nameId: "Sumatra Selatan", population: 8467432, share: 3.1 },
    { name: "Riau", population: 6394087, share: 2.4 },
    { name: "West Sumatra", nameId: "Sumatra Barat", population: 5534472, share: 2.0 },
    { name: "West Kalimantan", nameId: "Kalimantan Barat", population: 5414390, share: 2.0 },
    { name: "East Nusa Tenggara", nameId: "Nusa Tenggara Timur", population: 5325566, share: 2.0 },
    { name: "West Nusa Tenggara", nameId: "Nusa Tenggara Barat", population: 5320092, share: 2.0 },
    { name: "Aceh", population: 5274871, share: 2.0 },
    { name: "Bali", population: 4317404, share: 1.6 },
    { name: "Papua", population: 4303707, share: 1.6 },
    { name: "South Kalimantan", nameId: "Kalimantan Selatan", population: 4073584, share: 1.5 },
    { name: "East Kalimantan", nameId: "Kalimantan Timur", population: 3766039, share: 1.4 },
    { name: "Yogyakarta", population: 3668719, share: 1.4 },
    { name: "Jambi", population: 3548228, share: 1.3 },
    { name: "Central Sulawesi", nameId: "Sulawesi Tengah", population: 2985734, share: 1.1 },
    { name: "Central Kalimantan", nameId: "Kalimantan Tengah", population: 2669969, share: 1.0 },
    { name: "Southeast Sulawesi", nameId: "Sulawesi Tenggara", population: 2624875, share: 1.0 },
    { name: "North Sulawesi", nameId: "Sulawesi Utara", population: 2621923, share: 1.0 },
    { name: "Riau Islands", nameId: "Kepulauan Riau", population: 2064564, share: 0.8 },
    { name: "Bengkulu", population: 2010670, share: 0.7 },
    { name: "Maluku", population: 1848923, share: 0.7 },
    { name: "Bangka Belitung", nameId: "Kepulauan Bangka Belitung", population: 1455678, share: 0.5 },
    { name: "West Sulawesi", nameId: "Sulawesi Barat", population: 1419229, share: 0.5 },
    { name: "North Maluku", nameId: "Maluku Utara", population: 1282937, share: 0.5 },
    { name: "Gorontalo", population: 1171681, share: 0.4 },
    { name: "West Papua", nameId: "Papua Barat", population: 1134068, share: 0.4 },
    { name: "North Kalimantan", nameId: "Kalimantan Utara", population: 701814, share: 0.3 }
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
  { id: 6, publisher: "BPS – Statistics Indonesia", covers: "Indonesia population projections and mid-year estimates 2015–2025", coversId: "proyeksi penduduk Indonesia dan estimasi pertengahan tahun 2015–2025" },
  { id: 7, publisher: "BPS – Statistics Indonesia", covers: "Human Development Index 2024", coversId: "Indeks Pembangunan Manusia 2024" },
  { id: 8, publisher: "BPS – Statistics Indonesia", covers: "Foreign trade statistics 2019–2024", coversId: "statistik perdagangan luar negeri 2019–2024" },
  { id: 9, publisher: "BPS – Statistics Indonesia", covers: "Tourism statistics: foreign visitor arrivals 2019–2024", coversId: "statistik pariwisata: kunjungan wisatawan mancanegara 2019–2024" },
  { id: 10, publisher: "APJII", covers: "Indonesia internet penetration survey 2024", coversId: "survei penetrasi internet Indonesia 2024" },
  { id: 11, publisher: "Ministry of Energy and Mineral Resources", covers: "electrification ratio 2024", coversId: "rasio elektrifikasi 2024" },
  { id: 12, publisher: "Ministry of Home Affairs (Kemendagri)", covers: "administrative divisions 2024", coversId: "pembagian administratif 2024" },
  { id: 13, publisher: "Provincial wage councils", covers: "provincial minimum wages (UMP) 2025", coversId: "upah minimum provinsi (UMP) 2025" }
];
