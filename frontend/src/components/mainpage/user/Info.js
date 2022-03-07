import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { userSelector, getInfoUser } from '../../../store/storeAction';
import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from 'react';
import './User.scss'

export const Info = () => {
    const dispatch = useDispatch()
    const login = JSON.parse(localStorage.getItem('login'))
    const userAction = useSelector(userSelector)
    const {userInfo} = userAction
    // console.log(userInfo)
    useEffect(() => {
        if(login) {
          dispatch(getInfoUser(login.accesstoken))
        }
        }, [dispatch, login.accesstoken])
  return (
    <div className="main">
    <div className="container">
        <div className="history__container container__item">
            <h2 className="page__header">Information</h2>
        <Grid item xs={12} md={12} lg={12}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                      <React.Fragment>
                          <Table size="medium">
                              <TableBody>

                              <div className="info__container">
                                  <div className="info__container__item">
                                  <div className="info__image--container">
                                      {
                                          login
                                          ? (<>
                                              {
                                            userInfo.avatar !== ""
                                            ? (<img src={userInfo.avatar} alt="avatar" className="info__image"/>)
                                            : (<img src="https://res.cloudinary.com/levanquang/image/upload/v1646536874/redux-tutorial/anh_dai_dien_ovcsoc.jpg" 
                                            alt="avatar" className="info__image"/>)
                                        }</>
                                          )
                                        : (<img src="https://res.cloudinary.com/levanquang/image/upload/v1646542159/redux-tutorial/sznqfigr7ebzotmmupaz.jpg" 
                                        alt="avatar" className="info__image"/>)
                                      }
                                  </div>
                                  </div>
                                  {
                                      login
                                      ? (<>
                                      <div className="info__content--container">
                                      <h2>Name: {userInfo.name}</h2>
                                      <p><b>Email</b>: {userInfo.email}</p>
                                      <p><b>Address</b>: {userInfo.address}</p>
                                      <p><b>Mobile</b>: {userInfo.mobile}</p>
                                      <p><b>Create Time</b>: {userInfo.createdAt}</p>
                                      <p><b>Update Time</b>: {userInfo.updatedAt}</p>
                                      {/* <p>: {userInfo.mobile}</p> */}
                                  </div>
                                  </>)
                                  : ("")
                                  }
                              </div>
                              </TableBody>
                              
                          </Table>
                          </React.Fragment>    
                  </Paper>
          </Grid>
        </div>

    </div>
    </div>
  )
}
