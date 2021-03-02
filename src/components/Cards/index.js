import React, { useState, useContext, useEffect } from 'react';

// hooks
import { LoginContext } from '../../hooks/LoginContext';

// packages
import axios from 'axios';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Avatar,
  Button,
  Typography
} from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// assets
import Dummy from '../../assets/Profile.jpg';

// style
import * as C from './styles';

const Cards = ({ type, setKey, setOpen, searchResult }) => {
  const { Dusers, Tusers } = useContext(LoginContext);
  const [user, setUser] = useState();
  let url;

  useEffect(() => {
    if (type === 'driver') {
      searchResult.length > 0 ? setUser(searchResult) : setUser(Dusers);
    } else {
      searchResult.length > 0 ? setUser(searchResult) : setUser(Tusers);
    }
  }, [Dusers, Tusers, type, searchResult]);

  function newData(contact) {
    const newSet = user.filter(data => {
      return data.contact !== parseInt(contact);
    });
    setUser(newSet);
  }

  const handleDelete = url => {
    axios
      .delete(url)
      .then(res => {
        toast.success('Succesfully deleted.');
      })
      .catch(error => {
        console.log(error);
        toast.error('Couldnot delete user. Try again!');
      });
  };

  const renderAvatar = key => {
    if (key === null) {
      return <Avatar style={{ width: 90, height: 90 }} src={Dummy} />;
    } else {
      if (type === 'driver') {
        const url =
          process.env.REACT_APP_BASE_URL +
          '/driver_pic/' +
          key +
          `?&timestamp=${new Date().getTime()}`;
        return <Avatar style={{ width: 90, height: 90 }} src={url} />;
      } else {
        const url =
          process.env.REACT_APP_BASE_URL +
          '/traffic_pic/' +
          key +
          `?&timestamp=${new Date().getTime()}`;
        return <Avatar style={{ width: 90, height: 90 }} src={url} />;
      }
    }
  };

  if (!user) {
    return (
      <Card style={C.Container} key={'name'}>
        <CardActionArea style={C.CardContainer}>
          <Avatar style={{ width: 90, height: 90 }} src={Dummy} />
          <CardContent>
            <Typography gutterBottom variant='h5' component='h2'>
              Name: -----
            </Typography>
            <Typography variant='body2' color='textSecondary' component='p'>
              Contact: -----
              <br />
              Email: -----
              <br />
              {type === 'driver' ? `Driver ID: -----` : null}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size='small' color='secondary'>
            Edit
          </Button>
          <Button size='small' color='secondary'>
            Delete
          </Button>
        </CardActions>
      </Card>
    );
  } else {
    return user.map(data => (
      <>
        <Card style={C.Container} key={data.contact}>
          <CardActionArea style={C.CardContainer}>
            {renderAvatar(data.contact)}
            <CardContent>
              <Typography gutterBottom variant='h5' component='h2'>
                {data.name}
              </Typography>
              <Typography
                style={{ width: 'max-content' }}
                variant='body2'
                color='textSecondary'
                component='p'
              >
                Contact: {data.contact}
                <br />
                Email: {data.email}
                <br />
                {data.driver_id ? `Driver ID: ${data.driver_id}` : null}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              size='small'
              color='secondary'
              onClick={() => {
                setKey(data.contact.toString());
                setOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              size='small'
              color='secondary'
              onClick={() => {
                if (type === 'driver') {
                  url =
                    process.env.REACT_APP_BASE_URL + '/driver/' + data.contact;
                } else {
                  url =
                    process.env.REACT_APP_BASE_URL + '/traffic/' + data.contact;
                }
                newData(data.contact);
                handleDelete(url);
              }}
            >
              Delete
            </Button>
          </CardActions>
          <ToastContainer />
        </Card>
      </>
    ));
  }
};

export default React.memo(Cards);
