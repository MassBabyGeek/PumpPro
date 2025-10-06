/**
 * Service API - Bouchon pour simuler les appels backend
 * À remplacer par de vrais appels API quand le backend sera prêt
 */

import {UserProfile} from '../types/user.types';

// Délai simulé pour les requêtes (en ms)
const API_DELAY = 1500;

/**
 * Simule un délai de requête API
 */
const simulateDelay = (delay: number = API_DELAY): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Simule l'upload d'une photo de profil
 * @param imageUri - URI locale de l'image
 * @returns URL de l'image uploadée (simulée)
 */
export const uploadProfileImage = async (
  imageUri: string,
): Promise<{success: boolean; url?: string; error?: string}> => {
  console.log('📤 [API MOCK] Upload de l\'image:', imageUri);

  // Simule le délai de l'upload
  await simulateDelay(2000);

  // Simule 90% de succès, 10% d'échec
  const isSuccess = Math.random() > 0.1;

  if (isSuccess) {
    // En production, ce serait l'URL retournée par le backend
    // Pour le moment, on retourne l'URI locale
    console.log('✅ [API MOCK] Upload réussi');
    return {
      success: true,
      url: imageUri, // En prod: 'https://api.pompeurpro.com/avatars/user_123.jpg'
    };
  } else {
    console.log('❌ [API MOCK] Upload échoué');
    return {
      success: false,
      error: 'Erreur réseau - Veuillez réessayer',
    };
  }
};

/**
 * Simule la mise à jour du profil utilisateur
 * @param userId - ID de l'utilisateur
 * @param updates - Données à mettre à jour
 * @returns Profil mis à jour
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>,
): Promise<{success: boolean; user?: UserProfile; error?: string}> => {
  console.log('📝 [API MOCK] Mise à jour du profil:', userId, updates);

  await simulateDelay();

  const isSuccess = Math.random() > 0.05;

  if (isSuccess) {
    console.log('✅ [API MOCK] Profil mis à jour');
    return {
      success: true,
      user: {
        id: userId,
        name: 'Lucas Usereau',
        email: 'lucas@pompeurpro.com',
        joinDate: '2024-01-15',
        ...updates,
      } as UserProfile,
    };
  } else {
    console.log('❌ [API MOCK] Mise à jour échouée');
    return {
      success: false,
      error: 'Erreur serveur - Veuillez réessayer',
    };
  }
};

/**
 * Simule la suppression du compte
 * @param userId - ID de l'utilisateur
 * @returns Résultat de la suppression
 */
export const deleteUserAccount = async (
  userId: string,
): Promise<{success: boolean; error?: string}> => {
  console.log('🗑️ [API MOCK] Suppression du compte:', userId);

  await simulateDelay(1000);

  console.log('✅ [API MOCK] Compte supprimé');
  return {
    success: true,
  };
};

/**
 * Simule la déconnexion
 */
export const logout = async (): Promise<{success: boolean}> => {
  console.log('👋 [API MOCK] Déconnexion');

  await simulateDelay(500);

  console.log('✅ [API MOCK] Déconnecté');
  return {
    success: true,
  };
};
