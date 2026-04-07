import {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {getNotifications, getNotificationsCount, marquerNotificationLue, marquerToutesNotificationsLues} from '../api';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [nonLues, setNonLues] = useState(0);
  const [loading, setLoading] = useState(true);

  const charger = async () => {
    try {
      setLoading(true);
      const [notifs, count] = await Promise.all([
        getNotifications(),
        getNotificationsCount(),
      ]);
      setNotifications(notifs);
      setNonLues(count.total);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const chargerCount = async () => {
    try {
      const count = await getNotificationsCount();
      setNonLues(count.total);
    } catch {
      // ignore
    }
  };

  useFocusEffect(
    useCallback(() => {
      charger();
    }, []),
  );

  const marquerLue = async id => {
    try {
      await marquerNotificationLue(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? {...n, lue: true} : n)),
      );
      setNonLues(prev => Math.max(0, prev - 1));
    } catch {
      // ignore
    }
  };

  const toutMarquerLu = async () => {
    try {
      await marquerToutesNotificationsLues();
      setNotifications(prev => prev.map(n => ({...n, lue: true})));
      setNonLues(0);
    } catch {
      // ignore
    }
  };

  return {notifications, nonLues, loading, charger, chargerCount, marquerLue, toutMarquerLu};
};

export default useNotifications;
