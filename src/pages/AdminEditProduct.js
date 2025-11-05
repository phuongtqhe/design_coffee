import { Button, Col, Container, Row, Form as BootstrapForm } from 'react-bootstrap';
import * as yup from 'yup';
import { Field, FieldArray, Form, Formik, useFormik } from 'formik';
import { toast } from 'react-toastify';
import CustomInput from '../components/CustomInput';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";

const productSchema = yup.object({
  title: yup
    .string()
    .required('This field is required'),
  price: yup.number()
    .typeError('Must be a number')
    .required('This field is required')
    .positive('Must be a positive value'),
  categoryId: yup.string()
    .required('This field is required'),
  description: yup.string().required('This field is required'),
  product: yup.array().of(
    yup.object().shape({
      image: yup.mixed()
        .test('fileType', 'Unsupported file type', (value) => {
          if (!value) return true;
          const supportedTypes = ['image/jpeg', 'image/png', 'image/gif'];
          return supportedTypes.includes(value.type);
        })
    })
  )
});

const initialValues = {
  title: '',
  price: '',
  categoryId: '',
  featured: false,
  status: true,
  description: '',
  product: [
    {
      image: '',
    },
  ],
};

const AdminEditProduct = () => {
    const [brands, setBrands] = useState([]);
    const [product, setProduct] = useState({});
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    
    useEffect(() => {
        fetch(`http://localhost:9999/products/${id}`)
            .then((res) => res.json())
            .then((json) => {
                setProduct(json)
                const { title, price, categoryId, featured, status, description } = json
                formik.setFieldValue('title', title)
                formik.setFieldValue('price', price)
                formik.setFieldValue('categoryId', String(categoryId))
                formik.setFieldValue('featured', featured)
                formik.setFieldValue('status', status === 'active' || status === true)
                formik.setFieldValue('description', description)
            });
    }, [id]);

    const formik = useFormik({
        initialValues,
        validationSchema: productSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
          setIsLoading(true);
          try {
              let newImages = [];
              if (values.product.length > 0 && values.product[0].image) {
                  newImages = await uploadImage(values.product);
              }
              await saveProduct(values, newImages);
          } catch (error) {
              console.error('Error in form submission:', error);
          } finally {
              setIsLoading(false);
          }
        },
    });

    useEffect(() => {
      fetch(`http://localhost:9999/brands`)
          .then((res) => res.json())
          .then((json) => {
            const br = []
            json.map(j => br.push({ value: j.id, label: j.name }))
            setBrands(br)
          });
    }, []);
  
    useEffect(() => {
      fetch(`http://localhost:9999/categories`)
          .then((res) => res.json())
          .then((json) => {
            const cate = []
            json.map(j => cate.push({ value: j.id, label: j.name }))
            setCategories(cate)
          });
    }, []);

    const uploadImage = async (product) => {
      const images = []
      try {
        for (const productItem of product) {
          if (!productItem.image) continue;
    
          const formData = new FormData();
          formData.append('file', productItem.image);
          formData.append('upload_preset', 'gaxpeofu');
          formData.append('api_key', '337676999889211');
    
          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/dck2nnfja/upload`,
            formData
          );
    
          images.push(response.data.url);
        }
        return images;
      } catch (error) {
        console.log(error)
        toast.error("Failed to upload image: " + error.message)
        throw error;
      }
    }

    const removeProduct = (index) => {
      const valuesCopy = { ...formik.values };
      const errorsCopy = { ...formik.errors };
  
      valuesCopy.product.splice(index, 1);
      formik.setValues(valuesCopy);

      if (!JSON.stringify(errorsCopy) === '{}') {
        errorsCopy.product.splice(index, 1);
        formik.setErrors(errorsCopy);
      }
    };

    const saveProduct = async (values, newImages) => {
      const { title, price, categoryId, featured, status, description } = values
      
      const statusValue = status === true ? 'active' : 'inactive';
      
      const productData = {
        title,
        description,
        price: Number(price),
        originPrice: Number(price), // Keep it consistent
        categoryId: Number(categoryId),
        featured,
        status: statusValue,
        images: [...product.images, ...newImages], // Combine old and new images
        updatedAt: new Date().toISOString()
      };
  
      try {
          const response = await fetch(`http://localhost:9999/products/${id}`, {
              method: 'PATCH',
              body: JSON.stringify(productData),
              headers: {
              'Content-type': 'application/json; charset=UTF-8',
              },
          });
  
          if (!response.ok) {
              throw new Error('Failed to update product');
          }
  
          toast.success('Update product successfully');
          navigate('/admin/product');
      } catch (error) {
          console.error('Error updating product:', error);
          toast.error('Something went wrong!');
      }
    }

    const handleDelete = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteP(index);
            }
        });
    };

    const deleteP = (index) => {
        const images = [...product.images]
        images.splice(index, 1)
        fetch(`http://localhost:9999/products/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                images
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then(async (res) => {
            if (res.ok) {
                const json = await res.json();
                setProduct(json);
                toast.success("Delete successfully");
            } else {
                throw new Error("Failed to delete image");
            }
        })
        .catch((error) => {
            toast.error(error.message);
        });
    };

    return (
        <Container>
            {isLoading && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
              }}
            >
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <Row>
              <Col>
              <h3 className='mt-3'>Create new product</h3>
              <Formik
                initialValues={initialValues}
                onSubmit={formik.handleSubmit}
              >
                {({values}) => (
                  <Form>
                    <Row>
                      <Col xs={12} lg={6} className='my-3'>
                        <label>Product title</label>
                        <CustomInput
                            type="text"
                            name="title"
                            placeholder="Product title..."
                            onChange={formik.handleChange('title')}
                            onBlur={formik.handleBlur('title')}
                            value={formik.values?.title}
                            errMes={formik.touched.title && formik.errors.title}
                        />
                      </Col>
                      <Col xs={12} lg={3} className='my-3'>
                        <label>Price</label>
                        <CustomInput
                            type="text"
                            name="price"
                            placeholder="Price..."
                            onChange={formik.handleChange('price')}
                            onBlur={formik.handleBlur('price')}
                            value={formik.values?.price}
                            errMes={
                              formik.touched.price &&
                              formik.errors.price
                            }
                        />
                      </Col>
                      <Col xs={12} lg={6}>
                        <label>Category</label>
                        <BootstrapForm.Select
                          size='lg'
                          placeholder="Select a category"
                          name="categoryId"
                          onChange={formik.handleChange('categoryId')}
                          onBlur={formik.handleBlur('categoryId')}
                          value={formik.values?.categoryId || ''}
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </BootstrapForm.Select>
                        {formik.touched.categoryId && <span className='text-danger'>{formik.errors.categoryId}</span>}
                      </Col>

                      <Col xs={12} className='mt-3'>
                        {
                            product.images?.map((image, index) => (
                                <Row key={index} className='mb-3'>
                                    <Col xs={10} lg={4}>
                                        <label>Image {index + 1}</label>
                                        <div className='mt-2'>
                                            <img
                                                src={image}
                                                alt={`Product image ${index + 1}`}
                                                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={2} style={{alignSelf: "center"}}>
                                        <Button
                                        type="button"
                                        className="secondary btn-danger"
                                        onClick={() => handleDelete(index)}
                                        >
                                        X
                                        </Button>
                                    </Col>
                                </Row>
                        ))}
                        <FieldArray name="product">
                          {({ insert, remove, push }) => (
                            <>
                              { values.product.length > 0 &&
                                values.product.map((p, index) => (
                                  <Row key={index} className='mb-3'>
                                    <Col xs={10} lg={4}>
                                      <label>New Image</label>
                                      <div> 
                                        <Field
                                          type="file"
                                          name={`product.${index}.image`}
                                          accept="image/jpeg, image/png, image/gif"
                                          onChange={(event) => {
                                            formik.setFieldValue(`product.${index}.image`, event.currentTarget.files[0]);
                                          }}
                                        />
                                        {formik.touched.product?.[index]?.image && (
                                          <span className="text-danger d-block">{formik.errors.product?.[index]?.image}</span>
                                        )}
                                      </div>

                                      {formik.values.product[index]?.image && (
                                        <div className='mt-2'>
                                          <img
                                            src={URL.createObjectURL(formik.values.product[index]?.image)}
                                            alt={`Preview ${index + 1}`}
                                            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                                          />
                                        </div>
                                      )}
                                    </Col>
                                    <Col xs={2} style={{alignSelf: "center"}}>
                                      <Button
                                        type="button"
                                        className="secondary mx-3"
                                        onClick={() => push({ image: '' })}
                                      >
                                        +
                                      </Button>
                                      <Button
                                        type="button"
                                        className={index === 0 && values.product.length === 1 ? "secondary disabled" : "secondary"}
                                        onClick={() => remove(index)}
                                      >
                                        X
                                      </Button>
                                    </Col>
                                  </Row>
                                ))
                              }
                            </>
                        )}
                        </FieldArray>
                      </Col>
                      <Col xs={6} lg={3} className='my-3'>
                        <label className='d-block'>Status</label>
                        <BootstrapForm.Check 
                          type="checkbox"
                          name='status'
                          label="Is active?"
                          onChange={(event) => formik.setFieldValue('status', event.target.checked)}
                          checked={formik.values.status}
                        />
                      </Col>
                      <Col xs={6} lg={3} className='my-3'>
                        <label className='d-block'>Featured</label>
                        <BootstrapForm.Check 
                          type="checkbox"
                          name='featured'
                          label="Is featured?"
                          onChange={(event) => formik.setFieldValue('featured', event.target.checked)}
                          checked={formik.values.featured}
                        />
                      </Col>
                      <Col xs={12} className='mb-3'>
                        <label>Description</label>
                        <BootstrapForm.Control
                          as="textarea"
                          rows={6}
                          placeholder="Enter product description..."
                          name="description"
                          value={formik.values?.description || ''}
                          onChange={formik.handleChange('description')}
                          onBlur={formik.handleBlur('description')}
                          isInvalid={formik.touched.description && !!formik.errors.description}
                        />
                        {formik.touched.description && formik.errors.description && (
                          <BootstrapForm.Control.Feedback type="invalid" className="d-block">
                            {formik.errors.description}
                          </BootstrapForm.Control.Feedback>
                        )}
                      </Col>
                      <Col xs={12} className='mb-3' style={{textAlign: "right"}}>
                        <Button className="btn-primary mx-2" type='submit'>Submit</Button>
                        <Button className="btn-danger"><Link className="text-white" to={'/admin/product'}>Back to list</Link></Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
              </Col>
          </Row>
        </Container>
    );
};

export default AdminEditProduct;
