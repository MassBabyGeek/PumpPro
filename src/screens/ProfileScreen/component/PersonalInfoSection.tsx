import React from 'react';
import {View, StyleSheet} from 'react-native';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import InfoCard from '../../../components/InfoCard/InfoCard';

type User = {
  age?: number;
  weight?: number;
  height?: number;
  joinDate?: string;
};

type PersonalInfoSectionProps = {
  user: User;
};

const PersonalInfoSection = ({user}: PersonalInfoSectionProps) => {
  return (
    <View style={styles.section}>
      <SectionTitle title="Informations" />
      <View style={styles.infoGrid}>
        {user.age && (
          <InfoCard
            icon="calendar-outline"
            label="Âge"
            value={`${user.age} ans`}
          />
        )}
        {user.weight && (
          <InfoCard
            icon="fitness-outline"
            label="Poids"
            value={`${user.weight} kg`}
          />
        )}
        {user.height && (
          <InfoCard
            icon="resize-outline"
            label="Taille"
            value={`${user.height} cm`}
          />
        )}
        {user.joinDate && (
          <InfoCard
            icon="time-outline"
            label="Membre depuis"
            value={new Date(user.joinDate).toLocaleDateString('fr-FR', {
              month: 'short',
              year: 'numeric',
            })}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 40,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});

export default PersonalInfoSection;
