import React from 'react';
import PropTypes from 'prop-types';
import Notification from './Notification';

const NotificationList = ({ notifications, isVisible }) => {
  return (
    <div className={`notification-list col center-all ${isVisible ? 'slide-in' : 'fade-out'}`}>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
        />
      ))}
    </div>
  );
};

NotificationList.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['info', 'success', 'warning', 'error']).isRequired,
    })
  ).isRequired,
};

export default NotificationList;