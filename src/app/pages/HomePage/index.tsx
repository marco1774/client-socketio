import React from 'react';
import { InputRt } from 'app/components/InputRt';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useLoginSlice } from '../Login/slice';
import { selectNomeUtente } from '../Login/slice/selectors';
import styles from './styles.module.scss';

interface Props {}
const socket = io('http://localhost:7766');

export function HomePage(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loginAction = useLoginSlice();
  const nomeUtente = useSelector(selectNomeUtente);
  return (
    <div className={styles.container}>
      <form>
        <p>Inserisci info...</p>
        <InputRt
          utente={nomeUtente}
          socket={socket}
          inputName={'nomeUtente'}
          inputPlaceHolder={'scrivi nome utente'}
        />
        <InputRt
          utente={nomeUtente}
          socket={socket}
          inputName={'cittaUtente'}
          inputPlaceHolder={'scrivi città utente'}
        />
      </form>
    </div>
  );
}
