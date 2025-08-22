import React from 'react';
import SaveIcon from '/public/icons/save.svg';
//import {dataApi} from '../api/data';
//import styles from './rowAdd.scss';

export default function RowAdd({user, setData, closeModal}: {user: string; setData: any, closeModal: any}) {
  const [isPending, setIsPending] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [isSubmitting, isSubmitting] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    id: '',
    email: '',
    username: '',
    password: '',
    notes: '',
    errors: {
      id: '',
      email: '',
      username: '',
      password: '',
      notes: '',
    },
  });

  // send data to backend
  const handleSubmit = async (formData: FormData) => {
    setLoginError(null);
    setIsPending(true);

    try {
      //const res = dataApi.getAll();

      //if (!res.success) {
      //  console.error('Failed to save changes:', res.message);
      //  return;
      //}
    //  setData(res.data);
      //closeModal();
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <form>

        <div>
          <label>Email</label>
          <input type="text" name="email" autoFocus={true} />
          <div>
            {formData.errors.email && (
              <p style={{ color: "red" }}>{formData.errors.username}</p>
            )}
          </div>
        </div>

        <div>
          <label>Username</label>
          <input type="text" name="username" />
          <div>
            {formData.errors.username && (
              <p style={{ color: "red" }}>{formData.errors.username}</p>
            )}
          </div>
        </div>

        <div>
          <label>Password</label>
          <input type="text" name="password" />
          <div>
            {formData.errors.password && (
              <p style={{ color: "red" }}>{formData.errors.username}</p>
            )}
          </div>
        </div>

        <div>
          <label>Notes</label>
          <input type="text" name="notes"/>
          <div>
            {formData.errors.notes && (
              <p style={{ color: "red" }}>{formData.errors.username}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
        >
          <SaveIcon color="#FFFFFF" />
          <div>
            {isPending ? 'Saving...' : 'Save'}
          </div>
        </button>



        {loginError && (
          <div>
            {loginError}
          </div>
        )}

      </form>
    </div>
  );
}


