'use client';
import * as React from 'react';
import { StackLayout } from '@progress/kendo-react-layout';
import { AppBar, AppBarSection } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Avatar } from '@progress/kendo-react-layout';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle
} from '@progress/kendo-react-layout';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Typography } from '@progress/kendo-react-common';

const FruitsLandingPage = () => {
  const fruits = [
    {
      id: 1,
      name: 'Apple',
      price: '$1.00',
      image: 'https://example.com/apple.jpg'
    },
    {
      id: 2,
      name: 'Banana',
      price: '$0.50',
      image: 'https://example.com/banana.jpg'
    }
  ];
  const testimonials = [
    {
      name: 'John Doe',
      text: 'The fruits here are always fresh and delicious!',
      avatar: 'https://example.com/johndoe.jpg'
    },
    {
      name: 'Jane Smith',
      text: 'I love the variety and quality of fruits!',
      avatar: 'https://example.com/janesmith.jpg'
    }
  ];
  return (
    <StackLayout>
      {/* Header Section */}
      <AppBar themeColor="primary">
        <AppBarSection>
          <img
            src="https://example.com/logo.png"
            alt="Brand Logo"
            style={{ width: 50, height: 'auto' }}
          />
        </AppBarSection>
        <AppBarSection>
          <div>
            <a href="#" style={{ margin: '0 10px' }}>
              Home
            </a>
            <a href="#" style={{ margin: '0 10px' }}>
              Shop
            </a>
            <a href="#" style={{ margin: '0 10px' }}>
              About Us
            </a>
            <a href="#" style={{ margin: '0 10px' }}>
              Contact
            </a>
          </div>
        </AppBarSection>
      </AppBar>

      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          background:
            'url(https://example.com/fruit-background.jpg) no-repeat center center',
          padding: '50px 0'
        }}
      >
        <Typography.h1>Fresh Fruits Delivered Daily!</Typography.h1>
        <Typography.p>
          Enjoy the freshest and healthiest fruits at your doorstep.
        </Typography.p>
        <Button onClick={() => alert('Shop Now Clicked!')} themeColor="success">
          Shop Now
        </Button>
      </section>

      {/* Fruits Showcase */}
      <section>
        <Grid data={fruits}>
          <GridColumn field="name" title="Fruit Name" />
          <GridColumn field="price" title="Price" />
          <GridColumn
            title="Add to Cart"
            cells={{
              data: ({ dataItem }) => (
                <Button
                  onClick={() => alert(`Added ${dataItem.name} to cart!`)}
                >
                  Add to Cart
                </Button>
              )
            }}
          />
        </Grid>
      </section>

      {/* About Us Section */}
      <section>
        <Typography.p>
          We are dedicated to delivering the freshest fruits sourced from local
          farms.
        </Typography.p>
        <img
          src="https://example.com/team.jpg"
          alt="Our Team"
          style={{ width: '100%', height: 'auto' }}
        />
      </section>

      {/* Testimonials Section */}
      <section>
        {testimonials.map((testimonial, index) => (
          <Card key={index} style={{ margin: '10px 0' }}>
            <CardHeader>
              <Avatar type="image" size="large" src={testimonial.avatar} />
              <CardTitle>{testimonial.name}</CardTitle>
            </CardHeader>
            <CardBody>{testimonial.text}</CardBody>
          </Card>
        ))}
      </section>

      {/* Subscription Section */}
      <section
        style={{ textAlign: 'center', padding: '20px', background: '#f5f5f5' }}
      >
        <Typography.p>Join our fruit lovers community!</Typography.p>
        <Button onClick={() => alert('Subscribed!')}>Subscribe</Button>
      </section>

      {/* Footer Section */}
      <footer style={{ padding: '20px', textAlign: 'center' }}>
        <div>
          <a href="#" style={{ margin: '0 10px' }}>
            Privacy Policy
          </a>
          <a href="#" style={{ margin: '0 10px' }}>
            Terms of Service
          </a>
        </div>
        <div>
          <a href="#" style={{ margin: '0 10px' }}>
            Facebook
          </a>
          <a href="#" style={{ margin: '0 10px' }}>
            Instagram
          </a>
        </div>
      </footer>
    </StackLayout>
  );
};

export default FruitsLandingPage;
