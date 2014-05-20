/** @jsx React.DOM */

var SampleView = React.createClass({
  render: function() {
    var buttons = [1,2,3,4].map(function(n) {
      if (this.state.current_selected_button == n) {
        btn_classes = 'btn btn-primary btn-lg';
      }
      else {
        btn_classes = 'btn btn-default btn-lg';
      }
      return <button onClick={this.handleButtonClick} value={n} className={btn_classes}>{n}</button>;
    }.bind(this))

    return (
      <div className='panel panel-default sample_view'>
        <div className='panel-heading'>
          Simple React component state serialization
        </div>
        <div className='panel-body'>
          <p>The selector below starts with no button selected, once the user
            has picked on the choice is inserted into the browser history.
          </p>
          <p>
            The user's choice is remembered on page reload and when navigating
            the browser history.
          </p>
          <div className='btn-group'>
            {buttons}
          </div>
        </div>
      </div>
    )
  },
  getInitialState: function() {
    return { current_selected_button: -1};
  },
  handleButtonClick: function(e) {
    this.setState({ current_selected_button: e.target.value }, this.saveState);
  },
  mixins: [HistoryJSMixin],
  componentDidMount: function() {
    this.bindToBrowserHistory();
    // If we uncomment the following line and thereby save the initial state
    // the view will always starts out with no selection
    // this.saveState();
  },
});


React.renderComponent(<SampleView />, document.getElementById('root_node'));
