import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';
import {BiSolidPencil, BiSolidPlusCircle, BiSolidWasher} from 'react-icons/bi'
import {AiFillDelete} from 'react-icons/ai' 
 

import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [editPost, setEditPost] = useState({ id: null, title: '', body: '' });

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setPosts(response.data);
    };

    fetchPosts();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowEditModal = (post) => {
    setEditPost(post);
    setEditModal(true);
  };
  const handleCloseEditModal = () => setEditModal(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleAddPost = async () => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', newPost);
      setPosts([...posts, response.data]);
      setNewPost({ title: '', body: '' });
      handleCloseModal();
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleEditPost = async () => {
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/posts/${editPost.id}`, editPost);
      const updatedPosts = posts.map((post) => (post.id === editPost.id ? editPost : post));
      setPosts(updatedPosts);
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="App">
      <h1>JSONPlaceholder CRUD App</h1>
      <div className="crud-table">
        <Button variant="primary" onClick={handleShowModal} className="button" style={{background:"#eee",color:'#1e868d',border:'0',marginBottom:'20px'}}>
          Write New Post...........<BiSolidPlusCircle/>
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Body</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>{post.body}</td>
                <td style={{display:''}}>
                  <Button
                    variant="info"
                    className="button"
                    style={{backgroundColor:'transparent',border:'0',color:'rgb(26, 98, 97)'}}
                    onClick={() => handleShowEditModal(post)}
                  >
                    <BiSolidPencil />
                  </Button>
                  <Button
                    variant="danger"
                    style={{backgroundColor:'transparent',border:'0',color:'red'}}
                    className="button"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <AiFillDelete />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination>
          {Array.from({ length: Math.ceil(posts.length / postsPerPage) }).map((_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Body</Form.Label>
                <Form.Control
                  as="textarea"
                  name="body"
                  value={newPost.body}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="" onClick={handleAddPost} style={{backgroundColor:'#1a6261;'}}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={editModal} onHide={handleCloseEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={editPost.title}
                  onChange={(event) =>
                    setEditPost({ ...editPost, title: event.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Body</Form.Label>
                <Form.Control
                  as="textarea"
                  name="body"
                  value={editPost.body}
                  onChange={(event) =>
                    setEditPost({ ...editPost, body: event.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditPost} style={{backgroundColor:'#1a6261;'}}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default App;
