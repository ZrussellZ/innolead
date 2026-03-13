export interface Run {
  id: string
  keyword: string
  date: string
  status: 'running' | 'complete' | 'failed'
  companyCount?: number
}

export interface Lead {
  'Score %': string
  'Company name': string
  'Website URL': string
  'Gehaald punten': string
  'Mogelijke Punten': string
  'Uitleg score': string
  'Date': string
  'Wat voor producten ze verkopen': string
  'Aantal SKU\'s': string
  'Kleinste product naam': string
  'Kleinste product URL': string
  'Kleinste product afmetingen ': string
  'Kleinste product gewicht': string
  'Grootste product naam': string
  'Grootste product URL': string
  'Grootste product afemtingen': string
  'Grootste product gewicht': string
  'Lichtste product naam': string
  'Lichtste product URL': string
  'Lichtste product afemtingen': string
  'Lichtste product gewicht': string
  'Zwaarste product naam': string
  'Zwaarste product URL': string
  'Zwaarste product afmetingen': string
  'Zwaarste product gewicht': string
  'Retour adress': string
  'Cutoff tijd': string
  'Cutoff Note': string
  'Waar ze hun producten naartoe sturen': string
  'Instagram': string
  'Facebook': string
  'Youtube': string
  'Tiktok': string
  'X': string
  'Linked In': string
  'Status Product/Bedrijfs Informatie': string
  'Google Rating': string
  'Google Total Reviews': string
  'Recent Review 1': string
  'Recent Review 2': string
  'Recent Review 3': string
  'Google Business Adress': string
  'Google Place ID': string
  'Status Google Reviews': string
  'TrustPilot Rating': string
  'TrustPilot Total Reviews': string
  'TrustPilot Recent Review 1': string
  'TrustPilot Recent Review 2': string
  'TrustPilot Recent Review 3': string
  'TrustPilot URL': string
  'Status TrustPilot': string
  'Has Meta Ads': string
  'Meta active ads count': string
  'Meta Platforms': string
  'Meta Last ad run': string
  'Meta Ads runned last 30 days?': string
  'Meta Likes count': string
  'Meta Libary URL': string
  'Meta Page ID': string
  'Google has ads': string
  'Google Page ID': string
  'Google Latest ad': string
  'Ads runned last 30 days?': string
  'Status': string
  'Contact 1 First Name': string
  'Contact 1 Last Name': string
  'Contact 1 Position': string
  'Contact 1 Linked-In': string
  'Contact 2 First Name': string
  'Contact 2 Last Name': string
  'Contact 2 Position': string
  'Contact 2 Linked-In': string
  'Contact 3 First Name': string
  'Contact 3 Last Name': string
  'Contact 3 Position': string
  'Contact 3 Linked-In': string
  'Contact 4 First Name': string
  'Contact 4 Last Name': string
  'Contact 4 Position': string
  'Contact 4 Linked-In': string
  'Contact 5 First Name': string
  'Contact 5 Last Name': string
  'Contact 5 Position': string
  'Contact 5 Linked-In': string
  [key: string]: string
}

export interface OverzichtData {
  score: string
  companyName: string
  websiteUrl: string
  gehaaldePunten: string
  mogelijkePunten: string
  uitlegScore: string
  date: string
  producten: string
  aantalSkus: string
  retourAdres: string
  cutoffTijd: string
  cutoffNote: string
  verzendLanden: string
  instagram: string
  facebook: string
  youtube: string
  tiktok: string
  x: string
  linkedIn: string
}

export interface ProductInfo {
  naam: string
  url: string
  afmetingen: string
  gewicht: string
}

export interface ProductData {
  kleinste: ProductInfo
  grootste: ProductInfo
  lichtste: ProductInfo
  zwaarste: ProductInfo
}

export interface ReviewsData {
  google: {
    rating: string
    totalReviews: string
    recentReview1: string
    recentReview2: string
    recentReview3: string
    businessAddress: string
    placeId: string
    status: string
  }
  trustpilot: {
    rating: string
    totalReviews: string
    recentReview1: string
    recentReview2: string
    recentReview3: string
    url: string
    status: string
  }
}

export interface AdsData {
  meta: {
    hasAds: string
    activeCount: string
    platforms: string
    lastAdRun: string
    last30Days: string
    likesCount: string
    libraryUrl: string
    pageId: string
  }
  google: {
    hasAds: string
    pageId: string
    latestAd: string
    last30Days: string
  }
}

export interface Contact {
  firstName: string
  lastName: string
  position: string
  linkedIn: string
}

export interface ProspectData {
  status: string
  contacts: Contact[]
}

export function extractOverzicht(lead: Lead): OverzichtData {
  return {
    score: lead['Score %'],
    companyName: lead['Company name'],
    websiteUrl: lead['Website URL'],
    gehaaldePunten: lead['Gehaald punten'],
    mogelijkePunten: lead['Mogelijke Punten'],
    uitlegScore: lead['Uitleg score'],
    date: lead['Date'],
    producten: lead['Wat voor producten ze verkopen'],
    aantalSkus: lead['Aantal SKU\'s'],
    retourAdres: lead['Retour adress'],
    cutoffTijd: lead['Cutoff tijd'],
    cutoffNote: lead['Cutoff Note'],
    verzendLanden: lead['Waar ze hun producten naartoe sturen'],
    instagram: lead['Instagram'],
    facebook: lead['Facebook'],
    youtube: lead['Youtube'],
    tiktok: lead['Tiktok'],
    x: lead['X'],
    linkedIn: lead['Linked In'],
  }
}

export function extractProducts(lead: Lead): ProductData {
  return {
    kleinste: {
      naam: lead['Kleinste product naam'],
      url: lead['Kleinste product URL'],
      afmetingen: lead['Kleinste product afmetingen '],
      gewicht: lead['Kleinste product gewicht'],
    },
    grootste: {
      naam: lead['Grootste product naam'],
      url: lead['Grootste product URL'],
      afmetingen: lead['Grootste product afemtingen'],
      gewicht: lead['Grootste product gewicht'],
    },
    lichtste: {
      naam: lead['Lichtste product naam'],
      url: lead['Lichtste product URL'],
      afmetingen: lead['Lichtste product afemtingen'],
      gewicht: lead['Lichtste product gewicht'],
    },
    zwaarste: {
      naam: lead['Zwaarste product naam'],
      url: lead['Zwaarste product URL'],
      afmetingen: lead['Zwaarste product afmetingen'],
      gewicht: lead['Zwaarste product gewicht'],
    },
  }
}

export function extractReviews(lead: Lead): ReviewsData {
  return {
    google: {
      rating: lead['Google Rating'],
      totalReviews: lead['Google Total Reviews'],
      recentReview1: lead['Recent Review 1'],
      recentReview2: lead['Recent Review 2'],
      recentReview3: lead['Recent Review 3'],
      businessAddress: lead['Google Business Adress'],
      placeId: lead['Google Place ID'],
      status: lead['Status Google Reviews'],
    },
    trustpilot: {
      rating: lead['TrustPilot Rating'],
      totalReviews: lead['TrustPilot Total Reviews'],
      recentReview1: lead['TrustPilot Recent Review 1'],
      recentReview2: lead['TrustPilot Recent Review 2'],
      recentReview3: lead['TrustPilot Recent Review 3'],
      url: lead['TrustPilot URL'],
      status: lead['Status TrustPilot'],
    },
  }
}

export function extractAds(lead: Lead): AdsData {
  return {
    meta: {
      hasAds: lead['Has Meta Ads'],
      activeCount: lead['Meta active ads count'],
      platforms: lead['Meta Platforms'],
      lastAdRun: lead['Meta Last ad run'],
      last30Days: lead['Meta Ads runned last 30 days?'],
      likesCount: lead['Meta Likes count'],
      libraryUrl: lead['Meta Libary URL'],
      pageId: lead['Meta Page ID'],
    },
    google: {
      hasAds: lead['Google has ads'],
      pageId: lead['Google Page ID'],
      latestAd: lead['Google Latest ad'],
      last30Days: lead['Ads runned last 30 days?'],
    },
  }
}

export function extractProspects(lead: Lead): ProspectData {
  const contacts: Contact[] = []
  for (let i = 1; i <= 5; i++) {
    const firstName = lead[`Contact ${i} First Name`]
    const lastName = lead[`Contact ${i} Last Name`]
    if (firstName || lastName) {
      contacts.push({
        firstName: firstName || '',
        lastName: lastName || '',
        position: lead[`Contact ${i} Position`] || '',
        linkedIn: lead[`Contact ${i} Linked-In`] || '',
      })
    }
  }
  return {
    status: lead['Status'],
    contacts,
  }
}
