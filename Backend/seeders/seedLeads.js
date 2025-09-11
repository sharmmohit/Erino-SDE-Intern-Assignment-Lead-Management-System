const User = require('../models/User'); // Fixed import (no {})
const Lead = require('../models/Lead'); // Fixed import (no {})

const seedLeads = async () => {
  try {
    console.log('Starting seed process...');
    
    // Use findOne and create instead of findOrCreate
    let user = await User.findOne({ where: { email: 'test@example.com' } });
    
    if (!user) {
      user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('User created:', user.email);
    } else {
      console.log('User found:', user.email);
    }

    // Check if leads already exist
    const existingLeads = await Lead.count();
    if (existingLeads > 0) {
      console.log('Leads already exist, skipping seeding');
      return;
    }

    // Generate simple test data (without faker)
    const leads = [];
    const statuses = ['new', 'contacted', 'qualified', 'lost', 'won'];
    const sources = ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'];

    for (let i = 0; i < 50; i++) {
      leads.push({
        user_id: user.id,
        first_name: `First${i}`,
        last_name: `Last${i}`,
        email: `lead${i}@example.com`,
        phone: `555-${100 + i}-${1000 + i}`,
        company: `Company ${i}`,
        city: `City ${i % 10}`,
        state: ['CA', 'NY', 'TX', 'FL', 'IL', 'OH', 'GA', 'NC', 'MI', 'WA'][i % 10],
        source: sources[i % sources.length],
        status: statuses[i % statuses.length],
        score: i % 101,
        lead_value: (i * 100).toFixed(2),
        last_activity_at: new Date(Date.now() - i * 86400000),
        is_qualified: i % 4 === 0,
        created_at: new Date(Date.now() - i * 86400000),
        updated_at: new Date()
      });
    }

    await Lead.bulkCreate(leads);
    console.log('Leads seeded successfully');
  } catch (error) {
    console.error('Error seeding leads:', error);
  }
};

module.exports = seedLeads;