import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Button, Table, Modal, Form as BootstrapForm, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

// Validation Schemas
const toppingSchema = yup.object({
    name: yup.string().required("Name is required"),
    price: yup.number().positive("Price must be positive").required("Price is required"),
});

const categorySchema = yup.object({
    name: yup.string().required("Name is required"),
});

const AdminCategory = () => {
    const [key, setKey] = useState('categories');

    // Data State
    const [categories, setCategories] = useState([]);
    const [toppings, setToppings] = useState([]);
    const [categoriesTopping, setCategoriesTopping] = useState({});
    const [loading, setLoading] = useState(false);

    // Modal State
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showToppingModal, setShowToppingModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingTopping, setEditingTopping] = useState(null);

    // Data Fetching
    const fetchData = async () => {
        setLoading(true);
        try {
            const [catRes, topRes, catTopRes] = await Promise.all([
                axios.get('http://localhost:9999/categories'),
                axios.get('http://localhost:9999/toppings'),
                axios.get('http://localhost:9999/categories_topping'),
            ]);
            setCategories(catRes.data.sort((a, b) => a.id - b.id));
            setToppings(topRes.data.sort((a, b) => a.id - b.id));
            setCategoriesTopping(catTopRes.data);
        } catch (error) {
            toast.error("Failed to fetch data.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Topping Logic ---
    const toppingFormik = useFormik({
        initialValues: { name: '', price: '', status: 'active' },
        validationSchema: toppingSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const payload = { ...values, price: Number(values.price) };
            try {
                if (editingTopping) {
                    await axios.patch(`http://localhost:9999/toppings/${editingTopping.id}`, payload);
                    toast.success("Topping updated successfully!");
                } else {
                    const newId = toppings.length > 0 ? Math.max(...toppings.map(t => Number(t.id))) + 1 : 1;
                    await axios.post('http://localhost:9999/toppings', { ...payload, id: newId });
                    toast.success("Topping created successfully!");
                }
                handleCloseToppingModal();
                fetchData();
            } catch (error) {
                toast.error("An error occurred while saving the topping.");
            }
        },
    });

    const handleShowToppingModal = (topping = null) => {
        setEditingTopping(topping);
        if (topping) {
            toppingFormik.setValues({
                name: topping.name,
                price: topping.price,
                status: topping.status || 'active',
            });
        } else {
            toppingFormik.resetForm({ values: { name: '', price: '', status: 'active' } });
        }
        setShowToppingModal(true);
    };

    const handleCloseToppingModal = () => setShowToppingModal(false);

    const handleDeleteTopping = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Deleting this topping will also remove it from all categories. This cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:9999/toppings/${id}`);
                    const newCategoriesTopping = { ...categoriesTopping };
                    Object.keys(newCategoriesTopping).forEach(catId => {
                        newCategoriesTopping[catId] = newCategoriesTopping[catId].filter(topId => String(topId) !== String(id));
                    });
                    await axios.put('http://localhost:9999/categories_topping', newCategoriesTopping);
                    toast.success("Topping deleted successfully.");
                    fetchData();
                } catch (error) {
                    toast.error("Failed to delete topping.");
                }
            }
        });
    };

    // --- Category Logic ---
    const categoryFormik = useFormik({
        initialValues: { name: '', status: 'active', hasIceLevel: false, hasSugarLevel: false, toppingIds: [] },
        validationSchema: categorySchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const { toppingIds, ...categoryData } = values;
            const payload = { ...categoryData, status: categoryData.status || 'active' };
            try {
                let categoryId;
                if (editingCategory) {
                    categoryId = editingCategory.id;
                    await axios.patch(`http://localhost:9999/categories/${categoryId}`, payload);
                    toast.success("Category updated successfully!");
                } else {
                    const newId = categories.length > 0 ? Math.max(...categories.map(c => Number(c.id))) + 1 : 1;
                    const response = await axios.post('http://localhost:9999/categories', { ...payload, id: newId });
                    categoryId = response.data.id;
                    toast.success("Category created successfully!");
                }

                const newCategoriesTopping = { ...categoriesTopping, [String(categoryId)]: toppingIds };
                await axios.put('http://localhost:9999/categories_topping', newCategoriesTopping);

                handleCloseCategoryModal();
                fetchData();
            } catch (error) {
                toast.error("An error occurred while saving the category.");
            }
        },
    });

    const handleShowCategoryModal = (category = null) => {
        setEditingCategory(category);
        if (category) {
            categoryFormik.setValues({
                name: category.name,
                status: category.status || 'active',
                hasIceLevel: category.hasIceLevel || false,
                hasSugarLevel: category.hasSugarLevel || false,
                toppingIds: categoriesTopping[category.id] || [],
            });
        } else {
            categoryFormik.resetForm({ values: { name: '', status: 'active', hasIceLevel: false, hasSugarLevel: false, toppingIds: [] } });
        }
        setShowCategoryModal(true);
    };

    const handleCloseCategoryModal = () => setShowCategoryModal(false);

    const handleDeleteCategory = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:9999/categories/${id}`);
                    const newCategoriesTopping = { ...categoriesTopping };
                    delete newCategoriesTopping[id];
                    await axios.put('http://localhost:9999/categories_topping', newCategoriesTopping);
                    toast.success("Category deleted successfully.");
                    fetchData();
                } catch (error) {
                    toast.error("Failed to delete category.");
                }
            }
        });
    };

    return (
        <Container>
            <h3 className="mt-3">Category and Topping Management</h3>
            <Tabs id="management-tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
                <Tab eventKey="categories" title="Manage Categories">
                    <Button variant="primary" className="mb-3" onClick={() => handleShowCategoryModal()}>
                        Add New Category
                    </Button>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Ice/Sugar</th>
                                <th>Toppings</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => (
                                <tr key={cat.id}>
                                    <td>{cat.id}</td>
                                    <td>{cat.name}</td>
                                    <td>
                                        <Badge bg={cat.status === 'active' ? 'success' : 'warning'}>
                                            {cat.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        {cat.hasIceLevel && <Badge bg="info" className="me-1">Ice</Badge>}
                                        {cat.hasSugarLevel && <Badge bg="secondary">Sugar</Badge>}
                                    </td>
                                    <td>
                                        {(categoriesTopping[cat.id] || []).map(toppingId => {
                                            const topping = toppings.find(t => String(t.id) === String(toppingId));
                                            return <Badge key={toppingId} bg="light" text="dark" className="me-1">{topping ? topping.name : 'N/A'}</Badge>;
                                        })}
                                    </td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" onClick={() => handleShowCategoryModal(cat)}>Edit</Button>{' '}
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCategory(cat.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="toppings" title="Manage Toppings">
                    <Button variant="primary" className="mb-3" onClick={() => handleShowToppingModal()}>
                        Add New Topping
                    </Button>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {toppings.map(top => (
                                <tr key={top.id}>
                                    <td>{top.id}</td>
                                    <td>{top.name}</td>
                                    <td>{Number(top.price).toLocaleString('vi-VN')} ₫</td>
                                    <td>
                                        <Badge bg={top.status === 'active' ? 'success' : 'warning'}>
                                            {top.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" onClick={() => handleShowToppingModal(top)}>Edit</Button>{' '}
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTopping(top.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>

            {/* Category Modal */}
            <Modal show={showCategoryModal} onHide={handleCloseCategoryModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingCategory ? 'Edit' : 'Add'} Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <BootstrapForm onSubmit={categoryFormik.handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>Category Name</BootstrapForm.Label>
                                    <BootstrapForm.Control
                                        type="text"
                                        name="name"
                                        {...categoryFormik.getFieldProps('name')}
                                        isInvalid={categoryFormik.touched.name && !!categoryFormik.errors.name}
                                    />
                                    <BootstrapForm.Control.Feedback type="invalid">{categoryFormik.errors.name}</BootstrapForm.Control.Feedback>
                                </BootstrapForm.Group>
                            </Col>
                            <Col md={6}>
                                <BootstrapForm.Group className="mb-3">
                                    <BootstrapForm.Label>Status</BootstrapForm.Label>
                                    <BootstrapForm.Select name="status" {...categoryFormik.getFieldProps('status')}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </BootstrapForm.Select>
                                </BootstrapForm.Group>
                            </Col>
                        </Row>
                        <BootstrapForm.Group className="mb-3">
                            <BootstrapForm.Label>Options</BootstrapForm.Label>
                            <BootstrapForm.Check type="checkbox" label="Has Ice Level" name="hasIceLevel" {...categoryFormik.getFieldProps('hasIceLevel')} checked={categoryFormik.values.hasIceLevel} />
                            <BootstrapForm.Check type="checkbox" label="Has Sugar Level" name="hasSugarLevel" {...categoryFormik.getFieldProps('hasSugarLevel')} checked={categoryFormik.values.hasSugarLevel} />
                        </BootstrapForm.Group>
                        <BootstrapForm.Group className="mb-3">
                            <BootstrapForm.Label>Available Toppings</BootstrapForm.Label>
                            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #dee2e6', padding: '10px', borderRadius: '5px' }}>
                                {toppings.map(topping => (
                                    <BootstrapForm.Check
                                        key={topping.id}
                                        type="checkbox"
                                        label={`${topping.name} (${Number(topping.price).toLocaleString('vi-VN')} ₫)`}
                                        name="toppingIds"
                                        value={topping.id}
                                        onChange={categoryFormik.handleChange}
                                        onBlur={categoryFormik.handleBlur}
                                        checked={categoryFormik.values.toppingIds.includes(String(topping.id))}
                                    />
                                ))}
                            </div>
                        </BootstrapForm.Group>
                        <Button type="submit" variant="primary">Save Changes</Button>
                    </BootstrapForm>
                </Modal.Body>
            </Modal>

            {/* Topping Modal */}
            <Modal show={showToppingModal} onHide={handleCloseToppingModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingTopping ? 'Edit' : 'Add'} Topping</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <BootstrapForm onSubmit={toppingFormik.handleSubmit}>
                        <BootstrapForm.Group className="mb-3">
                            <BootstrapForm.Label>Topping Name</BootstrapForm.Label>
                            <BootstrapForm.Control
                                type="text"
                                name="name"
                                {...toppingFormik.getFieldProps('name')}
                                isInvalid={toppingFormik.touched.name && !!toppingFormik.errors.name}
                            />
                            <BootstrapForm.Control.Feedback type="invalid">{toppingFormik.errors.name}</BootstrapForm.Control.Feedback>
                        </BootstrapForm.Group>
                        <BootstrapForm.Group className="mb-3">
                            <BootstrapForm.Label>Price</BootstrapForm.Label>
                            <BootstrapForm.Control
                                type="number"
                                name="price"
                                {...toppingFormik.getFieldProps('price')}
                                isInvalid={toppingFormik.touched.price && !!toppingFormik.errors.price}
                            />
                            <BootstrapForm.Control.Feedback type="invalid">{toppingFormik.errors.price}</BootstrapForm.Control.Feedback>
                        </BootstrapForm.Group>
                        <BootstrapForm.Group className="mb-3">
                            <BootstrapForm.Label>Status</BootstrapForm.Label>
                            <BootstrapForm.Select name="status" {...toppingFormik.getFieldProps('status')}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </BootstrapForm.Select>
                        </BootstrapForm.Group>
                        <Button type="submit" variant="primary">Save Changes</Button>
                    </BootstrapForm>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminCategory;
