import { useState } from 'react';

// packages
import axios from 'axios';
import { toast } from 'react-toastify';

const useSubmit = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [driver_id, setDriverId] = useState('');
  const [password, setPassword] = useState('');
  const [upload, setUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [url, setUrl] = useState(null);
  const driver_pic = process.env.REACT_APP_BASE_URL + '/driver_pic/' + contact;
  const traffic_pic =
    process.env.REACT_APP_BASE_URL + '/traffic_pic/' + contact;

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

  const handleClose = () => {
    setSuccess(false);
    setFail(false);
  };

  const handleDriverUpload = async () => {
    if (upload == null) {
      alert('Submit form and choose image before upload.');
    } else {
      let file = new FormData();
      file.append('file', upload, upload.name);
      await axios
        .post(driver_pic, file, {})
        .then(response => {
          console.log(response.statusText, 'Sent image!!!!!');
          toast.success('Successfully uploaded image.');
        })
        .catch(error => {
          setFail(true);
          console.log(error);
        });
    }
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

  function resetForm() {
    setName('');
    setContact('');
    setEmail('');
    setDriverId('');
    setPassword('');
    setUpload(null);
  }

  const postData = async e => {
    e.preventDefault();
    setLoading(true);
    if (!upload) {
      toast.error('Please upload an image!');
      setLoading(false);
      return;
    }

    //API call here
    if (upload) {
      await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/driver_signup`,
          {
            // data to be sent
            name,
            email,
            password,
            driver_id,
            contact
          },
          {}
        )
        .then(response => {
          handleDriverUpload();
          setSuccess(true);
          setUrl(null);
          resetForm();
        })
        .catch(error => {
          setFail(true);
          console.log(error);
        });
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const postTrafficData = async e => {
    e.preventDefault();
    setLoading(true);

    if (!upload) {
      toast.error('Please upload an image!');
      setLoading(false);
      return;
    }

    //API call here
    if (upload) {
      await axios
        .post(`${process.env.REACT_APP_BASE_URL}/traffic_signup`, {
          // data to be sent
          name,
          email,
          password,
          contact
        })
        .then(response => {
          handleTrafficUpload();
          setSuccess(true);
          setUrl(null);
          resetForm();
        })
        .catch(error => {
          setFail(true);
          console.log(error);
        });
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleTrafficUpload = async () => {
    if (upload == null) {
      alert('Submit form and choose image before upload.');
    } else {
      let file = new FormData();
      file.append('file', upload, upload.name);
      await axios
        .post(traffic_pic, file, {})
        .then(response => {
          toast.success('Successfully uploaded image.');
          resetForm();
        })
        .catch(error => {
          setFail(true);
          console.log(error);
        });
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    contact,
    setContact,
    driver_id,
    setDriverId,
    password,
    setPassword,
    postData,
    postTrafficData,
    url,
    setUpload,
    handlePreview,
    loading,
    success,
    handleClose,
    fail,
    generateDownload
  };
};

export default useSubmit;
