import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {Button} from "@mui/material"
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import {Link} from "react-router-dom"
import {getProducts, productSelector, getCategories, adminSelector, updateProducts } from '../../../store/storeAction'
import {useDispatch, useSelector} from 'react-redux'
import Loading from '../support/Loading'

let initialState = {
    product_id: '',
    title: '',
    rating: 0,
    price: 0,
    description: '',
    content: '',
    category: '',
    _id: ''
}

export default function AdminProductsList() {
    const [product, setProduct] = useState(initialState)
    const [onEdit, setOnEdit] = useState(false)
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [callback, setCallback] = useState(false)

    const [category] = useState('')
    const [search] = useState('')
    const [sort] = useState('')
    const [page, setPage] =useState(1)
    
    useEffect(() => {
        setPage(5)
    }, [page, setPage])
    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()
    const productAction = useSelector(productSelector)
    const {products} = productAction
    const adminInfo = useSelector(adminSelector)
    const {categories} = adminInfo
    console.log(products)

    useEffect(() => {
        dispatch(getProducts({page, category, sort, search}))
    }, [dispatch, page, categories])

    const login = JSON.parse(localStorage.getItem('login'))
    useEffect(() => {
        if(login.user.role === 1) {
            setIsAdmin(true)
        }
    },[login])

    useEffect(() => {
            dispatch(getCategories())
        }, [dispatch])

 
    useEffect(() => {
        if(params.id) {
            setOnEdit(true)
            products && products.forEach((product) => {
                if(product._id === params.id) {
                    setProduct(product)
                    setImages(product.images)
                }
            })
        } else {
            setOnEdit(false)
            setProduct(initialState)
            setImages(false)
        }
    }, [params, product.images, products])
    
    const handleUpload = async(e) => {
         e.preventDefault()
         try {
            if(!isAdmin) {
                Swal.fire("You are not admin!", "error")
            }
            const file = e.target.files[0]
            if(!file) return Swal.fire("File not exist")
            if(file.size > 1024 * 1024) return Swal.fire("File format is incorrect.")

            let formData = new FormData()
            formData.append("file", file)
            setLoading(true)
            const response = await axios.post(`http://localhost:5000/api/upload`, formData, {
                headers: {"content-type":"multipart/form-data", Authorization: login.accesstoken}
            })
            setLoading(false)
            setImages(response.data)

         } catch(error) {
            Swal.fire("Error", error.response.data.msg , "error")
         }
    }

    const handleChangeInput = (e) => {
           const {name, value} = e.target
           setProduct({...product, [name]: value})
    }

    const handleDestroy = async() => {
        try {
            setLoading(true)
            if(!isAdmin) return Swal.fire("You're not an admin")
            setLoading(true)
            await axios.post("http://localhost:5000/api/destroy", {public_id: images.public_id}, {
                headers: {Authorization: login.accesstoken}
            })
            setImages(false)
            setLoading(false)
        } catch(err) {
            Swal.fire("Error", err.response.data.msg, "error")
        }
    }

    const handleSubmit = async(e) => {
           e.preventDefault()
           try {
               if(!isAdmin) return Swal.fire("You're not an admin")
               if(!images) return Swal.fire("No images upload")

               if(onEdit) {
                  const response =  await axios.put(`http://localhost:5000/api/products/${product._id}`, {...product, images}, {
                        headers: {Authorization: login.accesstoken}
                   })
                   dispatch(updateProducts(response.data.listProduct))
                Swal.fire("Success", "Update product success", "success")
               } else {
                   const response = await axios.post(`http://localhost:5000/api/products`, {...product, images}, {
                       headers: {Authorization: login.accesstoken}
                   })
                   dispatch(updateProducts(response.data.listProduct))
                Swal.fire("Success", "Create product success", "success")
               }
               setCallback(!callback)
               setProduct(initialState)
               navigate("/admin")
           } catch(error) {
               Swal.fire("Error", error.response.data.msg, "error")
           }
    }

    const deleteProductHandle = async(id, public_id) => {
        try {
            setLoading(true)
            const destroyImg = await axios.post(`http://localhost:5000/api/destroy`, {public_id}, {
                headers: {Authorization: login.accesstoken}
            })
           const deleteProduct = await axios.delete(`http://localhost:5000/api/products/${id}`, {
               headers: {Authorization: login.accesstoken}
           })
            console.log(deleteProduct)
            dispatch(updateProducts(deleteProduct.data.listProduct))
            setLoading(false)
            Swal.fire("Success", "Delete Product success", "success")
            // navigate("/admin")
        } catch(error) {
            Swal.fire("Error", error.response.data.msg, "error")
        }
    }

    if(loading) return (<div className="admin__loading"><Loading/></div>)

    const styleImage = {
        display: images ? "block" : "none"
    }

    return (
        <>
           <Grid item xs={12} md={12} lg={12}>
                <h2 className="page__header">Create Products</h2>
               <Paper sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: "space-between",
                        flexDirection: 'row',
                        height: "600px",
                        maxWidth: onEdit ? "1200px" : "auto",
                      }}>    
           
            <Grid item xs={12} md={5} lg={5}>

                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: "300px"
                      }}>
                          <div className="upload__file--container">
                          <input type="file" name="file" className="form-control-file" id="file__upload" onChange={handleUpload}/>
                          {
                              loading 
                              ? (<div id="file__images--container"><Loading/></div>)
                              : (
                            <div className="file__image--container" style={styleImage}>
                                <img src={images ? images.url : ""} alt="" id="file__image"/>
                                <i className="far fa-times-circle" onClick={handleDestroy}></i>
                            </div>
                              )
                          }
                          </div>
                    </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
                <Paper
                    sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    }}>
                    <div className="updata__content">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="productID">ProductID</label>
                                <input type="text" name="product_id" className="form-control create__product--input" id="product_id" placeholder="ProductID..."
                                disabled={onEdit}
                                value={product.product_id} 
                                onChange={handleChangeInput}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input type="text" name="title" className="form-control create__product--input" id="title" placeholder="Title..."
                                value={product.title}
                                onChange={handleChangeInput}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="rating">Rating</label>
                                <input type="text" name="rating" className="form-control create__product--input" id="rating" placeholder="Rating..."
                                value={product.rating}
                                onChange={handleChangeInput}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Price</label>
                                <input type="text" name="price" className="form-control create__product--input" id="price" placeholder="Price..."
                                value={product.price}
                                onChange={handleChangeInput}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <input type="text" name="description" className="form-control create__product--input" id="description" placeholder="Description..."
                                value={product.description}
                                onChange={handleChangeInput}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="content">Content</label>
                                <textarea name="content" className="form-control create__product--input" id="content" rows="3"
                                value={product.content}
                                onChange={handleChangeInput}></textarea>
                            </div>
                            <select name="category" className="form-control create__product--input" value={product.category} onChange={handleChangeInput}>
                                <option value="">Choose Category...</option>
                                    {
                                       categories && categories.map((item) => {
                                            return (
                                                <option value={item.name} key={item._id}>{item.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            <div>
                                <Button className="create__product--btn" variant="contained" color="primary" type="submit"
                                >{onEdit ? "Update Product" : "Create Product"}</Button>
                            </div>
                        </form>
                        </div>
                </Paper>
            </Grid>
            </Paper>
        </Grid>
                
            <Grid item xs={12} md={9} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  className="paper__container"
                >
                  <React.Fragment>
                    <h2>Products List</h2>
                    <Table size="medium">
                        <TableHead>
                        <TableRow>
                            <TableCell className="order__item">Name</TableCell>
                            <TableCell className="order__item">Image</TableCell>
                            <TableCell className="order__item">Price</TableCell>
                            <TableCell className="order__item">Sold</TableCell>
                            <TableCell className="order__item">Category</TableCell>
                            <TableCell className="order__item" align="right">Action</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {products && products.map((item) => (
                            <TableRow key={item._id}>
                            <TableCell className="order__item">{item.title}</TableCell>
                            <TableCell className="order__item">
                                <img src={item.images.url ? item.images.url : item.images} alt={item.title} className="order__image"/>
                            </TableCell>
                            <TableCell className="order__item">{item.price}$</TableCell>
                            <TableCell className="order__item">{item.sold}</TableCell>
                            <TableCell className="order__item">{item.category}</TableCell>
                            <TableCell className="order__item" align="right">
                                <Link to={`/admin/${item._id}`}>
                                <Button className="admin__btn" variant="contained" color="primary">Edit</Button>
                                </Link>&nbsp;
                                <Button className="admin__btn" variant="contained" color="primary"
                                onClick={() => deleteProductHandle(item._id, item.images.public_id)}>Delete</Button>
                            </TableCell>
                            </TableRow>
                        ))}
                        
                        </TableBody>
                    </Table>
                    </React.Fragment>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 200,
                  }}
                >
                  <div>
                  <h4>Quantity Products</h4>
                  <p>
                   {products && products.length}
                  </p>
                  </div>
                  <div>
                      <h4>Quantity Sold</h4>
                      <p>
                          {
                             products && products.reduce((prev, item) => (
                                 prev + (item.sold)
                              ), 0)
                          }
                      </p>
                  </div>

                  
                </Paper>
              </Grid>
        </>
    )
}
