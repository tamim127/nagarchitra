export interface AreaMeta {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  city: string;
  district: string;
  division: string;
  zone: string;
  wardList: string[];
  lat: number;
  lng: number;
  populationEstimate: string;
}

export const DHAKA_AREAS: AreaMeta[] = [
  {
    id: 'mirpur',
    name: 'Mirpur',
    nameBn: 'মিরপুর',
    slug: 'mirpur',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    zone: 'DNCC Zone 4 & 2',
    wardList: ['Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8', 'Ward 10', 'Ward 11', 'Ward 12'],
    lat: 23.8071,
    lng: 90.3686,
    populationEstimate: '1.4M',
  },
  {
    id: 'dhanmondi',
    name: 'Dhanmondi',
    nameBn: 'ধানমন্ডি',
    slug: 'dhanmondi',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    zone: 'DSCC Zone 3',
    wardList: ['Ward 14', 'Ward 15'],
    lat: 23.7465,
    lng: 90.3760,
    populationEstimate: '280K',
  },
  {
    id: 'uttara',
    name: 'Uttara',
    nameBn: 'উত্তরা',
    slug: 'uttara',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    zone: 'DNCC Zone 1',
    wardList: ['Ward 1', 'Ward 51'],
    lat: 23.8759,
    lng: 90.3795,
    populationEstimate: '650K',
  },
  {
    id: 'mohammadpur',
    name: 'Mohammadpur',
    nameBn: 'মোহাম্মদপুর',
    slug: 'mohammadpur',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    zone: 'DNCC Zone 5',
    wardList: ['Ward 29', 'Ward 31', 'Ward 32', 'Ward 33', 'Ward 34'],
    lat: 23.7658,
    lng: 90.3584,
    populationEstimate: '520K',
  },
  {
    id: 'gulshan',
    name: 'Gulshan & Banani',
    nameBn: 'গুলশান ও বনানী',
    slug: 'gulshan',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    zone: 'DNCC Zone 3',
    wardList: ['Ward 18', 'Ward 19'],
    lat: 23.7925,
    lng: 90.4078,
    populationEstimate: '310K',
  },
  {
    id: 'farmgate',
    name: 'Farmgate & Tejgaon',
    nameBn: 'ফার্মগেট ও তেজগাঁও',
    slug: 'farmgate',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    zone: 'DNCC Zone 3',
    wardList: ['Ward 26', 'Ward 27'],
    lat: 23.7588,
    lng: 90.3892,
    populationEstimate: '420K',
  },
  {
    id: 'old-dhaka',
    name: 'Old Dhaka (Puran Dhaka)',
    nameBn: 'পুরান ঢাকা',
    slug: 'old-dhaka',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    zone: 'DSCC Zone 4',
    wardList: ['Ward 35', 'Ward 36', 'Ward 37'],
    lat: 23.7104,
    lng: 90.4074,
    populationEstimate: '980K',
  },
];
