import React, { useState, useEffect } from 'react';

const LeadForm = ({ lead, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    state: '',
    source: 'website',
    status: 'new',
    score: 0,
    lead_value: 0,
    last_activity_at: '',
    is_qualified: false
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        first_name: lead.first_name || '',
        last_name: lead.last_name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        city: lead.city || '',
        state: lead.state || '',
        source: lead.source || 'website',
        status: lead.status || 'new',
        score: lead.score || 0,
        lead_value: lead.lead_value || 0,
        last_activity_at: lead.last_activity_at || '',
        is_qualified: lead.is_qualified || false
      });
    }
  }, [lead]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{lead ? 'Edit Lead' : 'Add New Lead'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Source</label>
              <select name="source" value={formData.source} onChange={handleChange}>
                <option value="website">Website</option>
                <option value="facebook_ads">Facebook Ads</option>
                <option value="google_ads">Google Ads</option>
                <option value="referral">Referral</option>
                <option value="events">Events</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="lost">Lost</option>
                <option value="won">Won</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Score (0-100)</label>
              <input
                type="number"
                name="score"
                value={formData.score}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </div>
            <div className="form-group">
              <label>Lead Value</label>
              <input
                type="number"
                name="lead_value"
                value={formData.lead_value}
                onChange={handleChange}
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Last Activity Date</label>
            <input
              type="datetime-local"
              name="last_activity_at"
              value={formData.last_activity_at}
              onChange={handleChange}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="is_qualified"
                checked={formData.is_qualified}
                onChange={handleChange}
              />
              Is Qualified
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="submit">{lead ? 'Update' : 'Create'} Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;