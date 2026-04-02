import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Alert, TouchableOpacity, StyleSheet} from 'react-native';
import {getMedecins, getDisponibilites, getCreneaux, creerRendezVous} from '../api';
import ChampTexte from '../components/ChampTexte';
import Bouton from '../components/Bouton';
import Chargement from '../components/Chargement';

const JOURS_MAP = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const JOURS_LABELS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MOIS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

const PriseRendezVous = ({route, navigation}) => {
  const medecinParam = route.params?.medecin;

  const [medecins, setMedecins] = useState([]);
  const [selectedMedecin, setSelectedMedecin] = useState(medecinParam || null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [joursDisponibles, setJoursDisponibles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [creneaux, setCreneaux] = useState([]);
  const [selectedCreneau, setSelectedCreneau] = useState(null);
  const [motif, setMotif] = useState('');
  const [loading, setLoading] = useState(!medecinParam);
  const [loadingCreneaux, setLoadingCreneaux] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!medecinParam) {
      chargerMedecins();
    }
  }, []);

  useEffect(() => {
    if (selectedMedecin) {
      chargerDisponibilites(selectedMedecin.id);
      setSelectedDate(null);
      setCreneaux([]);
      setSelectedCreneau(null);
    }
  }, [selectedMedecin]);

  useEffect(() => {
    if (selectedMedecin && selectedDate) {
      chargerCreneaux(selectedMedecin.id, selectedDate);
      setSelectedCreneau(null);
    }
  }, [selectedDate]);

  const chargerMedecins = async () => {
    try {
      const data = await getMedecins();
      setMedecins(data);
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  const chargerDisponibilites = async medecinId => {
    try {
      const data = await getDisponibilites(medecinId);
      setDisponibilites(data);
      genererJoursDisponibles(data);
    } catch {
      setDisponibilites([]);
      setJoursDisponibles([]);
    }
  };

  const genererJoursDisponibles = dispos => {
    const joursAvecDispo = dispos.map(d => d.jour);
    const jours = [];
    const today = new Date();

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const jourSemaine = JOURS_MAP[date.getDay()];

      if (joursAvecDispo.includes(jourSemaine)) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;
        jours.push({
          date: dateStr,
          jour: date.getDate(),
          jourSemaine: JOURS_LABELS[date.getDay()],
          mois: MOIS[date.getMonth()],
        });
      }
    }
    setJoursDisponibles(jours);
  };

  const chargerCreneaux = async (medecinId, date) => {
    setLoadingCreneaux(true);
    try {
      const data = await getCreneaux(medecinId, date);
      setCreneaux(data);
    } catch {
      setCreneaux([]);
    } finally {
      setLoadingCreneaux(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMedecin || !selectedDate || !selectedCreneau) {
      Alert.alert('Attention', 'Sélectionne un médecin, une date et un créneau');
      return;
    }

    setSubmitting(true);
    try {
      await creerRendezVous({
        medecin_id: selectedMedecin.id,
        date_rdv: selectedDate,
        heure_rdv: selectedCreneau,
        motif: motif.trim(),
      });
      Alert.alert('Succès', 'Rendez-vous créé avec succès');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Chargement />;
  }

  return (
    <ScrollView style={styles.container}>
      {!medecinParam && (
        <View style={styles.section}>
          <Text style={styles.etape}>1</Text>
          <Text style={styles.sectionTitle}>CHOISIR UN MÉDECIN</Text>
          {medecins.map(m => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.medecinOption,
                selectedMedecin?.id === m.id && styles.medecinSelected,
              ]}
              onPress={() => setSelectedMedecin(m)}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.medecinNom,
                  selectedMedecin?.id === m.id && styles.medecinNomSelected,
                ]}>
                {m.nom}
              </Text>
              <Text style={styles.medecinSpec}>{m.specialite}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {medecinParam && (
        <View style={styles.medecinHeader}>
          <Text style={styles.medecinHeaderNom}>{medecinParam.nom}</Text>
          <Text style={styles.medecinHeaderSpec}>{medecinParam.specialite}</Text>
        </View>
      )}

      {selectedMedecin && (
        <View style={styles.section}>
          <Text style={styles.etape}>{medecinParam ? '1' : '2'}</Text>
          <Text style={styles.sectionTitle}>CHOISIR UNE DATE</Text>
          {joursDisponibles.length === 0 ? (
            <Text style={styles.aucun}>Aucune disponibilité</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
              {joursDisponibles.map(j => (
                <TouchableOpacity
                  key={j.date}
                  style={[
                    styles.dateCard,
                    selectedDate === j.date && styles.dateCardSelected,
                  ]}
                  onPress={() => setSelectedDate(j.date)}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      styles.dateJourSemaine,
                      selectedDate === j.date && styles.dateTextSelected,
                    ]}>
                    {j.jourSemaine}
                  </Text>
                  <Text
                    style={[
                      styles.dateJour,
                      selectedDate === j.date && styles.dateTextSelected,
                    ]}>
                    {j.jour}
                  </Text>
                  <Text
                    style={[
                      styles.dateMois,
                      selectedDate === j.date && styles.dateTextSelected,
                    ]}>
                    {j.mois}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {selectedDate && (
        <View style={styles.section}>
          <Text style={styles.etape}>{medecinParam ? '2' : '3'}</Text>
          <Text style={styles.sectionTitle}>CHOISIR UN CRÉNEAU</Text>
          {loadingCreneaux ? (
            <Text style={styles.aucun}>Chargement...</Text>
          ) : creneaux.length === 0 ? (
            <Text style={styles.aucun}>Aucun créneau disponible</Text>
          ) : (
            <View style={styles.creneauxGrid}>
              {creneaux.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.creneauCard,
                    selectedCreneau === c && styles.creneauSelected,
                  ]}
                  onPress={() => setSelectedCreneau(c)}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      styles.creneauText,
                      selectedCreneau === c && styles.creneauTextSelected,
                    ]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {selectedCreneau && (
        <View style={styles.form}>
          <ChampTexte
            label="Motif (optionnel)"
            value={motif}
            onChangeText={setMotif}
            placeholder="Consultation générale..."
          />

          <View style={styles.recapitulatif}>
            <Text style={styles.recapTitle}>RÉCAPITULATIF</Text>
            <Text style={styles.recapLine}>{selectedMedecin.nom} — {selectedMedecin.specialite}</Text>
            <Text style={styles.recapLine}>
              {joursDisponibles.find(j => j.date === selectedDate)?.jourSemaine}{' '}
              {joursDisponibles.find(j => j.date === selectedDate)?.jour}{' '}
              {joursDisponibles.find(j => j.date === selectedDate)?.mois}{' '}
              à {selectedCreneau}
            </Text>
          </View>

          <Bouton
            titre={submitting ? 'Envoi...' : 'Confirmer le rendez-vous'}
            onPress={submitting ? undefined : handleSubmit}
            style={{marginTop: 16}}
          />
        </View>
      )}

      <View style={{height: 40}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  section: {
    margin: 16,
    marginBottom: 0,
  },
  etape: {
    fontSize: 32,
    fontWeight: '900',
    color: '#e85d4a',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6b6453',
    letterSpacing: 2,
    marginBottom: 12,
  },
  aucun: {
    fontSize: 13,
    color: '#6b6453',
    fontStyle: 'italic',
    paddingVertical: 8,
  },

  medecinOption: {
    backgroundColor: '#f0ead6',
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderRadius: 4,
    padding: 14,
    marginBottom: 8,
  },
  medecinSelected: {
    borderColor: '#e85d4a',
    backgroundColor: '#1a1a2e',
  },
  medecinNom: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1a1a2e',
  },
  medecinNomSelected: {
    color: '#f0ead6',
  },
  medecinSpec: {
    fontSize: 12,
    color: '#6b6453',
    marginTop: 2,
  },
  medecinHeader: {
    backgroundColor: '#f0ead6',
    padding: 20,
    margin: 16,
    marginBottom: 0,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderLeftWidth: 6,
    borderLeftColor: '#2d6a6a',
  },
  medecinHeaderNom: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1a1a2e',
  },
  medecinHeaderSpec: {
    fontSize: 13,
    color: '#6b6453',
    marginTop: 4,
  },

  dateScroll: {
    marginHorizontal: -4,
  },
  dateCard: {
    backgroundColor: '#f0ead6',
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 4,
    alignItems: 'center',
    minWidth: 64,
  },
  dateCardSelected: {
    backgroundColor: '#e85d4a',
    borderColor: '#e85d4a',
  },
  dateJourSemaine: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6b6453',
    letterSpacing: 1,
  },
  dateJour: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1a1a2e',
    marginVertical: 2,
  },
  dateMois: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b6453',
  },
  dateTextSelected: {
    color: '#fff',
  },

  creneauxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  creneauCard: {
    backgroundColor: '#f0ead6',
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  creneauSelected: {
    backgroundColor: '#2d6a6a',
    borderColor: '#2d6a6a',
  },
  creneauText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  creneauTextSelected: {
    color: '#f0ead6',
  },

  form: {
    margin: 16,
    backgroundColor: '#f0ead6',
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderRadius: 4,
    padding: 20,
  },
  recapitulatif: {
    backgroundColor: '#1a1a2e',
    borderRadius: 4,
    padding: 16,
    marginTop: 16,
  },
  recapTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#6b6453',
    letterSpacing: 2,
    marginBottom: 8,
  },
  recapLine: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f0ead6',
    marginBottom: 4,
  },
});

export default PriseRendezVous;
