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
    value: "284.4",
    unit: "million people",
    note: "Mid-2025 estimate; the 2020 census counted 270.2 million",
    source: "BPS",
    year: "2025"
  },
  {
    id: "gdp",
    label: "Gross Domestic Product",
    value: "22,139",
    unit: "trillion rupiah",
    note: "Per capita Rp 78.6 million (about US$4,960) at current prices",
    source: "BPS",
    year: "2024"
  },
  {
    id: "gdp-growth",
    label: "GDP Growth",
    value: "5.03",
    unit: "%",
    note: "Steady post-pandemic economic expansion",
    source: "BPS",
    year: "2024"
  },
  {
    id: "poverty",
    label: "Poverty Rate",
    value: "8.47",
    unit: "% of population",
    note: "Lowest in decades; represents 23.9 million people",
    source: "BPS",
    year: "March 2025"
  },
  {
    id: "unemployment",
    label: "Unemployment Rate",
    value: "4.76",
    unit: "% of labour force",
    note: "Open unemployment rate (TPT)",
    source: "BPS",
    year: "February 2025"
  },
  {
    id: "inflation",
    label: "Inflation",
    value: "1.57",
    unit: "% year on year",
    note: "December 2024, within the central bank target band",
    source: "BPS",
    year: "2024"
  }
];

export const FACTS = [
  {
    label: "Land Area",
    value: "1,904,569 km²",
    source: "BPS",
    year: "2024"
  },
  {
    label: "Islands",
    value: "17,508 islands",
    source: "BPS geographic",
    year: "2024"
  },
  {
    label: "Provinces",
    value: "38 provinces",
    source: "Kemendagri",
    year: "2024"
  },
  {
    label: "Regencies and Cities",
    value: "514 administrative regions",
    source: "Kemendagri",
    year: "2024"
  },
  {
    label: "Human Development Index",
    value: "75.02",
    source: "BPS",
    year: "2024"
  },
  {
    label: "Internet Penetration",
    value: "79.5% (221.6M users)",
    source: "APJII",
    year: "2024"
  },
  {
    label: "Electricity Access",
    value: "99.83% of households",
    source: "Ministry of Energy and Mineral Resources",
    year: "2024"
  },
  {
    label: "Urban Share",
    value: "56.6% of population",
    source: "Population Census",
    year: "2020"
  },
  {
    label: "Foreign Visitors",
    value: "13.90 million arrivals",
    source: "BPS",
    year: "2024"
  },
  {
    label: "Highest Minimum Wage",
    value: "Rp 5,396,761 / month (Jakarta)",
    source: "Provincial wage councils",
    year: "2025"
  },
  {
    label: "Lowest Minimum Wage",
    value: "Rp 2,169,349 / month (Central Java)",
    source: "Provincial wage councils",
    year: "2025"
  },
  {
    label: "Mean years of schooling",
    value: "8.85 years",
    source: "BPS",
    year: "2024"
  },
  {
    label: "Stunting among children under five",
    value: "19.8 percent",
    source: "Ministry of Health (SSGI)",
    year: "2024"
  }
];

export const SERIES = {
  "gdp-growth": {
    id: "gdp-growth",
    title: "GDP growth",
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
    unit: "million people",
    source: "BPS",
    note: "2020 is the census count; other years are BPS estimates.",
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
  source: "BPS, Population Census 2020",
  items: [
    { name: "West Java", population: 48274162, share: 17.9 },
    { name: "East Java", population: 40665696, share: 15.1 },
    { name: "Central Java", population: 36516035, share: 13.5 },
    { name: "North Sumatra", population: 14799361, share: 5.5 },
    { name: "Banten", population: 11904562, share: 4.4 },
    { name: "Jakarta", population: 10562088, share: 3.9 },
    { name: "South Sulawesi", population: 9073509, share: 3.4 },
    { name: "Lampung", population: 9007848, share: 3.3 },
    { name: "South Sumatra", population: 8467432, share: 3.1 },
    { name: "Riau", population: 6394087, share: 2.4 },
    { name: "West Sumatra", population: 5534472, share: 2.1 },
    { name: "East Nusa Tenggara", population: 5325566, share: 2.0 },
    { name: "West Nusa Tenggara", population: 5320092, share: 2.0 },
    { name: "Aceh", population: 5274871, share: 2.0 },
    { name: "Bali", population: 4317404, share: 1.6 }
  ]
};

export const ISLANDS = {
  note: "Island-group figures are rounded; shares may not sum to exactly 100.",
  source: "BPS, Population Census 2020",
  items: [
    { name: "Java", population: 151.6, share: 56.1 },
    { name: "Sumatra", population: 58.6, share: 21.7 },
    { name: "Sulawesi", population: 19.9, share: 7.4 },
    { name: "Kalimantan", population: 16.6, share: 6.1 },
    { name: "Bali and Nusa Tenggara", population: 15.0, share: 5.5 },
    { name: "Maluku and Papua", population: 8.9, share: 3.3 }
  ]
};

export const AGE = {
  note: "Seven in ten Indonesians are of working age — the demographic bonus BPS projects to peak around 2030.",
  source: "BPS, Population Census 2020",
  items: [
    { name: "Ages 0-14", percent: 23.3 },
    { name: "Ages 15-64 (working age)", percent: 70.7 },
    { name: "Ages 65 and over", percent: 6.0 }
  ]
};

export const RELIGION = {
  source: "BPS, Population Census 2020",
  items: [
    { name: "Islam", percent: 86.88 },
    { name: "Protestant", percent: 7.47 },
    { name: "Catholic", percent: 3.06 },
    { name: "Hindu", percent: 1.71 },
    { name: "Buddhist", percent: 0.72 },
    { name: "Confucian", percent: 0.05 },
    { name: "Other", percent: 0.11 }
  ]
};

export const SOURCES = [
  { id: 1, publisher: "BPS – Statistics Indonesia", covers: "national accounts and GDP releases 2024–2025" },
  { id: 2, publisher: "BPS – Statistics Indonesia", covers: "Consumer price index and inflation releases 2015–2024" },
  { id: 3, publisher: "BPS – Statistics Indonesia", covers: "Poverty profile of Indonesia (March 2025 and earlier rounds)" },
  { id: 4, publisher: "BPS – Statistics Indonesia", covers: "Labour force situation (Sakernas, February 2025)" },
  { id: 5, publisher: "BPS – Statistics Indonesia", covers: "Population Census 2020 results" },
  { id: 6, publisher: "BPS – Statistics Indonesia", covers: "Indonesia population projections and mid-year estimates 2015–2025" },
  { id: 7, publisher: "BPS – Statistics Indonesia", covers: "Human Development Index 2024" },
  { id: 8, publisher: "BPS – Statistics Indonesia", covers: "Foreign trade statistics 2019–2024" },
  { id: 9, publisher: "BPS – Statistics Indonesia", covers: "Tourism statistics: foreign visitor arrivals 2019–2024" },
  { id: 10, publisher: "APJII", covers: "Indonesia internet penetration survey 2024" },
  { id: 11, publisher: "Ministry of Energy and Mineral Resources", covers: "electrification ratio 2024" },
  { id: 12, publisher: "Ministry of Home Affairs (Kemendagri)", covers: "administrative divisions 2024" },
  { id: 13, publisher: "Provincial wage councils", covers: "provincial minimum wages (UMP) 2025" }
];
