/**
 *
 * DettaglioArticoli
 *
 */
import { EditableTable } from 'app/components/EditableTable';
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
    socket.on('ricevo-value', (value, name, utente) => {
      console.log('ricevo-value', value, name, utente);
    });
    socket.on('ricevo-focusInput', (column, row, artId, nomeUtente) => {
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
      );
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('prova');
      socket.off('blurInput');
      socket.off('focusInput');
      socket.off('ricevo-value');
      socket.off('ricevo-focusInput');
    };
  }, []);

  return (
    <div style={{ backgroundColor: 'white' }}>
      <div>
        <h1>Dettaglio articoli</h1>
        <Link to="/schede_articoli">SCHEDE ARTICOLI</Link>
      </div>
      <div>
        {data.map((art, i) => {
          const columns = art.colonne.map(e => {
            return {
              Header: e,
              accessor: e,
            };
          });
          return (
            <div style={{ display: 'flex', width: '100%' }}>
              <div style={{ width: '10%' }}>{art.nomeArt}</div>
              <div style={{ width: '80%' }}>
                <EditableTable
                  artId={art.id}
                  columns={columns}
                  data={art.dati}
                  updateMyData={updateMyData}
                  skipPageReset={skipPageReset}
                  socket={socket}
                  nomeUtente={nomeUtente}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
