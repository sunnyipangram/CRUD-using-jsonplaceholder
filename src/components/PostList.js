import React, { useState } from 'react';
import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';

const PostList = ({ posts, onUpdate, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const postsPerPage = 5; // Number of posts to display per page

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleDelete = (postId) => {
    onDelete(postId);
  };

  const handleClose = () => {
    setSelectedPost(null);
    setShowModal(false);
  };

  return (
    <>
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
              <td>
                <Button variant="primary" onClick={() => handleEdit(post)}>
                  Edit
                </Button>
                {' '}
                <Button variant="danger" onClick={() => handleDelete(post.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="pagination-container">
        <Pagination>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>

      {/* Modal for updating posts */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        {selectedPost && (
          <Modal.Body>
            <Form>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedPost.title}
                  // Add an onChange handler if needed
                />
              </Form.Group>
              <Form.Group controlId="formBody">
                <Form.Label>Body</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  defaultValue={selectedPost.body}
                  // Add an onChange handler if needed
                />
              </Form.Group>
            </Form>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onUpdate(selectedPost)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PostList;
