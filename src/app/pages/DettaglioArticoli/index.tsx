/**
 *
 * DettaglioArticoli
 *
 */
import { EditableTable } from 'app/components/EditableTable';
import { debug } from 'console';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLoginSlice } from '../Login/slice';
import { selectNomeUtente } from '../Login/slice/selectors';
import articoli from './dataListaArt.json';

interface Props {
  socket: any;
}

export function DettaglioArticoli(props: Props) {
  const { socket } = props;
  const [data, setData] = React.useState(articoli);
  const [originalData] = React.useState(data);
  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const loginAction = useLoginSlice();
  const nomeUtente = useSelector(selectNomeUtente);
  const [focusEvent, setFocusEvent] = React.useState<any>([]);
  const [coloreUtente, setColoreUtente] = React.useState('');

  /*  let focusEvent = [
    { nome: 'iPhone ', column: '31-1', row: 2, artId: 10 },
    { nome: 'iPhone ', column: '15-2', row: 1, artId: 10 },
    { nome: 'iPhone ', column: '15-2', row: 0, artId: 10 },
  ]; */

  const updateMyData = (rowIndex, columnId, value, artId) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setData((old: any) => {
      const currentArticle = old.find(art => art.id === artId);
      const update = currentArticle!.dati.map((row, i) => {
        if (i === rowIndex) {
          return { ...row, [columnId]: parseInt(value, 10) };
        }
        return row;
      });

      const result = { ...currentArticle, dati: update };

      return old.map(e => {
        if (e.id === artId) {
          return result;
        }
        return e;
      });
    });
  };

  React.useEffect(() => {
    socket.on('connect', () => {
      console.log('Server connected: ', socket.id);
    });
    socket.emit('nomeUtente', nomeUtente);
    socket.on('mandaColoreUtente', colore => {
      console.log('mandaColoreUtente', colore);
      setColoreUtente(colore.colore);
    });

    socket.on('ricevo-value', nomeUtente => {
      console.log('ricevo-value', nomeUtente);
      setFocusEvent(prev => {
        return prev.filter(e => e.nome !== nomeUtente);
      });
    });

    socket.on(
      'ricevo-focusInput',
      (column, row, artId, coloreUtente, nomeUtente) => {
        console.log(
          'ricevo-focusInput',
          'column',
          column,
          'row',
          row,
          'artId',
          artId,
          'nomeUtente',
          nomeUtente,
          'coloreUtente',
          coloreUtente,
        );
        setFocusEvent(prev => {
          if (prev.some(e => e.nome === nomeUtente)) {
            prev.filter(e => e.nome !== nomeUtente);
            return [
              ...prev,
              { nome: nomeUtente, column, row, artId, coloreUtente },
            ];
          } else {
            return [
              ...prev,
              { nome: nomeUtente, column, row, artId, coloreUtente },
            ];
          }
        });
      },
    );

    return () => {
      socket.on('disconnect', () => {
        socket.emit('utenteDisconnesso', nomeUtente);
      });

      // socket.off('connect');
      // socket.off('disconnect');
      // socket.off('prova');
      // socket.off('blurInput');
      // socket.off('focusInput');
      // socket.off('ricevo-value');
      // socket.off('ricevo-focusInput');
      // socket.off('utente_connesso');
      socket.removeAllListeners();
    };
  }, []);

  // const listColunm = {};
  // data.forEach(art => {
  //   return (listColunm[art.id] = art.colonne.map(e => {
  //     return {
  //       Header: e,
  //       accessor: e,
  //     };
  //   }));
  // });

  let listColumn = data.reduce((acc, art) => {
    acc[art.id] = [...art.colonne.map(e => ({ Header: e, accessor: e }))];

    return acc;
  }, {});

  return (
    <div style={{ backgroundColor: 'white' }}>
      <div>
        <h1>Dettaglio articoli</h1>
        <Link to="/schede_articoli">SCHEDE ARTICOLI</Link>
      </div>
      <div>
        {data.map((art, i) => {
          // const columns = art.colonne.map(e => {
          //   return {
          //     Header: e,
          //     accessor: e,
          //   };
          // });

          return (
            <div style={{ display: 'flex', width: '100%' }}>
              <div style={{ width: '10%' }}>{art.nomeArt}</div>
              <div style={{ width: '80%' }}>
                <EditableTable
                  artId={art.id}
                  columns={listColumn[+art.id]}
                  data={art.dati}
                  updateMyData={updateMyData}
                  skipPageReset={skipPageReset}
                  socket={socket}
                  nomeUtente={nomeUtente}
                  focusEvent={focusEvent}
                  coloreUtente={coloreUtente}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
