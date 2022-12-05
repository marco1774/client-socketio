/**
 *
 * InputRt
 *
 */
import * as React from 'react';

interface Props {
  socket: any;
  inputName: string;
  inputPlaceHolder: string;
  utente: string;
}

export function InputRt(props: Props) {
  const { socket, inputName, inputPlaceHolder, utente } = props;
  const [value, setValue] = React.useState('');
  const [disableInput, setDisableInput] = React.useState({
    disable: false,
    name: '',
  });
  const [utenteFocusField, setUtenteFocusField] = React.useState({
    name: '',
    utente: '',
  });

  const refInput = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    socket.on('connect', () => {
      console.log('Server connected: ', socket.id);
    });
    socket.emit('prova', 'questa è una prova dal client!!!!');
    socket.on('ricevo-value', (value, name, utente) => {
      console.log(value, name, utente);
      if (name === inputName) setValue(value);
    });
    socket.on('ricevo-focusInput', (data, name, utente) => {
      console.log(data, name, utente);
      setDisableInput({ disable: data, name });
      setUtenteFocusField({ utente, name });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('prova');
      socket.off('input');
      socket.off('focusInput');
    };
  }, []);
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      <input
        ref={refInput}
        type="text"
        name={inputName}
        placeholder={inputPlaceHolder}
        value={value}
        disabled={
          disableInput.name === inputName ? disableInput.disable : false
        }
        onChange={e => {
          setValue(e.target.value);
        }}
        onFocus={e => {
          socket.emit('focusInput', true, e.target.name, utente);
        }}
        onBlur={e => {
          socket.emit('input', e.target.value, e.target.name, '');
          socket.emit('focusInput', false, e.target.name, '');
          setUtenteFocusField({
            name: '',
            utente: '',
          });
        }}
        style={
          utenteFocusField.name === inputName && utenteFocusField.utente
            ? { outline: '2px solid red', outlineOffset: '1px' }
            : {}
        }
      />
      {utenteFocusField.name === inputName && utenteFocusField.utente ? (
        <p
          style={{
            color: 'white',
            backgroundColor: 'red',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            paddingLeft: '4px',
            paddingRight: '4px',
            position: 'absolute',
            top: '-24px',
            left: '24px',
            fontSize: '14px',
          }}
        >
          {utenteFocusField.utente}
        </p>
      ) : (
        ''
      )}
    </div>
  );
}
