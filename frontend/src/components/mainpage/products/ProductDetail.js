import React, {useEffect, useState} from 'react'
import { useParams } from "react-router"
import {useDispatch, useSelector} from "react-redux"
import { productSelector, getProducts } from '../../../store/storeAction'
import "./ProductDetail.scss"
import {v4 as uuidv4} from 'uuid';

export const ProductDetail = () => {
    const dispatch = useDispatch()
    const productAction = useSelector(productSelector)
    const {products} = productAction
    const [search] = useState("")
    const [category] = useState("")
    const [sort] = useState("")
    const [page] = useState(1)

    useEffect(() => {
        dispatch(getProducts({page, category, sort, search}))
    }, [dispatch])
    console.log(products)

  const [productDetail, setProductDetail] = useState([])
  const params = useParams()
  console.log(params.id);

  useEffect(() => {
      if(params.id) {
          products.forEach((product) => {
              if(product._id === params.id) {
                  setProductDetail(product)
              }
          })
      }
  }, [params.id, products])

  console.log(productDetail)
  if(productDetail.length === 0) return null
  let color = "#FFA41C"

  return (
    <div className="main">
        <div className="container__item container">
        <div className="product__detail--container">
            <div style={{margin: "auto", minWidth: "35%"}}>
            <div className="detail__image--container">
                 <img src={productDetail.images.url} alt={productDetail.title} className="detail__image"/>
            </div>
            </div>
            <p className="border__column"></p>
            <div className="detail__content--container">
                <div className="detail__content">
                <p>Category: <span className="product__detail--title">{productDetail.category}</span></p>
                <h2 className="product__detail--title">{productDetail.title}</h2>
                <h2>Price: ${productDetail.price}</h2>
                <p>{productDetail.description}</p>
                <p>{productDetail.content}</p>
                </div>
                <div>
                <h2>Rating: {[1,2,3,4,5].map((rate) => (
                <span key={uuidv4()}>
                    <i style={{color}} className= {
                        productDetail.rating + 1 === rate + 0.5 
                        ? "fas fa-star-half-alt" 
                        : productDetail.rating >= rate 
                        ? "fas fa-star" 
                        : "far fa-star"
                    }
                    />
                </span>
            ))}</h2>
                
                </div>
                <div></div>
            </div>
        </div>
        </div>
        </div>
  )
}
