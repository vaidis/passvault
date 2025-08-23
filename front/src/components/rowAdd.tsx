import React from 'react';
import './rowAdd.scss';

export default function RowAdd({user, setData, closeModal}: {user: string; setData: any, closeModal: any}) {
  const [isPending, setIsPending] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  // const initialValues = {
  //   title: '',
  //   username: '',
  //   password: '',
  //   notes: '',
  // };

  // send data to backend
  const handleSubmit = async (formData: FormData) => {
    setLoginError(null);
    setIsPending(true);

    try {
      const res = await apiFetchWithRefresh(URL, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      if (!res.success) {
        console.error('Failed to save changes:', res.message);
        return;
      }
      setData(res.data);
      closeModal();
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
          <Form className={'form'}>

            <div className={'formGroup'}>
              <label>Title</label>
              <input type="text" name="title" className={'input'} autoFocus={true} />
              <div className={'error'}>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
              </div>
            </div>

            <div className={'formGroup'}>
              <label>Username</label>
              <input type="text" name="username" className={'input'} />
              <div className={'error'}>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
              </div>
            </div>

            <div className={'formGroup'}>
              <label>Password</label>
              <input type="text" name="password" className={'input'} />
              <div className={'error'}>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
              </div>
            </div>

            <div className={'formGroup'}>
              <label>Notes</label>
              <input type="text" name="notes" className={'input'} />
              <div className={'error'}>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={'button'}
            >
              <div className={'buttonLabel'}>
                {isPending ? 'Saving...' : 'Save'}
              </div>
            </button>

            {loginError && (
              <div className={'error'}>
                {loginError}
              </div>
            )}

          </Form>
    </div>
  );
}


