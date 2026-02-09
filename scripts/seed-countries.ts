/**
 * Country Seed Script for TurboMed Distributors
 *
 * Run with: npx tsx scripts/seed-countries.ts
 *
 * Make sure to set SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL
 * in your environment or .env.local file
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Complete ISO 3166-1 alpha-2 country list with regions and common synonyms
const countries = [
  // North America
  { iso2: 'US', name: 'United States', region: 'North America', synonyms: ['USA', 'U.S.', 'U.S.A.', 'America', 'United States of America'] },
  { iso2: 'CA', name: 'Canada', region: 'North America', synonyms: [] },
  { iso2: 'MX', name: 'Mexico', region: 'North America', synonyms: ['México'] },

  // Central America & Caribbean
  { iso2: 'GT', name: 'Guatemala', region: 'North America', synonyms: [] },
  { iso2: 'BZ', name: 'Belize', region: 'North America', synonyms: [] },
  { iso2: 'HN', name: 'Honduras', region: 'North America', synonyms: [] },
  { iso2: 'SV', name: 'El Salvador', region: 'North America', synonyms: [] },
  { iso2: 'NI', name: 'Nicaragua', region: 'North America', synonyms: [] },
  { iso2: 'CR', name: 'Costa Rica', region: 'North America', synonyms: [] },
  { iso2: 'PA', name: 'Panama', region: 'North America', synonyms: ['Panamá'] },
  { iso2: 'CU', name: 'Cuba', region: 'North America', synonyms: [] },
  { iso2: 'JM', name: 'Jamaica', region: 'North America', synonyms: [] },
  { iso2: 'HT', name: 'Haiti', region: 'North America', synonyms: [] },
  { iso2: 'DO', name: 'Dominican Republic', region: 'North America', synonyms: ['DR'] },
  { iso2: 'PR', name: 'Puerto Rico', region: 'North America', synonyms: [] },
  { iso2: 'TT', name: 'Trinidad and Tobago', region: 'North America', synonyms: [] },
  { iso2: 'BS', name: 'Bahamas', region: 'North America', synonyms: ['The Bahamas'] },
  { iso2: 'BB', name: 'Barbados', region: 'North America', synonyms: [] },

  // South America
  { iso2: 'BR', name: 'Brazil', region: 'South America', synonyms: ['Brasil'] },
  { iso2: 'AR', name: 'Argentina', region: 'South America', synonyms: [] },
  { iso2: 'CL', name: 'Chile', region: 'South America', synonyms: [] },
  { iso2: 'CO', name: 'Colombia', region: 'South America', synonyms: [] },
  { iso2: 'PE', name: 'Peru', region: 'South America', synonyms: ['Perú'] },
  { iso2: 'VE', name: 'Venezuela', region: 'South America', synonyms: [] },
  { iso2: 'EC', name: 'Ecuador', region: 'South America', synonyms: [] },
  { iso2: 'BO', name: 'Bolivia', region: 'South America', synonyms: [] },
  { iso2: 'PY', name: 'Paraguay', region: 'South America', synonyms: [] },
  { iso2: 'UY', name: 'Uruguay', region: 'South America', synonyms: [] },
  { iso2: 'GY', name: 'Guyana', region: 'South America', synonyms: [] },
  { iso2: 'SR', name: 'Suriname', region: 'South America', synonyms: [] },

  // Europe - Western
  { iso2: 'GB', name: 'United Kingdom', region: 'Europe', synonyms: ['UK', 'U.K.', 'Britain', 'Great Britain', 'England'] },
  { iso2: 'FR', name: 'France', region: 'Europe', synonyms: [] },
  { iso2: 'DE', name: 'Germany', region: 'Europe', synonyms: ['Deutschland'] },
  { iso2: 'IT', name: 'Italy', region: 'Europe', synonyms: ['Italia'] },
  { iso2: 'ES', name: 'Spain', region: 'Europe', synonyms: ['España'] },
  { iso2: 'PT', name: 'Portugal', region: 'Europe', synonyms: [] },
  { iso2: 'NL', name: 'Netherlands', region: 'Europe', synonyms: ['Holland', 'The Netherlands'] },
  { iso2: 'BE', name: 'Belgium', region: 'Europe', synonyms: ['België', 'Belgique'] },
  { iso2: 'LU', name: 'Luxembourg', region: 'Europe', synonyms: [] },
  { iso2: 'IE', name: 'Ireland', region: 'Europe', synonyms: ['Eire'] },
  { iso2: 'AT', name: 'Austria', region: 'Europe', synonyms: ['Österreich'] },
  { iso2: 'CH', name: 'Switzerland', region: 'Europe', synonyms: ['Schweiz', 'Suisse', 'Svizzera'] },
  { iso2: 'MC', name: 'Monaco', region: 'Europe', synonyms: [] },
  { iso2: 'AD', name: 'Andorra', region: 'Europe', synonyms: [] },
  { iso2: 'LI', name: 'Liechtenstein', region: 'Europe', synonyms: [] },
  { iso2: 'MT', name: 'Malta', region: 'Europe', synonyms: [] },

  // Europe - Northern
  { iso2: 'SE', name: 'Sweden', region: 'Europe', synonyms: ['Sverige'] },
  { iso2: 'NO', name: 'Norway', region: 'Europe', synonyms: ['Norge'] },
  { iso2: 'DK', name: 'Denmark', region: 'Europe', synonyms: ['Danmark'] },
  { iso2: 'FI', name: 'Finland', region: 'Europe', synonyms: ['Suomi'] },
  { iso2: 'IS', name: 'Iceland', region: 'Europe', synonyms: ['Ísland'] },

  // Europe - Eastern
  { iso2: 'PL', name: 'Poland', region: 'Europe', synonyms: ['Polska'] },
  { iso2: 'CZ', name: 'Czech Republic', region: 'Europe', synonyms: ['Czechia', 'Česko'] },
  { iso2: 'SK', name: 'Slovakia', region: 'Europe', synonyms: ['Slovensko'] },
  { iso2: 'HU', name: 'Hungary', region: 'Europe', synonyms: ['Magyarország'] },
  { iso2: 'RO', name: 'Romania', region: 'Europe', synonyms: ['România'] },
  { iso2: 'BG', name: 'Bulgaria', region: 'Europe', synonyms: ['България'] },
  { iso2: 'UA', name: 'Ukraine', region: 'Europe', synonyms: ['Україна'] },
  { iso2: 'BY', name: 'Belarus', region: 'Europe', synonyms: ['Беларусь'] },
  { iso2: 'MD', name: 'Moldova', region: 'Europe', synonyms: [] },
  { iso2: 'RU', name: 'Russia', region: 'Europe', synonyms: ['Russian Federation', 'Россия'] },
  { iso2: 'EE', name: 'Estonia', region: 'Europe', synonyms: ['Eesti'] },
  { iso2: 'LV', name: 'Latvia', region: 'Europe', synonyms: ['Latvija'] },
  { iso2: 'LT', name: 'Lithuania', region: 'Europe', synonyms: ['Lietuva'] },

  // Europe - Southern/Balkans
  { iso2: 'GR', name: 'Greece', region: 'Europe', synonyms: ['Hellas', 'Ελλάδα'] },
  { iso2: 'HR', name: 'Croatia', region: 'Europe', synonyms: ['Hrvatska'] },
  { iso2: 'SI', name: 'Slovenia', region: 'Europe', synonyms: ['Slovenija'] },
  { iso2: 'RS', name: 'Serbia', region: 'Europe', synonyms: ['Србија'] },
  { iso2: 'BA', name: 'Bosnia and Herzegovina', region: 'Europe', synonyms: ['BiH'] },
  { iso2: 'ME', name: 'Montenegro', region: 'Europe', synonyms: ['Crna Gora'] },
  { iso2: 'MK', name: 'North Macedonia', region: 'Europe', synonyms: ['Macedonia', 'FYROM'] },
  { iso2: 'AL', name: 'Albania', region: 'Europe', synonyms: ['Shqipëria'] },
  { iso2: 'XK', name: 'Kosovo', region: 'Europe', synonyms: [] },
  { iso2: 'CY', name: 'Cyprus', region: 'Europe', synonyms: ['Κύπρος'] },

  // Middle East
  { iso2: 'TR', name: 'Turkey', region: 'Middle East', synonyms: ['Türkiye'] },
  { iso2: 'IL', name: 'Israel', region: 'Middle East', synonyms: ['ישראל'] },
  { iso2: 'SA', name: 'Saudi Arabia', region: 'Middle East', synonyms: ['KSA', 'Kingdom of Saudi Arabia'] },
  { iso2: 'AE', name: 'United Arab Emirates', region: 'Middle East', synonyms: ['UAE', 'Emirates'] },
  { iso2: 'QA', name: 'Qatar', region: 'Middle East', synonyms: [] },
  { iso2: 'KW', name: 'Kuwait', region: 'Middle East', synonyms: [] },
  { iso2: 'BH', name: 'Bahrain', region: 'Middle East', synonyms: [] },
  { iso2: 'OM', name: 'Oman', region: 'Middle East', synonyms: [] },
  { iso2: 'YE', name: 'Yemen', region: 'Middle East', synonyms: [] },
  { iso2: 'JO', name: 'Jordan', region: 'Middle East', synonyms: [] },
  { iso2: 'LB', name: 'Lebanon', region: 'Middle East', synonyms: [] },
  { iso2: 'SY', name: 'Syria', region: 'Middle East', synonyms: [] },
  { iso2: 'IQ', name: 'Iraq', region: 'Middle East', synonyms: [] },
  { iso2: 'IR', name: 'Iran', region: 'Middle East', synonyms: ['Persia'] },
  { iso2: 'PS', name: 'Palestine', region: 'Middle East', synonyms: ['Palestinian Territories'] },

  // Africa - North
  { iso2: 'EG', name: 'Egypt', region: 'Africa', synonyms: ['مصر'] },
  { iso2: 'MA', name: 'Morocco', region: 'Africa', synonyms: ['المغرب'] },
  { iso2: 'TN', name: 'Tunisia', region: 'Africa', synonyms: [] },
  { iso2: 'DZ', name: 'Algeria', region: 'Africa', synonyms: [] },
  { iso2: 'LY', name: 'Libya', region: 'Africa', synonyms: [] },

  // Africa - Sub-Saharan
  { iso2: 'ZA', name: 'South Africa', region: 'Africa', synonyms: ['RSA'] },
  { iso2: 'NG', name: 'Nigeria', region: 'Africa', synonyms: [] },
  { iso2: 'KE', name: 'Kenya', region: 'Africa', synonyms: [] },
  { iso2: 'GH', name: 'Ghana', region: 'Africa', synonyms: [] },
  { iso2: 'ET', name: 'Ethiopia', region: 'Africa', synonyms: [] },
  { iso2: 'TZ', name: 'Tanzania', region: 'Africa', synonyms: [] },
  { iso2: 'UG', name: 'Uganda', region: 'Africa', synonyms: [] },
  { iso2: 'RW', name: 'Rwanda', region: 'Africa', synonyms: [] },
  { iso2: 'SN', name: 'Senegal', region: 'Africa', synonyms: [] },
  { iso2: 'CI', name: "Côte d'Ivoire", region: 'Africa', synonyms: ['Ivory Coast'] },
  { iso2: 'CM', name: 'Cameroon', region: 'Africa', synonyms: [] },
  { iso2: 'AO', name: 'Angola', region: 'Africa', synonyms: [] },
  { iso2: 'MZ', name: 'Mozambique', region: 'Africa', synonyms: [] },
  { iso2: 'ZW', name: 'Zimbabwe', region: 'Africa', synonyms: [] },
  { iso2: 'BW', name: 'Botswana', region: 'Africa', synonyms: [] },
  { iso2: 'NA', name: 'Namibia', region: 'Africa', synonyms: [] },
  { iso2: 'MU', name: 'Mauritius', region: 'Africa', synonyms: [] },
  { iso2: 'MG', name: 'Madagascar', region: 'Africa', synonyms: [] },
  { iso2: 'ZM', name: 'Zambia', region: 'Africa', synonyms: [] },
  { iso2: 'MW', name: 'Malawi', region: 'Africa', synonyms: [] },
  { iso2: 'ML', name: 'Mali', region: 'Africa', synonyms: [] },
  { iso2: 'BF', name: 'Burkina Faso', region: 'Africa', synonyms: [] },
  { iso2: 'NE', name: 'Niger', region: 'Africa', synonyms: [] },
  { iso2: 'TD', name: 'Chad', region: 'Africa', synonyms: [] },
  { iso2: 'SD', name: 'Sudan', region: 'Africa', synonyms: [] },
  { iso2: 'SS', name: 'South Sudan', region: 'Africa', synonyms: [] },
  { iso2: 'SO', name: 'Somalia', region: 'Africa', synonyms: [] },
  { iso2: 'CD', name: 'DR Congo', region: 'Africa', synonyms: ['Democratic Republic of the Congo', 'DRC', 'Congo-Kinshasa'] },
  { iso2: 'CG', name: 'Republic of the Congo', region: 'Africa', synonyms: ['Congo', 'Congo-Brazzaville'] },
  { iso2: 'GA', name: 'Gabon', region: 'Africa', synonyms: [] },
  { iso2: 'GQ', name: 'Equatorial Guinea', region: 'Africa', synonyms: [] },
  { iso2: 'TG', name: 'Togo', region: 'Africa', synonyms: [] },
  { iso2: 'BJ', name: 'Benin', region: 'Africa', synonyms: [] },
  { iso2: 'LR', name: 'Liberia', region: 'Africa', synonyms: [] },
  { iso2: 'SL', name: 'Sierra Leone', region: 'Africa', synonyms: [] },
  { iso2: 'GN', name: 'Guinea', region: 'Africa', synonyms: [] },
  { iso2: 'GM', name: 'Gambia', region: 'Africa', synonyms: ['The Gambia'] },
  { iso2: 'GW', name: 'Guinea-Bissau', region: 'Africa', synonyms: [] },
  { iso2: 'CV', name: 'Cape Verde', region: 'Africa', synonyms: ['Cabo Verde'] },
  { iso2: 'MR', name: 'Mauritania', region: 'Africa', synonyms: [] },
  { iso2: 'ER', name: 'Eritrea', region: 'Africa', synonyms: [] },
  { iso2: 'DJ', name: 'Djibouti', region: 'Africa', synonyms: [] },
  { iso2: 'BI', name: 'Burundi', region: 'Africa', synonyms: [] },
  { iso2: 'CF', name: 'Central African Republic', region: 'Africa', synonyms: ['CAR'] },
  { iso2: 'LS', name: 'Lesotho', region: 'Africa', synonyms: [] },
  { iso2: 'SZ', name: 'Eswatini', region: 'Africa', synonyms: ['Swaziland'] },
  { iso2: 'SC', name: 'Seychelles', region: 'Africa', synonyms: [] },
  { iso2: 'KM', name: 'Comoros', region: 'Africa', synonyms: [] },
  { iso2: 'ST', name: 'São Tomé and Príncipe', region: 'Africa', synonyms: [] },

  // Asia - East
  { iso2: 'CN', name: 'China', region: 'Asia', synonyms: ['PRC', "People's Republic of China", '中国'] },
  { iso2: 'JP', name: 'Japan', region: 'Asia', synonyms: ['日本'] },
  { iso2: 'KR', name: 'South Korea', region: 'Asia', synonyms: ['Korea', 'Republic of Korea', '한국'] },
  { iso2: 'KP', name: 'North Korea', region: 'Asia', synonyms: ['DPRK'] },
  { iso2: 'TW', name: 'Taiwan', region: 'Asia', synonyms: ['Republic of China', '台灣'] },
  { iso2: 'HK', name: 'Hong Kong', region: 'Asia', synonyms: ['香港'] },
  { iso2: 'MO', name: 'Macau', region: 'Asia', synonyms: ['Macao', '澳門'] },
  { iso2: 'MN', name: 'Mongolia', region: 'Asia', synonyms: [] },

  // Asia - Southeast
  { iso2: 'SG', name: 'Singapore', region: 'Asia', synonyms: [] },
  { iso2: 'MY', name: 'Malaysia', region: 'Asia', synonyms: [] },
  { iso2: 'ID', name: 'Indonesia', region: 'Asia', synonyms: [] },
  { iso2: 'TH', name: 'Thailand', region: 'Asia', synonyms: [] },
  { iso2: 'VN', name: 'Vietnam', region: 'Asia', synonyms: ['Viet Nam'] },
  { iso2: 'PH', name: 'Philippines', region: 'Asia', synonyms: [] },
  { iso2: 'MM', name: 'Myanmar', region: 'Asia', synonyms: ['Burma'] },
  { iso2: 'KH', name: 'Cambodia', region: 'Asia', synonyms: [] },
  { iso2: 'LA', name: 'Laos', region: 'Asia', synonyms: [] },
  { iso2: 'BN', name: 'Brunei', region: 'Asia', synonyms: [] },
  { iso2: 'TL', name: 'Timor-Leste', region: 'Asia', synonyms: ['East Timor'] },

  // Asia - South
  { iso2: 'IN', name: 'India', region: 'Asia', synonyms: ['भारत'] },
  { iso2: 'PK', name: 'Pakistan', region: 'Asia', synonyms: [] },
  { iso2: 'BD', name: 'Bangladesh', region: 'Asia', synonyms: [] },
  { iso2: 'LK', name: 'Sri Lanka', region: 'Asia', synonyms: ['Ceylon'] },
  { iso2: 'NP', name: 'Nepal', region: 'Asia', synonyms: [] },
  { iso2: 'BT', name: 'Bhutan', region: 'Asia', synonyms: [] },
  { iso2: 'MV', name: 'Maldives', region: 'Asia', synonyms: [] },
  { iso2: 'AF', name: 'Afghanistan', region: 'Asia', synonyms: [] },

  // Asia - Central
  { iso2: 'KZ', name: 'Kazakhstan', region: 'Asia', synonyms: [] },
  { iso2: 'UZ', name: 'Uzbekistan', region: 'Asia', synonyms: [] },
  { iso2: 'TM', name: 'Turkmenistan', region: 'Asia', synonyms: [] },
  { iso2: 'KG', name: 'Kyrgyzstan', region: 'Asia', synonyms: [] },
  { iso2: 'TJ', name: 'Tajikistan', region: 'Asia', synonyms: [] },
  { iso2: 'AM', name: 'Armenia', region: 'Asia', synonyms: [] },
  { iso2: 'AZ', name: 'Azerbaijan', region: 'Asia', synonyms: [] },
  { iso2: 'GE', name: 'Georgia', region: 'Asia', synonyms: ['საქართველო'] },

  // Oceania
  { iso2: 'AU', name: 'Australia', region: 'Oceania', synonyms: ['Aus'] },
  { iso2: 'NZ', name: 'New Zealand', region: 'Oceania', synonyms: ['Aotearoa'] },
  { iso2: 'FJ', name: 'Fiji', region: 'Oceania', synonyms: [] },
  { iso2: 'PG', name: 'Papua New Guinea', region: 'Oceania', synonyms: ['PNG'] },
  { iso2: 'NC', name: 'New Caledonia', region: 'Oceania', synonyms: [] },
  { iso2: 'PF', name: 'French Polynesia', region: 'Oceania', synonyms: ['Tahiti'] },
  { iso2: 'SB', name: 'Solomon Islands', region: 'Oceania', synonyms: [] },
  { iso2: 'VU', name: 'Vanuatu', region: 'Oceania', synonyms: [] },
  { iso2: 'WS', name: 'Samoa', region: 'Oceania', synonyms: [] },
  { iso2: 'TO', name: 'Tonga', region: 'Oceania', synonyms: [] },
  { iso2: 'FM', name: 'Micronesia', region: 'Oceania', synonyms: [] },
  { iso2: 'GU', name: 'Guam', region: 'Oceania', synonyms: [] },
  { iso2: 'PW', name: 'Palau', region: 'Oceania', synonyms: [] },
  { iso2: 'KI', name: 'Kiribati', region: 'Oceania', synonyms: [] },
  { iso2: 'MH', name: 'Marshall Islands', region: 'Oceania', synonyms: [] },
  { iso2: 'NR', name: 'Nauru', region: 'Oceania', synonyms: [] },
  { iso2: 'TV', name: 'Tuvalu', region: 'Oceania', synonyms: [] },
]

async function seedCountries() {
  console.log('Starting country seed...')
  console.log(`Total countries to seed: ${countries.length}`)

  // Upsert countries in batches
  const batchSize = 50
  for (let i = 0; i < countries.length; i += batchSize) {
    const batch = countries.slice(i, i + batchSize)

    const { error } = await supabase
      .from('countries')
      .upsert(batch, { onConflict: 'iso2' })

    if (error) {
      console.error(`Error seeding batch ${i / batchSize + 1}:`, error)
      throw error
    }

    console.log(`Seeded batch ${i / batchSize + 1} (${batch.length} countries)`)
  }

  console.log('Country seed completed successfully!')
  console.log(`Total countries seeded: ${countries.length}`)
}

seedCountries()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
