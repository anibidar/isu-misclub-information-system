import React from 'react';
import { connect } from 'react-redux';
import AdminTools from './pages/AdminTools';
import AttendanceReport from './pages/AttendanceReport';
import CreateEvent from './pages/CreateEvent';
import EventCheckIn from './pages/EventCheckIn';
import GraphsTrends from './pages/GraphsTrends';
import Help from './pages/Help';
import NavPanel from './navigation/NavPanel';

class MISClubPage extends React.Component {

	render() {
		return (
			<div className='pane-group'>
				<NavPanel/>
				{this._renderActiveView()}
			</div>
		);
	}

	_renderActiveView() {
		return {
			'create-event': <CreateEvent/>,
			'event-check-in': <EventCheckIn/>,
			'attendance-report': <AttendanceReport/>,
			'graphs-trends': <GraphsTrends/>,
			'admin-tools': <AdminTools/>,
			'help': <Help/>
		}[this.props.view];
	}
}

const mapStateToProps = state => ({
	view: state.navigation.view
});

export default connect(mapStateToProps)(MISClubPage);