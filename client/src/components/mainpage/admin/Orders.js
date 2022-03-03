import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { adminSelector, getInfoAdmin } from '../../../store/storeAction';
import { useEffect} from 'react'

export default function Orders() {
  const dispatch = useDispatch()
  const adminInfo = useSelector(adminSelector)
  const {history} = adminInfo
  // console.log(history);
  const login = JSON.parse(localStorage.getItem('login'))
  useEffect(() => {
    if(login) {
      dispatch(getInfoAdmin(login.accesstoken))
    }
  }, [dispatch])
  return (
    <React.Fragment>
      {/* <Title>Recent Orders</Title> */}
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell className="order__item">Date</TableCell>
            <TableCell className="order__item">Name</TableCell>
            <TableCell className="order__item">PaymentID</TableCell>
            <TableCell className="order__item">Quantity</TableCell>
            <TableCell className="order__item" align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history && history.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="order__item">{item.updatedAt}</TableCell>
              <TableCell className="order__item">{item.name}</TableCell>
              <TableCell className="order__item">{item.paymentID}</TableCell>
              <TableCell className="order__item">{item.cart.map((cartItem, index) => {
                return (
                  <div key={index} className="flexrow">
                    <img src={cartItem.images.url} alt="" className="order__image"/>
                    <p>{cartItem.title} - {cartItem.quantity}</p>
                  </div>
                )
              })}</TableCell>
              <TableCell className="order__item" align="right">${item.cart.reduce((prev, cartItem) => (
                     prev + (cartItem.quantity * cartItem.price)
              ), 0)}</TableCell>
            </TableRow>
          ))}
          
        </TableBody>
      </Table>
    </React.Fragment>
  );
}