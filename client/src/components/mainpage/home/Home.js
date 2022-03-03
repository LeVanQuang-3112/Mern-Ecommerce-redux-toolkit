import React, { useState, useEffect } from 'react'
import {getProducts, productSelector } from '../../../store/storeAction'
import {useDispatch, useSelector} from 'react-redux'
import {Button} from "@mui/material"
import { ProductItem } from '../products/ProductItem'
import "./Home.scss"
import Banner from '../../banner/Banner'
import Advertise from '../../ads/Advertise'
import Loading from '../support/Loading'

export const Home = () => {
    const [category] = useState("")
    const [search] = useState("")
    const [page, setPage] =useState(1)
    const [sort] = useState("")
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getProducts({page, category, sort, search}))
    }, [dispatch, page])
    
    const productAction = useSelector(productSelector)
    const {products, result} = productAction
    // console.log(products)
  return (
    <div className="main">
        <div className="container">
            <div>
                <Banner/>
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
            <div>
                <Advertise/>
            </div>
        </div>
        </div>  
  )
}
