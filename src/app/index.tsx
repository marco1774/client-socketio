/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { io } from 'socket.io-client';

import { GlobalStyle } from 'styles/global-styles';

// import { HomePage } from './pages/HomePage/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';
import { Login } from './pages/Login';
import { HomePage } from './pages/HomePage';
import { SchedeArticoli } from './pages/SchedeArticoli';
import { useSelector } from 'react-redux';
import { selectNomeUtente } from './pages/Login/slice/selectors';
import { useLoginSlice } from './pages/Login/slice';
import { DettaglioArticoli } from './pages/DettaglioArticoli';

// const socket = io('https://real-time-try.onrender.com');
const socket = io('http://localhost:7766');

export function App() {
  // const { i18n } = useTranslation();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<HomePage socket={socket} />} />
        <Route path="/schede_articoli" element={<SchedeArticoli />} />
        <Route
          path="/dettaglio_articoli"
          element={<DettaglioArticoli socket={socket} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <GlobalStyle />
    </BrowserRouter>
  );
}
