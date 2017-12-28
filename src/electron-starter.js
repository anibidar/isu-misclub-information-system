const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron'),
	{ default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer'),
	csv = require('fast-csv'),
	mysqlDump = require('mysqldump'),
	path = require('path'),
	url = require('url'),
	mysql = new (require('./sql/mysqlManager'))(),
	logger = new (require('./utils/logger'))(),
	sqlActions = require('./actions/sqlActions').sqlActions(mysql, logger),
	{ requestDirectoryInfo } = require('./utils/isuDirectoryLookup'),
	{ createMenuTemplate } = require('./static/MenuTemplate'),
	{ ipcGeneral, ipcMysql } = require('./actions/ipcActions');

require('hazardous');

let mainWindow, devToolsEnabled = true;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		show: false, width: 600, height: 600, minWidth: 600, minHeight: 600, resizable: true, title: 'ISU MIS Club Check-In'
	});

	const startUrl = process.env.ELECTRON_START_URL || url.format({
		pathname: path.join(__dirname, '/../build/index.html'),
		protocol: 'file:',
		slashes: true
	});
	mainWindow.loadURL(startUrl);

	installExtension(REACT_DEVELOPER_TOOLS)
		.then((name) => logger.debug(`Added Extension:  ${name}`))
		.catch((err) => logger.error('An error occurred: ', err));

	installExtension(REDUX_DEVTOOLS)
		.then((name) => logger.debug(`Added Extension:  ${name}`))
		.catch((err) => logger.error('An error occurred: ', err));

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		mainWindow.center();
		mainWindow.focus();
	});

	mainWindow.webContents.on('devtools-opened', () => {
		if (!devToolsEnabled) {
			mainWindow.webContents.closeDevTools();
		}
	});
};

app.on('ready', () => {
	process.on('uncaughtException', error => {
		logger.error(error);
		app.quit();
	});
	const menu = Menu.buildFromTemplate(createMenuTemplate(app.getName(), shell));
	Menu.setApplicationMenu(menu);

	mysql.sqlQueryHandler().then(() => {
		createWindow();
		logger.debug('Connected to database successfully');
	}).catch(error => {
		logger.error(error, 'Error connecting to database. Please ensure you have an internet connection and are ' +
			'connected to the ISU Network. VPN is needed if connecting from off-campus.', true);
		app.quit();
	});

	ipcMain.on(ipcMysql.EXECUTE_SQL, async (event, action, ipcArgs) => {
		let results;
		try {
			results = await retrieveSqlData(action, ipcArgs);
		} catch (error) {
			logger.error(error, `Error retrieving SQL data for action: ${action} with arguments: ${ipcArgs}`);
		}
		if (action === ipcMysql.VERIFY_CREDENTIALS && results.hasOwnProperty('devToolsEnabled')) {
			devToolsEnabled = results.devToolsEnabled;
			delete results.devToolsEnabled;
		}
		mainWindow.webContents.send(action, results);
	});

	ipcMain.on(ipcGeneral.SET_WINDOW, (event, action) => {
		const size = mainWindow.getSize();
		if (action === ipcGeneral.LOGIN_WINDOW) {
			if (size[0] === 600 && size[1] === 600) {
				return;
			}
			mainWindow.hide();
			mainWindow.setSize(600, 600);
		} else if (action === ipcGeneral.MIS_CLUB_PAGE_WINDOW) {
			if (size[0] === 1200 && size[1] === 800) {
				return;
			}
			mainWindow.hide();
			mainWindow.setSize(1200, 800);
		}
		setTimeout(() => {
			mainWindow.show();
			mainWindow.center();
			mainWindow.focus();
		}, 1000);
	});

	ipcMain.on(ipcGeneral.REQUEST_DIRECTORY_INFO, async (event, action, ipcArgs) => {
		const {netid} = ipcArgs;
		let member;
		try {
			member = await requestDirectoryInfo(netid);
		} catch (error) {
			logger.error(error, `Error getting directory info for Net-ID: ${netid}`, true);
		}
		if (!member || !(member.first_name && member.last_name && member.classification && member.major)) {
			logger.error(null, `Incomplete data - ${member} - for member with Net-ID: ${netid}`);
		}
		mainWindow.webContents.send(ipcGeneral.REQUEST_DIRECTORY_INFO, member);
	});
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const retrieveSqlData = (action, ipcArgs) => {
	return sqlActions[action] ? sqlActions[action](ipcArgs) : sqlActions['default'](action);
};