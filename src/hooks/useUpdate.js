import { useState, useEffect } from "react";
import axios from "axios";

const useUpdate = (o_contact, type) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [driver_id, setDriverId] = useState("");
  const [user, setUser] = useState(null);
  const [urls, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type === "driver") {
      setUrl(process.env.REACT_APP_BASE_URL + "get_driver_pic/" + o_contact);
      setLoading(true);
      axios
        .get("/driver")
        .then((res) => {
          let user = res.data.filter(function (obj) {
            return obj.contact.toString() === o_contact;
          });
          setUser(user[0]);
          setName(user[0].name);
          setContact(user[0].contact);
          setEmail(user[0].email);
          setDriverId(user[0].driver_id);
          setLoading(false);
        })
        .catch((e) => console.log(e));
    } else {
      setUrl(process.env.REACT_APP_BASE_URL + "/get_traffic_pic/" + o_contact);
      setLoading(true);
      axios
        .get("/traffic")
        .then((res) => {
          let user = res.data.filter(function (obj) {
            return obj.contact.toString() === o_contact;
          });
          setUser(user[0]);
          setName(user[0].name);
          setContact(user[0].contact);
          setEmail(user[0].email);
          setLoading(false);
        })
        .catch((e) => console.log(e));
    }
  }, [o_contact, type]);

  const handleDriverUpdate = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `/driver/` + o_contact,
        {
          // data to be sent
          name,
          email,
          driver_id,
          contact,
        },
        {}
      )
      .then((response) => {
        console.log(response.data);
        alert("succesfully updated!");
        window.location.reload(false);
      })
      .catch((error) => {
        alert("failed to update!");
        console.log(error);
      });
  };

  const handleTrafficUpdate = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `/traffic/` + o_contact,
        {
          // data to be sent
          name,
          email,
          contact,
        },
        {}
      )
      .then((response) => {
        console.log(response.data);
        alert("succesfully updated!");
        window.location.reload(false);
      })
      .catch((error) => {
        alert("failed to update!");
        console.log(error);
      });
  };

  return {
    user,
    urls,
    handleDriverUpdate,
    handleTrafficUpdate,
    name,
    setName,
    email,
    setEmail,
    contact,
    setContact,
    driver_id,
    setDriverId,
    loading,
  };
};

export default useUpdate;
