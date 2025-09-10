const { Lead} = require('../models/Lead');
const { User } = require('../models/User');
const { faker } = require('@faker-js/faker');

const seedLeads = async () => {
  try {
    // Find or create test user
    const [user] = await User.findOrCreate({
      where: { email: 'test@example.com' },
      defaults: {
        firstName: 'Test',
        lastName: 'User',
        password: 'password123'
      }
    });

    // Generate 100+ leads
    const leads = [];
    const statuses = ['new', 'contacted', 'qualified', 'lost', 'won'];
    const sources = ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'];

    for (let i = 0; i < 150; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      
      leads.push({
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        email: faker.internet.email(firstName, lastName),
        phone: faker.phone.phoneNumber(),
        company: faker.company.companyName(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        source: faker.random.arrayElement(sources),
        status: faker.random.arrayElement(statuses),
        score: faker.datatype.number({ min: 0, max: 100 }),
        lead_value: faker.finance.amount(100, 10000, 2),
        last_activity_at: faker.date.recent(),
        is_qualified: faker.datatype.boolean(),
        created_at: faker.date.past(),
        updated_at: faker.date.recent()
      });
    }

    await Lead.bulkCreate(leads);
    console.log('Leads seeded successfully');
  } catch (error) {
    console.error('Error seeding leads:', error);
  }
};

module.exports = seedLeads;