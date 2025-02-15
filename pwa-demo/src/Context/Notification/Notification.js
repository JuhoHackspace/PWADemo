import React from 'react';
import PropTypes from 'prop-types';
const Notification = ({ message, type }) => {
  return (
    <div className={`inner-05em notification ${type}`}>
      {message}
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']).isRequired,
};

export default Notification;