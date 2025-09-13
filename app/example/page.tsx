'use client';
import * as React from 'react';
import { AppBar, AppBarSection } from '@progress/kendo-react-layout';
import { StackLayout } from '@progress/kendo-react-layout';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
export default function Dashboard() {
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearchChange = (event) => {
    setSearchValue(event.value);
  };

  return (
    <StackLayout className="max-w-7xl mx-auto p-4">
      <AppBar>
        <AppBarSection>
          <h1 className="text-xl font-bold">Real Estate Dashboard</h1>
        </AppBarSection>
        <AppBarSection>
          <nav className="flex space-x-4">
            <a href="#home" className="text-white hover:text-gray-400">
              Home
            </a>
            <a href="#saved" className="text-white hover:text-gray-400">
              Saved Searches
            </a>
            <a href="#analytics" className="text-white hover:text-gray-400">
              Analytics
            </a>
          </nav>
        </AppBarSection>
        <AppBarSection>
          <Form
            render={() => (
              <FormElement className="flex flex-grow mx-4">
                <Field
                  name="search"
                  component={Input}
                  placeholder="Search by property type"
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="flex-grow p-2 rounded-md border border-gray-300"
                />
                <Button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Search
                </Button>
              </FormElement>
            )}
          ></Form>
        </AppBarSection>
        <AppBarSection>
          <Button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            Toggle Map/Grid
          </Button>
        </AppBarSection>
      </AppBar>
    </StackLayout>
  );
}
