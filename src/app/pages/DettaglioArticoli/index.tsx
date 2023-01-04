/**
 *
 * DettaglioArticoli
 *
 */
import { EditableTable } from 'app/components/EditableTable';
import * as React from 'react';
import { Link } from 'react-router-dom';
import articoli from './dataListaArt.json';

interface Props {}

export function DettaglioArticoli(props: Props) {
  /*  const columns = [
    {
      Header: '15-1',
      accessor: '15-1',
    },
    {
      Header: '31-1',
      accessor: '31-1',
    },
    {
      Header: '15-2',
      accessor: '15-2',
    },
    {
      Header: '29-2',
      accessor: '29-2',
    },
    {
      Header: '15-3',
      accessor: '15-3',
    },
    {
      Header: '30-3',
      accessor: '30-3',
    },
  ];
 */
  const [data, setData] = React.useState(articoli);
  console.log('🚀 ~ file: index.tsx:46 ~ DettaglioArticoli ~ data', data);
  const [originalData] = React.useState(data);
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  const updateMyData = (rowIndex, columnId, value, artId) => {
    console.log(
      '🚀 ~ file: index.tsx:50 ~ updateMyData ~ rowIndex, columnId, value, artId',
      rowIndex,
      columnId,
      value,
      artId,
    );
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

  return (
    <>
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
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
