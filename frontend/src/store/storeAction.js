import { createAsyncThunk, createSlice, configureStore } from '@reduxjs/toolkit'
import axios from 'axios'
import Swal from 'sweetalert2'
// user 
export const userLogin = createAsyncThunk('user/userLogin', async (user) => {
    try {
        const { data } = await axios.post(`http://localhost:5000/user/login`, { ...user })
        localStorage.setItem("login", JSON.stringify(data))
        return data;
    } catch(error) {
        Swal.fire("error", error.response.data.msg, "error")
    }
})

export const userRegister = createAsyncThunk('user/userRegister', async (user) => {
    try {
        // console.log(user)

        const response = await axios.post(`http://localhost:5000/user/register`, {name: user.name, email: user.email, password: user.password} )
        console.log(response)
        localStorage.setItem("login", JSON.stringify(response.data))
        window.location.href = ('/')
        return response.data;
    } catch (error) {
        Swal.fire("error", error.response.data.msg, "error")
    }
})

export const userLogout = createAsyncThunk('user/userLogout', async () => {
    try {
        await axios.get(`http://localhost:5000/user/logout`)
       localStorage.removeItem("login")
       window.location.href = ('/')
    } catch (error) {
        Swal.fire("Error", error.response.data.msg, "error")
    }
})

export const getInfoUser = createAsyncThunk('user/getInfoUser', async (token) => {
        const {data} = await axios.get(`http://localhost:5000/user/infor`, {
            headers: {Authorization: token}
        })
        return data;
})

export const getHistoryUser = createAsyncThunk('user/getHistoryUser', async (token) => {
        const response = await axios.get(`http://localhost:5000/user/history`, {
            headers: {Authorization: token}
        })
        return response.data;
})


// admin
export const getInfoAdmin = createAsyncThunk('admin/getInfoAdmin', async (token) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/payment`, {
            headers: {Authorization: token}
        })
        return response.data
    } catch (error) {
        Swal.fire("error", error.response.data.msg, "error")

    }
})

export const getCategories = createAsyncThunk('admin/getCategories', async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/category`)
        return response.data;
    } catch (error) {
        Swal.fire("error", error.response.data.msg, "error")

    }
})

export const updateCategory = createAsyncThunk('admin/updateCategory', async (categories) => {
      return categories
})


//products
export const getProducts = createAsyncThunk('products/getProducts', async (query) => { 
    try {
        const response = await axios.get(`http://localhost:5000/api/products?limit=${query.page*9}&${query.category}&${query.sort}&title[regex]=${query.search}`)
        return response.data;
    }  catch(error) {
        Swal.fire("error", error.response.data.msg, "error")
    }
})

export const updateProducts = createAsyncThunk('products/updateProducts', async(products) => {
    return products;
})

//cart 
export const addCart = createAsyncThunk('cart/addCart', async (cart) => {
    return cart;
})

export const increment = createAsyncThunk('cart/increment', async (id) => {
    return id;
})

export const decrement = createAsyncThunk('cart/decrement', async (id) => {
    return id;
})


//user slice 

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: [],
        token: '',
        cartItems: [],
        history: [],
    },
    reducers: {

    },
    extraReducers: {
        [userLogin.pending]: () => {
            console.log("pending...");
        },
        [userLogin.fulfilled]: (state, action) => {
            console.log("fulfilled...");
            state.userInfo = action.payload.user
            state.cartItems = action.payload.user.cart
            state.token = action.payload.accesstoken
        },
        [userLogin.rejected]: () => {
            console.log("rejected...");
        },
        [userRegister.fulfilled]: (state, action) => {
            state.userInfo = action.payload.user
            state.token = action.payload.accesstoken
        },
        [getInfoUser.fulfilled]: (state, action) => {
            console.log("fulfilled...");
            state.userInfo = action.payload
            state.cartItems = action.payload.cart
        },
        [getHistoryUser.fulfilled]: (state, action) => {
            console.log("fulfilled...");
            state.history = action.payload
        },
        [addCart.fulfilled]: (state, action) => {
            console.log("fulfilled...");
            state.cartItems = action.payload
        }, 
        [increment.fulfilled]: (state, action) => {
            console.log("fulfilled...");
            state.cartItems.map((item) => {
                if(item._id === action.payload) {
                    item.quantity +=1
                }
            })
        }, 
        [decrement.fulfilled]: (state, action) => {
            console.log("fulfilled...");
            state.cartItems.map((item) => {
                if(item._id === action.payload) {
                    item.quantity === 1 ? item.quantity = 1 : item.quantity-=1
                }
            })
        }
    }
})

//products slice

export const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        result: 0,

    },
    reducers: {

    },
    extraReducers: {
        [getProducts.pending]: () => {
            console.log("pending...");
        },
        [getProducts.fulfilled]: (state, action) => {
            console.log("fulfilled...");
            state.products = action.payload.products
            state.result = action.payload.result
        },
        [getProducts.rejected]: () => {
            console.log("rejected...");
        },
        [updateProducts.fulfilled]: (state, action) => {
            console.log("fulfilled...");
            state.products = action.payload
        },
    }
})

//admin slice

export const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        history: [],
        categories: []
    },
    reducers: {

    },
    extraReducers: {
        [getInfoAdmin.pending]: () => {
            console.log("pending...");
        },
        [getInfoAdmin.fulfilled]: (state, action) => {
            console.log("fulfilled...");
            state.history = action.payload
        },
        [getInfoAdmin.rejected]: () => {
            console.log("rejected...");
        },
        [getCategories.fulfilled]: (state, action) => {
            console.log("fulfilled...");
            state.categories = action.payload
        },
        [updateCategory.fulfilled]: (state, action) => {
            console.log("fulfilled...");
            state.categories = action.payload
        }
    }
})


export const userState = userSlice.reducer;
export const productState = productSlice.reducer;
export const adminState = adminSlice.reducer;

const store = configureStore({
    reducer: {
        userInfoAction: userState,
        productsAction: productState,
        adminAction: adminState,
    }
})
export const productSelector = (state) => state.productsAction
export const userSelector = (state) => state.userInfoAction
export const adminSelector = (state) => state.adminAction

export default store;
