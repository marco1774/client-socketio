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
  value: string;
  setValue: (value) => void;
  setUtenteFocusField: (a) => void;
  disableInput: {
    disable: boolean;
    name: string;
  };
  utenteFocusField: {
    name: string;
    utente: string;
  };
}

export function InputRt(props: Props) {
  const {
    socket,
    inputName,
    inputPlaceHolder,
    utente,
    value,
    setValue,
    disableInput,
    setUtenteFocusField,
    utenteFocusField,
  } = props;

  // const [value, setValue] = React.useState('');

  // const refInput = React.useRef<HTMLInputElement>(null);
  // console.log('%cInputRt', 'color:purple', inputName);

  React.useEffect(() => {
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
        // ref={refInput}
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
