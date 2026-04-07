import React from 'react';
import {View, FlatList, Text, TouchableOpacity, StyleSheet} from 'react-native';
import useNotifications from '../hooks/useNotifications';
import {useNotificationContext} from '../contexts/NotificationContext';
import Chargement from '../components/Chargement';

const TYPE_ICONS = {
  creation: {icon: '+', color: '#e85d4a'},
  confirmation: {icon: '✓', color: '#2d6a6a'},
  annulation: {icon: '✕', color: '#e85d4a'},
};

const Notifications = () => {
  const {notifications, nonLues, loading, marquerLue, toutMarquerLu} = useNotifications();
  const {rafraichir} = useNotificationContext();

  const handleMarquerLue = async (id) => {
    await marquerLue(id);
    rafraichir();
  };

  const handleToutLire = async () => {
    await toutMarquerLu();
    rafraichir();
  };

  if (loading) {
    return <Chargement />;
  }

  const formatDate = dateStr => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const heures = Math.floor(diff / 3600000);
    const jours = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (heures < 24) return `Il y a ${heures}h`;
    if (jours < 7) return `Il y a ${jours}j`;
    return d.toLocaleDateString('fr-FR', {day: '2-digit', month: 'short'});
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.compteurNombre}>{nonLues}</Text>
          <Text style={styles.compteurLabel}>NON LUES</Text>
        </View>
        {nonLues > 0 && (
          <TouchableOpacity onPress={handleToutLire} activeOpacity={0.7}>
            <Text style={styles.toutLire}>TOUT LIRE</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.videSymbol}>--</Text>
          <Text style={styles.vide}>Aucune notification</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 16}}
          renderItem={({item}) => {
            const typeInfo = TYPE_ICONS[item.type] || TYPE_ICONS.creation;
            return (
              <TouchableOpacity
                style={[styles.carte, !item.lue && styles.carteNonLue]}
                onPress={() => !item.lue && handleMarquerLue(item.id)}
                activeOpacity={item.lue ? 1 : 0.8}>
                <View style={[styles.iconContainer, {backgroundColor: typeInfo.color}]}>
                  <Text style={styles.icon}>{typeInfo.icon}</Text>
                </View>
                <View style={styles.contenu}>
                  <View style={styles.titreRow}>
                    <Text style={[styles.titre, !item.lue && styles.titreNonLu]}>
                      {item.titre}
                    </Text>
                    <Text style={styles.date}>{formatDate(item.created_at)}</Text>
                  </View>
                  <Text style={styles.message}>{item.message}</Text>
                </View>
                {!item.lue && <View style={styles.dot} />}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  compteurNombre: {
    fontSize: 32,
    fontWeight: '900',
    color: '#e85d4a',
  },
  compteurLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6b6453',
    letterSpacing: 2,
  },
  toutLire: {
    fontSize: 11,
    fontWeight: '900',
    color: '#e85d4a',
    letterSpacing: 1,
  },

  carte: {
    backgroundColor: '#f0ead6',
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderRadius: 4,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    opacity: 0.7,
  },
  carteNonLue: {
    opacity: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#e85d4a',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  contenu: {
    flex: 1,
  },
  titreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titre: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b6453',
  },
  titreNonLu: {
    fontWeight: '900',
    color: '#1a1a2e',
  },
  date: {
    fontSize: 11,
    color: '#6b6453',
    fontWeight: '600',
  },
  message: {
    fontSize: 13,
    color: '#1a1a2e',
    lineHeight: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e85d4a',
    marginLeft: 8,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videSymbol: {
    fontSize: 40,
    color: '#3a3a5e',
    fontWeight: '900',
    marginBottom: 8,
  },
  vide: {
    fontSize: 14,
    color: '#6b6453',
    letterSpacing: 0.5,
  },
});

export default Notifications;
