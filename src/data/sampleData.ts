import { Vendor } from '../types';

export const SAMPLE_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'Sunset Frames Studio',
    category: 'Photographer',
    location: 'Baga, Goa',
    startingPrice: 25000,
    rating: 4.8,
    featured: true,
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=900&h=600&fit=crop'
    ],
    packages: [
      {
        id: 'p1',
        name: 'Basic Package',
        price: 25000,
        features: ['4 hours coverage', '200 edited photos', 'Online gallery', 'USB drive'],
        description: 'Perfect for intimate ceremonies',
        duration: '4 hours'
      },
      {
        id: 'p2',
        name: 'Premium Package',
        price: 45000,
        features: ['8 hours coverage', '500 edited photos', 'Online gallery', 'USB drive', 'Engagement shoot'],
        description: 'Complete wedding day coverage',
        duration: '8 hours'
      }
    ],
    description: 'Candid wedding photography with a documentary feel. Specializing in capturing authentic moments and emotions.',
    contactInfo: {
      phone: '+91 98765 43210',
      email: 'info@sunsetframes.com',
      instagram: '@sunsetframes_goa'
    },
    availability: {
      isAvailable: true,
      nextAvailableDate: '2024-03-15'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'v2',
    name: 'Maroon Events',
    category: 'Decorator',
    location: 'Anjuna, Goa',
    startingPrice: 40000,
    rating: 4.6,
    featured: true,
    gallery: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f1426e1b1e?w=900&h=600&fit=crop'
    ],
    packages: [
      {
        id: 'p1',
        name: 'Standard Decoration',
        price: 40000,
        features: ['Flower arrangements', 'Lighting setup', 'Stage decoration', 'Entrance decor'],
        description: 'Beautiful floral decorations for your special day',
        duration: 'Full day'
      },
      {
        id: 'p2',
        name: 'Premium Decoration',
        price: 75000,
        features: ['Premium flowers', 'LED lighting', 'Custom stage design', 'Entrance decor', 'Table centerpieces'],
        description: 'Luxurious decoration with premium materials',
        duration: 'Full day'
      }
    ],
    description: 'Elegant decor focused on local flowers and sustainable materials. Creating magical atmospheres for your wedding.',
    contactInfo: {
      phone: '+91 98765 43211',
      email: 'hello@maroonevents.com',
      instagram: '@maroon_events_goa'
    },
    availability: {
      isAvailable: true,
      nextAvailableDate: '2024-03-20'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'v3',
    name: 'Bayview Venue',
    category: 'Venue',
    location: 'Calangute, Goa',
    startingPrice: 150000,
    rating: 4.9,
    featured: false,
    gallery: [
      'https://images.unsplash.com/photo-1519167758481-83f1426e1b1e?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&h=600&fit=crop'
    ],
    packages: [
      {
        id: 'p1',
        name: 'Full Day Venue',
        price: 150000,
        features: ['Seaside location', '200 guests capacity', 'Ceremony & reception spaces', 'Parking', 'Basic sound system'],
        description: 'Stunning seaside venue with ceremony and reception areas',
        duration: 'Full day'
      },
      {
        id: 'p2',
        name: 'Premium Venue',
        price: 250000,
        features: ['Seaside location', '300 guests capacity', 'Ceremony & reception spaces', 'Valet parking', 'Premium sound system', 'Bridal suite'],
        description: 'Luxurious seaside venue with premium amenities',
        duration: 'Full day'
      }
    ],
    description: 'Seaside venue with ceremony & reception spaces. Breathtaking ocean views and perfect for destination weddings.',
    contactInfo: {
      phone: '+91 98765 43212',
      email: 'bookings@bayviewvenue.com',
      website: 'www.bayviewvenue.com'
    },
    availability: {
      isAvailable: true,
      nextAvailableDate: '2024-04-01'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'v4',
    name: 'Goa Catering Co.',
    category: 'Catering',
    location: 'Margao, Goa',
    startingPrice: 80000,
    rating: 4.7,
    featured: true,
    gallery: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=900&h=600&fit=crop'
    ],
    packages: [
      {
        id: 'p1',
        name: 'Goan Delights',
        price: 80000,
        features: ['Traditional Goan cuisine', '100 guests', 'Appetizers & main course', 'Desserts', 'Beverages'],
        description: 'Authentic Goan flavors for your special day',
        duration: 'Full day'
      },
      {
        id: 'p2',
        name: 'Fusion Feast',
        price: 120000,
        features: ['Goan & Continental cuisine', '150 guests', 'Appetizers & main course', 'Premium desserts', 'Open bar'],
        description: 'Perfect blend of local and international flavors',
        duration: 'Full day'
      }
    ],
    description: 'Authentic Goan cuisine with a modern twist. Fresh ingredients and traditional recipes passed down through generations.',
    contactInfo: {
      phone: '+91 98765 43213',
      email: 'orders@goacatering.com',
      instagram: '@goa_catering_co'
    },
    availability: {
      isAvailable: true,
      nextAvailableDate: '2024-03-25'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'v5',
    name: 'Beachside DJ Services',
    category: 'DJ',
    location: 'Palolem, Goa',
    startingPrice: 35000,
    rating: 4.5,
    featured: false,
    gallery: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571266028243-e68f857f258a?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&h=600&fit=crop'
    ],
    packages: [
      {
        id: 'p1',
        name: 'Basic DJ Package',
        price: 35000,
        features: ['6 hours DJ service', 'Sound system', 'Microphone', 'Music library', 'MC services'],
        description: 'Professional DJ services for your wedding celebration',
        duration: '6 hours'
      },
      {
        id: 'p2',
        name: 'Premium DJ Package',
        price: 55000,
        features: ['8 hours DJ service', 'Premium sound system', 'Wireless microphones', 'Custom playlist', 'MC services', 'Lighting effects'],
        description: 'Premium DJ experience with lighting and custom music',
        duration: '8 hours'
      }
    ],
    description: 'Professional DJ services specializing in beach weddings. Creating the perfect atmosphere with music and entertainment.',
    contactInfo: {
      phone: '+91 98765 43214',
      email: 'bookings@beachsidedj.com',
      instagram: '@beachside_dj_goa'
    },
    availability: {
      isAvailable: true,
      nextAvailableDate: '2024-03-18'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

