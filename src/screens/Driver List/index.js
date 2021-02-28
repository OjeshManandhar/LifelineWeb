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

// hooks
import useDriverData from '../../hooks/useDriverData';

// components
import NavBar from '../../components/NavBar';
import TableView from '../../components/TableView';
import Cards from '../../components/Cards';
import Edit from '../../components/Edit';

// styles
import * as D from './styles';

const DriverList = () => {
  const [view, setView] = useState(true);
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const { loading } = useDriverData();

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (searchValue.length > 2) {
      if (parseInt(searchValue)) {
        // contact query
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}/driver?&contact=${searchValue}`
          )
          .then(res => {
            setSearchResult(res.data);
          });
      } else {
        axios
          .get(`${process.env.REACT_APP_BASE_URL}/driver?&name=${searchValue}`)
          .then(res => {
            setSearchResult(res.data);
          });
        // username query
      }
    } else {
      setSearchResult([]);
    }
  }, [searchValue]);

  return (
    <>
      <NavBar />

      <Box component='div' style={D.container}>
        <Box style={D.row}>
          <FormControlLabel
            style={D.toggle}
            control={
              <Switch
                checked={view}
                onChange={() => setView(!view)}
                name={view ? 'Cards' : 'Table'}
              />
            }
            label={view ? 'Cards' : 'Table'}
          />

          <div style={D.search}>
            <div style={D.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder='Search…'
              inputProps={{ 'aria-label': 'search' }}
              onChange={e => setSearchValue(e.target.value)}
            />
          </div>
        </Box>
        {loading && <CircularProgress color='secondary' />}
        {view ? (
          <Box component='div' style={D.cardsContainer}>
            <Cards
              type='driver'
              setOpen={setOpen}
              setKey={setKey}
              searchResult={searchResult}
            />
          </Box>
        ) : (
          <TableView type='driver' searchResult={searchResult} />
        )}
      </Box>
      {key ? (
        <Edit
          title={'Edit Driver info'}
          type='driver'
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

export default React.memo(DriverList);
