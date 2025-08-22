import React from 'react';

import {dataApi} from '../api/data';
import { DataItem, DataItems } from '../api/types';

import Modal from '../utils/modal';
import RowAdd from '../utils/rowAdd';
import RowEdit from '../utils/rowEdit';
import RowDelete from '../utils/rowDelete';
import UserForm from '../utils/userForm';

import MenuIcon from '/public/icons/menu.svg';
import CopyIcon from '/public/icons/copy.svg';
import DeleteIcon from '/public/icons/delete.svg';
import EditIcon from '/public/icons/edit.svg';
import KeyIcon from '/public/icons/key.svg';


const Data: React.FC = () => {

  const [data, setData] = React.useState<Item[] | null>(null);
  const [isLoading, setLoading] = React.useState<Boolean>(true);
  const [isCopied, setCopied] = React.useState<Boolean>(false);
  const [actionsIndex, setActionsIndex] = React.useState<number | null>(null);

  // modal
  const [modalContent, setModalContent] = React.useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = React.useState<string>('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const user = 'ste';

  // show actions area (copy, edit, delete)
  const toggleActions = (index: number) => {
    setActionsIndex(prev => (prev === index ? null : index))
  }

  // show modal
  const addHandler = () => {
    setModalTitle('Add Password');
    setModalContent(<RowAdd user={user} setData={setData} closeModal={closeModal} />);
    openModal();
  }

  const profileHandler = () => {
    setModalTitle('User Profile');
    setModalContent(<UserForm user={user} setData={setData} closeModal={closeModal} />);
    openModal();
  }

  const editHandler = (row: Item) => {
    setModalTitle('Edit Password');
    setModalContent(<RowEdit row={row} user={user} setData={setData} closeModal={closeModal} />);
    openModal();
  }

  const deleteHandler = async (row:Item) => {
    setModalTitle('Delete Password');
    setModalContent(<RowDelete row={row} user={user} setData={setData} closeModal={closeModal} />);
    openModal();
  }

  // send password to clipboard
  const copyHandler = (event: any, password: string) => {
    event.stopPropagation()
    setCopied(true);
    navigator.clipboard.writeText(password);
    setTimeout(function() {
      setCopied(false)
    }, 500);
  }


  // show loading while waiting the api response
  if (isLoading) return <p>Loading...</p>



  return (
    <div>
      {
        /* add / edit modal */
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
      <header >
        <div>
          <KeyIcon />
          <div >PassVault</div>
        </div>
        <div >
          <div  onClick={() => addHandler()}>
            A
          </div>
          <div  onClick={() => profileHandler()}>
            U
          </div>
        </div>
      </header>

      <main>
        {
          /* show actions */
        }
        {
          data && data.map((row:any, index:number) => (
            <div key={index} onClick={() => toggleActions(index)} >

              <div >
                <div >
                  <div >{row.title}</div>
                  <div >
                     {row.username} <span >&nbsp;/&nbsp;</span> {row.password}
                  </div>
                  {
                    row.notes && <div >{row.notes}</div>
                  }
                </div>
                <div  style={{ cursor: 'pointer' }}>
                  <MenuIcon />
                </div>
              </div>

              {
                /* show actions */
              }
              <div>
                <div  onClick={(event) => copyHandler(event, row.password)} >
                  <CopyIcon />
                  <div >
                    {isCopied ? 'Copied!' : 'Copy'}
                  </div>
                </div>

                <div  onClick={() => editHandler(row)} >
                  <EditIcon />
                  <div >
                    Edit
                  </div>
                </div>

                <div  onClick={() => deleteHandler(row)} >
                  <DeleteIcon />
                  <div >
                    Delete
                  </div>
                </div>
              </div>

            </div>
          ))}
        {
          !data && <div >You don't have any passwords stored.</div>
        }
      </main>
    </div>
  )

};

export default Data;

