import { useState, useEffect, useContext } from 'react';

// hook
import { LoginContext } from './LoginContext';

// packages
import axios from 'axios';
import { toast } from 'react-toastify';

const useUpdate = (o_contact, type) => {
  const { Dusers, Tusers } = useContext(LoginContext);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [driver_id, setDriverId] = useState('');
  const [user, setUser] = useState(null);
  const [urls, setUrls] = useState('');
  const [loading, setLoading] = useState(true);
  const [upload, setUpload] = useState(null);
  const [url, setUrl] = useState(null);
  const driver_pic =
    process.env.REACT_APP_BASE_URL + '/driver_pic/' + o_contact;
  const traffic_pic =
    process.env.REACT_APP_BASE_URL + '/traffic_pic/' + o_contact;

  useEffect(() => {
    if (type === 'driver') {
      setLoading(true);
      setUrls(process.env.REACT_APP_BASE_URL + 'driver_pic/' + o_contact);
      console.log(Dusers);
      const data = Dusers.filter(user => {
        return parseInt(user.contact) === parseInt(o_contact);
      });

      setUser(data[0]);
      setName(data[0].name);
      setContact(data[0].contact);
      setEmail(data[0].email);
      setDriverId(data[0].driver_id);
      setLoading(false);
    } else {
      setUrls(process.env.REACT_APP_BASE_URL + 'traffic_pic/' + o_contact);
      setLoading(true);
      const data = Tusers.filter(user => {
        return parseInt(user.contact) === parseInt(o_contact);
      });
      setUser(data[0]);
      setName(data[0].name);
      setContact(data[0].contact);
      setEmail(data[0].email);
      setDriverId(data[0].driver_id);
      setLoading(false);
    }
  }, [Dusers, Tusers, o_contact, type]);

  const createImage = url =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
      image.src = url;
    });

  function getRadianAngle(degreeValue) {
    return (degreeValue * Math.PI) / 180;
  }

  async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    // set each dimensions to double largest dimension to allow for a safe area for the
    // image to rotate in without being clipped by canvas context
    canvas.width = safeArea;
    canvas.height = safeArea;

    // translate canvas context to a central location on image to allow rotating around the center.
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate(getRadianAngle(rotation));
    ctx.translate(-safeArea / 2, -safeArea / 2);

    // draw rotated image and store data.
    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // paste generated rotate image with correct offsets for x,y crop values.
    ctx.putImageData(
      data,
      0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
      0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
    );

    // As Base64 string
    // return canvas.toDataURL("image/jpeg");
    return canvas;
  }

  const generateDownload = async (imageSrc, crop) => {
    if (!crop || !imageSrc) {
      return;
    }

    const canvas = await getCroppedImg(imageSrc, crop);
    var file;
    canvas.toBlob(
      blob => {
        file = new File([blob], 'image.jpg', {
          type: blob.type,
          lastModified: new Date()
        });
        setUpload(file);
      },
      'image/jpeg',
      0.66
    );

    return file;
  };

  function handlePreview(e) {
    e.preventDefault();
    if (upload == null) {
      toast.warn('Choose an image to preview.');
    } else {
      const objectUrl = URL.createObjectURL(upload);
      setUrl(objectUrl);
    }
  }

  const handleDriverUpdate = async e => {
    e.preventDefault();

    await axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/driver/` + o_contact,
        {
          // data to be sent
          name,
          email,
          driver_id,
          contact
        },
        {}
      )
      .then(response => {
        handleDriverUpload();
        toast.success('succesfully updated!');
        // window.location.reload(false);
      })
      .catch(error => {
        toast.error('failed to update!');
        console.log(error);
      });
  };

  const handleDriverUpload = async () => {
    if (upload == null) {
      return;
    } else {
      let file = new FormData();
      file.append('file', upload, upload.name);
      await axios
        .post(driver_pic, file, {})
        .then(response => {
          // console.log(response.statusText, "Sent image!!!!!");
          toast.success('Successfully uploaded image.');
          window.location.reload();
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const handleTrafficUpdate = async e => {
    e.preventDefault();

    await axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/traffic/` + o_contact,
        {
          // data to be sent
          name,
          email,
          contact
        },
        {}
      )
      .then(response => {
        handleTrafficUpload();
        toast.success('succesfully updated!');
        // window.location.reload(false);
      })
      .catch(error => {
        toast.error('failed to update!');
        console.log(error);
      });
  };

  const handleTrafficUpload = async () => {
    if (upload == null) {
      return;
    } else {
      let file = new FormData();
      file.append('file', upload, upload.name);
      await axios
        .post(traffic_pic, file, {})
        .then(response => {
          toast.success('Successfully uploaded image.');
          window.location.reload();
        })
        .catch(error => {
          console.log(error);
        });
    }
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
    url,
    setUpload,
    handlePreview,
    generateDownload
  };
};

export default useUpdate;
