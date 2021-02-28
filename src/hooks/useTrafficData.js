import { useState, useEffect, useContext } from 'react';

// hook
import { LoginContext } from './LoginContext';

// packages
import axios from 'axios';
import { toast } from 'react-toastify';

const useTrafficData = () => {
  const [T_loading, setLoading] = useState(true);
  const { setTusers } = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(
        `${
          process.env.REACT_APP_BASE_URL
        }/traffic?&timestamp=${new Date().getTime()}`
      )
      .then(res => {
        setTusers(Array.from(res.data).sort(compare));
        setLoading(false);
      })
      .catch(e => {
        toast.warn('Could not connect to server!');
      });
  }, [setTusers]);

  function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    let comparison = 0;
    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }
    return comparison;
  }

  return { T_loading };
};

export default useTrafficData;
