import { useState, useEffect, useContext } from 'react';

// hook
import { LoginContext } from './LoginContext';

// packages
import axios from 'axios';
import { toast } from 'react-toastify';

const useDriverData = () => {
  const [loading, setLoading] = useState(true);
  const { setDusers } = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(
        `${
          process.env.REACT_APP_BASE_URL
        }/driver?&timestamp=${new Date().getTime()}`
      )
      .then(res => {
        setDusers(Array.from(res.data).sort(compare));
        setLoading(false);
      })
      .catch(e => {
        toast.warn('Could not connect to server!');
      });
  }, [setDusers]);

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

  return { loading };
};

export default useDriverData;
