import React from 'react';
import { Column, Table } from '../common/index';

export default class LookupResults extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			eventsTable: this._populateEventsTable(props.events)
		};
		this._handleRowClick = this._handleRowClick.bind(this);
	}

	render() {
		const {eventsTable} = this.state;
		return (
			<Column title='Results' style={{paddingLeft:'40px'}}>
				<p>{Boolean(eventsTable) ?
					'Click an event to view attendance' :
					'Search for an event using the Lookup button on the left.'
				}</p>
				{Boolean(eventsTable) &&
					<Table id='lookup-results' style={{marginTop:'20px', maxHeight:'40vh', overflow:'scroll'}}>
						<thead>
							<tr>
								<th>Name</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody onClick={this._handleRowClick}>
							{eventsTable}
						</tbody>
					</Table>
				}
			</Column>
		);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.events !== this.props.events) {
			this.setState({eventsTable: this._populateEventsTable(nextProps.events)});
		}
	}

	_populateEventsTable(events) {
		return events && events.length ? events.map(event => (
			<tr id={event.event_id} key={event.event_id}>
				<td className='event-name'>{event.event_name}</td>
				<td className='event-date'>{event.event_date}</td>
			</tr>
		)) : null;
	}

	_handleRowClick({target}) {
		let rowEl;
		if (target.nodeName === 'TR') {
			rowEl = target;
		} else {
			rowEl = target.parentNode;
		}
		const eventId = rowEl.id;
		const eventName = rowEl.querySelector('.event-name');
		const eventDate = rowEl.querySelector('.event-date');
		if (eventId && eventName && eventDate) {
			this.props.onEventSelected({
				eventId,
				eventName: eventName.innerHTML,
				eventDate: eventDate.innerHTML
			});
		}
	}
}