import React from 'react';
import PropTypes from 'prop-types';
import { onlyUpdateForKeys } from 'recompose';

const ActionPicker = onlyUpdateForKeys(['pickedActionValue', 'inProgress'])(({ actions, pickedActionValue, handlePickedAction, inProgress, className }) => {

  return (
    <div className={'action-picker' + (className ? ' ' + className : '')}>
      {actions.map((action, i) =>
        <span key={action.value}>
          <a className={resolveLinkClass(action.value, pickedActionValue, inProgress)}
            onClick={(event) => { event.preventDefault(); if (!inProgress) { handlePickedAction(event, action.value); } }}>
            {action.label}
          </a>
          {actions.length !== i + 1 ? ' | ' : null}
        </span>
      )}
    </div>
  );

});

ActionPicker.propTypes = {
  actions: PropTypes.array.isRequired,
  pickedActionValue: PropTypes.string.isRequired,
  handlePickedAction: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

export default ActionPicker;

function resolveLinkClass(currentActionValue, pickedActionValue, inProgress) {
  let className = '';
  className += currentActionValue === pickedActionValue ? 'action-picker__link--selected' : 'action-picker__link--idle';
  className += ' ';
  className += inProgress ? 'action-picker__link--disabled' : 'action-picker__link--enabled';
  return className;
}
