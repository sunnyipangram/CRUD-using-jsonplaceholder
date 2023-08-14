import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const PostForm = ({ onAddPost }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      title,
      body,
    };

    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', newPost);
      onAddPost(response.data);
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Add New Post</h2>
      <Form.Group controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="body">
        <Form.Label>Body</Form.Label>
        <Form.Control as="textarea" rows={3} value={body} onChange={(e) => setBody(e.target.value)} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Add Post
      </Button>
    </Form>
  );
};

export default PostForm;
