import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {Button} from "@mui/material"
import Swal from 'sweetalert2';
import axios from "axios"
import { useState, useEffect } from 'react';
import './Admin.scss'
import { useDispatch, useSelector } from 'react-redux';
import { adminSelector, getCategories, updateCategory } from '../../../store/storeAction';

export default function Category() {
    const dispatch = useDispatch()
    const adminInfo = useSelector(adminSelector)
    const {categories} = adminInfo
    // console.log(adminInfo);
    const login = JSON.parse(localStorage.getItem('login'))
    useEffect(() => {
    //   if(login) {
        dispatch(getCategories())
    //   }
    }, [dispatch])

    const [category, setCategory] = useState('')
    const [edit, setEdit] = useState(false)
    const [id, setId] = useState('')
    

    const createCategoryHandle = async() => {
        if(login) {
            try {
                if(edit) {
                    const response = await axios.put(`http://localhost:5000/api/category/${id}`, {name: category}, {
                        headers: {Authorization: login.accesstoken}
                    })
                    dispatch(updateCategory(response.data.category))
                    Swal.fire("Success!", "Updata category success", "success")
                }
                else {
                    const response = await axios.post(`http://localhost:5000/api/category`, {name: category}, {
                        headers: {Authorization: login.accesstoken}
                    })
                    dispatch(updateCategory(response.data.category))
                    Swal.fire("Success!", "Create category success", "success")
                }
                setEdit(false)
                setCategory('')
            } catch(error) {
                Swal.fire("Error", error.response.data.msg, "error")
            }
        }
    }
    const editCategory = (id, name) => {
        setEdit(true)
        setId(id)
        setCategory(name)
    }

    const deleteCategory = async(id) => {
         try {
             const response = await axios.delete(`http://localhost:5000/api/category/${id}`, {
                 headers: {Authorization: login.accesstoken}
             })
             dispatch(updateCategory(response.data.category))
             Swal.fire("Success!", response.data.msg)
         }
         catch(error) {
             Swal.fire("Error", error.response.data.msg, "error")
         }
    }
    
    return (
        <div className="order__item">
            <div className="mb-3">
                <label htmlFor="exampleFormControlInput1" className="form-label">Name Category</label>
                <input type="text" name="category" className="form-control" id="exampleFormControlInput1" 
                placeholder="Enter your category..." 
                style={{fontSize: "2rem"}}
                value={category}
                onChange={(e) => setCategory(e.target.value)}/>
                <button type="submit" className="create__category--btn"
                onClick={createCategoryHandle}>{edit ? "UPDATE" : "CREATE"}</button>
            </div>
            <div>
            <React.Fragment>
                <h2>Categories Table</h2>
                <Table size="medium">
                    <TableHead>
                    <TableRow>
                        <TableCell className="order__item">Name</TableCell>
                        <TableCell className="order__item">Create At</TableCell>
                        <TableCell className="order__item">Update At</TableCell>
                        <TableCell className="order__item">Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {categories && categories.map((item) => (
                        <TableRow key={item._id}>
                        <TableCell className="order__item">{item.name}</TableCell>
                        <TableCell className="order__item">{item.createdAt}</TableCell>
                        <TableCell className="order__item">{item.updatedAt}</TableCell>
                        <TableCell className="order__item flexrow">
                            <Button className="admin__btn" variant="contained" color="primary" 
                            onClick={() => editCategory(item._id, item.name)}>Edit</Button>&nbsp;
                            <Button className="admin__btn" variant="contained" color="primary" 
                            onClick={() => deleteCategory(item._id)}>Delete</Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </React.Fragment>
            </div>
        </div>
    )
}
