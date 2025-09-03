'use client';
import React from 'react';
import { Upload } from '@progress/kendo-react-upload';

import { Notification } from '@progress/kendo-react-notification';
import { TimePicker } from '@progress/kendo-react-dateinputs';
import {
  AppBar,
  Breadcrumb,
  Drawer,
  Menu,
  MenuItem,
  TabStrip
} from '@progress/kendo-react-layout';
import {
  Checkbox,
  Input,
  RadioButton,
  Slider,
  Switch,
  TextArea
} from '@progress/kendo-react-inputs';
import { Loader } from '@progress/kendo-react-indicators';

import { useState } from 'react';
import '@progress/kendo-theme-default/dist/all.css';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Dialog } from '@progress/kendo-react-dialogs';

const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabSelect = (e) => {
    setActiveTab(e.selectedIndex);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleSearch = (e) => {
    // Implement search functionality here
    console.log('Search:', e.target.value);
  };

  const handleUserMenuClick = (e) => {
    // Implement user menu functionality here
    console.log('User menu clicked:', e.target.value);
  };

  const handleSidebarItemClick = (e) => {
    // Implement sidebar navigation functionality here
    console.log('Sidebar item clicked:', e.target.value);
  };

  const handleStatusBarClick = (e) => {
    // Implement status bar functionality here
    console.log('Status bar clicked:', e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Implement form submission functionality here
    console.log('Form submitted');
  };

  return (
    <div className="app-container">
      <AppBar>
        <div className="app-header">
          <input
            type="text"
            placeholder="Search..."
            onChange={handleSearch}
            className="search-bar"
          />
          <div className="user-menu">
            <button onClick={handleUserMenuClick}>User Menu</button>
          </div>
        </div>
      </AppBar>
      <div className="main-content">
        <Drawer>
          <Menu>
            <MenuItem key="users">Users</MenuItem>
            <MenuItem key="settings">Settings</MenuItem>
            <MenuItem key="reports">Reports</MenuItem>
          </Menu>
        </Drawer>
        <div className="content-area">
          <Breadcrumb data={[{ text: 'Home' }, { text: 'Admin Panel' }]} />
          <div className="tabs">
            <TabStrip selected={activeTab} onSelect={handleTabSelect}>
              <TabStrip>
                <div className="tab-content">Overview Content</div>
              </TabStrip>
              <TabStrip>
                <div className="tab-content">Data Content</div>
              </TabStrip>
              <TabStrip>
                <div className="tab-content">Reports Content</div>
              </TabStrip>
            </TabStrip>
          </div>
          <div className="data-table">
            <Grid data={mockData} style={{ height: '400px' }}>
              <GridColumn field="id" title="ID" width="100px" />
              <GridColumn field="name" title="Name" width="200px" />
              <GridColumn field="email" title="Email" width="300px" />
              <GridColumn field="status" title="Status" width="150px" />
            </Grid>
          </div>
          <div className="status-bar">
            <div
              className="status-item"
              onClick={handleStatusBarClick}
              value="health"
            >
              System Health
            </div>
            <div
              className="status-item"
              onClick={handleStatusBarClick}
              value="notifications"
            >
              Notifications
            </div>
          </div>
        </div>
      </div>

      <Button type="button" onClick={handleDialogOpen} id="open-dialog">
        Open Dialog
      </Button>
      {isDialogOpen && (
        <Dialog title="Add/Edit Item" onClose={handleDialogClose} width={400}>
          <form onSubmit={handleFormSubmit} className="form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <Input id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <TextArea id="description" name="description" required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <Checkbox name="status" label="Active" />
            </div>
            <div className="form-group">
              <label>Type</label>
              <RadioButton name="type" label="Type A" />
              <RadioButton name="type" label="Type B" />
            </div>
            <div className="form-group">
              <label>Enabled</label>
              <Switch name="enabled" />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <Slider name="priority" min={1} max={5} step={1} />
            </div>

            <div className="form-group">
              <label>Start Time</label>
              <TimePicker name="startTime" />
            </div>
            <div className="form-group">
              <label>Upload File</label>
              <Upload accept="file" />
            </div>
            <div className="form-group">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Dialog>
      )}
      {isLoading && <Loader />}
      <Notification />
    </div>
  );
};

const mockData = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', status: 'Active' },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'Inactive'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    status: 'Active'
  }
];

export default App;
