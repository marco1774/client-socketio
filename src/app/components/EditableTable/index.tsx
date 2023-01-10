/**
 *
 * EditableTable
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTable } from 'react-table';

interface Props {
  columns: any;
  data: any;
  updateMyData: any;
  skipPageReset: any;
  artId: any;
  socket: any;
  nomeUtente: any;
  focusEvent: any;
  coloreUtente: any;
}

// Create an editable cell renderer
const EditableCell = props => {
  const {
    value: initialValue,
    row: { index: row },
    column: { id: column },
    updateMyData, // This is a custom function that we supplied to our table instance
    artId,
    socket,
    nomeUtente,
    coloreUtente,
  } = props;
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = e => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    console.log('onBlur');
    socket.emit('blurInput', nomeUtente);
    updateMyData(row, column, value, artId);
  };

  const onFocus = () => {
    console.log('onFocus');
    socket.emit('focusInput', column, row, artId, coloreUtente, nomeUtente);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  //rende non editabile la colonna tipo
  if (column === 'tipo') return value;

  return (
    <input
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
};

export function EditableTable(props: Props) {
  const {
    columns,
    data,
    updateMyData,
    skipPageReset,
    artId,
    socket,
    nomeUtente,
    focusEvent,
    coloreUtente,
  } = props;
  console.log('%cRENDER', 'color:red', focusEvent);
  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: EditableCell,
  };
  const ogt = useTable(
    {
      columns,
      data,
      defaultColumn,
      // use the skipPageReset option to disable page resetting temporarily
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      artId,
      socket,
      nomeUtente,
      coloreUtente,
    },
    /*    usePagination */
  );
  // console.log('🚀 ~ file: index.tsx:104 ~ ogt', ogt);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    ogt;

  return (
    <Styles>
      <>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    const res = focusEvent.filter(art => {
                      return (
                        art.artId === artId &&
                        art.column.toString() === cell.column.id &&
                        art.row.toString() === cell.row.id
                      );
                    })[0];
                    console.log('🚀 ~ file: index.tsx:141 ~ res ~ res', res);
                    return (
                      <td
                        style={
                          res &&
                          artId === res.artId &&
                          cell.column.id === res.column.toString() &&
                          cell.row.id === res.row.toString()
                            ? {
                                outlineWidth: '3px',
                                outlineOffset: '-3px',
                                outlineStyle: 'solid',
                                outlineColor: [res.coloreUtente],
                                position: 'relative',
                              }
                            : {}
                        }
                        {...cell.getCellProps()}
                      >
                        {res &&
                          artId === res.artId &&
                          cell.column.id === res.column.toString() &&
                          cell.row.id === res.row.toString() && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '-21px',
                                left: '0',
                                color: res.coloreUtente,
                                fontWeight: 'bold',
                                padding: '0 2px',
                              }}
                            >
                              {res.nome}
                            </div>
                          )}
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    </Styles>
  );
}

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    // tr {
    //   :last-child {
    //     td {
    //       border-bottom: 0;
    //     }
    //   }
    // }
    tr td:nth-child(even) {
      background-color: #cecece;
    }

    th,
    td:nth-child(even) {
      margin: 0;
      padding: 0.25rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }

      input {
        width: 60px;
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
        background-color: #cecece;
      }
    }
    th,
    td:nth-child(odd) {
      margin: 0;
      padding: 0.25rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }

      input {
        width: 60px;
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
        background-color: #fff;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;
