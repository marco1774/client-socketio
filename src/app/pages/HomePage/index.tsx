import React from 'react';
import { InputRt } from 'app/components/InputRt';
import { useSelector } from 'react-redux';
import { useLoginSlice } from '../Login/slice';
import { selectNomeUtente } from '../Login/slice/selectors';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';

interface Props {
  socket: any;
}

export function HomePage(props: Props) {
  const { socket } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [coloreValue, setColoreValue] = React.useState('');
  const [cittaUtenteValue, setCittaUtenteValue] = React.useState('');

  const [risposta, setRisposta] = React.useState({
    cittaUtenteValue: '',
    coloreValue: '',
  });
  const loginAction = useLoginSlice();
  const nomeUtente = useSelector(selectNomeUtente);

  function submit(e) {
    e.preventDefault();
    console.log(coloreValue, cittaUtenteValue);
    setRisposta({ coloreValue, cittaUtenteValue });
  }

  const [disableInput, setDisableInput] = React.useState({
    disable: false,
    name: '',
  });
  const [utenteFocusField, setUtenteFocusField] = React.useState({
    name: '',
    utente: '',
  });

  React.useEffect(() => {
    socket.on('connect', () => {
      console.log('Server connected: ', socket.id);
      console.log('socket connected: ', socket.id);
    });
    socket.on('ricevo-value', (value, name, utente) => {
      console.log('ricevo-value', value, name, utente);
      if (name === 'cittaUtente') setCittaUtenteValue(value);
      if (name === 'colore') setColoreValue(value);
    });
    socket.on('ricevo-focusInput', (data, name, utente) => {
      console.log('ricevo-focusInput', data, name, utente);
      setDisableInput({ disable: data, name });
      setUtenteFocusField({ utente, name });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('prova');
      socket.off('input');
      socket.off('focusInput');
      socket.off('ricevo-value');
      socket.off('ricevo-focusInput');
    };
  }, []);

  return (
    <>
      <Link to="/schede_articoli">SCHEDE ARTICOLI</Link>

      <div className={styles.container}>
        <p style={{ color: 'white' }}>Inserisci info...</p>
        <form onSubmit={e => submit(e)}>
          <Article
            nomeUtente={nomeUtente}
            coloreValue={coloreValue}
            setColoreValue={setColoreValue}
            disableInput={disableInput}
            setUtenteFocusField={setUtenteFocusField}
            utenteFocusField={utenteFocusField}
            cittaUtenteValue={cittaUtenteValue}
            setCittaUtenteValue={setCittaUtenteValue}
            socket={socket}
          />
          <input type="submit" value="invia" />
        </form>
        {risposta && (
          <div>
            <p style={{ color: 'white' }}>RISPOSTA:</p>
            <p style={{ color: 'white' }}>{risposta.coloreValue}</p>
            <p style={{ color: 'white' }}>{risposta.cittaUtenteValue}</p>
          </div>
        )}
      </div>
    </>
  );
}

function Article({
  nomeUtente,
  coloreValue,
  setColoreValue,
  disableInput,
  setUtenteFocusField,
  utenteFocusField,
  cittaUtenteValue,
  setCittaUtenteValue,
  socket,
}) {
  return (
    <>
      <InputRt
        utente={nomeUtente}
        value={coloreValue}
        setValue={setColoreValue}
        socket={socket}
        inputName="colore"
        inputPlaceHolder={'scrivi colore'}
        disableInput={disableInput}
        setUtenteFocusField={setUtenteFocusField}
        utenteFocusField={utenteFocusField}
      />
      <InputRt
        utente={nomeUtente}
        value={cittaUtenteValue}
        setValue={setCittaUtenteValue}
        socket={socket}
        inputName="cittaUtente"
        inputPlaceHolder={'scrivi città utente'}
        disableInput={disableInput}
        setUtenteFocusField={setUtenteFocusField}
        utenteFocusField={utenteFocusField}
      />
    </>
  );
}
