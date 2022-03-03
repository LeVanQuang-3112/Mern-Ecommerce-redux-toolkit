import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { userSelector, getHistoryUser } from '../../../store/storeAction';
import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from 'react';
import './History.scss'

export default function History() {
  const dispatch = useDispatch()
  const userAction = useSelector(userSelector)
  const {history} = userAction
//   console.log(history)
  const login = JSON.parse(localStorage.getItem('login'))

  useEffect(() => {
      if(login) {
          dispatch(getHistoryUser(login.accesstoken))
      }
  }, [dispatch, login.accesstoken])
  return (
      <div className="main">
      <div className="container">
          <div className="history__container">
              <h2 className="page__header">History</h2>
          <Grid item xs={12} md={12} lg={12}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                      }}>
                        <React.Fragment>
                            <Table size="medium">
                                <TableHead>
                                <TableRow>
                                    <TableCell className="history__item">Your Information</TableCell>
                                    <TableCell className="history__item">Shipping Address</TableCell>
                                    <TableCell className="history__item">Cart Content</TableCell>
                                    <TableCell className="history__item" align="right">Total</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {history && history.map((item) => (
                                    <TableRow key={item._id}>
                                    <TableCell className="history__item">
                                        <p>Name: {item.name}</p>
                                        <p>Email: {item.email}</p>
                                    </TableCell>
                                    <TableCell className="history__item">
                                        <p>{item.address.line1}-{item.address.city}-{item.address.country_code}</p>
                                    </TableCell>
                                    <TableCell className="history__item">{item.cart.map((cartItem, index) => {
                                        return (
                                        <div key={index} className="flexrow text__transform">
                                            <p>{cartItem.title} - {cartItem.quantity}</p>
                                        </div>
                                        )
                                    })}</TableCell>
                                    <TableCell className="history__item" align="right">${item.cart.reduce((prev, cartItem) => (
                                            prev + (cartItem.quantity * cartItem.price)
                                    ), 0)}</TableCell>
                                    </TableRow>
                                ))}
                                
                                </TableBody>
                            </Table>
                            </React.Fragment>    
                    </Paper>
            </Grid>
          </div>

      </div>
      </div>

  );
}