import React from "react";
import { dataApi } from "../api/data";
import type { DataItem, DataItems } from "../api/types";

import Modal from '../components/Modal';
import RowAdd from '../components/rowAdd';
import RowDelete from '../components/rowDelete';

import "./Data.scss";

const Data: React.FC = () => {
  const [data, setData] = React.useState<DataItems | null>(null);
  const [isLoading, setLoading] = React.useState<boolean>(true);
  const [actionsIndex, setActionsIndex] = React.useState<number | null>(null);
  const [isCopied, setCopied] = React.useState<string>('');

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
            setLoading(false);
          }
          //setSuccessMessage(response.message ?? 'Logout successful');
        }
      } catch (error) {
        console.log("Data.tsx error:", error);
        //setErrorMessage(error instanceof Error ? error.message: 'Logout failed');
      }
    })();
    return;
  }, []);


  // show actions area (copy, edit, delete)
  const toggleActions = (index: number) => {
    setActionsIndex(prev => (prev === index ? null : index))
  }

  const addHandler = () => {
    setModalTitle('Add Password');
    setModalContent(<RowAdd setData={setData} closeModal={closeModal} />);
    openModal();
  }

  const deleteHandler = async (row: DataItem) => {
    setModalTitle('Delete Password');
    setModalContent(<RowDelete row={row} setData={setData} closeModal={closeModal} />);
    openModal();
  }

  // send password to clipboard
  const copyHandler = (event: React.MouseEvent<HTMLElement>, password: string) => {
    event.stopPropagation()
    setCopied(password);
    navigator.clipboard.writeText(password);
    setTimeout(function () {
      setCopied('')
    }, 500);
  }

  if (isLoading) {
    return (
      <div>
        Loading...
      </div>
    )
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
        <div className={'header__brand'}>
          <div className={'header__title'}>PassVault</div>
        </div>
        <div className={'header__menu'}>
          <div className={'header__add'} onClick={() => addHandler()}>
            Add new item
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
          data && data.map((row: DataItem, index: number) => (
            <div className={'item'} key={index} onClick={() => toggleActions(index)} >
              <div className={'item__card'}>
                <div className={'item__data'}>
                  <div className={'item__field item__field--category'}><label>Category:</label> {row.category}</div>
                  <div className={'item__field item__field--label'}><label>Title:</label> {row.title}</div>
                  <div className={'item__field item__field--username'}><label>Username:</label> {row.username}</div>
                  <div className={'item__field item__field--password'}><label>Password:</label> {row.password}</div>
                  {
                    row.notes &&
                    <div className={'item__field item__field--notes'}>Notes: {row.notes}</div>
                  }
                </div>
                <div className={'item__menu'} style={{ cursor: 'pointer' }}>
                </div>
              </div>
              {
                /* action buttons */
              }
              <div className={`${'item__actions'} ${actionsIndex === index ? 'show' : ''}`}>
                <button
                  type="button"
                  className="item__action item__action--copy-username"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyHandler(e, row.username);
                  }}
                >
                  {isCopied === row.username ? 'Copied!' : 'Copy Username'}
                </button>
                <button
                  type="button"
                  className="item__action item__action--copy-password"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyHandler(e, row.password);
                  }}
                >
                  {isCopied === row.password ? 'Copied!' : 'Copy password'}
                </button>
                <button
                  type="button"
                  className="item__action item__action--delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler(row);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </main>
    </div>
  )
};

export default Data;
