import React, { useEffect, useRef, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import TextViewer from './TextViewer';
import "../components/styles/scrollbar.css";

function OfficeDocumentThumbnail({ documentUrl }) {
  const [thumbnail, setThumbnail] = useState();


  //   useEffect(() => {


  // if(documentUrl){
  //   WebViewer.WebComponent({
  //     path: '/webviewer/lib',
  //     licenseKey: 'demo:1688483639362:7c680c8a0300000000ebc0fd953818e5cfa47c7d0b7cd9b4fca56d77b4',
  //     initialDoc:documentUrl
  //   }, document.getElementById('viewer'))
  //     .then(instance => {
  //       const { UI, Core } = instance;
  //       const { documentViewer } = Core;


  //       documentViewer.addEventListener('documentLoaded', () => {

  //         const doc = documentViewer.getDocument();
  //         doc.loadThumbnail(1,(thumbnail)=>{
  //           console.log(thumbnail);
  //           setThumbnail(thumbnail);
  //           document.getElementById('viewer').innerHTML = '';
  //         })
  //       });


  //     })
  // }

  //   }, [documentUrl]);
  const isOfficeViewableFunc = (contentValue) => {
    const isPPT = contentValue?.endsWith('.ppt') || contentValue?.endsWith('.pptx');
    const isDOC = contentValue?.endsWith('.doc') || contentValue?.endsWith('.docx');
    const isXLS = contentValue?.endsWith('.xls') || contentValue?.endsWith('.xlsx');



    const isOfficeViewable = isPPT || isDOC || isXLS;
    if (isOfficeViewable) {
      return true;
    }
  }

  const isImageFunc = (contentUri) => {
    const isIMG = contentUri?.endsWith('.jpg') || contentUri?.endsWith('.jpeg') || contentUri?.endsWith('.png');
    return isIMG;
  }


  const isPDF = (uri) => uri?.endsWith('.pdf');


  const isTXT = (uri) => uri?.endsWith('.txt');

  return (
    <div id='outer'>
      {/* <div id='viewer' hidden>
      <hr />
      
    </div> */}
      {/* { thumbnail && <img src={thumbnail.toDataURL()} />} */}





      {
        isOfficeViewableFunc(documentUrl) ?
          (
            <iframe
              title={'DOC-Viewer'}
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${documentUrl}`}
              frameBorder={0}
              style={{ height: '150px', width: '100%' }}></iframe>
          ) : (
            isImageFunc(documentUrl) ? (
              <img src={documentUrl} alt='image' style={{
                height: '150px',
                width: '100%',
                objectFit: 'contain'
              }} />
            ) : (
              isPDF(documentUrl) ? (
                <iframe
                  // className='scrollbar scrollbar-primary'
                  title={'DOC-Viewer'}
                  src={`${documentUrl}`}
                  frameBorder={0}
                  style={{
                    height: '150px', width: '100%', overflow: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'lightgray darkgray',
                  }}></iframe>
              ) : (
                isTXT(documentUrl) ? (
                  <div style={{
                    height: '150px',
                    width: '100%',
                    overflow: 'hidden',

                  }}>
                    <TextViewer url={documentUrl} />
                  </div>
                ) : null
              )
            )
          )

      }

    </div>
  )
}

export default OfficeDocumentThumbnail


