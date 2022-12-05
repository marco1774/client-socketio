/**
 *
 * Login
 *
 */
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useLoginSlice } from './slice';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';

interface Props {}

export function Login(props: Props) {
  const [inputValue, setInputValue] = React.useState('');

  const { actions } = useLoginSlice();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <form>
        <p>Welcome</p>
        <input
          type="text"
          id="nome"
          placeholder="NOME..."
          onChange={e => setInputValue(e.target.value)}
        />
        <button
          className={styles.btn}
          type="button"
          onClick={() => {
            if (!inputValue) return null;
            dispatch(actions.setNomeUtente(inputValue));
            navigate('/homepage');
          }}
        >
          Invia
        </button>
      </form>

      <div className={styles.drops}>
        <div className={`${styles.drop} ${styles.dropa}`}></div>
        <div className={`${styles.drop} ${styles.dropb}`}></div>
        <div className={`${styles.drop} ${styles.dropc}`}></div>
        <div className={`${styles.drop} ${styles.dropd}`}></div>
        <div className={`${styles.drop} ${styles.drope}`}></div>
      </div>
    </div>
  );
}

{
  /* <div>
        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          id="nome"
          onChange={e => setInputValue(e.target.value)}
        />
        <button
          onClick={() => {
            if (!inputValue) return null;
            dispatch(actions.setNomeUtente(inputValue));
            navigate('/homepage');
          }}
        >
          Invia
        </button>
      </div> */
}
