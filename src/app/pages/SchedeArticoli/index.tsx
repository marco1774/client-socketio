/**
 *
 * SchedeArticoli
 *
 */
import * as React from 'react';
import { Link } from 'react-router-dom';

interface Props {}

export function SchedeArticoli(props: Props) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <h1>VISUALIZZAZIONE SCHEDE ARTICOLI</h1>
      <Link to="/dettaglio_articoli">DETTAGLIO ARTICOLI</Link>
    </div>
  );
}
