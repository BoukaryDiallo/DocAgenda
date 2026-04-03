import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const STATUT_COLORS = {
  en_attente: {bg: '#e8a94a', text: '#1a1a2e', label: 'EN ATTENTE'},
  confirme: {bg: '#2d6a6a', text: '#f0ead6', label: 'CONFIRMÉ'},
  annule: {bg: '#e85d4a', text: '#fff', label: 'ANNULÉ'},
};

const CarteRendezVous = ({rdv, onPress, showPatient = false}) => {
  const statut = STATUT_COLORS[rdv.statut] || STATUT_COLORS.en_attente;

  const formatDate = dateStr => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {day: '2-digit', month: 'short', year: 'numeric'});
  };

  const formatHeure = heureStr => {
    return heureStr ? heureStr.substring(0, 5) : '';
  };

  return (
    <TouchableOpacity style={styles.carte} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.accent, {backgroundColor: statut.bg}]} />
      <View style={styles.contenu}>
        <View style={{flex: 1}}>
          <Text style={styles.medecin}>{rdv.medecin_nom}</Text>
          {rdv.specialite && <Text style={styles.specialite}>{rdv.specialite}</Text>}
          {showPatient && (
            <Text style={styles.patient}>{rdv.patient_prenom} {rdv.patient_nom}</Text>
          )}
          <Text style={styles.dateHeure}>
            {formatDate(rdv.date_rdv)} a {formatHeure(rdv.heure_rdv)}
          </Text>
          {rdv.motif && <Text style={styles.motif}>{rdv.motif}</Text>}
        </View>
        <View style={[styles.badge, {backgroundColor: statut.bg}]}>
          <Text style={[styles.badgeText, {color: statut.text}]}>{statut.label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  carte: {
    backgroundColor: '#f0ead6',
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accent: {
    width: 6,
  },
  contenu: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  medecin: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1a1a2e',
  },
  specialite: {
    fontSize: 12,
    color: '#6b6453',
    marginTop: 2,
    fontWeight: '600',
  },
  patient: {
    fontSize: 13,
    color: '#2d6a6a',
    marginTop: 4,
    fontWeight: '700',
  },
  dateHeure: {
    fontSize: 13,
    color: '#1a1a2e',
    marginTop: 6,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  motif: {
    fontSize: 12,
    color: '#6b6453',
    marginTop: 4,
    fontStyle: 'italic',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default CarteRendezVous;
