const Products = require('../models/productModel')

// Filter, sorting and paginating

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = {...this.queryString} // queryString = req.query
    const excludedFields = ['page', 'sort', 'limit']
    excludedFields.forEach(el => delete(queryObj[el]))

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

    this.query.find(JSON.parse(queryStr))

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt')
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 9
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit)

    return this;
  }
}

const productController = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Products.find(), req.query).filtering().sorting().paginating()
      const products = await features.query

      res.json({
        status: 'success',
        result: products.length,
        products: products
      })
    } catch (err) {
      return res.status(500).json({message: err.message})
    }
  },
  getProduct: async (req, res) => { 
    try {
        const productId = req.params.id;
        const product = await Products.findById(productId)
          if(product) {
            res.send(product)
          } else {
            res.status(404).send({ message: 'Product Not Found' });
          }
      } catch {
        res.status(404).send({ message: 'Product Not Found' }); 
      }
  },
  createProduct: async (req, res) => {
    try {
      const {product_id, title, price, rating, description, content, images, category, sold} = req.body;
      if (!images) return res.status(400).json({message: "No image upload."})

      const product = await Products.findOne({product_id})
      if (product) return res.status(400).json({message: "This product already exists."})

      const newProduct = await Products({
        product_id, title: title.toLowerCase(), price, rating, description, content, images, category, sold
      })

      await newProduct.save()
      const listProduct = await Products.find();
      res.json({product: newProduct, listProduct: listProduct})
    } catch (err) {
      return res.status(500).json({message: err.message})
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id)
      const listProduct = await Products.find();
      
      res.json({message: "Deleted a product.", listProduct: listProduct})
    } catch (err) {
      return res.status(500).json({message: err.message})
    }
  },
  updateProduct: async (req, res) => {
    try {
      const {title, price, rating, description, content, images, category} = req.body;
      if (!images) return res.status(400).json({message: "No image upload."})
      
      await Products.findOneAndUpdate({_id: req.params.id}, {
        title: title.toLowerCase(), price, rating, description, content, images, category
      })

      const listProduct = await Products.find();

      res.json({message: "Updated a product", listProduct: listProduct})
    } catch (err) {
      return res.status(500).json({message: err.message})
    }
  },
}

module.exports = productController