import React, { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import 'react-quill/dist/quill.snow.css';

Quill.register('modules/imageResize', ImageResize);

const CustomQuillEditor = ({ content, setContent }) => {
  const quillRef = useRef(null);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const MAX_IMAGE_SIZE = 5 * 2500 * 2500; 

  const uploadImageToFirebase = async (file) => {
    if (file.size > MAX_IMAGE_SIZE) {
      setError("La taille de l'image ne doit pas dépasser 5MB.");
      return Promise.reject("Image size exceeds maximum limit");
    }

    setIsUploading(true);
    setError("");
    const uniqueImageName = `${Date.now()}_${file.name}`;
    const storage = getStorage();
    const storageReference = storageRef(storage, `images/${uniqueImageName}`);
    const uploadTask = uploadBytesResumable(storageReference, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          setIsUploading(false);
          setUploadProgress(0);
          console.error('Upload failed: ', error);
          setError("Erreur du chargement de l'image, veuillez réessayer.");
          reject(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
            setIsUploading(false);
            setUploadProgress(0);
          });
        }
      );
    });
  };

  useEffect(() => {
    const quill = quillRef.current;
    if (quill) {
      const editor = quill.getEditor();
      editor.getModule('toolbar').addHandler('image', () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async (event) => {
          const file = event.target.files[0];
          if (file) {
            const imageUrl = await uploadImageToFirebase(file).catch(err => console.error(err));
            if (imageUrl) {
              const range = editor.getSelection(true);
              editor.insertEmbed(range.index, 'image', imageUrl);
            }
          }
        };
      });
    }
  }, []);

  return (
    <>
      {isUploading && (
        <div>Uploading...</div>
      )}
      {uploadProgress > 0 && !isUploading && (
        <div>
          <progress value={uploadProgress} max="100" />
          <span>{Math.round(uploadProgress)}%</span>
        </div>
      )}
      {error && <div>{error}</div>}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={content}
        onChange={setContent}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote'],
            ['link', 'image'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['clean']
          ],
          imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          },
        }}
      />
    </>
  );
};

export default CustomQuillEditor;