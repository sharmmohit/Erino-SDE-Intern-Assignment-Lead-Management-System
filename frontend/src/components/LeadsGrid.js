import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { leadService } from '../services/leadService';
import LeadForm from './LeadForm';

const LeadsGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const columnDefs = [
    { headerName: 'ID', field: 'id', width: 80 },
    { headerName: 'First Name', field: 'first_name', filter: true },
    { headerName: 'Last Name', field: 'last_name', filter: true },
    { headerName: 'Email', field: 'email', filter: true },
    { headerName: 'Company', field: 'company', filter: true },
    { headerName: 'Status', field: 'status', filter: true },
    { headerName: 'Source', field: 'source', filter: true },
    { headerName: 'Score', field: 'score', filter: 'agNumberColumnFilter' },
    { headerName: 'Lead Value', field: 'lead_value', filter: 'agNumberColumnFilter' },
    { headerName: 'Qualified', field: 'is_qualified', filter: true, 
      cellRenderer: (params) => params.value ? 'Yes' : 'No' 
    },
    {
      headerName: 'Actions',
      cellRenderer: (params) => (
        <div>
          <button onClick={() => handleEdit(params.data)}>Edit</button>
          <button onClick={() => handleDelete(params.data.id)}>Delete</button>
        </div>
      )
    }
  ];

  const fetchLeads = useCallback(async (page = 1, limit = 20, filters = {}) => {
    setLoading(true);
    try {
      const params = { page, limit, ...filters };
      const response = await leadService.getLeads(params);
      setRowData(response.data.data);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages
      });
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads(pagination.page, pagination.limit, filters);
  }, [fetchLeads, pagination.page, pagination.limit, filters]);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadService.deleteLead(id);
        fetchLeads(pagination.page, pagination.limit, filters);
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingLead) {
        await leadService.updateLead(editingLead.id, formData);
      } else {
        await leadService.createLead(formData);
      }
      setShowForm(false);
      setEditingLead(null);
      fetchLeads(pagination.page, pagination.limit, filters);
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  return (
    <div className="leads-container">
      <div className="leads-header">
        <h2>Leads Management</h2>
        <button onClick={() => setShowForm(true)}>Add New Lead</button>
      </div>

      <div className="filters-section">
        <h3>Filters</h3>
        {/* Implement filter inputs here */}
      </div>

      <div className="grid-container">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={pagination.limit}
          modules={[ClientSideRowModelModule]}
        />
      </div>

      <div className="pagination-controls">
        <button 
          disabled={pagination.page === 1} 
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          Previous
        </button>
        <span>Page {pagination.page} of {pagination.totalPages}</span>
        <button 
          disabled={pagination.page === pagination.totalPages} 
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Next
        </button>
      </div>

      {showForm && (
        <LeadForm
          lead={editingLead}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingLead(null);
          }}
        />
      )}
    </div>
  );
};

export default LeadsGrid;