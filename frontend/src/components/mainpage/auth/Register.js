import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Swal from 'sweetalert2';
import {useState} from "react"
import { useDispatch } from 'react-redux';
import { userRegister } from '../../../store/storeAction';


const theme = createTheme();

export default function Register() {
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const dispatch = useDispatch()
  const registerSubmit = async(e) => {
    e.preventDefault()
    try {
        if(password !== passwordConfirm) {
            Swal.fire("Error", "password does not match", "error")
        } else {
            dispatch(userRegister({name, email, password}))
        }
    } catch(err) {
        Swal.fire("Error", err.response.data.msg, "err")
    }
  }
  return (
    <div className="main">
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xxs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            {/* <LockOutlinedIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h3">
            Register
          </Typography>
          <Box component="form" onSubmit={registerSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="passwordConfirm"
              label="Confirm Password"
              type="password"
              id="passwordConfirm"
              autoComplete="current-passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{fontSize: "1.8rem"}}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </div>
  );
}