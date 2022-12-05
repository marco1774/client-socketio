import React from 'react';
import { InputRt } from 'app/components/InputRt';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useLoginSlice } from '../Login/slice';
import { selectNomeUtente } from '../Login/slice/selectors';
import styles from './styles.module.scss';

interface Props {}
const socket = io('https://real-time-try.onrender.com');

export function HomePage(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [nomeUtenteValue, setNomeUtenteValue] = React.useState('');
  const [cittaUtenteValue, setCittaUtenteValue] = React.useState('');
  const [risposta, setRisposta] = React.useState({
    cittaUtenteValue: '',
    nomeUtenteValue: '',
  });
  const loginAction = useLoginSlice();
  const nomeUtente = useSelector(selectNomeUtente);

  function submit(e) {
    e.preventDefault();
    console.log(nomeUtenteValue, cittaUtenteValue);
    setRisposta({ nomeUtenteValue, cittaUtenteValue });
  }
  return (
    <>
      <div className={styles.container}>
        <p style={{ color: 'white' }}>Inserisci info...</p>
        <form onSubmit={e => submit(e)}>
          <InputRt
            utente={nomeUtente}
            value={nomeUtenteValue}
            setValue={setNomeUtenteValue}
            socket={socket}
            inputName={'nomeUtente'}
            inputPlaceHolder={'scrivi nome utente'}
          />
          <InputRt
            utente={nomeUtente}
            value={cittaUtenteValue}
            setValue={setCittaUtenteValue}
            socket={socket}
            inputName={'cittaUtente'}
            inputPlaceHolder={'scrivi città utente'}
          />
          <input type="submit" value="invia" />
        </form>
        {risposta && (
          <div>
            <p style={{ color: 'white' }}>RISPOSTA:</p>
            <p style={{ color: 'white' }}>{risposta.nomeUtenteValue}</p>
            <p style={{ color: 'white' }}>{risposta.cittaUtenteValue}</p>
          </div>
        )}
      </div>
    </>
  );
}
