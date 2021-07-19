import './App.css';
// import { useState } from 'react';
import 'bootswatch/dist/darkly/bootstrap.min.css';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';
import StartMenu from './containers/StartMenu';
import Reviewer from './containers/Reviewer';
import Configure from './containers/Configure';
import React, { useState } from 'react';

require('dotenv').config();

const App = () => {
	const [config, setConfig] = useState('');
	return (
		<div className='App'>
			<Navbar bg='light' expand='lg'>
				<Navbar.Brand href='/start'>
					👓 Sheet Reviewer 2.0{' '}
				</Navbar.Brand>
			</Navbar>
			<Container className='App-body'>
				<Switch>
					<Route exact path='/'>
						<Redirect to='/start' />
					</Route>
					<Route path='/start'>
						<StartMenu config={config} setConfig={setConfig} />
					</Route>
					<Route path='/reviewer' x>
						<Reviewer config={config} />
					</Route>
					<Route path='/configure'>
						<Configure />
					</Route>
				</Switch>
			</Container>
		</div>
	);
};

export default App;
