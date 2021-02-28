import React, { useState, useEffect } from 'react';

// packages
import {
  Box,
  FormControlLabel,
  Switch,
  CircularProgress,
  InputBase
} from '@material-ui/core';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';

// hook
import useTrafficData from '../../hooks/useTrafficData';

// components
import NavBar from '../../components/NavBar';
import TableView from '../../components/TableView';
import Cards from '../../components/Cards';
import Edit from '../../components/Edit';

// styles
import * as T from './styles';

const TrafficList = () => {
  const [view, setView] = useState(true);
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const { T_loading } = useTrafficData();

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (searchValue.length > 2) {
      if (parseInt(searchValue)) {
        // contact query
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}/traffic?&contact=${searchValue}`
          )
          .then(res => {
            setSearchResult(res.data);
          });
      } else {
        axios
          .get(`${process.env.REACT_APP_BASE_URL}/traffic?&name=${searchValue}`)
          .then(res => setSearchResult(res.data));
        // username query
      }
    } else {
      setSearchResult([]);
    }
  }, [searchValue]);

  return (
    <>
      <NavBar />

      <Box component='div' style={T.container}>
        <Box style={T.row}>
          <FormControlLabel
            style={T.toggle}
            control={
              <Switch
                checked={view}
                onChange={() => setView(!view)}
                name={view ? 'Cards' : 'Table'}
              />
            }
            label={view ? 'Cards' : 'Table'}
          />

          <div style={T.search}>
            <div style={T.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder='Search…'
              inputProps={{ 'aria-label': 'search' }}
              onChange={e => setSearchValue(e.target.value)}
            />
          </div>
        </Box>
        {T_loading && <CircularProgress color='secondary' />}
        {view ? (
          <Box component='div' style={T.cardsContainer}>
            <Cards
              type='traffic'
              setOpen={setOpen}
              setKey={setKey}
              searchResult={searchResult}
            />
          </Box>
        ) : (
          <TableView searchResult={searchResult} />
        )}
      </Box>
      {key ? (
        <Edit
          title={'Edit Traffic info'}
          type='traffic'
          open={open}
          setOpen={setOpen}
          handleClose={handleClose}
          o_contact={key}
        />
      ) : null}
      <ToastContainer />
    </>
  );
};

export default TrafficList;
