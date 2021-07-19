import './App.css';
// import { useState } from 'react';
import 'bootswatch/dist/darkly/bootstrap.min.css';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Button, Container, Navbar } from 'react-bootstrap';
import StartMenu from './containers/StartMenu';
import Reviewer from './containers/Reviewer';
import Configure from './containers/Configure';
import InfoPopUp from './components/InfoPopup';
import React, { useState } from 'react';

require('dotenv').config();

const App = () => {
	const [config, setConfig] = useState('');
	const [showInfo, setShowInfo] = useState(false);

	return (
		<div className='App'>
			<InfoPopUp
				version='2.0 alpha 2'
				show={showInfo}
				onHide={() => {
					setShowInfo(false);
				}}
			/>
			<Navbar bg='light' expand='lg' fixed='top'>
				<Navbar.Brand href='/start'>👓 Sheet Reviewer 2 </Navbar.Brand>
				<Navbar.Collapse className='justify-content-end navbar-buttons'>
					<Button variant='light' onClick={() => setShowInfo(true)}>
						About
					</Button>
				</Navbar.Collapse>
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
