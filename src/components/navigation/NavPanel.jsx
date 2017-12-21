import React from 'react';
import Radium, {Style} from 'radium';
import NavLink from './NavLink';
import {NavCss} from '../../style/Nav.css.js';

class NavPanel extends React.Component {

	render() {
		return (
			<div className='tabs'>
				<Style rules={NavCss}/>
				<ul>
					<NavLink id='events' icon='fa fa-calendar-plus-o'>Events</NavLink>
					<NavLink id='event-check-in' icon='fa fa-user-o'>Check-In</NavLink>
					<NavLink id='attendance-report' icon='fa fa-file-text-o'>Report</NavLink>
					<NavLink id='graphs-trends' icon='fa fa-bar-chart'>Graphs</NavLink>
					<NavLink id='admin-tools' icon='fa fa-cog'>Admin</NavLink>
					<NavLink id='help' icon='fa fa-info-circle'>Help</NavLink>
				</ul>
			</div>
		);
	}
}

export default Radium(NavPanel);