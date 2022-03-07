import React, { useState, useEffect } from 'react'
import {getProducts, productSelector, getCategories, adminSelector } from '../../../store/storeAction'
import {useDispatch, useSelector} from 'react-redux'
import {Button} from "@mui/material"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ProductItem } from './ProductItem'
import './Products.scss'
import Loading from '../support/Loading';

export const Products = () => {
    const [category, setCategory] = useState('')
    const [search] = useState('')
    const [sort] = useState('')
    const [page, setPage] =useState(1)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getProducts({page, category, sort, search}))
    }, [dispatch, page, category])

    useEffect(() => {
        dispatch(getCategories())
    }, [dispatch])

    const categoryAction = useSelector(adminSelector)
    const {categories} = categoryAction
    const productAction = useSelector(productSelector)
    const {products, result} = productAction

  return (
    <div className="main">
        <div className="container">
            <div>
            <>
            <FormControl sx={{ m: 0, minWidth: 120 }} className="categories__form">
            <InputLabel id="demo-simple-select-autowidth-label"><h4>Categories</h4></InputLabel>
            <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={category ? category : ""}
                onChange={(e) => setCategory(e.target.value)}
                autoWidth
                label="Categories"
            >
                <MenuItem value="">
                <em className="categories__item">All Products</em>
                </MenuItem>
                {
                        categories.map((item) => {
                            return (
                                <MenuItem value={"category=" + item.name} key={item._id} className="categories__item">{item.name}</MenuItem>
                            )
                        })
                    }
            </Select>
            </FormControl>
      </>
            </div>
            <div className="container__item">
            {
                products.length > 0
                ? (<div className="product__home--container">
                    {
                        products.map((product) => {
                            return (
                                <ProductItem key={product._id} product={product}/>
                            )
                        })
                    }
                </div>)  
                : (<Loading/>)          }
            <div className="button__seemore">
                {
                   result.length > 0 
                   ? ""
                   : <Button variant="contained" color="success"
                   onClick={() => setPage(page+1)}>SEE MORE</Button>
                }
            </div>
            </div>
        </div>
        </div> 
  )
}
