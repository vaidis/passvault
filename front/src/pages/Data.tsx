import React from "react";
import { dataApi } from "../api/data";
import type { DataItem, DataItems } from "../api/types";

import Modal from '../components/Modal';
import RowAdd from '../components/rowAdd';
import RowDelete from '../components/rowDelete';
import RowEdit from '../components/rowEdit';

import "./Data.css";

const Data: React.FC = () => {
  const [data, setData] = React.useState<DataItems>([]);
  const [isLoading, setLoading] = React.useState<boolean>(true);
  const [actionsIndex, setActionsIndex] = React.useState<number | null>(null);
  const [isCopied, setCopied] = React.useState<boolean>(false);

  //const [status, setStatus] = React.useState<'idle' | 'ok' | 'error'>('idle');

  // modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState<string>("");
  const [modalContent, setModalContent] = React.useState<React.ReactNode>(null);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  React.useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const response = await dataApi.getDataItems();
        if (response.success) {
          const data = response.data;
          if (data !== undefined) {
            setData(data);
          }
          //setSuccessMessage(response.message ?? 'Logout successful');
        }
      } catch (error) {
        console.log("Data.tsx error:", error);
        //setErrorMessage(error instanceof Error ? error.message: 'Logout failed');
      }
    })();
    setLoading(false);
    return;
  }, []);


  // show actions area (copy, edit, delete)
  const toggleActions = (index: number) => {
    setActionsIndex(prev => (prev === index ? null : index))
  }

  const addHandler = () => {
   setModalTitle('Add Password');
   setModalContent(<RowAdd user={user} setData={setData} closeModal={closeModal} />);
   openModal();
  }

  const editHandler = (row: DataItem) => {
   setModalTitle('Edit Password');
   setModalContent(<RowEdit row={row} user={user} setData={setData} closeModal={closeModal} />);
   openModal();
  }
  
  const deleteHandler = async (row:DataItem) => {
   setModalTitle('Delete Password');
   setModalContent(<RowDelete row={row} user={user} setData={setData} closeModal={closeModal} />);
   openModal();
  }

  // send password to clipboard
  const copyHandler = (event: React.MouseEvent<HTMLElement>, password: string) => {
   event.stopPropagation()
   setCopied(true);
   navigator.clipboard.writeText(password);
   setTimeout(function() {
     setCopied(false)
   }, 500);
  }

  if (isLoading) {
    <div>
      Loading...
    </div>
  }

  return (
    <div className={'content'}>
      {
        /* modal */
      }
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
      >
        {modalContent}
      </Modal>
      {
        /* Add new password button */
      }
      <header className={'header'}>
        <div className={'brand'}>
          <div className={'title'}>PassVault</div>
        </div>
        <div className={'menu'}>
          <div className={'add'} onClick={() => addHandler()}>
            A
          </div>
        </div>
      </header>
      <main className={'main'}>
        {
          !data && <div className={'empty'}>You don't have any passwords stored.</div>
        }
        {
          /* list data */
        }
        {
          data && data.map((row:DataItem, index:number) => (
            <div className={'row'} key={index} onClick={() => toggleActions(index)} >
              <div className={'card'}>
                <div className={'data'}>
                  <div className={'label'}>{row.title}</div>
                  <div className={'username'}>{row.username}</div>
                  <div className={'password'}>{row.password}</div>
                  {
                    row.notes && <div className={'notes'}>{row.notes}</div>
                  }
                </div>
                <div className={'menu'} style={{ cursor: 'pointer' }}>
                </div>
              </div>
              {
                /* action buttons */
              }
              <div className={`${'actions'} ${actionsIndex === index ? 'show' : ''}`}>
                <div className={'copy'} onClick={(event) => copyHandler(event, row.password)} >
                  <div className={'actionLabel'}>
                    {isCopied ? 'Copied!' : 'Copy'}
                  </div>
                </div>
                <div className={'edit'} onClick={() => editHandler(row)} >
                  <div className={'actionLabel'}>
                    Edit
                  </div>
                </div>
                <div className={'delete'} onClick={() => deleteHandler(row)} >
                  <div className={'actionLabel'}>
                    Delete
                  </div>
                </div>
              </div>
            </div>
          ))}
      </main>
    </div>
  )
};

export default Data;
