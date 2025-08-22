import React from 'react';
//import MenuIcon from '/public/icons/menu.svg';
import {dataApi} from '../api/data';
import type { DataItem, DataItems } from '../api/types';

const Data: React.FC = () => {
  const [data, setData] = React.useState<DataItems>([]);
  const [isLoading, setLoading] = React.useState<boolean>(true);
  const [actionsIndex, setActionsIndex] = React.useState<number | undefined>();
  //const [status, setStatus] = React.useState<'idle' | 'ok' | 'error'>('idle');

  // show actions area (copy, edit, delete)
  const toggleActions = (index: number) => {
    console.log('toggleActions index', index);
    //setActionsIndex(prev => (prev === index ? null : index))
  }

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
        console.log('Data.tsx error:', error)
        //setErrorMessage(error instanceof Error ? error.message: 'Logout failed');
      }
    })();
    setLoading(false);
    return;
  }, []);

  // show loading while waiting the api response
  if (isLoading) return <p>Loading...</p>

  return (
    <div>
        {
          data && data.map((row:DataItem, index:number) => (
            <div key={index} onClick={() => toggleActions(index)} >
              <div>
                <div>
                  <div>
                    Title: {row.title}
                  </div>
                  <div >
                     Username: {row.username}
                  </div>
                  <div >
                     Password: {row.password}
                  </div>
                  <div>
                    Notes: {row.notes}
                  </div>
                  <div >
                     Created: {row.created}
                  </div>
                  <div >
                     Edited: {row.edited}
                  </div>
                </div>
                <div style={{ cursor: 'pointer' }}>
                </div>
              </div>
            </div>
          ))}
        {
          !data && <div >You don't have any passwords stored.</div>
        }
    </div>
  )
};

export default Data;

