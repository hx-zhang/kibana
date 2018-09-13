import { applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { getWindow } from '../../lib/get_window';
import { aeroelastic } from './aeroelastic';
import { esPersistMiddleware } from './es_persist';
import { fullscreen } from './fullscreen';
import { historyMiddleware } from './history';
import { inFlight } from './in_flight';
import { workpadUpdate } from './workpad_update';
import { workpadRefresh } from './workpad_refresh';
import { appReady } from './app_ready';

const middlewares = [
  applyMiddleware(
    thunkMiddleware,
    esPersistMiddleware,
    historyMiddleware,
    aeroelastic,
    fullscreen,
    inFlight,
    appReady,
    workpadUpdate,
    workpadRefresh
  ),
];

// intitialize redux devtools if extension is installed
if (getWindow().__REDUX_DEVTOOLS_EXTENSION__)
  middlewares.push(getWindow().__REDUX_DEVTOOLS_EXTENSION__());

export const middleware = compose(...middlewares);
