'use client';

import { AppBar } from '@progress/kendo-react-layout';
import { Avatar } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Card } from '@progress/kendo-react-layout';
import { ListView } from '@progress/kendo-react-listview';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { GridLayout } from '@progress/kendo-react-layout';
import { Dialog } from '@progress/kendo-react-dialogs';
import { Typography } from '@progress/kendo-react-common';
import { Form } from '@progress/kendo-react-form';

const PortfolioLandingPage = () => {
  const skills = [
    { name: 'HTML', proficiency: 85 },
    { name: 'CSS', proficiency: 75 },
    { name: 'JavaScript', proficiency: 90 }
  ];
  const portfolioImages = [
    'portfolio-image1.jpg',
    'portfolio-image2.jpg',
    'portfolio-image3.jpg'
  ];
  const testimonials = [
    { name: 'John Doe', feedback: 'Excellent service and quality work!' },
    { name: 'Jane Smith', feedback: 'Highly recommend for their creativity!' }
  ];
  const handleImageClick = (image) => {
    alert(`Viewing image: ${image}`);
  };
  return (
    <StackLayout style={{ padding: '20px' }}>
      <AppBar title="My Portfolio" />
      <Card title="Welcome to My Portfolio">
        <Avatar
          style={{ width: '100px', height: '100px', marginBottom: '20px' }}
          src="logo.jpg"
        />
      </Card>
      <Card title="My Skills">
        <Typography style={{ marginBottom: '10px' }}>My Skills</Typography>
        <ListView
          data={skills.map((skill) => ({
            title: `${skill.name} - ${skill.proficiency}%`,
            progress: skill.proficiency
          }))}
          renderItem={({ dataItem }) => (
            <div>
              <Typography>{dataItem.title}</Typography>
              <ProgressBar value={dataItem.progress} />
            </div>
          )}
        />
      </Card>
      <Card title="My Work">
        <Typography style={{ marginBottom: '10px' }}>
          Portfolio Gallery
        </Typography>
        <GridLayout>
          {portfolioImages.map((image, index) => (
            <Avatar
              key={index}
              src={image}
              onClick={() => handleImageClick(image)}
              style={{
                cursor: 'pointer',
                width: '150px',
                height: '150px',
                margin: '10px'
              }}
            />
          ))}
        </GridLayout>
      </Card>
      <Card title="What Clients Say">
        <Typography style={{ marginBottom: '10px' }}>Testimonials</Typography>
        <ListView
          data={testimonials.map((item) => ({
            name: item.name,
            feedback: item.feedback
          }))}
          renderItem={({ dataItem }) => (
            <div>
              <Typography>{dataItem.name}</Typography>
              <Typography>{dataItem.feedback}</Typography>
            </div>
          )}
        />
      </Card>
      <Card title="Get in Touch">
        <Form>
          <FormField
            label="Your Name"
            name="name"
            component={Input}
            required
            placeholder="Enter your Name"
          />
          <FormField
            label="Your Email"
            name="email"
            component={Input}
            required
            placeholder="Enter your Email"
          />
          <FormField
            label="Your Message"
            name="message"
            component={TextArea}
            required
            placeholder="Enter your Message"
          />
          <Button type="submit">Submit</Button>
        </Form>
      </Card>
      <AppBar title="© 2023 My Portfolio" />
    </StackLayout>
  );
};
export default PortfolioLandingPage;
