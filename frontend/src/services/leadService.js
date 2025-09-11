import api from './api';

export const leadService = {
  getLeads: (params) => api.get('/api/leads', { params }),
  getLead: (id) => api.get(`/api/leads/${id}`),
  createLead: (data) => api.post('/api/leads', data),
  updateLead: (id, data) => api.put(`/api/leads/${id}`, data),
  deleteLead: (id) => api.delete(`/api/leads/${id}`)
};