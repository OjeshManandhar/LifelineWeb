import React, { useState, useContext } from 'react';

// packages
import {
  Backdrop,
  Paper,
  TextField,
  Grid,
  Typography,
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';

// route
import history from '../../navigation/history';

// components
import Buttons from '../../components/Button';
import Failure from '../../components/Failure';

// style
import * as L from './styles';

// hook
import { LoginContext } from '../../hooks/LoginContext';

function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [fail, setFail] = useState(false);
  const { success, setSuccess } = useContext(LoginContext);
  console.log(success);

  const handleClose = () => {
    setFail(false);
  };

  const handleSubmit = async () => {
    if (name === 'admin' && password === 'admin@123') {
      setSuccess(true);
      history.push('/Home');
    } else {
      setFail(true);
    }
  };

  return (
    <Backdrop
      open={true}
      color={'#f0f1f2'}
      style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
    >
      <Paper
        elevation='3'
        component='form'
        style={L.container}
        onSubmit={() => handleSubmit()}
      >
        <Typography style={L.Header}>Lifeline Admin Login</Typography>
        <Grid container spacing={1} style={L.Form}>
          <Grid item>
            <AccountCircle style={L.Icon} />
          </Grid>
          <Grid item>
            <TextField
              label='Username'
              color={'secondary'}
              required
              autoComplete='username'
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={L.Input}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} style={L.Form}>
          <Grid item>
            <LockIcon style={L.Icon} />
          </Grid>
          <Grid item>
            <TextField
              type='password'
              label='Password'
              color={'secondary'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={L.Input}
            />
          </Grid>
        </Grid>
        <Buttons title={'Submit'} onSubmit={() => handleSubmit()} />
        <Failure
          open={fail}
          handleClose={handleClose}
          title='Login Error'
          message='Please enter both name and password.'
        />
      </Paper>
    </Backdrop>
  );
}

export default Login;
