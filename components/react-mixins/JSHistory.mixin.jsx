/** @jsx React.DOM */

var HistoryJSMixin = {
  _historyjs_recoverState: function(state) {
    received_state_serialized = state.data;
    if (!$.isEmptyObject(received_state_serialized)) {
      if (this.deserializeState !== undefined) {
        received_state = this.deserializeState(received_state_serialized);
      }
      else {
        received_state = received_state_serialized;
      }

      if (this.serializeState !== undefined) {
        current_state_serialized = this.serializeState();
      }
      else {
        current_state_serialized = JSON.stringify(this.state);
      }

      // look through the received state to see if there are any changes
      // relative to the state we are currently in
      combined_state = $.extend({}, this.state, received_state);
      update_state = !(JSON.stringify(current_state_serialized) === JSON.stringify(received_state_serialized));

      var callback_f = function() {};
      if (this.hasRecoveredState !== undefined) {
        callback_f = this.hasRecoveredState;
      }

      if (update_state) {
        if (this.recoverState !== undefined) {
          this.recoverState(combined_state, callback_f);
        }
        else {
          this.setState(combined_state, callback_f);
        }
      }
    }
  },
  saveState: function() {
    var serialized_state = null;
    if (this.serializeState !== undefined) {
      serialized_state = this.serializeState();
    }
    else {
      serialized_state = {};
      $.each(this.state, function(k,v) {
        if (k != '_historyjs_has_saved') {
          serialized_state[k] = String(v);
        }
      });
    }

    if (!this.state._historyjs_has_saved) {
      this.setState({ _historyjs_has_saved: true }, function() {
        History.replaceState(serialized_state);
      });
    }
    else {
      History.pushState(serialized_state);
    }
  },
  bindToBrowserHistory: function() {
    History.Adapter.bind(window,'statechange',function(){
      this._historyjs_recoverState(History.getState());
    }.bind(this));
    this._historyjs_recoverState(History.getState());
  },
  getInitialState: function() {
    return { _historyjs_has_saved: false };
  },
  patchSavedState: function(data, callback) {
    var old_state = History.getState();
    $.extend(old_state.data, data);
    History.replaceState(old_state.data);
    if (callback !== undefined) {
      callback();
    }
  },
};
